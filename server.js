const express = require('express');
const cryptoJS = require('crypto-js');
const { checkData } = require('./utils/checkFunction.js');

const app = express();
const bodyParser = require('body-parser');
const xml2js = require('xml2js');
const util = require('util');
const toXml = require('./toXml.js');
const JStoXML = require('./toXml.js');


const parser = new xml2js.Parser()

app.use(express.json())


const MondialRelaiPrivateKey = "PrivateK"

const MondialRelaiConst = {
  Enseigne: "BDTEST13",
  Action: "REL",
  Security: "PrivateK"
}


const requestCompletion = (jsRequest) => {
  return {
    ...MondialRelaiConst,
    ...jsRequest,
  }
}


const CreateSecurityKey = (verifiedJSobject) => {

  const orderPropertyArray = ["Enseigne", "Pays", "NumPointRelais", "Ville", "CP", "Latitude", "Longitude", "Taille", "Poids", "Action", "DelaiEnvoi", "RayonRecherche", "TypeActivite", "NombreResultats", "Security"];

  let concatenedProperty = '' //MondialRelaiEnseigne
  const valueArray = {}

  for (let property in verifiedJSobject) {
    const value = verifiedJSobject[property]
    valueArray[property] = value.toString()
  }

  for (let key of orderPropertyArray) {
    for (let key2 in valueArray) {
      if (key == key2) {
        concatenedProperty += valueArray[key]
      }
    }
  }


  console.log(concatenedProperty)
  const key = cryptoJS.MD5(concatenedProperty).toString().toUpperCase()
  console.log(key)
  return { ...verifiedJSobject, Security: key }
}

app.post('/', (req, res) => {

  const verif = checkData(req.body);

  if (verif) {
    return res.status(400).send({
      ok: false,
      msg: verif.details[0].message,
    });
  }

  // console.log("1", req.body)

  let JSrequest = requestCompletion(req.body)

  // console.log("2", JSrequest)

  JSrequest = CreateSecurityKey(JSrequest)

  // console.log("3", JSrequest)





  const requestBody = JStoXML(JSrequest)   // TODO convert JSREQUEST TO XML 

  console.log("4", requestBody)


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
      parser.parseString(data, (err, result) => {
        if (err) {
          console.log(err)
        }
        try {
          res.send(util.inspect(result, true, null, false));
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