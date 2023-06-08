
const express = require('express');
const cryptoJS = require('crypto-js');
const app = express();
const bodyParser = require('body-parser');
const xml2js = require('xml2js');
const util = require('util');
const parser = new xml2js.Parser()

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
function removeArrayBrackets(obj) {
    if (Array.isArray(obj)) {
      if (obj.length === 1) {
        return removeArrayBrackets(obj[0]);
      }
      return obj.map(item => removeArrayBrackets(item));
    } else if (typeof obj === 'object') {
      if (obj.hasOwnProperty('string')) {
        obj.Horaire = obj.string;
        delete obj.string;
      }
      for (const key in obj) {
        obj[key] = removeArrayBrackets(obj[key]);
      }
    }
    return obj;
  }
  
const JStoJSON = JS => JSON.stringify(JS);

module.exports = {

    getData(req , res) {

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
                const cleanedObject = removeArrayBrackets(result);
                res.json(cleanedObject);
                } catch (error) {
                res.send(error)
                }
            })
        })
            .catch(error => {
            res.status(500).send(error);
        });
    }
}
