const { response } = require("express");
const { Pista, Reserva } = require("../models/pista");


const nodemailer = require('nodemailer');

// Configurar el transporte de correo
let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'tucorreo@gmail.com', // reemplaza esto con tu correo
    pass: 'tucontraseña', // reemplaza esto con tu contraseña
  },
});

// Configurar las opciones del correo
let mailOptions = {
  from: 'tucorreo@gmail.com', // dirección de correo del remitente
  to: 'usuario@example.com', // dirección de correo del destinatario, en tu caso sería el correo del usuario
  subject: 'Confirmación de reserva', // Línea de asunto
  text: 'Detalles de la reserva', // cuerpo del correo en texto plano
  html: '<h1>Detalles de la reserva</h1>', // cuerpo del correo en formato HTML
};

// Enviar el correo
transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    console.log(error);
  } else {
    console.log('Email enviado: ' + info.response);
  }
});




const getAllPistas = async (req, res) => {

  try {
    const pistas = await Pista.find()

    return res.status(200).json(pistas);
    
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: error });
  }

}

const getPistaById = async (req, res) => {
  const { id } = req.params;

  try {
    const pista = await Pista.findById(id);

    if (!pista) {
      return res.status(404).json({ msg: 'Pista no encontrada' });
    }

    return res.status(200).json(pista);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: 'Error al buscar la pista' });
  }
};

const  pistaPost = async (req, res = response) => {

    

    const { nombre, horariosDisponibles, deporte} = req.body;
    const pista = new Pista( {nombre, horariosDisponibles, deporte} );

    
    //Guardar en bd
    await pista.save();


    res.json(
  
        pista
    );
}

const hacerReserva = async(req, res = response) => {
    const { id } = req.params;
    const { fecha, hora, usuario } = req.body;
    const diasDisponibles = ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'];
    const diaReserva = diasDisponibles[new Date(fecha).getDay()];

  
    try {
      const pista = await Pista.findById(id);
      if (!pista) {
        return res.status(404).json({ error: 'No se encontró la pista' });
      }
      
      const reserva = new Reserva({ fecha, hora, usuario, pista: pista._id });
      pista.reservas.push(reserva);
      await reserva.save();
      await pista.save();


       // Configurar las opciones del correo
    let mailOptions = {
      from: 'tucorreo@gmail.com', // dirección de correo del remitente
      to: usuario, // dirección de correo del destinatario
      subject: 'Confirmación de reserva', // Línea de asunto
      text: `Detalles de la reserva: Fecha - ${fecha}, Hora - ${hora}, Pista - ${pista.nombre}`, // cuerpo del correo en texto plano
      html: `<h1>Detalles de la reserva</h1><p>Fecha: ${fecha}</p><p>Hora: ${hora}</p><p>Pista: ${pista.nombre}</p>`, // cuerpo del correo en formato HTML
    };

    // Enviar el correo
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
      } else {
        console.log('Email enviado: ' + info.response);
      }
    });

    
      return res.send(reserva);
    } catch (error) {
      console.error(error);
      return res.status(500).send({ error: 'Error al realizar la reserva' });
    }
  };

  const horariosPut = async (req, res) => {
    try {
      const { id } = req.params;
      const { horarios } = req.body;

    
  
      const pista = await Pista.findByIdAndUpdate(
        id,
        { $set: { horariosDisponibles: horarios } },
        { new: true }
      );
  
      if (!pista) {
        return res.status(404).json({ error: "Pista no encontrada" });
      }
  
      res.json(pista);
    } catch (error) {
      return res.status(500).json({ msg: 'Error al actualizar la pista' });
    }
  };

  const getPistasByDeporte = async (req, res) =>{
    const { idDeporte } = req.params;

    const pistas = await Pista.find({deporte: idDeporte})
    if (!pistas) {
      return res.status(404).json({ error: "No hay pistas asignadas para ese deporte" });
    }

    res.json({
      pistas
    });
}




const getPistasDisponibles = async (req, res, next) => {
  try {
    const { deporte, fecha } = req.params;

    const pistas = await Pista.find({ deporte: deporte })
      .populate('reservas', 'fecha hora')
      .exec();

    const pistasDisponibles = pistas.filter((pista) => {
      const fechaReserva = new Date(fecha);
      const reservasEnFecha = pista.reservas.filter((reserva) => {
        const fechaReservaPista = new Date(reserva.fecha);
        return fechaReserva.toDateString() === fechaReservaPista.toDateString();
      });

      return reservasEnFecha.length === 0;
    });

    res.json(pistasDisponibles);
  } catch (error) {
    next(error);
  }
};




  


  module.exports = {
    pistaPost,
    hacerReserva,
    getPistaById,
    horariosPut,
    getPistasByDeporte,
    getPistasDisponibles,
    getAllPistas
  }
  