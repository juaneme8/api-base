const mongoose = require('mongoose');
const supertest = require('supertest');
const { app, server } = require('../index');
const Note = require('../models/Note');

const api = supertest(app);

const initialNotes = [
	{
		content: 'Notas de Juan',
		important: true,
		date: new Date(),
	},
	{
		content: 'Notas de Paco',
		important: true,
		date: new Date(),
	},
	{
		content: 'Notas de Pedro',
		important: true,
		date: new Date(),
	},
];

beforeEach(async () => {
	await Note.deleteMany({});

	const note1 = new Note(initialNotes[0]);
	await note1.save();

	const note2 = new Note(initialNotes[1]);
	await note2.save();

	const note3 = new Note(initialNotes[2]);
	await note3.save();
});

describe('GET /api/notes', () => {
	test('the result should be a json', async () => {
		await api
			.get('/api/notes')
			.expect(200)
			.expect('Content-Type', /application\/json/);
	});
	test('there should be two notes', async () => {
		const res = await api.get('/api/notes');
		expect(res.body).toHaveLength(initialNotes.length);
	});

	test('the first note should be about Juan', async () => {
		const res = await api.get('/api/notes');

		expect(res.body[0].content).toBe('Notas de Juan');
	});
	test('there should be a note about Paco', async () => {
		const res = await api.get('/api/notes');

		const contents = res.body.map(note => note.content);

		expect(contents).toContain('Notas de Paco');
	});
	test('a new note should be added', async () => {
		const newNote = {
			content: 'Notas de De La Mar',
			important: false,
		};

		await api
			.post('/api/notes')
			.send(newNote)
			.expect(200)
			.expect('Content-Type', /application\/json/);

		const res = await api.get('/api/notes');

		const contents = res.body.map(note => note.content);

		expect(contents).toContain('Notas de De La Mar');
		expect(res.body).toHaveLength(initialNotes.length + 1);
	});
	test('an empty note should not be added', async () => {
		const newNote = {
			important: false,
		};
		await api.post('/api/notes').send(newNote).expect(400);

		const res = await api.get('/api/notes');
		expect(res.body).toHaveLength(initialNotes.length);
	});
});

afterAll(() => {
	server.close();
	mongoose.connection.close();
});
