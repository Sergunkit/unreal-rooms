import { spawn } from 'node:child_process';
import { setTimeout as delay } from 'node:timers/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const serverDirectory = resolve(projectRoot, 'server');
const viteEntrypoint = resolve(projectRoot, 'node_modules/vite/bin/vite.js');
const nodeMajorVersion = Number(process.versions.node.split('.')[0]);

if (nodeMajorVersion < 22) {
  throw new Error('The SQLite API requires Node.js 22.5 or newer.');
}

const children = [];
let stopRequested = false;
let exitSignal;

function stopChildren(signal = 'SIGTERM') {
  for (const child of children) {
    if (child.exitCode === null && child.signalCode === null) child.kill(signal);
  }
}

for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () => {
    stopRequested = true;
    exitSignal = signal;
    stopChildren(signal);
  });
}

async function waitForApi(server) {
  const deadline = Date.now() + 30_000;

  while (Date.now() < deadline) {
    if (stopRequested) throw new Error('Startup interrupted');
    if (server.exitCode !== null || server.signalCode !== null) {
      throw new Error('API server stopped before becoming ready.');
    }

    try {
      const response = await fetch('http://127.0.0.1:8011/api/game/health', {
        signal: AbortSignal.timeout(1_000),
      });
      if (response.ok) return;
    } catch {
      await delay(250);
    }
  }

  throw new Error('API server did not become ready within 30 seconds.');
}

const serverNodeOptions = nodeMajorVersion === 22 ? ['--experimental-strip-types'] : [];
const apiServer = spawn(
  process.execPath,
  [...serverNodeOptions, '--watch', 'src/index.ts'],
  { cwd: serverDirectory, stdio: 'inherit' }
);
children.push(apiServer);

try {
  await waitForApi(apiServer);
  console.log('SQLite API is ready; starting Vite.');

  const vite = spawn(process.execPath, [viteEntrypoint, ...process.argv.slice(2)], {
    cwd: projectRoot,
    stdio: 'inherit',
  });
  children.push(vite);

  const viteExitCode = await new Promise((resolveExit) => {
    vite.once('error', (error) => {
      console.error('Failed to start Vite:', error);
      resolveExit(1);
    });
    vite.once('exit', (code) => resolveExit(code ?? 1));
  });

  stopChildren();
  process.exitCode = stopRequested
    ? exitSignal === 'SIGINT'
      ? 130
      : 143
    : viteExitCode;
} catch (error) {
  stopChildren();
  if (!stopRequested) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  } else {
    process.exitCode = exitSignal === 'SIGINT' ? 130 : 143;
  }
}
