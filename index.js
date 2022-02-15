const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const methodOverride = require('method-override');
const redis = require('redis');

const app = express();
const hbs = exphbs.create({ defaultLayout: 'main' });
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(methodOverride('_method'));

app.get('/', function (req, res, next) {
	res.render('searchusers');
});

app.listen(3000);
