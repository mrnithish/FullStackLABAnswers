const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/expressmongodb', { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});

// Create a schema and model
const userSchema = new mongoose.Schema({
    firstName: String,
    lastName: String
});

const User = mongoose.model('User', userSchema);

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/addname', (req, res) => {
    const { firstName, lastName } = req.body;
    const newUser = new User({ firstName, lastName });
    newUser.save((err) => {
        if (err) return console.error(err);
        res.send('<script>alert("Name added successfully!"); window.location.href = "/";</script>');
    });
});

app.get('/user', (req, res) => {
    User.find({}, (err, users) => {
        if (err) return console.error(err);
        let userList = users.map(user => `<li>${user.firstName} ${user.lastName}</li>`).join('');
        res.send(`
            <h1>User List</h1>
            <ul>${userList}</ul>
            <a href="/">Go back</a>
        `);
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
