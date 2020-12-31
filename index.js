const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const bodyParser = require('body-parser');
const cors = require('cors');
const userController = require('./controller/userController');
const homeController = require('./controller/homeController');

app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());


//Home route
app.get('/', homeController.showUsers);
//User routes
app.post('/signin', userController.signin);
app.post('/register', userController.register);
app.get('/users/profile/:id', userController.findSingleUser);
app.put('/users/updateEntries', userController.updateUserEntre);

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));