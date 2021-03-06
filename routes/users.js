const routes = require('express').Router();
const users = require('../models').users;
const bcrypt = require('bcryptjs');

// ----- HANDLERS FOR USERS -----
// --- GET ALL USERS AND USERS BY ROLE ---
routes.get('/', (req, res) => {
    let options = { where: {}, order: [['id', 'DESC']] };

    if(req.user.role === 1 && req.query.role) options.where.role = req.query.role;
    else if(req.user.role === 2) {
        options.attributes = ['id', 'username'];
        options.where.id = { $ne: req.user.id };
        options.where.email = { $ne: null };
        options.where.role = 2;
    } else if(req.user.role === 3) return res.status(500).send({ message: 'You have no rights' });

    users.findAll(options)
        .then(users => {
            res.send(users);
        })
        .catch(err => {
            res.status(500).send({ message: err.message });
        });
});

// --- GET ALL MANAGERS ---
routes.get('/managers', (req, res) => {
    users.findAll({where: { role: 2 }, order: [['id', 'DESC']], attributes : ['id', 'username']})
        .then(users => {
            res.send(users);
        })
        .catch(err => {
            res.status(500).send({ message: err.message });
        });
});

// --- GET ALL SIMPLE USERS ---
routes.get('/simple', (req, res) => {
    users.findAll({where: { role: 2 }, order: [['id', 'DESC']], attributes : ['id', 'username']})
        .then(users => {
            res.send(users);
        })
        .catch(err => {
            res.status(500).send({ message: err.message });
        });
});

// --- ADD NEW USER ---
routes.post('/', (req, res) => {
    req.body.role = req.body.role || 2;
    if(req.user.role === 1){
        users.findOne({where: { username: req.body.username }})
            .then(user => {
                if(user) return Promise.reject('User with that name is already exist');
                else return bcrypt.genSalt(10);
            })
            .then(salt => {
                return bcrypt.hash(req.body.password, salt);
            })
            .then(hash => {
                req.body.password = hash;
                return users.create(req.body);
            })
            .then(user => {
                res.status(201).send(user);
            })
            .catch(err => {
                res.status(501).send(typeof err === 'string' ? { message: err } : { message: err.message });
            });
    } else {
        res.status(500).send({ message: 'You have no rights' });
    }
});

// --- EDIT USER ---
routes.put('/:id', (req, res) => {
    if(req.user.role === 1) {
        users.findOne({where: {id: req.params.id}})
            .then(user => {
                if (user){
                    if(user.dataValues.provider) return users.update({ username: req.body.username, role: req.body.role}, {where: {id: req.params.id}});
                    else if(!req.body.password) return Promise.reject('Password cannot be empty');
                    else return getUserWithCryptPass(req.body, req.params.id);
                }
                return Promise.reject('Wrong id');
            })
            .then(user => {
                res.send(user);
            })
            .catch(err => {
                res.status(501).send(typeof err === 'string' ? { message: err } : { message: err.message });
            });
    } else res.status(500).send({ message: 'You have no rights' });
});

const getUserWithCryptPass = (user, userId) => {
    return bcrypt.genSalt(10)
        .then(salt => {
            return bcrypt.hash(user.password, salt);
        })
        .then(hash => {
            user.password = hash;
            return users.update(user, {where: {id: userId}});
        })
        .then(user => {
            return users.findOne({where: {id: userId}});
        })
        .catch(err => {
            return err.message;
        })
};

// --- DELETE USER ---
routes.delete('/:id', (req, res) => {
    if(req.user.role === 1) {
        users.destroy({where: {id: req.params.id}})
            .then(user => {
                user ? res.send(req.params.id.toString()) : res.status(500).send({message: 'Wrong id'});
            })
            .catch(err => {
                res.status(500).send({message: err.message});
            });
    }
});

// --- GET CURRENT USER ---
routes.get('/current', (req, res) => {
    if(!Number.isInteger(req.user.id))
        req.user = { username: 'Anonymous', role: 3 };

    req.user ? res.send(req.user) : res.send(401).send({ message: 'Unauthorized' });
});

module.exports = routes;