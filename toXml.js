
//npm i xmlbuilder
const xmlbuilder = require('xmlbuilder');


/**
 * Convertit un objet JavaScript en une chaîne XML.
 * @param {Object} data - L'objet JavaScript à convertir en XML.
 * @returns {string} - La chaîne XML résultante.
 */
function toXml(data) {
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
  const xmlContent = convertToXml(data);
  const xmlMessage = `${headerXml}\n${xmlContent}\n${footerXml}`;
  return xmlMessage;
}

function convertToXml(data) {
  const root = xmlbuilder.create('PointRelais_Details');
  buildXml(root, data);
  return root.end({ pretty: true });
}

/**
 * Construit la structure XML en parcourant l'objet JavaScript récursivement.
 * @param {Object} parent - L'élément parent XML à construire.
 * @param {Object} data - L'objet JavaScript contenant les données pour la construction XML.
 */
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
const Message = {
  pays: "FR",
  CP: "38000",
  ACTION: "REL"
};



const xmlMessage = toXml(Message);
console.log(xmlMessage);

module.exports = toXml;