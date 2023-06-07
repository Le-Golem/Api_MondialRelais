const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const Joi = require('joi');
const xml2js = require('xml2js');
const util = require('util');

const parser = new xml2js.Parser()

app.use(express.json())

app.post('/', (req, res) => {

  const requestBody = `<?xml version="1.0" encoding="utf-8"?>
    <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
      <soap:Body>
        <WSI3_PointRelais_Recherche xmlns="http://www.mondialrelay.fr/webservice/">
          <Enseigne>BDTEST13</Enseigne>
          <Pays>FR</Pays>
          <CP>38000</CP>
          <Poids>1000</Poids>
          <Action>REL</Action>
          <Security>6252387E5451147ED851DBC957535921</Security>
        </WSI3_PointRelais_Recherche>
      </soap:Body>
    </soap:Envelope>`;

  fetch('http://api.mondialrelay.com/Web_Services.asmx?op=WSI4_PointRelais_Recherche', {
    method: 'POST',
    headers: {
      'Content-Type': 'text/xml'
    },
    body: requestBody
  })
    .then(response => {
      return response.text();
    })
    .then(data => {
      console.log(data)
      // fonction XML to JSON 
      parser.parseString(data, (err,result) => {
        res.send(util.inspect(result , false , null , false));
      })
    })
    .catch(error => {
      console.error(error);
      res.status(500).send('Une erreur est survenue.');
    });
});

app.listen(3000, () => {
  console.log('Serveur démarré sur le port 3000');
});
