const express = require('express');
const router = express.Router();
const axios = require('axios');
const Log = require('../db/logs');

var start = new Date();

router.get('/', async (req, res) => {
     const listLogs = await Log.find();
     console.log(listLogs);
     res.render('index', {
          listLogs
     });
     // res.render('index');
});

router.post('/sendReq', (req,res) => {
     axios.get('http://localhost:3001/receiveReq').catch(error => {
          console.log("servidor conectado");
     });
     res.redirect('/');
});

router.get('/log', async (req, res) => {
     console.log(req.query);
     const log = new Log(req.query);
     await log.save();
     res.redirect('/');
     // console.log(JSON.stringify(req.headers));
});

module.exports = router;