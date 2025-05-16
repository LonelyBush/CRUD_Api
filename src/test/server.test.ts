//@ts-nocheck
import http from 'http';
import request from 'supertest';
import { setupServer } from '../server';

describe('User API Endpoints', () => {
  let server: http.Server;
  let api: request.SuperTest<request.Test>;

  beforeAll(() => {
    server = setupServer().listen();
    api = request(server);
  });

  afterAll((done) => {
    server.close(done);
  });

  let createdUserId: string;
  const userData = {username:"mockUser",age:29,hobbies:["mock","mock"]};
  const updatedData = {username:"mockSuperUser!",age:29,hobbies:["mock","mock", "mock"]};

  it('should create a new user', async () => {
    const res = await api
      .post('/api/users')
      .send(userData)
      .set('Content-Type', 'application/json');

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.username).toBe(userData.username);
    expect(res.body.age).toBe(userData.age);
    expect(res.body.hobbies).toStrictEqual(userData.hobbies);
    createdUserId = res.body.id;
    console.log(createdUserId);
  });

  it('should get the newly created user by id', async () => {
    const res = await api.get(`/api/users/${createdUserId}`);
    expect(res.status).toBe(200);
    expect(res.body[0].username).toBe(userData.username);
    expect(res.body[0].age).toBe(userData.age);
    expect(res.body[0].hobbies).toStrictEqual(userData.hobbies);
  });

  it('should update the user', async () => {
    const res = await api
      .put(`/api/users/${createdUserId}`)
      .send(updatedData)
      .set('Content-Type', 'application/json');

    expect(res.status).toBe(200);
    expect(res.body.username).toBe(updatedData.username);
    expect(res.body.age).toBe(updatedData.age);
    expect(res.body.hobbies).toStrictEqual(updatedData.hobbies);
  });

  it('should delete the user', async () => {
    const res = await api.delete(`/api/users/${createdUserId}`);
    expect(res.status).toBe(204);
  });
  it('should return 404 for invalid route', async () => {
    const res = await api.get('/api/invalid');
    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: 'Bad url! Check your request url!' });
  });
});