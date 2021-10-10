const supertest = require('supertest');
const { app } = require('../index');
const User = require('../models/User')
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

const getUsers = async () => {
	const usersDB = await User.find({})
	return usersDB.map(user => user.toJSON())
}

module.exports = { initialNotes, api, getAllNotes, getAllContentFromNotes, getUsers };