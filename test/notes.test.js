const mongoose = require('mongoose');
const supertest = require('supertest');
const { app, server } = require('../index');
const Note = require('../models/Note');

const api = supertest(app);

const initialNotes = [
    {
        content: 'Nota 1',
        important: true,
        date: new Date()
    },
    {
        content: 'Nota 2',
        important: true,
        date: new Date()
    },
    {
        content: 'Nota 3',
        important: true,
        date: new Date()
    }
]

beforeEach(async () => {
    await Note.deleteMany({});

    const note1 = new Note(initialNotes[0])
    await note1.save()

    const note2 = new Note(initialNotes[1])
    await note2.save()

    const note3 = new Note(initialNotes[2])
    await note3.save()
})

describe('GET /api/notes', () => {
    test('notes are returned in json', async () => {
        await api
            .get('/api/notes')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    });
    test('there are two notes', async () => {
        const res = await api.get('/api/notes')
        expect(res.body).toHaveLength(initialNotes.length);
    });
})


afterAll(() => {
    server.close()
    mongoose.connection.close();
})