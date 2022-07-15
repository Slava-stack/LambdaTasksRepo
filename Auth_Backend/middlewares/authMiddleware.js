const jwt = require('jsonwebtoken');
const {secret} = require('../config')
module.exports = (req, res, next) => {
    // if (req.method === "OPTIONS")
    //     next();
    try {
        const request_num = req.params.request_number;
        const token = req.headers.authorization.split(' ')[1]
        if (!token)
            return res.status(403).json({message: "User is not authorized"})
        const decodedData = jwt.verify(token, secret);
        const {email, hashed_pwd} = decodedData;
        // req.user = decodeData;
        res.status(200).json({request_num, data: {username: `${email} ${hashed_pwd}`}});
        next();
    } catch (e) {
        console.log(e);
        return res.status(401).json({message: "User is not authorized"})
    }
}