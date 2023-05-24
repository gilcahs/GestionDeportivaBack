 
 const { response, request } = require('express');

const jwt = require('jsonwebtoken');

const Usuario = require('../models/usuario')


 const validarJWT = async( req = request, res = response, next) => {

    const token = req.header('x-token');

    if (!token) {
        return res.status(401).json({
            msg: ' No hay token en la peticion'
        })
    }

    try {

        const { uid, nombre, rol } = jwt.verify( token, process.env.SECRETORPRIVATEKEY );
        req.uid  = uid;
        req.name = nombre;
        req.rol = rol

        //leer el usuario que corresponde al uid
        const usuario = await Usuario.findById(uid);

        if ( !usuario ) {
            return res.status(401).json({
                msg: 'Token no valido - Usuario no existe ne bd'
            })
        }

        // Verificar si el uid tiene estado true
        if ( !usuario.estado) {
            return res.status(401).json({
                msg: 'Token no valido - Usuario con estado en false'
            })
        }

        req.usuario = usuario;
     

        next();
    } catch (error) {
        console.log(error);
        res.status(401).json({
            msg: 'Token no valido'
        })
    }

    

    

 }

 module.exports = {
    validarJWT
 }