const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const methodOverride = require('method-override');
const redis = require('redis');
const _ = require('lodash');

// Create Redis Client
const client = redis.createClient();

(async () => {
	client.on('error', (err) => console.log('Redis Client Error', err));

	client.on('connect', function () {
		console.log('Redis connected...');
	});

	await client.connect();

	// await client.set('key', 'value');
	// const value = await client.get('key');
})();

const app = express();
const hbs = exphbs.create({ defaultLayout: 'main' });
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(methodOverride('_method'));

// Search Page
app.get('/', function (req, res, next) {
	res.render('searchusers');
});

// Search processing
app.post('/user/search', async function (req, res, next) {
	let id = req.body.id;
	try {
		const obj = await client.hGetAll(id);

		if (_.isEqual(obj, Object.create(null))) {
			res.render('searchusers', {
				error: 'User does not exist',
			});
		} else {
			obj.id = id;
			res.render('details', {
				user: obj,
			});
		}
	} catch (error) {}
});

// Add User Page
app.get('/user/add', function (req, res, next) {
	res.render('adduser');
});

// Process Add User Page
app.post('/user/add', async function (req, res, next) {
	const { id, first_name, last_name, email, phone } = req.body;
	try {
		const reply = await client.HSET(id, [
			'first_name',
			first_name,
			'last_name',
			last_name,
			'email',
			email,
			'phone',
			phone,
		]);
	} catch (err) {
		console.log(err);
	}
	res.redirect('/');
});

// Delete User
app.delete('/user/delete/:id', function (req, res, next) {
	client.del(req.params.id);
	res.redirect('/');
});

app.listen(3000, () => console.log('Server listening on port 3000'));
