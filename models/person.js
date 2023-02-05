const mongoose = require('mongoose');

////////////////////////
// Databse Connection //
/////////////////////////

const url = process.env.MONGODB_URI;

console.log('connecting to', url);

mongoose
	.connect(url)
	.then(result => {
		console.log('connected to MongoDB');
	})
	.catch(error => {
		console.log('error connecting to MongoDB:', error.message);
	});

const personSchema = new mongoose.Schema({
	name: {
		type: String,
		minLength: 3,
		required: true,
		// Got the duplicate name not allowed like this, somewhat confusing!
		index: { unique: true, dropDups: true },
	},
	number: {
		type: String,
		required: [true, 'User phone number required as ###-###-####'],
		minLength: 8,
		validate: {
			validator: v => {
				return /\d{3}-\d{3}-\d{4}/.test(v);
			},
			message: props =>
				`${props.value} is not a valid phone number. Use ###-###-#### format`,
		},
	},
});

// Transform _id object to string
personSchema.set('toJSON', {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString();
		delete returnedObject._id;
		delete returnedObject.__v;
	},
});

module.exports = mongoose.model('Person', personSchema);
