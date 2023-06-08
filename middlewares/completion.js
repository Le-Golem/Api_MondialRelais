
module.exports = (req, res, next) => {


    const body = req.body

    const MondialRelaiConst = {
        enseigne: "BDTEST13",
        action: "REL",
        security: "PrivateK"
    }


    req.body = {
        ...MondialRelaiConst,
        ...body,
    }

    next();
}