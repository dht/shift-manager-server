const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const dbJson = require('./dal/db.json');
const dbMongo = require('./dal/db.mongo');
const dbTypicode = require('./dal/db.typicode');

const jwt = require('./utils/jwt');
const kleur = require('kleur');

const port = process.env.PORT || 3001;

const app = express();

app.use(cors());
app.use(bodyParser.json());

dbMongo.connect();

// m1. log requests
app.use((req, res, next) => {
    const { method, path, body } = req;
    console.log(kleur.yellow(`${method} ${path} ${JSON.stringify(body)}`));
    next();
});

// p. respond to ping
app.get('/ping', (req, res) => {
    res.send('pong');
});

// l. login
app.post('/login', (req, res) => {
    const { username, email } = req.body;

    dbTypicode.users.getByCredentials(username, email).then((users) => {
        if (users.length === 0) {
            res.status(401).send('Invalid credentials');
            return;
        }

        const user = users[0];
        const token = jwt.createJwt(user.email);

        res.json({ token });
    });
});

// m2. verify token
app.use((req, res, next) => {
    const { authorization } = req.headers;

    if (!authorization) {
        res.status(401).send('Unauthorized');
        return;
    }

    const token = authorization.replace('Bearer ', '');
    const decoded = jwt.verifyJwt(token);

    if (!decoded) {
        res.status(401).send('Unauthorized');
        return;
    }

    const { email } = decoded;

    dbTypicode.users.getByEmail(email).then((users) => {
        if (users.length === 0) {
            res.status(401).send('Unauthorized');
            return;
        }

        res.locals.userId = users[0].id;

        next();
    });
});

// m3. validate max requests
app.use((req, res, next) => {
    const { userId } = res.locals;

    dbMongo.users.readById(userId).then((user) => {
        const { numOfActions } = user;

        const logsForToday = dbJson.logs.getByUserForToday(userId);
        const count = logsForToday.length;

        if (count >= numOfActions) {
            res.status(429).send('Too many requests, try again tomorrow');
            return;
        }

        next();
    });
});

// m4. logs
app.use((req, res, next) => {
    const { userId } = res.locals;
    const { method, path } = req;

    dbJson.logs.add(userId, method, path);

    next();
});

// a1. get users
app.get('/users', (req, res) => {
    dbMongo.users.read().then((users) => {
        res.json(users);
    });
});

// a2. create user
app.post('/users', (req, res) => {
    const { fullName, numOfActions } = req.body;

    dbMongo.users.create({ fullName, numOfActions }).then((user) => {
        res.json(user);
    });
});

// a3. update user
app.put('/users/:id', (req, res) => {
    const { id } = req.params;
    const { fullName, numOfActions } = req.body;

    dbMongo.users.update(id, { fullName, numOfActions }).then((user) => {
        res.json(user);
    });
});

// a4. delete user
app.delete('/users/:id', (req, res) => {
    const { id } = req.params;

    dbMongo.users.delete(id).then((user) => {
        res.json(user);
    });
});

// b1. get employees
app.get('/employees', (req, res) => {
    dbMongo.employees.read().then((employees) => {
        res.json(employees);
    });
});

// b2. create employee
app.post('/employees', (req, res) => {
    const { firstName, lastName, startYear, department } = req.body;

    dbMongo.employees
        .create({ firstName, lastName, startYear, department })
        .then((employee) => {
            res.json(employee);
        });
});

// b3. update employee
app.put('/employees/:id', (req, res) => {
    const { id } = req.params;
    const { firstName, lastName, startYear, department } = req.body;

    dbMongo.employees
        .update(id, { firstName, lastName, startYear, department })
        .then((employee) => {
            res.json(employee);
        });
});

// b4. delete employee
app.delete('/employees/:id', (req, res) => {
    const { id } = req.params;

    dbMongo.employees.delete(id).then((employee) => {
        res.json(employee);
    });
});

// c1. get departments
app.get('/departments', (req, res) => {
    dbMongo.departments.read().then((departments) => {
        res.json(departments);
    });
});

// c2. create department
app.post('/departments', (req, res) => {
    const { name, manager } = req.body;

    dbMongo.departments.create({ name, manager }).then((department) => {
        res.json(department);
    });
});

// c3. update department
app.put('/departments/:id', (req, res) => {
    const { id } = req.params;
    const { name, manager } = req.body;

    dbMongo.departments.update(id, { name, manager }).then((department) => {
        res.json(department);
    });
});

// c4. delete department
app.delete('/departments/:id', (req, res) => {
    const { id } = req.params;

    dbMongo.departments.delete(id).then((department) => {
        res.json(department);
    });
});

// d1. get shifts
app.get('/shifts', (req, res) => {
    dbMongo.shifts.read().then((shifts) => {
        res.json(shifts);
    });
});

// d2. create shift
app.post('/shifts', (req, res) => {
    const { employee, start, end } = req.body;

    dbMongo.shifts.create({ employee, start, end }).then((shift) => {
        res.json(shift);
    });
});

// d3. update shift
app.put('/shifts/:id', (req, res) => {
    const { id } = req.params;
    const { employee, start, end } = req.body;

    dbMongo.shifts.update(id, { employee, start, end }).then((shift) => {
        res.json(shift);
    });
});

// d4. delete shift
app.delete('/shifts/:id', (req, res) => {
    const { id } = req.params;

    dbMongo.shifts.delete(id).then((shift) => {
        res.json(shift);
    });
});

app.listen(port, () => {
    console.log(kleur.green(`Server is running on port ${port}`));
});
