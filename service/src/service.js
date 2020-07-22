const express = require('express');
const axios = require('axios');
const ip = require('ip');

const app = express();
let port = 3001;
prt();
function prt(){
     axios.get('http://localhost:3001/',{
     }).then(res =>{
          port = 3002;
     }).catch(error => {
     });

}
app.get('/', (req, res) => {
     res.send('Server');
})

app.get('/receiveReq', (req, res) => {
     console.log("Recibida la solicitud del middleware");
     axios.get('http://localhost:3000/log',{
          params: {
               date: new Date(),
               server:ip.address(),
               timeResponse: 100,
               status: true,
          }
     }).then(res =>{
          // res.connection.destroy();
     }).catch(error => {
          console.log('middleware desconectado')
          // console.log(error);
     });
});

setTimeout(() => {  app.listen(port, () => console.log(`Example app listening on port ${port}`)); }, 2000);
//setTimeout(app.listen(port, () => console.log(`Example app listening on port ${port}`)), 1000);