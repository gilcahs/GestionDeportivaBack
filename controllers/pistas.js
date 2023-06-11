const { response } = require("express");
const { Pista, Reserva } = require("../models/pista");


const nodemailer = require('nodemailer');

// Configurar el transporte de correo
let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL, // reemplaza esto con tu correo
    pass: process.env.PASSEMAIL, // reemplaza esto con tu contraseña
  },
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


       //Configurar las opciones del correo
    let mailOptions = {
      from: process.env.EMAIL, // dirección de correo del remitente
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



const deleteReservas = async (req, res) => {
  const { reservas } = req.body;

  try {
    for (const reservaObj of reservas) {
      // Find the reservation in the database
      const reserva = await Reserva.findById(reservaObj._id);
      if (!reserva) {
        continue;  // Skip if the reservation doesn't exist
      }

      // Mark the reservation as cancelled
      reserva.cancelada = true;
      await reserva.save();

      const pista = await Pista.findById(reserva.pista);
      if (!pista) {
        continue;  // Skip if the pista doesn't exist
      }

      // Remove the reservation from the pista's reservas array
      pista.reservas = pista.reservas.filter(r => r._id.toString() !== reserva._id.toString());
      await pista.save();

      // Send an email to the user
      let mailOptions = {
        from: process.env.EMAIL,
        to: reserva.usuario,
        subject: 'Tu reserva ha sido cancelada',
        text: `Estimado usuario,

Lamentamos informarle que su reserva para el día ${reserva.fecha.toLocaleDateString('es-ES', {day: '2-digit', month: '2-digit', year: 'numeric'})} a las ${reserva.hora} en la pista ${pista.nombre} ha sido cancelada. 

Si tienes alguna duda o pregunta, no dudes en contactarnos.

Atentamente,
El equipo de [Nombre de tu empresa/servicio]`
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
    }

    res.status(200).json({ message: 'Reservas canceladas, eliminadas de las pistas y correo enviado exitosamente' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error al cancelar las reservas, eliminarlas de las pistas y enviar el correo' });
  }
};


const deletePista = async (req, res) => {
  try {
    const { id } = req.params;

    const pista = await Pista.findById(id);
    if (!pista) {
      return res.status(404).json({ error: 'No se encontró la pista' });
    }
    console.log(pista);

    // Actualizar la propiedad 'cancelada' de todas las reservas asociadas a la pista
    const reservas = pista.reservas;
    
    for (let i = 0; i < reservas.length; i++) {
      try {
        console.log(reservas[i]._id.toString());
        let reserva = await Reserva.findById(reservas[i]._id.toString());
        if (reserva != null ){
          console.log(reserva);
    
          reserva.cancelada = true;
          await reserva.save();

        }
        
        
      } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Error al eliminar la reserva' });
      }
    }
    

    // Eliminar la pista
    await Pista.findByIdAndDelete(id);

    return res.status(200).json({ message: 'Pista eliminada correctamente' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error al eliminar la pista' });
  }
};

const obtenerReservas = async (req, res) => {
  try {
    const reservas = await Reserva.find({});  
    res.status(200).json(reservas);
  } catch (error) {
    res.status(500).json({ error: 'Error del servidor al obtener las reservas' });
  }
};

const eliminarReserva = async (req, res) => {
  try {
    const reserva = await Reserva.findById(req.params.id);
  
    if (!reserva) {
      return res.status(404).json({ message: 'Reserva no encontrada' });
    }
  
    if (!reserva.cancelada && new Date(reserva.fecha) > new Date()) {
      const pista = await Pista.findById(reserva.pista);
      if (!pista) {
        return res.status(404).json({ message: 'Pista no encontrada' });
      }

      let mailOptions = {
          from: process.env.EMAIL,
          to: reserva.usuario,
          subject: 'Tu reserva ha sido cancelada',
          text: `Estimado usuario,

  Lamentamos informarle que su reserva para el día ${reserva.fecha.toLocaleDateString('es-ES', {day: '2-digit', month: '2-digit', year: 'numeric'})} a las ${reserva.hora} en la pista ${pista.nombre} ha sido cancelada. 

  Si tienes alguna duda o pregunta, no dudes en contactarnos.

  Atentamente,
  El equipo de [Nombre de tu empresa/servicio]`
        };

      try {
        await transporter.sendMail(mailOptions);
        console.log('Correo enviado ');
      } catch (error) {
        console.error('Error enviando correo: ', error);
        return res.status(500).json({ message: 'Error enviando correo' });
      }
  
      const updatedPista = await Pista.updateOne(
        { _id: reserva.pista }, 
        { $pull: { reservas: reserva._id } }
      );

      if (!updatedPista) {
        return res.status(500).json({ message: 'Error eliminando reserva de la pista' });
      }
    }
  
    const deletedReserva = await Reserva.deleteOne({ _id: req.params.id });

    if (!deletedReserva) {
      return res.status(500).json({ message: 'Error eliminando reserva' });
    }
  
    return res.status(200).json({ message: 'Reserva eliminada' });
  } catch (error) {
    console.error('Error eliminando reserva: ', error);
    return res.status(500).json({ message: 'Error eliminando reserva' });
  }
}









  


  module.exports = {
    pistaPost,
    hacerReserva,
    getPistaById,
    horariosPut,
    getPistasByDeporte,
    getPistasDisponibles,
    getAllPistas,
    deleteReservas,
    deletePista,
    obtenerReservas,
    eliminarReserva
  }
  