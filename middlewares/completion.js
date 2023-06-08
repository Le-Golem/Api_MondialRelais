
module.exports = (req, res, next) => {


    const body = req.body

    const MondialRelaiConst = {
        Enseigne: "BDTEST13",
        Action: "REL",
        Security: "PrivateK"
    }


    req.body = {
        ...MondialRelaiConst,
        ...body,
    }

    next();
}