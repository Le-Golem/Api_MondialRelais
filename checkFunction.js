const Joi = require('joi');

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

exports.checkData = checkData;