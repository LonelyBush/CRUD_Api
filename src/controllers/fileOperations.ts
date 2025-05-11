import { v4 as randomId } from 'uuid';
import usersData from '../users.json';
import { writeFile } from 'fs/promises';
import path from 'path';
import { newUser, User } from 'types';

const USERS: User[] = usersData as User[];

const FILE_PATH = path.join(__dirname, '../users.json').normalize();

export const create = async (body: newUser) => {
  return new Promise(async (resolve, reject) => {
    try {
      const newUser = { id: randomId(), ...body } as User;
      USERS.push(newUser);
      await writeFile(FILE_PATH, JSON.stringify(USERS), { encoding: 'utf8' });
      resolve(newUser);
    } catch (err) {
      reject(err);
    }
  });
};

export const update = async (body: newUser, id: string) => {
  return new Promise(async (resolve, reject) => {
    try {
      const findId = USERS.findIndex((elem: User) => elem.id === id);
      USERS[findId] = { id, ...body } as User;
      await writeFile(FILE_PATH, JSON.stringify(USERS), { encoding: 'utf8' });
      resolve(USERS[findId]);
    } catch (err) {
      reject(err);
    }
  });
};

export const remove = async (id: string) => {
  return new Promise<void>(async (resolve, reject) => {
    try {
      const filterUser = USERS.filter((elem: User) => elem.id !== id);
      await writeFile(FILE_PATH, JSON.stringify(filterUser), {
        encoding: 'utf8',
      });

      resolve();
    } catch (err) {
      reject(err);
    }
  });
};
