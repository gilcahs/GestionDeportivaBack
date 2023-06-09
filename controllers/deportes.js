const { response } = require("express");
const { Deporte, Pista } = require("../models/pista");

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

const eliminarDeporte = async (req, res) => {
    const { id } = req.params;
  
    if (!id) {
      return res.status(400).send({ error: 'ID de deporte inválido' });
    }
  
    try {
      // Primero eliminamos las pistas asociadas al deporte
      await Pista.deleteMany({ deporte: id });
  
      const deporte = await Deporte.findByIdAndRemove(id);
  
      if (!deporte) {
        return res.status(404).send({ error: 'Deporte no encontrado' });
      }
  
      res.send({ message: 'Deporte y pistas asociadas eliminados con éxito', deporte });
    } catch (err) {
      res.status(500).send({ error: 'Error del servidor al eliminar el deporte y las pistas asociadas' });
    }
  };
  

  const actualizarDeporte = async (req, res) => {
    const { id } = req.params;
    const { nombre, icono } = req.body;
  
    if (!id) {
        return res.status(400).send({ error: 'ID de deporte inválido' });
      }
  
    if (!nombre && !icono) {
      return res.status(400).send({ error: 'Debe proporcionar al menos un campo para actualizar' });
    }
  
    try {
      const deporte = await Deporte.findByIdAndUpdate(id, { nombre, icono }, { new: true });
  
      if (!deporte) {
        return res.status(404).send({ error: 'Deporte no encontrado' });
      }
  
      res.send({ message: 'Deporte actualizado con éxito', deporte });
    } catch (err) {
      res.status(500).send({ error: 'Error del servidor al actualizar el deporte' });
    }
  };

module.exports = {
    deportePost,
    deportesGet,
    eliminarDeporte,
    actualizarDeporte
}
