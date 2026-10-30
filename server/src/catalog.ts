import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { db } from './db.ts';

interface CatalogSeed {
  version: number;
  hotels: Record<string, Record<string, unknown>>;
  chains: Record<string, Record<string, unknown>>;
  artefacts: Record<string, Record<string, unknown>>;
}

const catalogPath = fileURLToPath(new URL('../catalog/catalog.json', import.meta.url));

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function loadSeed(): CatalogSeed {
  const rawSeed: unknown = JSON.parse(readFileSync(catalogPath, 'utf8'));
  if (
    !isRecord(rawSeed) ||
    typeof rawSeed.version !== 'number' ||
    !Number.isInteger(rawSeed.version) ||
    !isRecord(rawSeed.hotels) ||
    !isRecord(rawSeed.chains) ||
    !isRecord(rawSeed.artefacts)
  ) {
    throw new Error(`Invalid catalog seed: ${catalogPath}`);
  }

  const hotels: CatalogSeed['hotels'] = {};
  const chains: CatalogSeed['chains'] = {};
  const artefacts: CatalogSeed['artefacts'] = {};

  for (const [id, hotel] of Object.entries(rawSeed.hotels)) {
    const chain = rawSeed.chains[id];
    if (!isRecord(hotel) || hotel.id !== Number(id)) {
      throw new Error(`Catalog hotel "${id}" has an invalid ID`);
    }
    if (!isRecord(chain) || chain.hotelId !== Number(id) || !isRecord(chain.steps)) {
      throw new Error(`Catalog chain "${id}" is missing or has an invalid hotel ID`);
    }
    hotels[id] = hotel;
    chains[id] = chain;
  }

  for (const [id, artefact] of Object.entries(rawSeed.artefacts)) {
    if (!isRecord(artefact) || artefact.id !== id || typeof artefact.image !== 'string') {
      throw new Error(`Catalog artefact "${id}" is invalid`);
    }
    artefacts[id] = artefact;
  }

  return { version: rawSeed.version, hotels, chains, artefacts };
}

export function seedCatalog(): void {
  const seed = loadSeed();
  const insertHotel = db.prepare(
    'INSERT INTO hotel_catalog (hotel_id, hotel_json, chain_json) VALUES (?, ?, ?)'
  );
  const insertArtefact = db.prepare(
    'INSERT INTO artifact_catalog (artifact_id, artifact_json) VALUES (?, ?)'
  );

  db.exec('BEGIN IMMEDIATE');
  try {
    db.exec('DELETE FROM hotel_catalog; DELETE FROM artifact_catalog');
    for (const [id, hotel] of Object.entries(seed.hotels)) {
      insertHotel.run(id, JSON.stringify(hotel), JSON.stringify(seed.chains[id]));
    }
    for (const [id, artefact] of Object.entries(seed.artefacts)) {
      insertArtefact.run(id, JSON.stringify(artefact));
    }
    db.prepare(
      `INSERT INTO catalog_metadata (key, value) VALUES ('version', ?)
       ON CONFLICT(key) DO UPDATE SET value = excluded.value`
    ).run(String(seed.version));
    db.exec('COMMIT');
  } catch (error) {
    db.exec('ROLLBACK');
    throw error;
  }
}

export function getCatalog() {
  const version = db.prepare("SELECT value FROM catalog_metadata WHERE key = 'version'").get() as
    | { value: string }
    | undefined;

  if (!version) {
    seedCatalog();
    return getCatalog();
  }

  const hotels = db
    .prepare('SELECT hotel_id, hotel_json FROM hotel_catalog ORDER BY rowid')
    .all() as {
    hotel_id: string;
    hotel_json: string;
  }[];
  const chains = db
    .prepare('SELECT hotel_id, chain_json FROM hotel_catalog ORDER BY rowid')
    .all() as {
    hotel_id: string;
    chain_json: string;
  }[];
  const artefacts = db
    .prepare('SELECT artifact_id, artifact_json FROM artifact_catalog ORDER BY rowid')
    .all() as { artifact_id: string; artifact_json: string }[];

  return {
    version: Number(version.value),
    hotels: Object.fromEntries(
      hotels.map(({ hotel_id, hotel_json }) => [hotel_id, JSON.parse(hotel_json)])
    ),
    chains: Object.fromEntries(
      chains.map(({ hotel_id, chain_json }) => [hotel_id, JSON.parse(chain_json)])
    ),
    artefacts: Object.fromEntries(
      artefacts.map(({ artifact_id, artifact_json }) => [artifact_id, JSON.parse(artifact_json)])
    ),
  };
}

seedCatalog();
