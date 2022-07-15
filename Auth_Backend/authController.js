const userValidationCollection = require('./models(Validations)/users');
const tokenValidationCollection = require('./models(Validations)/tokens');
const bcrypt = require('bcryptjs');
const {validationResult} = require('express-validator');
const jwt = require('jsonwebtoken');
const {MongoClient} = require("mongodb");
const tokenService = require("./token-service");
const {secret_jwt_refresh, secret_jwt_access} = require('./config');

const uri = "mongodb://127.0.0.1:27017";
const client = new MongoClient(uri);

class authController {
    async signUp(req, res) {
        try {
            await userValidationCollection.runUserValidation();
            const errors = validationResult(req);
            if (!errors.isEmpty())
                return res.status(401).json({message: errors.errors.map(el => `Error: ${el.msg}`)});
            const {email, password} = req.body;
            const userColl = await client.db("jwtoken").collection("Users");
            const candidate = await userColl.findOne({email});
            if (candidate)
                return res.status(401).json({message: "A user with such email already exists"});
            const salt = bcrypt.genSaltSync(5);
            const hash = bcrypt.hashSync(password, salt);
            const user = {email, password: hash};
            await userColl.insertOne(user);
            const usersEmail = await userColl.findOne({email});
            const {accessToken, refreshToken} = tokenService.generateTokens(user);
            await tokenService.saveToken(usersEmail._id, refreshToken);
            // res.cookie('refreshToken', refreshToken, {maxAge: 15 * 24 * 60 * 60 * 1000, httpOnly: true});
            // probably I don't need this line either;
            return res.json({message: {accessToken, refreshToken}});
        } catch (e) {
            console.log(e);
            res.status(500).json({message: 'Sign up error'});
        }
    };

    async signIn(req, res) {
        try {
            const {email, password} = req.query;
            const userColl = await client.db("jwtoken").collection("Users");
            const user = await userColl.findOne({email});
            if (!user)
                return res.status(401).json({message: `There is no user with the email ${email}`});
            const validPassword = bcrypt.compareSync(password, user.password);
            if (!validPassword)
                return res.status(401).json({message: 'Wrong password!'});
            const {accessToken, refreshToken} = tokenService.generateTokens({email, password: user.password});
            const usersEmail = await userColl.findOne({email});
            await tokenService.saveToken(usersEmail._id, refreshToken);
            // mb I should delete the old refreshToken in the database
            // res.cookie('refreshToken', refreshToken, {maxAge: 15 * 24 * 60 * 60 * 1000, httpOnly: true});
            // probably I don't need this line either;
            return res.json({message: {accessToken, refreshToken}});
        } catch (e) {
            console.log(e);
            res.status(500).json({message: 'Sign in error'})
        }
    };

    async refreshToken(req, res) {
        try {
            const refreshToken = req.headers.authorization.split(' ')[1];
            if (!refreshToken)
                return res.status(401).json({message: 'Unauthorized'});
            const userDataRefresh = tokenService.validateRefreshToken(refreshToken);
            const tokenFromDb = await tokenService.findToken(refreshToken);
            if (!userDataRefresh || !tokenFromDb)   // !userDataAccess
                return res.status(401).json({message: 'Unauthorized'});
            const userColl = await client.db("jwtoken").collection("Users");
            const userRaw = await userColl.findOne({email: userDataRefresh.email});
            const tokens = tokenService.generateTokens({email: userRaw.email, password: userRaw.password});
            await tokenService.saveToken(userRaw._id, tokens.refreshToken);
            // res.cookie('refreshToken', tokens.refreshToken, {maxAge: 15 * 24 * 60 * 60 * 1000, httpOnly: true});
            // probably I don't need this line either;
            return res.status(200).json({message: {...tokens}});
        } catch (e) {
            console.log(e);
            res.status(400).json({message: 'Refresh error'})
        }
    };

    async getUser(req, res) {
        try {
            const request_num = req.params.request_number;
            const token = req.headers.authorization.split(' ')[1]
            if (!token)
                return res.status(401).json({message: "User is not authorized"})
            const decodedData = jwt.verify(token, secret_jwt_access);
            const {email, password} = decodedData;
            res.status(200).json({request_num, data: {username: `${email} ${password}`}});
        } catch (e) {
            console.log(e);
            return res.status(401).json({message: "User is not authorized"});
        }
    };
}

module.exports = new authController();