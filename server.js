const express = require('express');
const bodyParser = require('body-parser')
const bcrypt = require('bcryptjs');
const cors = require('cors')
const app = express();


const database = {
    users: [
        {
            id: '123',
            name: 'John',
            email: 'john@gmail.com',
            password: 'cookies',
            entries: 0,
            joined: new Date()
        },
        {
            id: '124',
            name: 'Sally',
            email: 'sally@gmail.com',
            password: 'bananas',
            entries: 0,
            joined: new Date()
        }
    ],
    login: [
        {
            id: '987',
            hash: '',
            email: 'john@gmail.com'
        }
    ]
}

app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => {
    res.send(database.users)
})

app.post('/signin', (req, res) => {
    // bcrypt.compare("apples", "$2a$08$D6C5PYjMytBDGVwFlbTSO.YYFFQ3api27S73ClURBIvfLr9eFL69m", function(err, res) {
    //     console.log("first guess", res)
    // });
    // bcrypt.compare("veggies", "$2a$08$D6C5PYjMytBDGVwFlbTSO.YYFFQ3api27S73ClURBIvfLr9eFL69m", function(err, res) {
    //     console.log("second guess", res)
    // });

    if(req.body.email === database.users[0].email &&
        req.body.password === database.users[0].password){
            res.json('success')
    }
    else {
        res.status(400).json('Error logging in.')
    }

})

app.post('/register', (req, res) => {
    const {email, name, password} = req.body;

    bcrypt.hash(password, 8, function(err, hash) {
        console.log(hash);
    });

    database.users.push({
        id: '125',
        name: name,
        email: email,
        password: password,
        entries: 0,
        joined: new Date()
    });
    res.json(database.users[database.users.length-1])
})

app.get('/profile/:id', (req, res) => {
    const {id} = req.params;
    let found = false;
    database.users.forEach(user => {
        if(user.id === id) {
            found = true;
            return res.json(user);
        }
    })
    if(!found) {
        res.status(400).json('Not found.')
    }
})

app.put('/image', (req, res) => {
    const {id} = req.body;
    console.log(id)
    let found = false;
    database.users.forEach(user => {
        if(user.id === id) {
            found = true;
            user.entries ++;
            return res.json(user.entries);
        }
    })
    if(!found) {
        res.status(400).json('Not found.')
    }
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