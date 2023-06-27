const db = require('../db/connection');
const seed = require('../db/seeds/seed');
const app = require('../app');
const data = require('../db/data/test-data/index');
const request = require('supertest');
const jsonEndPoints = require('../endpoints.json');

afterAll(() => {
	return db.end();
});

beforeEach(() => {
	return seed(data);
});

describe('GET /api', () => {
	test('200: Should return a JSON object with descriptions of all endpoints available', () => {
		return request(app)
			.get('/api')
			.expect(200)
			.then(({ body }) => {
				expect(body).toEqual(jsonEndPoints);
			});
	});
});

describe('GET /api/topics', () => {
	test('200: Should return with an array containing all topics as objects with description and slug keys', () => {
		return request(app)
			.get('/api/topics')
			.expect(200)
			.then(({ body }) => {
				expect(body.length).toBe(3);
				body.forEach((topic) => {
					expect(topic).toHaveProperty('description', expect.any(String));
					expect(topic).toHaveProperty('slug', expect.any(String));
				});
			});
	});
});
describe('GET /api/articles/:article_id', () => {
	test('200: Should return article according to passed id', () => {
		return request(app)
			.get('/api/articles/1')
			.expect(200)
			.then(({ body }) => {
				expect(body[0]).toEqual(
					expect.objectContaining({
						article_id: expect.any(Number),
						title: expect.any(String),
						topic: expect.any(String),
						author: expect.any(String),
						body: expect.any(String),
						created_at: expect.any(String),
						votes: expect.any(Number),
						article_img_url: expect.any(String),
					})
				);
			});
	});
	test('404: valid but non-existent id', () => {
		return request(app)
			.get('/api/articles/20')
			.expect(404)
			.then(({ body }) => {
				expect(body.msg).toBe('Invalid ID');
			});
	});
	test('400: invalid id (NAN)', () => {
		return request(app)
			.get('/api/articles/banana')
			.expect(400)
			.then(({ body }) => {
				expect(body.msg).toBe('Bad request');
			});
	});
});
describe('GET /api/articles', () => {
	test('200: Should return with an array containing all articles as objects with comment_count key and sorted by date in descending order', () => {
		return request(app)
			.get('/api/articles')
			.expect(200)
			.then(({ body }) => {
				expect(body).toBeSortedBy('created_at', { descending: true });
				body.forEach((article) => {
					expect(article).toHaveProperty('article_id', expect.any(Number));
					expect(article).toHaveProperty('title', expect.any(String));
					expect(article).toHaveProperty('topic', expect.any(String));
					expect(article).toHaveProperty('author', expect.any(String));
					expect(article).toHaveProperty('created_at', expect.any(String));
					expect(article).toHaveProperty('article_img_url', expect.any(String));
					expect(article).toHaveProperty('comment_count', expect.any(String));
				});
			});
	});
});
test('200: Should return objects without body property', () => {
	return request(app)
		.get('/api/articles')
		.expect(200)
		.then(({ body }) => {
			body.forEach((article) => {
				expect(article).not.toHaveProperty('body');
			});
		});
});
describe('PATCH /api/articles/:article_id', () => {
	test('200: Should return article with updated vote count when passed a positive number', () => {
		return request(app)
			.patch('/api/articles/1')
			.send({ inc_votes: 9 })
			.expect(201)
			.then(({ body }) => {
				expect(body[0].votes).toBe(109);
			});
	});
	test('200: Should return article with updated vote count when passed a negative number', () => {
		return request(app)
			.patch('/api/articles/1')
			.send({ inc_votes: -150 })
			.expect(201)
			.then(({ body }) => {
				expect(body[0].votes).toBe(-50);
			});
	});
	test('404: valid but non-existent id', () => {
		return request(app)
			.patch('/api/articles/25')
			.send({ inc_votes: -150 })
			.expect(404)
			.then(({ body }) => {
				expect(body.msg).toBe('Invalid ID');
			});
	});
	test('400: invalid id (NAN)', () => {
		return request(app)
			.patch('/api/articles/banana')
			.send({ inc_votes: -150 })
			.expect(400)
			.then(({ body }) => {
				expect(body.msg).toBe('Bad request');
			});
	});
	test('400: invalid input passed (NAN)', () => {
		return request(app)
			.patch('/api/articles/1')
			.send({ inc_votes: 'banana' })
			.expect(400)
			.then(({ body }) => {
				expect(body.msg).toBe('Bad request');
			});
	});
});
describe('DELETE /api/comments/:comment_id', () => {
	test('204: Should return empty object if passed valid comment id', () => {
		return request(app).delete('/api/comments/2').expect(204)
	})
	test('404: valid but non-existent id', () => {
		return request(app)
			.delete('/api/comments/25')
			.expect(404)
			.then(({ body }) => {
				expect(body.msg).toBe('Invalid ID');
			});
	});
	test('400: invalid id (NAN)', () => {
		return request(app)
			.delete('/api/comments/banana')
			.expect(400)
			.then(({ body }) => {
				expect(body.msg).toBe('Bad request');
			});
	});
})
 