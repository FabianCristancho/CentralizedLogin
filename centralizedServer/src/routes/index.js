const express = require('express');
const router = express.Router();
const axios = require('axios');
const Log = require('../db/logs');
var resultPalindrome = "";
var statusClient = 0;
var startHrTime;
let portService = 0;
const sleep = (waitTimeInMs) => new Promise(resolve => setTimeout(resolve, waitTimeInMs));

var start = new Date();
let main = true;

router.get('/', async (req, res) => {
     const listLogs = await Log.find({level: 'Error'});
     // console.log(listLogs);
     res.render('index', {
          listLogs, statusClient, resultPalindrome});
     // res.render('index');
});

router.post('/sendReq', (req,res) => {
     
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
     startHrTime = process.hrtime();
     sendRequest(req, res);

     sleep(100).then(() => {
          res.redirect('/');
     });
});

router.get('/log', async (req, res) => {
     const elapsedHrTime = process.hrtime(req.query.currentTime);
     const elapsedTimeInMs = elapsedHrTime[0] * 1000 + elapsedHrTime[1] / 1e6;

     let responseStatus = {date: req.query.date, server: req.query.server, timeResponse: elapsedTimeInMs, code: res.statusCode, level: req.query.level};

     console.log(responseStatus);

     // const log = new Log(req.query);
     const log = new Log(responseStatus);
     
     await log.save();
     // console.log(JSON.stringify(req.headers));
});

function sendRequest(req, res){
     axios.get('http://localhost:'+portService+'/receiveReq', {params: {word: req.body.word}}).then(res => {
          console.log("A continuacion la respuesta");
          statusClient = 1;
          resultPalindrome = res.data;
          console.log(res.data);
     }).catch(async error => {
          console.log(error);
          console.log("HA ENTRADO EN EL CATCH");
          let responseStatus = {date: new Date(), server: '192.168.56.1', timeResponse: -1, code: 404, level: 'Error'};
          let log = new Log(responseStatus);
          await log.save();
          resultPalindrome = "";
     });
     
}

module.exports = router;