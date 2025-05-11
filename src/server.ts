import http from 'http';
import 'dotenv/config';

const server = http.createServer(function (request, response) {
  console.log('Url:', request.url);
  console.log('Тип запроса:', request.method);
  console.log('User-Agent:', request.headers['user-agent']);
  console.log('Все заголовки');
  console.log(request.headers);

  response.end('Hello Server');
});

server.listen(process.env.SERVER_PORT, () =>
  console.log(`server listening on port: ${process.env.SERVER_PORT}`),
);
