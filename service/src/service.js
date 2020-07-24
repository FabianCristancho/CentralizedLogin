const express = require('express');
const axios = require('axios');
const ip = require('ip');

const app = express();
const port = process.argv[2]

app.get('/', (req, res) => {
     res.send("server");
})

app.get('/receiveReq', (req, res) => {
     console.log("Recibida la solicitud del middleware");
     console.log(isPalindrome(req.query.word));
     res.send(isPalindrome(req.query.word));
     sendLog(res);
});

function sendLog(res){
     axios.get('http://localhost:3000/log',{
          params: {
               date: new Date(),
               server:ip.address(),
               currentTime: process.hrtime(),
               status: res.statusCode,
               level: 'OK'
          }
     }).then(res =>{
          // res.connection.destroy();
     }).catch(error => {
          console.log('middleware desconectado')
          // console.log(error);
     });
}

function isPalindrome(word){
     var evaluateWord = word.replace(/ /g, "").toLowerCase();
     var i = 0;
     var j = evaluateWord.length - 1;
     while(i <= j){
          if(evaluateWord[i] !== evaluateWord[j]){
               return "'" +word +"'" +" no es palíndroma";
          }
          i++;
          j--;
     }
     return "'" +word +"'" +" es palíndroma";
}

app.listen(port, () => console.log(`Server listening on port ${port}`));