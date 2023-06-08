
const builder = require('xmlbuilder');

module.exports = (req, res, next) => {
    // Create the XML document
    const xml = builder.create('soap:Envelope', { version: '1.0', encoding: 'utf-8' })
        .att('xmlns:xsi', 'http://www.w3.org/2001/XMLSchema-instance')
        .att('xmlns:xsd', 'http://www.w3.org/2001/XMLSchema')
        .att('xmlns:soap', 'http://schemas.xmlsoap.org/soap/envelope/');

    // Add the soap:Body element
    const body = xml.ele('soap:Body');

    // Add the WSI3_PointRelais_Recherche element
    const wsiElement = body.ele('WSI3_PointRelais_Recherche', { xmlns: 'http://www.mondialrelay.fr/webservice/' });


    for (const property in req.body) {
        // Get the value of the property
        const value = req.body[property];

        // Add the property element with its value
        wsiElement.ele(property.toUpperCase(), value.toUpperCase());
    }

    // Convert the XML document to string
    const xmlString = xml.end({ pretty: true });

    req.body = xmlString

    next();
}

