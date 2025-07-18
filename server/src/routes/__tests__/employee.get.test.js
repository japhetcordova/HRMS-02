import request from 'supertest';
import app from '../index.js';
import Employee from '../models/Employee.js';
import { getAdminToken, cleanup } from './testUtils.js';

describe('GET /api/employees', () => {
  let token;

  beforeAll(async () => {
    token = await getAdminToken();
    await Employee.create({ name: 'John Doe', contact: { email: 'john@company.com' }, department: 'HR', position: 'Manager', status: 'active' });
  });

  afterAll(async () => {
    await cleanup();
  });

  it('should return a list of employees with status 200', async () => {
    const res = await request(app)
      .get('/api/employees')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.employees)).toBe(true);
    expect(res.body.employees.length).toBeGreaterThan(0);
    expect(res.body.employees[0].name).toBe('John Doe');
  });
});
