const users = require('../model/fakeUserData');
module.exports = {
    signin: (req, res, next) => {
        const { email, password } = req.body;
        const user = users.find(u => u.email === email);
        // console.log(user);
        // console.log(`databasepass${user.password} inputpass${password}`)
        if (!user) return res.status(404).json({ error: true, message: 'Email is not registered' });
        if (user.password !== password) return res.status(404).json({ error: true, message: 'Password not match' });
        res.status(200).json({ error: false, message: `You are logged in`, currentUser: user });
    },

    register: (req, res, next) => {
        const { email, name, password } = req.body;
        const emailError = users.find(user => user.email === email);
        if (emailError) return res.status(400).json({ error: true, message: 'Email is already being registered' });
        //Fake database query 
        users.push({
            id: String(users.length + 1),
            name: name,
            email: email,
            password: password,
            entries: 0,
            joinedDate: new Date()
        })
        res.json({ error: false, message: `Registered for ${users[users.length - 1].name}` });
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
    updateUserEntre: (req, res, next) => {
        const id = req.body.id;
        const user = users.find(user => user.id === id);
        if (!user) return res.status(404).json({
            error: true,
            message: 'User Not Find'
        });
        user.entries++;
        res.status(200).json({
            error: false,
            message: 'updated!',
            currentUser: user
        });
    }
}