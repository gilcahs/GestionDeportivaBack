const { Pista, Deporte } = require('../models/pista');
const Role = require('../models/role');
const Usuario = require('../models/usuario')

const esRoleValido =  async (rol = '') => {
    const existeRol = await Role.findOne({ rol})
    if (!existeRol) {
      throw new Error(`El rol ${ rol } no está resgistrado en la bd`)
    }
  }

const emailExiste = async (correo = '') => {
    //Verificar si el correo existe
    const existeEmail = await Usuario.findOne({correo});

    if (existeEmail) {
        throw new Error(`Ese correo: ${correo}, ya esta resgistrado`);
    }
}
const existeUsuarioPorId = async ( id) => {
    //Verificar si el correo existe
    const existeUsuario = await Usuario.findById(id);

    if (!existeUsuario) {
        throw new Error(`El id no existe ${id}`);
    }
}

const existePistaPorId = async ( id) => {
    //Verificar si el correo existe
    const existePista = await Pista.findById(id);

    if (!existePista) {
        throw new Error(`El id no existe ${id}`);
    }
}

const existeDeportePorId = async ( deporte) => {
    //Verificar si el deporte existe
    const existeDeporte = await Deporte.findById(deporte);
    console.log(existeDeporte);

    if (!existeDeporte) {
        throw new Error(`El id no existe ${deporte}`);
    }
}



module.exports = {
    esRoleValido,
    emailExiste,
    existeUsuarioPorId,
    existePistaPorId,
    existeDeportePorId
}