const xmlbuilder = require('xmlbuilder');

function jsonToXml(json_message, header, footer) {
  const data = JSON.parse(json_message);
  const xmlContent = convertToXml(data);
  const xmlMessage = `${header}\n${xmlContent}\n${footer}`;
  return xmlMessage;
}

function convertToXml(data) {
  const root = xmlbuilder.create('PointRelais_Details');
  buildXml(root, data);
  return root.end({ pretty: true });
}

function buildXml(parent, data) {
  for (let key in data) {
    if (data.hasOwnProperty(key)) {
      const value = data[key];

      if (typeof value === 'object') {
        const child = parent.ele(key);
        buildXml(child, value);
      } else {
        parent.ele(key, value);
      }
    }
  }
}

// Exemple d'utilisation
const jsonMessage = `{
  "pays": "FR",
  "CP": "38000",
  "ACTION": "REL"
}`;

const headerXml = `<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema">
    <soap:Body>
        <WSI3_PointRelais_RechercheResponse xmlns="http://www.mondialrelay.fr/webservice/">
            <WSI3_PointRelais_RechercheResult>
                <STAT>0</STAT>
                <PointsRelais>
                    `;

const footerXml = `
</PointsRelais>
</WSI3_PointRelais_RechercheResult>
</WSI3_PointRelais_RechercheResponse>
</soap:Body>
</soap:Envelope>`;

const xmlMessage = jsonToXml(jsonMessage, headerXml, footerXml);
console.log(xmlMessage);

module.exports = jsonToXml;