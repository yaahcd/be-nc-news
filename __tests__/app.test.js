const db = require('../db/connection');
const seed = require('../db/seeds/seed');
const app = require('../app');
const data = require('../db/data/test-data/index');
const request = require('supertest');

afterAll(() => {
  return db.end()
 });
 
 beforeEach(() => {
   return seed(data)
 });

 describe('GET /api/topics', () => {
  test('200: Should return with an array containing all topics as objects with description and slug keys', () => {
    return request(app).get('/api/topics').expect(200).then(({body}) => {
      expect(body.length).toBe(3);
      body.forEach((topic)=>{
        expect(topic).toHaveProperty('description', expect.any(String));
        expect(topic).toHaveProperty('slug', expect.any(String));
      });
    });
  });
 });
 describe('GET /api/articles/:article_id', () => {
  test('200: Should return article according to passed id', () => {
    return request(app).get('/api/articles/1').expect(200).then(({body}) => {
      expect(body[0]).toEqual(expect.objectContaining({
        article_id: expect.any(Number),
        title: expect.any(String),
        topic: expect.any(String),
        author: expect.any(String),
        body: expect.any(String),
        created_at: '2020-07-09T20:11:00.000Z',
        votes: expect.any(Number),
        article_img_url:expect.any(String)
      }));
    });
  });
  test('404: valid but non-existent id', () => {
    return request(app).get('/api/articles/20').expect(404).then(({body}) => {
      expect(body.msg).toBe('Invalid ID');
    });
  });
  test('400: invalid id (NAN)', () => {
    return request(app).get('/api/articles/banana').expect(400).then(({body}) => {
      expect(body.msg).toBe('Bad request');
    });
  });
 });