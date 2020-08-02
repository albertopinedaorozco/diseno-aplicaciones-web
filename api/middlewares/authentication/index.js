const jwt = require('jsonwebtoken');
const config = require('./../../../config');

const authentication = (req, res, next) => {
    const token = req.headers["x-access-token"];
    console.log('En el middleware, el valor de token es: ' + token)
    jwt.verify(token, config.tokenKey, (err, decoded) =>{
        if(err){
            res.sendStatus(401);
            console.log('Se verifico autenticación en middleware y no esta autenticado')
        }else{
            req.userId = decoded.id;
            next();
        }
    });
};

module.exports = authentication;