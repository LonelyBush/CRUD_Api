import http, { IncomingMessage } from 'http';
import cluster, { Worker } from 'cluster';
import { availableParallelism } from 'os';
import 'dotenv/config';
import { setupServer } from './server';

const SERVER_PORT = parseInt(process.env.SERVER_PORT!);

const CPU_COUNT = availableParallelism() - 1;

if (cluster.isPrimary) {
  const workers: Worker[] = [];

  for (let port = SERVER_PORT + 1; port <= SERVER_PORT + CPU_COUNT; port++) {
    const worker = cluster.fork({ WORKER_PORT: port });
    workers.push(worker);
  }
  let currentIndex = 0;

  //load balancer
  http
    .createServer((req, res) => {
      const findWorker = workers[currentIndex];
      console.log(findWorker);
      currentIndex = (currentIndex + 1) % workers.length;
      const proxyOptions = {
        hostname: 'localhost',
        port: SERVER_PORT,
        path: req.url,
        method: req.method,
        headers: req.headers,
      };

      //proxy
      const proxy = http.request(proxyOptions, (proxyRes: IncomingMessage) => {
        const statusCode = proxyRes.statusCode ?? 502;
        res.writeHead(statusCode, proxyRes.headers as http.OutgoingHttpHeaders);
        proxyRes.pipe(res);
      });

      proxy.on('error', (err) => {
        console.error('Proxy error:', err);
        res.writeHead(502, { 'Content-Type': 'text/plain' });
        res.end('Bad Gateway');
      });

      req.pipe(proxy);
    })
    .listen(8080, () => {
      console.log('Load balancer listening on http://localhost:8080/');
    });

  cluster.on('exit', (worker, code, signal) => {
    console.warn(
      `Воркер ${worker.process.pid} завершился (${signal || code}), форкаем заново`,
    );
    cluster.fork({ WORKER_PORT: process.env.WORKER_PORT });
  });
} else {
  setupServer().listen(process.env.WORKER_PORT, () => {
    console.log(`Server listening on port: ${process.env.WORKER_PORT}`);
  });
  console.log(`Worker process is running on PID: ${process.pid}`);
}
