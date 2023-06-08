const cryptoJS = require('crypto-js');

module.exports = (req, res, next) => {


    const orderPropertyArray = ["Enseigne", "Pays", "NumPointRelais", "Ville", "CP", "Latitude", "Longitude", "Taille", "Poids", "Action", "DelaiEnvoi", "RayonRecherche", "TypeActivite", "NombreResultats", "Security"];

    let concatenedProperty = '' //MondialRelaiEnseigne
    const valueArray = {}

    for (let property in req.body) {
        const value = req.body[property]
        valueArray[property] = value.toString()
    }

    console.log("value array ", valueArray)




    for (let key of orderPropertyArray) {
        for (let key2 in valueArray) {
            if (key == key2) {
                concatenedProperty += valueArray[key]
            }
        }
    }

    console.log("concat  ", concatenedProperty)


    const key = cryptoJS.MD5(concatenedProperty).toString().toUpperCase()

    const body = req.body

    req.body = { ...body, Security: key }

    next();
}