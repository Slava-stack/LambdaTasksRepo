const jwt = require('jsonwebtoken');
const {MongoClient} = require('mongodb');
const {secret_jwt_refresh, secret_jwt_access} = require('./config');
const tokenValidationCollection = require('./models(Validations)/tokens');

const uri = "mongodb://127.0.0.1:27017";
const client = new MongoClient(uri);

class TokenService {
    generateTokens(payload) {
        const random30or60sec = Math.floor(Math.random() * (60 - 30 + 1)) + 30;
        const accessToken = jwt.sign(payload, secret_jwt_access, {expiresIn: random30or60sec});
        const refreshToken = jwt.sign(payload, secret_jwt_refresh); // {expiresIn: '15 days'}
        return {accessToken, refreshToken};
    }

    generateAccessToken(payload){
        const random30or60sec = Math.floor(Math.random() * (60 - 30 + 1)) + 30;
        const accessToken = jwt.sign(payload, secret_jwt_access, {expiresIn: random30or60sec});
        return {accessToken};
    }

    async saveToken(userId, refreshToken) {
        try {
            await client.connect();
            await tokenValidationCollection.runJWTValidation();
            const refreshColl = await client.db("jwtoken").collection("refresh");
            const tokenData = refreshColl.findOne({userId});
            if (!tokenData)
                return await refreshColl.findOneAndUpdate({userId}, {$set: {refreshToken}});
            return await refreshColl.insertOne({userId, refreshToken});
        } catch (e) {
            console.log(e)
        } finally {
            await client.close();
        }
    }

    validateRefreshToken(token) {
        try {
            return jwt.verify(token, secret_jwt_refresh);
        } catch (e) {
            console.log(e);
            return null;
        }
    }

    async findToken(refreshToken) {
        try {
            await client.connect();
            const refreshColl = await client.db("jwtoken").collection("refresh");
            return await refreshColl.findOne({refreshToken});
        } catch (e) {
            console.log(e);
        } finally {
            await client.close();
        }
    }
}

module.exports = new TokenService();