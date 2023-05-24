const jwt = require('jsonwebtoken')

const generarJWT = ( uid = '', nombre = '', rol = '')  => {

    const payload = { uid, nombre, rol };

    return new Promise( (resolve, reject) => {

        

        jwt.sign( payload, process.env.SECRETORPRIVATEKEY, {
            expiresIn: '24h'
        }, (err, token) => {
            if (err) {
                console.log(err);
                reject( ' No se pudo generar el token')
            } else {
                resolve( token );
            }
        })

    })

}


module.exports= {
    generarJWT
}