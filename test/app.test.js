const { test } = require('node:test');
const assert = require('node:assert/strict');
const http = require('node:http');
const { spawn } = require('node:child_process');

test('application responds correctly', async (t) => {
  const port = 3001 + Math.floor(Math.random() * 1000);
  const app = spawn(process.execPath, ['app.js'], {
    env: { ...process.env, PORT: String(port) },
    stdio: 'ignore'
  });

  t.after(() => app.kill());

  let ready = false;

  for (let i = 0; i < 50; i++) {
    if (app.exitCode !== null) {
      throw new Error('Application exited before starting');
    }

    try {
      await new Promise((resolve, reject) => {
        const req = http.get(`http://127.0.0.1:${port}/health`, (res) => {
          res.resume();
          res.on('end', () => {
            if (res.statusCode === 200) resolve();
            else reject(new Error(`Unexpected status: ${res.statusCode}`));
          });
        });
        req.on('error', reject);
        req.setTimeout(300, () => req.destroy(new Error('Timeout')));
      });

      ready = true;
      break;
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }

  assert.equal(ready, true, 'Application should start and serve health checks');
});
