const express = require('express')
const Api = require('./resources/api_Mr/api.router')

const app = express();
app.use(express.json());

app.use('/', Api)


app.listen(3000, () => console.log("ecoute en cours sur 3000 ..."))
