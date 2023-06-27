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
	test('200: Should return with an array containing all topics as objects with description and slug properties', () => {
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
describe('GET /api/articles/:article_id/comments', () => {
	test('200: Should return array of objects with comments that correspond to passed article id', () => {
		return request(app)
			.get('/api/articles/1/comments')
			.expect(200)
			.then(({ body }) => {
				body.forEach((comment) => {
					expect(comment).toHaveProperty('comment_id', expect.any(Number));
					expect(comment).toHaveProperty('body', expect.any(String));
					expect(comment).toHaveProperty('article_id', expect.any(Number));
					expect(comment).toHaveProperty('author', expect.any(String));
					expect(comment).toHaveProperty('votes', expect.any(Number));
					expect(comment).toHaveProperty('created_at', expect.any(String));
				});
			});
	});
	test('200: Returned comments should be ordered by most recent first', () => {
		return request(app)
			.get('/api/articles/1/comments')
			.expect(200)
			.then(({ body }) => {
				expect(body).toBeSortedBy('created_at', { descending: true });
			});
	});
	test('200: Returns an empty array when passed id has no comments linked to it', () => {
		return request(app)
			.get('/api/articles/2/comments')
			.expect(200)
			.then(({ body }) => {
				expect(body).toEqual([]);
			});
	});
	test('404: valid but non-existent id', () => {
		return request(app)
			.get('/api/articles/65/comments')
			.expect(404)
			.then(({ body }) => {
				expect(body.msg).toBe('Invalid ID');
			});
	});
	test('400: invalid id (NAN)', () => {
		return request(app)
			.get('/api/articles/banana/comments')
			.expect(400)
			.then(({ body }) => {
				expect(body.msg).toBe('Bad request');
			});
	});
});
describe('POST /api/articles/:article_id/comments', () => {
	const newComment = {
		username: 'butter_bridge',
		body: "my cat is snoring, couldn't finish reading",
	};
	test('201: Should return passed comment', () => {
		return request(app)
			.post('/api/articles/1/comments')
			.send(newComment)
			.expect(201)
			.then(({ body }) => {
				expect(body[0]).toEqual(
					expect.objectContaining({
						comment_id: expect.any(Number),
						body: expect.any(String),
						votes: expect.any(Number),
						author: expect.any(String),
						article_id: expect.any(Number),
						created_at: expect.any(String),
					})
				);
			});
	});
	test('404: valid but non-existent id', () => {
		return request(app)
			.post('/api/articles/89/comments')
			.send(newComment)
			.expect(404)
			.then(({ body }) => {
				expect(body.msg).toBe('Invalid ID');
			});
	});
	test('400: invalid id (NAN)', () => {
		return request(app)
			.post('/api/articles/banana/comments')
			.send(newComment)
			.expect(400)
			.then(({ body }) => {
				expect(body.msg).toBe('Bad request');
			});
	});
	test('400: returns when passed invalid properties (not username or body)', () => {
		return request(app)
			.post('/api/articles/1/comments')
			.send({
				banana: 'butter_bridge',
				body: "my cat is snoring, couldn't finish reading",
			})
			.expect(400)
			.then(({ body }) => {
				expect(body.msg).toBe('Bad request');
			});
	});
	test('400: returns if any of the required properties for posting is missing', () => {
		return request(app)
			.post('/api/articles/1/comments')
			.send({ body: "my cat is snoring, couldn't finish reading" })
			.expect(400)
			.then(({ body }) => {
				expect(body.msg).toBe('Bad request');
			});
	});
});
describe('GET /api/users', () => {
	test('200: Should return an array containing all users as objects with username, name and avatar properties', () => {
		return request(app)
			.get('/api/users')
			.expect(200)
			.then(({ body }) => {
				expect(body.length).toBe(4);
				body.forEach((user) => {
					expect(user).toHaveProperty('username', expect.any(String));
					expect(user).toHaveProperty('name', expect.any(String));
					expect(user).toHaveProperty('avatar_url', expect.any(String));
				});
			});
	});
})