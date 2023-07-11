const express = require('express');
const bodyParser = require('body-parser')
const bcrypt = require('bcryptjs');
const cors = require('cors')
const app = express();
const knex = require('knex')

const register = require('./controllers/register')
const signin = require('./controllers/signin')
const profile = require('./controllers/profile')
const image = require('./controllers/image')

const db = knex({
    client: 'pg',
    connection: {
        host: process.env.DATABASE_HOST,
        user: process.env.DATABASE_USER,
        database: process.env.DATABASE_DB,
        password: process.env.DATABASE_PASSWORD
    },
    pool: {
        min: 0,
        max: 7,
        idleTimeoutMillis: 30000
    }
});

app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => {
    res.send("Success.")
})

app.post('/signin', signin.handleSignIn(db, bcrypt))

app.post('/register', register.handleRegister(db, bcrypt))

app.get('/profile/:id', profile.handleProfileGet(db))

app.put('/image', image.handleImage(db))

app.post('/imageurl', (req, res) => {image.handleApiCall(req, res)})

app.listen(4000, () => {
    console.log("App is running on port 4000.")
});
