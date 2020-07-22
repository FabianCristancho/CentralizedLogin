const express = require('express');
const router = express.Router();
const axios = require('axios');
const Log = require('../db/logs');

var start = new Date();
let main = true;

router.get('/', async (req, res) => {
     const listLogs = await Log.find();
     console.log(listLogs);
     res.render('index', {
          listLogs
     });
     // res.render('index');
});

router.post('/sendReq', (req,res) => {
     let portService = 0;
     console.log(portService);
     console.log(main);
     if(main){
          portService = 3001;
     }else{
          portService = 3002;
     }
     main = !main;
     console.log(main);
     console.log('http://localhost:'+portService+'/receiveReq');
     axios.get('http://localhost:'+portService+'/receiveReq').catch(error => {
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