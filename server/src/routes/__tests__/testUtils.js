import request from 'supertest';
import mongoose from 'mongoose';
import app from '../index.js';
import User from '../models/User.js';
import Employee from '../models/Employee.js';
import bcrypt from 'bcryptjs';

const TEST_DB_URI = process.env.TEST_DB_URI || 'mongodb://localhost:27017/hrms-test';

beforeAll(async () => {
  await mongoose.connect(TEST_DB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

export async function getAdminToken() {
  const password = 'adminpass123';
  const hashedPassword = await bcrypt.hash(password, 10);
  const admin = new User({ name: 'Admin', email: 'admin@test.com', password: hashedPassword, role: 'admin' });
  await admin.save();
  const res = await request(app)
    .post('/api/auth/login')
    .send({ email: 'admin@test.com', password });
  return res.body.token;
}

export async function cleanup() {
  await User.deleteMany({});
  await Employee.deleteMany({});
}
