/* Exportar modulos */
const jwt = require('jwt-simple');
const moment = require('moment');

/* Importar clave secreta */
const libjwt = require("../services/jwt");
const secret = libjwt.secret

/* MIDDLEWARE de autenticacion */
exports.auth = (req, res, next) => {
    /* Comprobar si me llega la cabecera de auth */
    if (!req.headers.authorization) {
        return res.status(403).send({
            status: "error",
            message: "La peticion no tiene la cabecera de autenticacion"
        });
    }
    /* Limpiear token */
    let token = req.headers.authorization.replace(/['"]+/g, '');

    /* Decodificar el token */
    try {
        let peyload = jwt.decode(token, secret);
        if (peyload.exp <= moment().unix()) {
            return res.status(401).send({
                status: "error",
                message: "Token expirado"
            });
        }
        /* Agregar datos de uusario a reques */
        req.user = peyload;
    } catch (error) {
        return res.status(404).send({
            status: "error",
            message: "Token invalido",
            error
        });
    }
    
    /* Pasar a ejecucion de accion */
    next();
}