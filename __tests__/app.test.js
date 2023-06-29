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
	test('200: Should return an object containing comment count for specified article id', () => {
		return request(app)
			.get('/api/articles/1')
			.expect(200)
			.then(({ body }) => {
				expect(body[0]).toHaveProperty('comment_count');
			});
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
describe('GET /api/articles', () => {
	test('200: Should return an array containing all articles as objects with comment_count key and sorted by date in descending order', () => {
		return request(app)
			.get('/api/articles')
			.expect(200)
			.then(({ body }) => {
				expect(body.articles).toBeSortedBy('created_at', { descending: true });
				body.articles.forEach((article) => {
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
			body.articles.forEach((article) => {
				expect(article).not.toHaveProperty('body');
			});
		});
});
describe('GET api/articles?topic=cats / mitch', () => {
	test('200: Should return all articles that have cats as topic', () => {
		return request(app)
			.get('/api/articles?topic=cats')
			.expect(200)
			.then(({ body }) => {
				body.articles.forEach((article) => {
					expect(article.topic).toBe('cats');
				});
			});
	});
	test('200: Should return all articles that have mitch as topic', () => {
		return request(app)
			.get('/api/articles?topic=mitch')
			.expect(200)
			.then(({ body }) => {
				body.articles.forEach((article) => {
					expect(article.topic).toBe('mitch');
				});
			});
	});
	test('200: Should return an empty array if passed topic exists but there are no articles related to it', () => {
		return request(app)
			.get('/api/articles?topic=paper')
			.expect(200)
			.then(({ body }) => {
				expect(body.articles).toEqual([]);
			});
	});
	test('404: returns if invalid topic is passed', () => {
		return request(app)
			.get('/api/articles?topic=banana')
			.expect(404)
			.then(({ body }) => {
				expect(body.msg).toBe('Topic not found');
			});
	});
});
describe('GET api/articles?sort_by', () => {
	test('200: should return articles sorted by date in descending order by default', () => {
		return request(app)
			.get('/api/articles')
			.expect(200)
			.then(({ body }) => {
				expect(body.articles).toBeSortedBy('created_at', { descending: true });
			});
	});
	test('200: should return articles sorted by specified path in descending order', () => {
		return request(app)
			.get('/api/articles?sort_by=author')
			.expect(200)
			.then(({ body }) => {
				expect(body.articles).toBeSortedBy('author', { descending: true });
			});
	});
	test('200: should return articles sorted by specified path in descending order', () => {
		return request(app)
			.get('/api/articles?sort_by=title')
			.expect(200)
			.then(({ body }) => {
				expect(body.articles).toBeSortedBy('title', { descending: true });
			});
	});
	test('400: returns if invalid sort_by is passed', () => {
		return request(app)
			.get('/api/articles?sort_by=banana')
			.expect(400)
			.then(({ body }) => {
				expect(body.msg).toBe('Bad request');
			});
	});
});
describe('GET api/articles?order=ASC / DESC', () => {
	test('200: Should return article list ordered by specified order', () => {
		return request(app)
			.get('/api/articles?order=asc')
			.expect(200)
			.then(({ body }) => {
				expect(body.articles).toBeSortedBy('created_at', { ascending: true });
			});
	});
	test('400: returns if invalid order by is passed', () => {
		return request(app)
			.get('/api/articles?order=banana')
			.expect(400)
			.then(({ body }) => {
				expect(body.msg).toBe('Bad request');
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
				expect(body.users.length).toBe(4);
				body.users.forEach((user) => {
					expect(user).toHaveProperty('username', expect.any(String));
					expect(user).toHaveProperty('name', expect.any(String));
					expect(user).toHaveProperty('avatar_url', expect.any(String));
				});
			});
	});
});
describe('DELETE /api/comments/:comment_id', () => {
	test('204: Should return empty object if passed valid comment id', () => {
		return request(app).delete('/api/comments/2').expect(204);
	});
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
});
describe('POST /api/articles', () => {
	test('201: Should return passed article', () => {
		const newArticle = {
			author: 'butter_bridge',
			title: 'More about cats',
			body: 'Cats are the sleepiest of all mammals. They spend an average of 16 hours sleeping each day',
			topic: 'cats',
		};
		return request(app)
			.post('/api/articles')
			.send(newArticle)
			.expect(201)
			.then(({ body }) => {
				expect(body.article_posted[0]).toEqual(
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
	test('400: returns if passed wrong user name (author is not in users list)', () => {
		const newArticle = {
			author: 'yaah',
			title: 'More about cats',
			body: 'Cats are the sleepiest of all mammals. They spend an average of 16 hours sleeping each day',
			topic: 'cats',
		};
		return request(app)
			.post('/api/articles')
			.send(newArticle)
			.expect(400)
			.then(({ body }) => {
				expect(body.msg).toBe('Bad request');
			});
	});
	test('400: returns if there is missing properties', () => {
		const newArticle = {
			title: 'More about cats',
			body: 'Cats are the sleepiest of all mammals. They spend an average of 16 hours sleeping each day',
		};
		return request(app)
			.post('/api/articles')
			.send(newArticle)
			.expect(400)
			.then(({ body }) => {
				expect(body.msg).toBe('Bad request');
			});
	});
});
describe('PATCH /api/comments/:comment_id', () => {
	test('200: Should return comment with updated vote count when passed a positive number', () => {
		return request(app)
			.patch('/api/comments/1')
			.send({ inc_votes: 9 })
			.expect(201)
			.then(({ body }) => {
				expect(body.updatedComment[0].votes).toBe(25);
			});
	});
	test('200: Should return comment with updated vote count when passed a negative number', () => {
		return request(app)
			.patch('/api/comments/1')
			.send({ inc_votes: -150 })
			.expect(201)
			.then(({ body }) => {
				expect(body.updatedComment[0].votes).toBe(-134);
			});
	});
	test('404: valid but non-existent id', () => {
		return request(app)
			.patch('/api/comments/25')
			.send({ inc_votes: -150 })
			.expect(404)
			.then(({ body }) => {
				expect(body.msg).toBe('Invalid ID');
			});
	});
	test('400: invalid id (NAN)', () => {
		return request(app)
			.patch('/api/comments/banana')
			.send({ inc_votes: -150 })
			.expect(400)
			.then(({ body }) => {
				expect(body.msg).toBe('Bad request');
			});
	});
	test('400: invalid input passed (NAN)', () => {
		return request(app)
			.patch('/api/comments/1')
			.send({ inc_votes: 'banana' })
			.expect(400)
			.then(({ body }) => {
				expect(body.msg).toBe('Bad request');
			});
	});
});
describe('GET /api/users/:username', () => {
	test('200: Should return user object according to passed username', () => {
		return request(app)
			.get('/api/users/butter_bridge')
			.expect(200)
			.then(({ body }) => {
				expect(body.user[0]).toEqual(
					expect.objectContaining({
						username: expect.any(String),
						name: expect.any(String),
						avatar_url: expect.any(String),
					})
				);
			});
	});
	test('400: returns if passed wrong user name (author is not in users list)', () => {
		const newArticle = {
			author: 'yaah',
			title: 'More about cats',
			body: 'Cats are the sleepiest of all mammals. They spend an average of 16 hours sleeping each day',
			topic: 'cats',
		};
		return request(app)
			.post('/api/articles')
			.send(newArticle)
			.expect(400)
			.then(({ body }) => {
				expect(body.msg).toBe('Bad request');
			});
	});
	test('400: returns if there is missing properties', () => {
		const newArticle = {
			title: 'More about cats',
			body: 'Cats are the sleepiest of all mammals. They spend an average of 16 hours sleeping each day',
		};
		return request(app)
			.post('/api/articles')
			.send(newArticle)
			.expect(400)
			.then(({ body }) => {
				expect(body.msg).toBe('Bad request');
			});
	});
});
describe('GET /api/articles?limit=num', () => {
	test('200: Should return list with amount of objects equal to limit passed', () => {
		return request(app)
			.get('/api/articles?limit=10')
			.expect(200)
			.then(({ body }) => {
				expect(body.articles.length).toBe(10);
				body.articles.forEach((article) => {
					expect(article).toHaveProperty('article_id', expect.any(Number));
					expect(article).toHaveProperty('topic', expect.any(String));
					expect(article).toHaveProperty('author', expect.any(String));
					expect(article).toHaveProperty('created_at', expect.any(String));
					expect(article).toHaveProperty('article_img_url', expect.any(String));
					expect(article).toHaveProperty('comment_count', expect.any(String));
					expect(article).toHaveProperty('title', expect.any(String));
				});
			});
	});
	test('400: Returns if passed limit is invalid (NAN)', () => {
		return request(app)
			.get('/api/articles?limit=banana')
			.expect(400)
			.then(({ body }) => expect(body.msg).toBe('Bad request'));
	});
});
describe('GET /api/articles?p=num', () => {
	test('200: Should return list with amount of objects equal to limit passed and according to page number', () => {
		return request(app)
			.get('/api/articles?p=1')
			.expect(200)
			.then(({ body }) => {
				expect(body.articles.length).toBe(10);
			});
	});
	test('200: Should return list with amount of objects equal to limit passed and according to page number', () => {
		return request(app)
			.get('/api/articles?p=2')
			.expect(200)
			.then(({ body }) => {
				expect(body.articles.length).toBe(3);
			});
	});
	test('200: Should return empty array if passed page is a valid number but there are no articles to show', () => {
		return request(app)
			.get('/api/articles?p=3')
			.expect(200)
			.then(({ body }) => {
				expect(body.articles).toEqual([]);
			});
	});
	test('400: returns if passed page is invalid (NAN)', () => {
		return request(app)
			.get('/api/articles?p=banana')
			.expect(400)
			.then(({ body }) => {
				expect(body.msg).toBe('Bad request');
			});
	});
});
describe('Returns total_count property when fetching articles', () => {
	test('200: Should return list with amount of objects equal to queries passed', () => {
		return request(app)
			.get('/api/articles?limit=10')
			.expect(200)
			.then(({ body }) => {
				expect(body).toHaveProperty('total_count');
				expect(body.total_count).toBe(10);
			});
	});
	test('200: Should return list with amount of objects equal to queries passed', () => {
		return request(app)
			.get('/api/articles?topic=mitch')
			.expect(200)
			.then(({ body }) => {
				expect(body).toHaveProperty('total_cofunt');
				expect(body.total_count).toBe(10);
			});
	});
});
