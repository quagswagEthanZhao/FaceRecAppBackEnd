const users = require('../model/fakeUserData');
const knex = require('knex');
const bcrypt = require('bcrypt');
const postgres = knex({
    client: 'pg',
    connection: {
        host: '127.0.0.1',
        user: 'postgres',
        password: 'admin',
        database: 'detectapp'
    },
});
module.exports = {
    signin: async (req, res, next) => {
        const { email, password } = req.body;
        try {
            const resoult = await postgres.select('*').from('login').where('email', email);
            const userLogin = resoult[0];
            if (!userLogin) return res.status(404).json({ error: true, message: 'Email is not registered' });
            const isValid = await bcrypt.compare(password, userLogin.hash);
            if (!isValid) return res.status(404).json({ error: true, message: 'The password is not match' });
            postgres.select('*').from('users').where('email', email)
                .then(user => res.status(200).json({ error: false, message: `You are logged in!`, currentUser: user[0] }))
                .catch(error => res.status(400).json({ error: true, message: 'Internal error unable to register right now', status: error }));
        } catch (error) {
            res.status(400).json({ error: true, message: 'Internal error cannot login now' });
        }
    },

    register: async (req, res, next) => {
        const { email, name, password } = req.body;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const emailError = users.find(user => user.email === email);
        if (emailError) return res.status(400).json({ error: true, message: 'Email is already being registered' });
        postgres.transaction(trx => {
            trx.insert({
                hash: hashedPassword,
                email: email
            })
                .into('login')
                .returning('email')
                .then(loginEmail => {
                    trx('users')
                        .returning('*')
                        .insert({
                            email: loginEmail[0],
                            name: name,
                            joined: new Date()
                        })
                        .then(user => res.json({ error: false, message: `Registered for user: ${user[0].name}`, currentUser: user[0] }))
                        .then(trx.commit)
                        .catch(trx.rollback);
                })
        })
    },
    findSingleUser: (req, res, next) => {
        const id = req.params.id;
        const user = users.find(user => user.id === id);
        if (!user) return res.status(404).json({
            error: true,
            message: 'User Not Find'
        });
        res.status(200).json({
            error: false,
            message: user
        });
    },
    updateUserEntre: async (req, res, next) => {
        const id = req.body.id;
        try {
            const user = await postgres('users').where('id', '=', id).increment('entries').returning('*');
            if (!user) return res.status(404).json({ error: true, message: 'Fail to update the user' });
            res.status(200).json({ error: false, message: 'Entries updated', currentUser: user[0] });
        } catch (error) {
            res.status(400).json({ error: true, message: 'Internal error' });
        }
    }
}