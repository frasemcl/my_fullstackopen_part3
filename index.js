require('dotenv').config();
const express = require('express');
// var morgan = require('morgan');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const Person = require('./models/person');

// Using this instead of morgan due to warning re fly.io
const requestLogger = (request, response, next) => {
	console.log('Method:', request.method);
	console.log('Path:  ', request.path);
	console.log('Body:  ', request.body);
	console.log('---');
	next();
};

// load the middleware (other middlewares come later)
app.use(express.static('build'));
// Without the json-parser, the body property would be undefined.
app.use(express.json());
app.use(requestLogger);
app.use(cors());

// const generateId = () => Math.floor(Math.random() * 10000);

////////////////////////
// App route handlers //
/////////////////////////

// app.get('/info', (request, response) => {
// 	const dateTime = new Date();

// 	response.send(`
// 	<div>Phonebook has info for ${persons.length} people</div>
// 	<div>${dateTime}</div>
// 	`);
// });

app.get('/api/persons', (request, response) => {
	Person.find({}).then(persons => {
		response.json(persons);
	});
});

// third param passes the error forward: 'next' function.
app.get('/api/persons/:id', (request, response, next) => {
	Person.findById(request.params.id)
		.then(person => {
			if (person) {
				response.json(person);
			} else {
				response.status(404).end();
			}
		})
		.catch(err => next(err));
});

app.put('/api/persons/:id', (request, response, next) => {
	const body = request.body;

	const person = {
		name: body.name,
		number: body.number,
	};

	Person.findByIdAndUpdate(request.params.id, person, { new: true })
		.then(updatedPerson => {
			response.json(updatedPerson);
		})
		.catch(error => next(error));
});

app.post('/api/persons', (request, response) => {
	const body = request.body;

	if (!body.name || !body.number) {
		return response.status(400).json({ error: 'content missing' });
	}

	const person = new Person({
		name: body.name,
		number: body.number,
	});

	person.save().then(savedPerson => {
		response.json(savedPerson);
	});
});

app.delete('/api/persons/:id', (request, response, next) => {
	Person.findByIdAndRemove(request.params.id)
		.then(result => {
			response.status(204).end();
		})
		.catch(error => next(error));
});

const unknownEndpoint = (request, response) => {
	response.status(404).send({ error: 'unknown endpoint' });
};

app.use(unknownEndpoint);

// error handler
const errorHandler = (error, request, response, next) => {
	console.error(error.message);

	if (error.name === 'CastError') {
		return response.status(400).send({ error: 'malformatted id' });
	}

	next(error);
};
// this has to be the last loaded middleware.
app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
