import test from "node:test";
import assert from "node:assert/strict";
import app from "../app.js";
import http from "node:http";

test("health endpoint returns status ok", async () => {
  const server = http.createServer(app);
  await new Promise(resolve => server.listen(0, resolve));
  const address = server.address();
  try {
    const response = await fetch(`http://127.0.0.1:${address.port}/api/health`);
    assert.equal(response.status, 200);
    const body = await response.json();
    assert.equal(body.status, "ok");
  } finally {
    await new Promise((resolve, reject) => server.close(err => err ? reject(err) : resolve()));
  }
});
