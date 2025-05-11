import { IncomingMessage, ServerResponse } from 'http';
import users from '../users.json';
import { create, remove, update } from './fileOperations';
import { newUser, User } from 'types';
import { validate } from 'uuid';

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
    const user = users.filter((elem: User) => elem.id === id);
    if (!validate(id)) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      throw new Error('Invalid ID, not uuid !');
    }
    if (user.length > 0) {
      res.writeHead(200, {
        'Content-Type': 'application/json',
        method: 'GET',
      });
      res.end(JSON.stringify(user));
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      throw new Error('User not found !');
    }
  } catch (err) {
    const error = err as Error;
    res.end(JSON.stringify({ error: error.message }));
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

export const updateUser = async (
  req: IncomingMessage,
  res: ServerResponse<IncomingMessage>,
  id?: string,
) => {
  try {
    const user: User[] = users.filter((elem: User) => elem.id === id);
    const [findById] = users as User[];
    if (!validate(id)) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      throw new Error('Invalid ID in url, not uuid !');
    }
    if (user.length > 0 && findById) {
      const body = await createPostBody(req);
      const { username, age, hobbies } = body;

      const updateUserBody = {
        username: username || findById.username,
        age: age || findById.age,
        hobbies: hobbies || findById.hobbies,
      };

      const updateUser = await update(updateUserBody, id!);
      res.writeHead(200, {
        'Content-Type': 'application/json',
        method: 'PUT',
      });
      return res.end(JSON.stringify(updateUser));
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      throw new Error('User is not found ! Try again.');
    }
  } catch (err) {
    const error = err as Error;
    return res.end(JSON.stringify({ error: error.message }));
  }
};

export const deleteUserById = async (
  res: ServerResponse<IncomingMessage>,
  id?: string,
) => {
  try {
    const user = users.filter((elem: User) => elem.id === id);
    if (!validate(id)) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      throw new Error('Invalid ID, not uuid !');
    }
    if (user.length > 0 && id) {
      await remove(id);

      res.writeHead(204, {
        'Content-Type': 'application/json',
        method: 'DELETE',
      });
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      throw new Error('User not found !');
    }
  } catch (err) {
    const error = err as Error;
    res.end(JSON.stringify({ error: error.message }));
  }
};

export const createPostBody = (req: IncomingMessage): Promise<newUser> => {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk.toString();
    });
    req.on('end', async () => {
      try {
        resolve(JSON.parse(body));
      } catch (err) {
        reject(err);
      }
    });
  });
};
