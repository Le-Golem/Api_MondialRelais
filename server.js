const express = require('express');
const cryptoJS = require('crypto-js');
const { checkData } = require('./utils/checkFunction.js');

const app = express();
const bodyParser = require('body-parser');
const xml2js = require('xml2js');
const util = require('util');

const parser = new xml2js.Parser()

app.use(express.json())


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

    const verif = checkData(req.body);

    if( verif )
    {
        return res.status(400).send({
            ok: false,
            msg: verif.details[0].message,
        });
    }
    
    const requestBody = `<?xml version="1.0" encoding="utf-8"?>
    <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
        <soap:Body>
        <WSI4_PointRelais_Recherche xmlns="http://www.mondialrelay.fr/webservice/">
            <Enseigne>BDTEST13</Enseigne>
            <Pays>FR</Pays>
            <CP>38000</CP>
            <Action>REL</Action>
            <NombreResultats>1</NombreResultats>
            <Security>E3B4A63E6FA9DE5098C37755CFB01666</Security>
        </WSI4_PointRelais_Recherche>
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
        // fonction XML to JSON 
        parser.parseString(data, (err,result) => {
            if(err){
            console.log(err)}
            try {
            res.send(util.inspect(result , true , null , false));
            } catch (error) {
            res.send(error)
            }
        })
    })
        .catch(error => {
        res.status(500).send(error);
    });
});

app.listen(3000, () => {
    console.log('Serveur démarré sur le port 3000');
});