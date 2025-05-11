import { v4 as randomId } from 'uuid';
import users from '../users.json';
import { writeFile } from 'fs/promises';
import path from 'path';
import { newUser } from 'types';

export const create = async (body: newUser) => {
  return new Promise(async (resolve, reject) => {
    try {
      const filePath = path.join(__dirname, '../users.json').normalize();
      const newUser = { id: randomId(), ...body };
      users.push(newUser);
      await writeFile(filePath, JSON.stringify(users), { encoding: 'utf8' });
      resolve(newUser);
    } catch (err) {
      reject(err);
    }
  });
};

export const update = async (body: newUser, id: string) => {
  return new Promise(async (resolve, reject) => {
    try {
      const filePath = path.join(__dirname, '../users.json').normalize();
      const findId = users.findIndex((elem) => elem.id === id);
      users[findId] = { id, ...body };
      console.log(users[findId]);
      await writeFile(filePath, JSON.stringify(users), { encoding: 'utf8' });
      resolve(users[findId]);
    } catch (err) {
      reject(err);
    }
  });
};
