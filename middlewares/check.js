const Joi = require('joi');

module.exports = (req, res , next) => {

    const schema = Joi.object({
        pays: Joi.string().min(2).max(2).required(),
        ville: Joi.string().min(5).max(100).allow(null, ''),
        cp: Joi.string().min(5).max(5).required(),
        latitude: Joi.string().allow(null, ''),
        longitude: Joi.string().allow(null, '')
    });
    const result = schema.validate(req.body);

    if (result.error)
        return res.status(400).send({ ok: false, msg: 'Invalid parameters sent' });

    next();
}
