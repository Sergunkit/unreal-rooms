import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import type { Artefact, Chain, Hotel } from '../data/hotels-data/hotelTypes';

interface Catalog {
  hotels: Record<string, Hotel>;
  chains: Record<string, Chain>;
  artefacts: Record<string, Artefact>;
}

type CatalogState =
  | { status: 'loading' }
  | { status: 'error'; error: Error }
  | { status: 'loaded'; catalog: Catalog };

type CatalogContextValue =
  | { status: 'loading'; reload: () => void }
  | { status: 'error'; error: Error; reload: () => void }
  | ({
      status: 'loaded';
      catalog: Catalog;
      reload: () => void;
    } & Catalog);

const CatalogContext = createContext<CatalogContextValue | undefined>(undefined);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isCatalog(value: unknown): value is Catalog {
  return (
    isRecord(value) && isRecord(value.hotels) && isRecord(value.chains) && isRecord(value.artefacts)
  );
}

export function CatalogProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<CatalogState>({ status: 'loading' });
  const [requestNumber, setRequestNumber] = useState(0);

  const reload = useCallback(() => {
    setState({ status: 'loading' });
    setRequestNumber((current) => current + 1);
  }, []);

  useEffect(() => {
    let active = true;

    async function loadCatalog() {
      try {
        const response = await fetch('/api/game/catalog');
        const body = await response.text();
        if (!response.ok) {
          let details = body.trim();
          try {
            const errorPayload: unknown = JSON.parse(body);
            if (isRecord(errorPayload) && typeof errorPayload.error === 'string') {
              details = errorPayload.error;
            }
          } catch {
            details = details.slice(0, 300);
          }

          throw new Error(
            `Catalog request failed (${response.status} ${response.statusText})${details ? `: ${details}` : ''}`
          );
        }

        const payload: unknown = JSON.parse(body);
        if (!isCatalog(payload)) {
          throw new Error('Catalog response has an invalid format');
        }

        if (active) setState({ status: 'loaded', catalog: payload });
      } catch (error) {
        if (active) {
          setState({
            status: 'error',
            error: error instanceof Error ? error : new Error(String(error)),
          });
        }
      }
    }

    void loadCatalog();
    return () => {
      active = false;
    };
  }, [requestNumber]);

  const value: CatalogContextValue =
    state.status === 'loaded' ? { ...state, ...state.catalog, reload } : { ...state, reload };

  return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>;
}

export function useCatalog(): CatalogContextValue {
  const context = useContext(CatalogContext);
  if (!context) {
    throw new Error('useCatalog must be used within a CatalogProvider');
  }

  return context;
}
