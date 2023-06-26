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