const {Deporte} = require('../models/pista');
const checkDeporteName = async (req, res, next) => {
  const { nombre } = req.body;

    const deporte = await Deporte.findOne({ nombre: nombre.toLowerCase() });

    if (deporte) {
      return res.status(400).json({ msg: 'El nombre del deporte ya existe' });
    }

    next();
 
};
module.exports = {
    checkDeporteName

}