const express = require('express');
const axios = require('axios');
const ip = require('ip');

const app = express();
const port = 3001;

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
               status: true
          }
     }).then(res =>{
          // res.connection.destroy();
     }).catch(error => {
          console.log('middleware desconectado')
          // console.log(error);
     });
});


app.listen(port, () => console.log(`Example app listening on port ${port}`));