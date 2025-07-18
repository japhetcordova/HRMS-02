import request from 'supertest';
import app from '../index.js';
import Employee from '../models/Employee.js';
import { getAdminToken, cleanup } from './testUtils.js';

describe('POST /api/employees', () => {
  let token;

  beforeAll(async () => {
    token = await getAdminToken();
  });

  afterAll(async () => {
    await cleanup();
  });

  it('should create a new employee and return 201', async () => {
    const newEmployee = {
      name: 'Jane Doe',
      email: 'jane@company.com',
      department: 'Finance',
      position: 'Analyst',
      status: 'active',
    };
    const res = await request(app)
      .post('/api/employees')
      .set('Authorization', `Bearer ${token}`)
      .send(newEmployee);
    expect(res.statusCode).toBe(201);
    expect(res.body.name).toBe('Jane Doe');
    expect(res.body.department).toBe('Finance');
  });
});
