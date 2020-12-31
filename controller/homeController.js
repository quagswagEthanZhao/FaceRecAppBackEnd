const users = require('../model/fakeUserData');
module.exports = {
    showUsers: (req, res, next) => {
        res.send(users);
    }
}