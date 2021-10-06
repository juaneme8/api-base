const supertest = require('supertest');
const { app } = require('../index');

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


const getAllNotes = async () => {
	return api.get('/api/notes');
}

const getAllContentFromNotes = (notes) => {
	return notes.map(note => note.content)
}

module.exports = { initialNotes, api, getAllNotes, getAllContentFromNotes };