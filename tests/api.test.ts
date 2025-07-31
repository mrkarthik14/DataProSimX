import request from 'supertest';
import express from 'express';
import { registerRoutes } from '../server/routes.js';

describe('DataProSimX API Tests', () => {
  let app: express.Application;
  
  beforeAll(async () => {
    app = express();
    app.use(express.json());
    await registerRoutes(app);
  });

  describe('User Management', () => {
    test('GET /api/user should return default user', async () => {
      const response = await request(app)
        .get('/api/user')
        .expect(200);
      
      expect(response.body).toHaveProperty('id', 'user-1');
      expect(response.body).toHaveProperty('username', 'johnsmith');
    });

    test('POST /api/user/xp should update user XP', async () => {
      const response = await request(app)
        .post('/api/user/xp')
        .send({ xp: 100 })
        .expect(200);
      
      expect(response.body).toHaveProperty('xp');
      expect(response.body.xp).toBeGreaterThanOrEqual(100);
    });
  });

  describe('Project Management', () => {
    test('GET /api/projects should return user projects', async () => {
      const response = await request(app)
        .get('/api/projects')
        .expect(200);
      
      expect(Array.isArray(response.body)).toBe(true);
    });

    test('POST /api/projects should create new project', async () => {
      const projectData = {
        title: 'Test Project',
        description: 'Test Description',
        role: 'data_analyst',
        currentStep: 'data_ingestion',
        status: 'in_progress',
        progress: 0
      };

      const response = await request(app)
        .post('/api/projects')
        .send(projectData)
        .expect(201);

      expect(response.body).toHaveProperty('title', 'Test Project');
      expect(response.body).toHaveProperty('role', 'data_analyst');
    });
  });

  describe('Advanced Features', () => {
    test('POST /api/challenges/:challengeId/start should start challenge', async () => {
      const response = await request(app)
        .post('/api/challenges/data-cleaning-basics/start')
        .expect(200);

      expect(response.body).toHaveProperty('message', 'Challenge started successfully');
      expect(response.body).toHaveProperty('challengeId', 'data-cleaning-basics');
    });

    test('POST /api/real-world-projects/:projectId/start should start real-world project', async () => {
      const response = await request(app)
        .post('/api/real-world-projects/fraud-detection-system/start')
        .expect(200);

      expect(response.body).toHaveProperty('message', 'Real-world project started');
    });

    test('POST /api/community/posts should create community post', async () => {
      const postData = {
        title: 'Test Post',
        content: 'Test content',
        category: 'discussion'
      };

      const response = await request(app)
        .post('/api/community/posts')
        .send(postData)
        .expect(201);

      expect(response.body).toHaveProperty('title', 'Test Post');
      expect(response.body).toHaveProperty('likes', 0);
    });
  });

  describe('AI Mentor', () => {
    test('POST /api/mentor/chat should return AI response', async () => {
      const response = await request(app)
        .post('/api/mentor/chat')
        .send({ message: 'How do I clean data?' })
        .expect(200);

      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('timestamp');
    });
  });
});