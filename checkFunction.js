const express = require('express')
const Joi = require('joi');
const app = express();

app.use(express.json());

function checkData(data){

    //   <Pays>string</Pays>
    //   <Ville>string</Ville>
    //   <CP>string</CP>
    //   <Latitude>string</Latitude>
    //   <Longitude>string</Longitude>

    const schema = Joi.object({
        Pays: Joi.string().min(5).max(100).required(),
        Ville: Joi.string().min(5).max(100).required(),
        CP: Joi.string().min(5).max(5).required(),
        Latitude: Joi.string().required(),
        Longitude: Joi.string().required()
    });
    const result = schema.validate(data);

    if (result.error) {
        return res.status(400).send({
        ok: false,
        msg: result.error.details[0].message,
        });
    }

    return true;
}

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
  
app.listen(3000, () => {console.log('Serveur démarré sur le port 3000')});
  