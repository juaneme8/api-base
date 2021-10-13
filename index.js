require('dotenv').config();
require('./mongo');

const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken')

const Note = require('./models/Note');

const notFound = require('./middleware/notFound');
const handleErrors = require('./middleware/handleErrors');
const usersRouter = require('./controller/users');
const loginRouter = require('./controller/login');
const User = require('./models/User');
const userExtractor = require('./middleware/userExtractor');

const app = express();


app.use(express.json());
app.use(cors());

app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)

app.get('/api/notes', (req, res, next) => {
	Note.find()
		.then(notes => res.json(notes))
		.catch(err => next(err));
});

app.get('/api/notes/:id', (req, res, next) => {
	const { id } = req.params;

	Note.findById(id)
		.then(note => {
			if (note) return res.json(note);
			res.status(404).end();
		})
		.catch(err => next(err));
});

app.post('/api/notes', userExtractor, async (req, res, next) => {
	const { content, important } = req.body;

	try {

		const { userId } = req;

		const user = await User.findById(userId)


		if (!user) {
			return res.status(404).json({
				error: 'user not found',
			});
		}
		// console.log({ user })

		const newNote = new Note({
			date: new Date(),
			content,
			important,
			user: user._id
		});

		user.notes = user.notes.concat(newNote._id)
		await user.save()


		const savedNote = await newNote.save()
		res.json(savedNote);
	}
	catch (error) {
		next(error)
	}
});

app.put('/api/notes/:id', (req, res, next) => {
	const { id } = req.params;
	const { content, important } = req.body;

	const newNote = { content, important };

	Note.findByIdAndUpdate(id, newNote, { new: true })
		.then(note => {
			if (note) return res.json(note);
			res.status(404).end();
		})
		.catch(err => next(err));
});

app.delete('/api/notes/:id', (req, res, next) => {
	const { id } = req.params;

	Note.findByIdAndDelete(id)
		.then(note => {
			if (note) return res.status(204).json(note);
			res.status(404).end();
		})
		.catch(err => next(err));
});


app.use(notFound);
app.use(handleErrors);

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => console.log(`Listening on Port ${PORT}`));

module.exports = { app, server };
