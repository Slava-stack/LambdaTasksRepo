const jwt = require('jsonwebtoken');
const {secret_jwt_access} = require('../config')
module.exports = (req, res, next) => {
    try {
        const request_num = req.params.request_number;
        const token = req.headers.authorization.split(' ')[1]
        if (!token)
            return res.status(401).json({message: "User is not authorized"})
        const decodedData = jwt.verify(token, secret_jwt_access);
        const {email, password} = decodedData;
        res.status(200).json({request_num, data: {username: `${email} ${password}`}});
        next();
    } catch (e) {
        console.log(e);
        return res.status(401).json({message: "User is not authorized"})
    }
}