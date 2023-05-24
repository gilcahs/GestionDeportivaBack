const { response } = require("express");
const { Deporte } = require("../models/pista");

const  deportePost = async (req, res = response) => {

    

    let { nombre, icono} = req.body;

    if(!icono || icono == ""){
        icono = "https://cdn-icons-png.flaticon.com/512/103/103956.png"
    }
    nombre = nombre.toLowerCase()

    const deporte = new Deporte( {nombre, icono} );

    
    //Guardar en bd
    await deporte.save();


    res.json(
        
        deporte
    );
}

const  deportesGet = async (req, res = response) => {
    
  
        const deportes = await Deporte.find()
    res.json({
        deportes
       
    });
}

module.exports = {
    deportePost,
    deportesGet
}
