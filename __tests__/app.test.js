const db = require('../db/connection');
const seed = require('../db/seeds/seed');
const app = require('../app');
const data = require('../db/data/test-data/index');
const request = require('supertest');

afterAll(() => {
  db.end()
 });
 
 beforeEach(() => {
   return seed(data)
 });

 describe('GET /api/topics', () => {
  test('200: Should return with an array containing all topics as objects with description and slug keys', () => {
    return request(app).get('/api/topics').expect(200).then(({body}) => {
      expect(body.length).toBe(3)
      body.forEach((topic)=>{
        expect(topic).toHaveProperty('description', expect.any(String));
        expect(topic).toHaveProperty('slug', expect.any(String));
      })
    })
  })
 })
 describe('GET /api/articles', () => {
  test('200: Should return with an array containing all articles as objects', () => {
    return request(app).get('/api/articles').expect(200).then(({body}) => {
        body.forEach((article)=>{
        expect(article).toHaveProperty('article_id', expect.any(Number));
        expect(article).toHaveProperty('title', expect.any(String));
        expect(article).toHaveProperty('topic', expect.any(String));
        expect(article).toHaveProperty('author', expect.any(String));
        expect(article).toHaveProperty('body', expect.any(String));
        expect(article).toHaveProperty('created_at', expect.any(String));
        expect(article).toHaveProperty('article_img_url', expect.any(String));
      })
    })
  })
 })