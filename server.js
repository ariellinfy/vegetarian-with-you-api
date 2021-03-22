const express = require('express');
const cors = require('cors');
const knex = require('knex')({
	client: 'pg',
	connection: {
	  host : '127.0.0.1',
	  user : 'postgres',
	  password : 'Infinite7*',
	  database : 'vegetarian-with-you'
	}
  });

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port = process.env.PORT || 5000;

app.get('/', (req, res) => {
	res.send('success');
});

app.post('/users/register', (req, res) => {
	console.log(req.body);
	res.send('success');
})

app.post('/users/signin', (req, res) => {
	console.log(req.body);
	res.send('success');
});

app.post('/users/signout', (req, res) => {
	console.log(req.body);
	res.send('success');
});

app.listen(port, error => {
    if(error) throw error;
    console.log('Server running on port ' + port);
});