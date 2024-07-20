const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const port = 3000;

// MongoDB connection string (replace <username>, <password>, and <dbname> with your details)
const mongoUri = 'mongodb://localhost:27017/auth-app'; // For local MongoDB
// const mongoUri = 'mongodb+srv://<username>:<password>@cluster0.mongodb.net/<dbname>?retryWrites=true&w=majority'; // For MongoDB Atlas

mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const userSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    mobileNo: String,
    email: String,
    password: String
});

const User = mongoose.model('User', userSchema);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static('public'));

// Signup route
app.post('/signup', async (req, res) => {
    const { firstName, lastName, mobileNo, email, password } = req.body;

    if (!firstName || !lastName || !mobileNo || !email || !password) {
        return res.status(400).send('Required fields are missing');
    }

    const newUser = new User({ firstName, lastName, mobileNo, email, password });
    await newUser.save();
    res.send('Signup successful');
});

// Login route
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email, password });
    if (user) {
        res.send('Login successful');
    } else {
        res.status(400).send('Invalid email or password');
    }
});

// Serve the index.html file for the root URL
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
