const express = require('express');
const router = express.Router();
const axios = require('axios');
const Log = require('../db/logs');

const host = process.argv[2];
const port1 = process.argv[3];
const port2 = process.argv[4];
var resultPalindrome = "";
var initTime = 0;
var portService = 0;

const sleep = (waitTimeInMs) => new Promise(resolve => setTimeout(resolve, waitTimeInMs));

var serverFailed = 0;
var isCatch = false;
var main = true;

/**
 * Ruta con página principal
 */
router.get('/', async (req, res) => {
     const listLogs = await Log.find({level:{$in:['Error', 'Warning']}});
     res.render('index', {
          listLogs, resultPalindrome});
});

/**
 * Encargado de solicitar respuesta por parte de un servidor elegido por el algoritmo de round robin
 */
router.post('/sendReq', (req,res) => {
     roundRobin();
     sendRequest(req, res);
});

function roundRobin(){
     if(main){
          portService = port1;
     }else{
          portService = port2;
     }
     main = !main;
}

/**
 * Respuesta de logs por parte del servidor
 */
router.get('/log', async (req, res) => {
     let finalTime = new Date();
     let responseTime = (finalTime.getMilliseconds()+initTime.getMilliseconds())/2;

     let responseStatus ={};
     if(responseTime<5000){
          responseStatus = {date: req.query.date, server: host, timeResponse: responseTime, code: res.statusCode, level: req.query.level};
     }else{
          responseStatus = {date: req.query.date, server: host, timeResponse: responseTime, code: 504, level: "Warning"};
     }
     console.log(responseStatus);

     const log = new Log(responseStatus);
     await log.save();
});

/**
 * Envía solicitud a server
 * @param {Solicitud} req 
 * @param {Respuesta} res 
 */
function sendRequest(req, res){
     initTime = new Date();
     axios.get('http://'+host+':'+portService+'/receiveReq', {params: {word: req.body.word}}).then(res => {
          console.log("Respuesta:");
          resultPalindrome = res.data;
          console.log(res.data);
          if(isCatch){
               roundRobin();
               isCatch = !isCatch;
          }
          serverFailed = 0;

     }).catch(async error => {
          let responseStatus = {date: new Date(), server: host +':' +portService, timeResponse: 0, code: 404, level: 'Error'};
          console.log(responseStatus);
          let log = new Log(responseStatus);
          await log.save();
          
          roundRobin();
          isCatch = true;
          serverFailed++;
          
          if(serverFailed < 2){
               resultPalindrome = "x_x servidores no disponibles x_x";
               sendRequest(req, res);
          }

     }).finally(() => {
          sleep(100).then(() => {
               res.redirect('/');
          });
     });
}

module.exports = router;