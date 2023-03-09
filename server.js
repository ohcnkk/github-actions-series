const express = require('express');
const bodyParser = require('body-parser');
const { Client } = require('pg');

// Constants
const PORT = 8080;
const HOST = '0.0.0.0';
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Default route
app.get('/', (req, res) => {
  res.send('Hello World');
});

// Postgres configuration
const client = new Client({
  host: 'postgres',
  port: 5432,
  user: 'postgres',
  password: 'postgres',
  database: 'postgres',
});
client.connect();

// New route for storing and retrieving messages
app.post('/messages', (req, res) => {
  const { message } = req.body;
  const query = 'INSERT INTO messages (message) VALUES ($1)';
  const values = [message];
  client.query(query, values, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error storing message');
    } else {
      res.status(201).send('Message stored successfully');
    }
  });
});

app.get('/messages', (req, res) => {
  const query = 'SELECT * FROM messages';
  client.query(query, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error retrieving messages');
    } else {
      const messages = result.rows.map(row => row.message);
      res.status(200).json(messages);
    }
  });
});

app.listen(PORT, HOST, () => {
  console.log(`Running on http://${HOST}:${PORT}`);
});

module.exports = app;