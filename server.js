require('dotenv').config();
const routes = require('./routes/routes');

const http = require('http');
const express = require('express');
const path = require('path');

const mongoose = require('mongoose');
const mongoString = process.env.DATABASE_URL;

mongoose.connect(mongoString);
const database = mongoose.connection;

database.on('error', (error) => {
    console.log(error)
})

database.once('connected', () => {
    console.log('Database Connected');
})


const app = express();
app.use(express.json());
app.use('/api', routes)
app.use(express.static("public"));

app.use('/', function(req,res){
    res.sendFile(path.join(__dirname+'/public/index.html'))
});

const server = http.createServer(app);

const port = 3000;
server.listen(port);console.debug('Server listening on port ' + port);