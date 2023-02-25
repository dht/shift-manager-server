var jwt = require('jsonwebtoken');

const SECRET = 'c6b4b5d3-ebf6-4db7-967b-e96b8ee6bbfb';

const createJwt = (email) => {
    var token = jwt.sign({ email }, SECRET);
    return token;
};

const verifyJwt = (token) => {
    var decoded = jwt.verify(token, SECRET);
    return decoded;
};

module.exports = {
    createJwt,
    verifyJwt,
};
