const express = require('express');
// var morgan = require('morgan');
const app = express();
const cors = require('cors');

// Without the json-parser, the body property would be undefined. The json-parser functions so that it takes the JSON data of a request, transforms it into a JavaScript object and then attaches it to the body property of the request object before the route handler is called.
app.use(express.json());

// Customize morgan so that it also shows the data sent in HTTP POST requests
// morgan.token('data', function (req, res) {
// 	return JSON.stringify(req.body);
// });
// app.use(
// 	morgan(':method :url :status :res[content-length] - :response-time ms :data')
// );

app.use(cors());
app.use(express.static('build'));

let persons = [
	{
		id: 1,
		name: 'Arto Hellas',
		number: '040-123456',
	},
	{
		id: 2,
		name: 'Ada Lovelace',
		number: '39-44-5323523',
	},
	{
		id: 3,
		name: 'Dan Abramov',
		number: '12-43-234345',
	},
	{
		id: 4,
		name: 'Mary Poppendieck',
		number: '39-23-6423122',
	},
];

const generateId = () => Math.floor(Math.random() * 10000);

// const generateId = () => {
// 	const maxId = persons.length > 0 ? Math.max(...persons.map(n => n.id)) : 0;
// 	return maxId + 1;
// };

app.get('/', (request, response) => {
	response.send('<h1>Hello World!</h1>');
});

app.get('/info', (request, response) => {
	const dateTime = new Date();

	response.send(`
	<div>Phonebook has info for ${persons.length} people</div>
	<div>${dateTime}</div>
	`);
});

app.get('/api/persons', (request, response) => {
	response.json(persons);
});

app.get('/api/persons/:id', (request, response) => {
	const id = Number(request.params.id);
	const person = persons.find(person => person.id === id);

	if (person) {
		response.json(person);
	} else {
		response.status(404).end();
	}
});

app.post('/api/persons', (request, response) => {
	const body = request.body;
	const nameExists = persons.find(person => person.name === body.name);

	if (!body.name || !body.number) {
		return response.status(400).json({
			error: 'content missing',
		});
	}

	if (nameExists) {
		return response.status(400).json({
			error: 'name must be unique',
		});
	}

	const person = {
		id: generateId(),
		name: body.name,
		number: body.number,
	};

	persons = persons.concat(person);

	response.json(person);
});

app.delete('/api/persons/:id', (request, response) => {
	const id = Number(request.params.id);
	persons = persons.filter(person => person.id !== id);

	response.status(204).end();
});

const unknownEndpoint = (request, response) => {
	response.status(404).send({ error: 'unknown endpoint' });
};

app.use(unknownEndpoint);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
