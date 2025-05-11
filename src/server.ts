import http from 'http';
import 'dotenv/config';
import {
  createNewUser,
  deleteUserById,
  getAll,
  getById,
  updateUser,
} from './controllers/handlers';
import { validatePath } from './helpers/validateUuidPath';
import { getUuid } from './helpers/getUuid';

const server = http.createServer(function (request, response) {
  const { url } = request;

  if (validatePath('/api/users', url) && request.method === 'GET') {
    getAll(response);
  } else if (
    validatePath('/api/users/:uuid', url) &&
    request.method === 'GET'
  ) {
    const uuid = getUuid(url);
    getById(response, uuid);
  } else if (validatePath('/api/users', url) && request.method === 'POST') {
    createNewUser(request, response);
  } else if (
    validatePath('/api/users/:uuid', url) &&
    request.method === 'PUT'
  ) {
    const uuid = getUuid(url);
    updateUser(request, response, uuid);
  } else if (
    validatePath('/api/users/:uuid', url) &&
    request.method === 'DELETE'
  ) {
    const uuid = getUuid(url);
    deleteUserById(response, uuid);
  } else {
    response.writeHead(404, { 'Content-Type': 'application/json' });
    response.end(JSON.stringify({ error: 'Bad url! Check your request url!' }));
  }
});

server.listen(process.env.SERVER_PORT, () =>
  console.log(`server listening on port: ${process.env.SERVER_PORT}`),
);
