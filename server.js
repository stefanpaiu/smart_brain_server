const express = require('express');
const bodyParser = require('body-parser')
const bcrypt = require('bcryptjs');
const cors = require('cors')
const app = express();
const knex = require('knex')

const db = knex({
    client: 'pg',
    connection: {
        host: '127.0.0.1',
        user: 'postgres',
        password: 'test',
        database: 'smart-brain'
    }
});

app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => {
    res.send("Success.")
})

app.post('/signin', (req, res) => {
    db.select('email', 'hash'). from('login')
        .where('email', '=', req.body.email)
        .then(data => {
            if(bcrypt.compareSync(req.body.password, data[0].hash)){
                return db.select('*').from('users')
                    .where('email', '=', req.body.email)
                    .then(user =>{
                        res.json(user[0])
                    })
                    .catch(err => res.status(400).json('Unable to get user'))
            }
            else{
                res.status(400).json('Wrong credentials')
            }
        })
        .catch(err => res.status(400).json('Wrong credentials'))
})

app.post('/register', (req, res) => {
    const {email, name, password} = req.body;
    const hash = bcrypt.hashSync(password);
    db.transaction(trx => {
        trx.insert({
            hash: hash,
            email: email
        })
        .into('login')
        .returning('email')
        .then(loginEmail => {
            return trx('users')
                .returning('*')
                .insert({
                    email: loginEmail[0].email,
                    name: name,
                    joined: new Date()
                }).then(user => {
                    res.json(user[0])
                })
        })
            .then(trx.commit)
            .catch(trx.rollback)
    })
        .catch(err => res.status(400).json("Unable to join"))
})

app.get('/profile/:id', (req, res) => {
    const {id} = req.params;
    db.select('*').from('users').where('id', id)
        .then(user => {
            if(user.length) {
                res.json(user[0]);
            }
            else {
                res.status(400).json('Not found');
            }
    })
        .catch(err => res.status(400).json('Error getting user'));
})

app.put('/image', (req, res) => {
    const {id} = req.body;
    db('users')
        .where('id', id)
        .increment('entries', 1)
        .returning('entries')
        .then(entries => {
            res.json(entries[0].entries);
    })
        .catch(err => res.status(400).json("Unable to get entries"))
})

app.listen(4000, () => {
    console.log("App is running on port 4000.")
});

/*
    / -> res = this is working
    /signin -> POST = success/fail
    /register -> POST = return user
    /profile/:userid -> GET = return user
    /image -> PUT -> return user
 */