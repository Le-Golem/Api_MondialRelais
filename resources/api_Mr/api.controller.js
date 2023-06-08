
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

const requestCompletion = (jsRequest) => {

    const MondialRelaiConst = {
        Enseigne: "BDTEST13",
        Action: "REL",
        Security: "PrivateK"
    }


    return {
        ...MondialRelaiConst,
        ...jsRequest,
    }
}




module.exports = {

    getData(req, res) {

        // const verif = checkData(req.body);

        // if(verif !== true)
        // {
        //     return res.status(400).send({
        //         ok: false,
        //         msg: verif.details[0].message,
        //     });
        // }
        const requestBody = toXML()

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
    }
}
