const Joi = require('joi');

function checkData(data){

    const schema = Joi.object({
        Pays: Joi.string().min(2).max(2).required(),
        Ville: Joi.string().min(5).max(100).required(),
        CP: Joi.string().min(5).max(5).required(),
        Latitude: Joi.string(),
        Longitude: Joi.string()
    });
    const result = schema.validate(data);

    if (result.error) {
        return result.error;
    }

    return true;
}

exports.checkData = checkData;