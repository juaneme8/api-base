require('dotenv').config()
require('./mongo')

const express = require('express');
const Note = require('./models/Note');
const notFound = require('./middleware/notFound');
const handleErrors = require('./middleware/handleErrors');

const app = express();

app.use(express.json());

app.get('/api/notes', (req, res, next) => {
    Note.find()
        .then(notes =>
            res.json(notes)
        )
        .catch(err => next(err))
})

app.get('/api/notes/:id', (req, res, next) => {
    const { id } = req.params

    Note.findById(id)
        .then(note => {
            if (note) return res.json(note)
            res.status(404).end()
        })
        .catch(err => next(err))
})

app.put('/api/notes/:id', (req, res, next) => {
    const { id } = req.params
    const { content, important } = req.body;

    const newNote = { content, important }

    Note.findByIdAndUpdate(id, newNote, { new: true })
        .then(note => {
            if (note) return res.json(note)
            res.status(404).end()
        })
        .catch(err => next(err))
})

app.delete('/api/notes/:id', (req, res, next) => {
    const { id } = req.params

    Note.findByIdAndDelete(id)
        .then(note => {
            if (note) return res.json(note)
            res.status(404).end()
        })
        .catch(err => next(err))
})

app.post('/api/notes', (req, res, next) => {
    const { content, important } = req.body;

    const newNote = new Note({
        date: new Date(),
        content,
        important,
    })
    newNote.save()
        .then(note => res.json(note))
        .catch(err => next(err))
})

app.use(notFound)
app.use(handleErrors)

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => console.log(`Listening on Port ${PORT}`));

module.exports = { app, server };