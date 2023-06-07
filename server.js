const express = require('express');
const cryptoJS = require('crypto-js')

const app = express();
app.use(express.json())
const bodyParser = require('body-parser');
app.use(bodyParser.text({ type: 'text/xml' }));

const MondialRelaiEnseigne = "BDTEST13" // => a ajouter dans requestCompletion 
const MondialRelaiPrivateKey = "PrivateK"

const CreateSecurityKey = (verifiedJSobject) => {

  let concatenedProperty = '' //MondialRelaiEnseigne
  for (let property of verifiedJSobject) {
    concatenedProperty += property.toString()
  }
  concatenedProperty += MondialRelaiPrivateKey
  const key = cryptoJS.MD5(concatenedProperty).toString.toUpperCase()
  return { ...verifiedJSobject, securityKey: key }
}

const JStoJSON = JS => JSON.stringify(JS);





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
      // Traiter la réponse
      return response.text();
    })
    .then(data => {
      res.send(data);
    })
    .catch(error => {
      console.error(error);
      res.status(500).send('Une erreur est survenue.');
    });
});

app.listen(3000, () => {
  console.log('Serveur démarré sur le port 3000');
});
