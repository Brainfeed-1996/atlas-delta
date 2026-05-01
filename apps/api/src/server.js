import http from 'node:http';

const port = process.env.PORT || 8094;

const datasets = [
  { id: 'ds-001', name: 'customer-risk-signals', freshness: 'fresh', records: 120340 },
  { id: 'ds-002', name: 'vendor-posture-rollup', freshness: 'stale', records: 2450 }
];

function json(res, code, payload) {
  res.writeHead(code, { 'content-type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(payload, null, 2));
}

const server = http.createServer((req, res) => {
  if (req.url === '/health') {
    return json(res, 200, { status: 'ok', service: 'atlas-delta-api' });
  }

  if (req.url === '/api/v1/datasets') {
    return json(res, 200, { data: datasets, total: datasets.length });
  }

  return json(res, 404, { error: 'not_found' });
});

server.listen(port, () => {
  console.log(`atlas-delta api listening on :${port}`);
});
