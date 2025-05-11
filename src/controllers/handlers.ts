import { IncomingMessage, ServerResponse } from 'http';
import users from '../users.json';
import { create } from './fileOperations';
import { newUser } from 'types';

export const getAll = (res: ServerResponse<IncomingMessage>) => {
  try {
    res.writeHead(200, {
      'Content-Type': 'application/json',
      method: 'GET',
    });
    res.end(JSON.stringify(users));
  } catch (err) {
    console.error(err);
  }
};

export const getById = (res: ServerResponse<IncomingMessage>, id?: string) => {
  try {
    const user = users.filter((elem) => elem.id === id);
    if (user.length > 0) {
      res.writeHead(200, {
        'Content-Type': 'application/json',
        method: 'GET',
      });
      res.end(JSON.stringify(user));
    } else {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Not found' }));
    }
  } catch (err) {
    console.error(err);
  }
};

export const createNewUser = async (
  req: IncomingMessage,
  res: ServerResponse<IncomingMessage>,
) => {
  try {
    const body = await createPostBody(req);
    const { username, age, hobbies } = body;
    if (!username || !age || !hobbies) {
      throw new Error('Required fields is missing!');
    }
    const newUserBody = {
      username,
      age,
      hobbies,
    };
    const newUser = await create(newUserBody);
    res.writeHead(201, {
      'Content-Type': 'application/json',
      method: 'POST',
    });
    return res.end(JSON.stringify(newUser));
  } catch (err) {
    const error = err as Error;
    res.writeHead(400, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ error: error.message }));
  }
};

export const createPostBody = (req: IncomingMessage): Promise<newUser> => {
  return new Promise((resolve, reject) => {
    try {
      let body = '';
      req.on('data', (chunk) => {
        body += chunk.toString();
      });
      req.on('end', async () => {
        resolve(JSON.parse(body));
      });
    } catch (err) {
      reject(err);
    }
  });
};
