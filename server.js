const express = require('express');
const cryptoJS = require('crypto-js');
const { checkData } = require('./utils/checkFunction.js');

const app = express();
const bodyParser = require('body-parser');
const xml2js = require('xml2js');
const util = require('util');

const parser = new xml2js.Parser()

app.use(express.json())


const MondialRelaiPrivateKey = "PrivateK"

const MondialRelaiConst = {
  Enseigne: "BDTEST13",
  Action: "REL"
}


const requestCompletion = (jsRequest) => {
  return {
    ...MondialRelaiConst,
    ...jsRequest,
  }
}


const CreateSecurityKey = (verifiedJSobject) => {

  let concatenedProperty = '' //MondialRelaiEnseigne
  for (let property in verifiedJSobject) {
    concatenedProperty += property.toString()
  }
  concatenedProperty += MondialRelaiPrivateKey
  const key = cryptoJS.MD5(concatenedProperty).toString().toUpperCase()
  return { ...verifiedJSobject, securityKey: key }
}

const jsonToJS = json => JSON.parse(json)

const JStoJson = JS => JSON.stringify(JS);

app.post('/', (req, res) => {

  const verif = checkData(req.body);

  if (verif) {
    return res.status(400).send({
      ok: false,
      msg: verif.details[0].message,
    });
  }


  console.log("1", req.body)

  let JSrequest = requestCompletion(req.body)

  console.log("2", JSrequest)

  JSrequest = CreateSecurityKey(JSrequest)

  console.log("3", JSrequest)



  const requestBody = ""   // TODO convert JSREQUEST TO XML 

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