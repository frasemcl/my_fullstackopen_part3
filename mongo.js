const mongoose = require('mongoose');

if (process.argv.length < 3) {
	console.log(
		'Please provide the password as an argument: node mongo.js <password>'
	);
	process.exit(1);
}

const password = process.argv[2];
const url = `mongodb+srv://fullstack:${password}@cluster0.fbuvkwo.mongodb.net/phonebookApp?retryWrites=true&w=majority`;

const personSchema = new mongoose.Schema({
	name: String,
	number: String,
});

const Person = mongoose.model('Person', personSchema);

if (process.argv.length > 3) {
	const newName = process.argv[3];
	const newNumber = process.argv[4];

	mongoose
		.connect(url)
		.then(result => {
			console.log('connected');

			const person = new Person({
				name: newName,
				number: newNumber,
			});

			return person.save();
		})
		.then(() => {
			console.log('person saved!');
			return mongoose.connection.close();
		})
		.catch(err => console.log(err));
} else {
	mongoose
		.connect(url)
		.then(result => {
			console.log('phonebook:');

			Person.find({}).then(result => {
				result.forEach(person => {
					console.log(person.name, person.number);
				});
				mongoose.connection.close();
			});
		})
		.catch(err => console.log(err));
}
