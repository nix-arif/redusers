const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const methodOverride = require('method-override');
const redis = require('redis');

// Create Redis Client

(async () => {
	const client = redis.createClient();

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
app.post('/user/search', function (req, res, next) {
	let id = req.body.id;
	console.log('ID', id);
});

app.listen(3000, () => console.log('Server listening on port 3000'));
