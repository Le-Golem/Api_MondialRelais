const Joi = require('joi');

module.exports = (req, res , next) => {

    const schema = Joi.object({
        Pays: Joi.string().min(2).max(2).required(),
        Ville: Joi.string().min(5).max(100).allow(null, ''),
        CP: Joi.string().min(5).max(5).required(),
        Latitude: Joi.string().allow(null, ''),
        Longitude: Joi.string().allow(null, '')
    });
    const result = schema.validate(req.body);

    if (result.error)
        return res.status(400).send({ ok: false, msg: 'Invalid parameters sent' });

    next();
}
