const { server } = require('../index');
const mongoose = require('mongoose');
const Note = require('../models/Note');

const { api, initialNotes, getAllNotes, getAllContentFromNotes } = require('./helpers');

beforeEach(async () => {
	await Note.deleteMany({});

	const note1 = new Note(initialNotes[0]);
	await note1.save();

	const note2 = new Note(initialNotes[1]);
	await note2.save();

	const note3 = new Note(initialNotes[2]);
	await note3.save();
});

describe('/api/notes', () => {
	test('the result should be a json', async () => {
		await api
			.get('/api/notes')
			.expect(200)
			.expect('Content-Type', /application\/json/);
	});

	test('there should be two notes', async () => {
		const response = await getAllNotes()
		expect(response.body).toHaveLength(initialNotes.length);
	});

	test('the first note should be about Juan', async () => {
		const response = await getAllNotes()

		expect(response.body[0].content).toBe('Notas de Juan');
	});
	test('there should be a note about Paco', async () => {
		const response = await getAllNotes();
		const contents = getAllContentFromNotes(response.body);

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

		const response = await getAllNotes();
		const contents = getAllContentFromNotes(response.body);

		expect(contents).toContain('Notas de De La Mar');
		expect(response.body).toHaveLength(initialNotes.length + 1);
	});
	test('an empty note should not be added', async () => {
		const newNote = {
			important: false,
		};
		await api.post('/api/notes').send(newNote).expect(400);

		const response = await getAllNotes()
		expect(response.body).toHaveLength(initialNotes.length);
	});

	test('a note should be deleted', async () => {
		const response = await getAllNotes()

		const { body: notes } = response;

		const [noteToDelete] = notes;

		await api
			.delete(`/api/notes/${noteToDelete.id}`)
			.expect(204)

		const response2 = await getAllNotes();
		const contents = getAllContentFromNotes(response2.body);

		expect(response2.body).toHaveLength(initialNotes.length - 1)
		expect(contents).not.toContain(noteToDelete.content)
	})

	test('a note should not be deleted', async () => {
		await api
			.delete(`/api/notes/123`)
			.expect(400)

		const response = await getAllNotes();

		expect(response.body).toHaveLength(initialNotes.length)
	})
});

afterAll(() => {
	server.close();
	mongoose.connection.close();
});
