const express = require('express');
const router = express.Router();
const axios = require('axios');
const Log = require('../db/logs');
var resultPalindrome = "Frase";
var statusClient = 0;

var start = new Date();
let main = true;

router.get('/', async (req, res) => {
     const listLogs = await Log.find();
     console.log(listLogs);
     res.render('index', {
          listLogs, statusClient, resultPalindrome});
     // res.render('index');
});

router.post('/sendReq', (req,res) => {
     let portService = 0;
     console.log(portService);
     console.log(main);
     console.log(req.body.num1);
     if(main){
          portService = 3001;
     }else{
          portService = 3002;
     }
     main = !main;
     console.log(main);
     console.log('http://localhost:'+portService+'/receiveReq');
     axios.get('http://localhost:'+portService+'/receiveReq', {params: {word: req.body.word}}).then(res => {
          console.log("A continuacion la respuesta");
          statusClient = 1;
          resultPalindrome = res.data;
          console.log(res.data);
     }).catch(error => {
          console.log(error);
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