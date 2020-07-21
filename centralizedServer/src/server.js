const express = require('express');
const path = require('path');
const morgan = require('morgan');
const mongoose = require('mongoose');

const indexRoutes = require('./routes/index');

const app = express();
const port = 3000;

//Conecting DB
mongoose.connect('mongodb://localhost/test_logs', {
     useUnifiedTopology: true,
     useNewUrlParser: true,
     }).then(db => console.log('DB connected')).catch(err => console.log(err));

//settings
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//middleware
app.use(morgan('dev'))
app.use(express.urlencoded({extended: false}));

//routes
app.use('/', indexRoutes);

app.listen(port, () => console.log(`Servidor escuchando en puerto ${port}`));