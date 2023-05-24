const { response } = require("express");
const Usuario = require('../models/usuario')
const bcryptjs = require('bcryptjs');
const { generarJWT } = require("../helpers/generar-jwt");


const login = async(req, res = response) => {

    const {correo, password} = req.body;  
    try {

        // Verificar si el email existe
        const usuario = await Usuario.findOne({correo});
        if (!usuario) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - correo'
            })
        }

        //Si el usuario esta activo
        if (!usuario.estado) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - estado: false'
            })
        }
        //Verificar la contraseña

        const validPassword = bcryptjs.compareSync(password, usuario.password);

        if (!validPassword) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - password'
            })
        }

        const token = await generarJWT( usuario.id, usuario.nombre, usuario.rol )


        res.json({
            usuario,
            token
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Hable con el administrador'
        })
    }  
    
}

const revalidarToken = async(req, res = response ) => {

    const { uid, name, rol, usuario } = req;

    // Generar el JWT
    const token = await generarJWT( uid, name, rol );

    return res.json({
        usuario,
        token
    });

}

module.exports = {
    login,
    revalidarToken
}