const { response } = require("express");
const { Pista } = require("../models/pista");

const validarReserva = async(req, res, next) => {
    const { hora, fecha } = req.body;
    const pistaId = req.params.id;

     // Verificar que se hayan proporcionado todos los datos necesarios
  if (!hora || !fecha || !pistaId) {
    return res.status(400).json({ msg: 'Faltan datos necesarios para realizar la reserva' });
  }

//   const fechaISO8601 = new Date(`${fecha}T${hora}:00`).toISOString();
//   const fechaReserva = new Date(fechaISO8601);
  console.log(hora);
  const startTime = hora.split('-')[0];
  console.log(startTime);

  const fechaReserva = new Date(fecha + "T" + startTime + ':00');

  console.log(fechaReserva);

  // Verificar que la fecha y hora de la reserva no sean anteriores a la actual
  if (fechaReserva < new Date()) {
    return res.status(400).json({ msg: 'No puedes reservar una fecha y hora anteriores a la actual' });
  }

  
    // Buscar la pista por su ID
    const pista = await Pista.findById(pistaId)
      
  
      if (!pista) {
        return res.status(404).json({ msg: 'Pista no encontrada' });
      }

    const diasDisponibles = ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'];
    const diaReserva = diasDisponibles[new Date(fecha).getDay()];

    console.log(diaReserva);

      console.log(pista.horariosDisponibles);
      // Obtener los horarios disponibles de la pista para el día de la reserva
      const horariosDisponibles = pista.horariosDisponibles[diaReserva];

    
  
      // Verificar si la hora de la reserva está dentro del horario disponible
      if (!horariosDisponibles.includes(hora)) {
        return res.status(400).json({ msg: 'La pista no está disponible en este horario' });
      }
  
      // Verificar si la pista ya está reservada para la fecha y hora especificadas
      const reservaExistente = pista.reservas.find((reserva) => {
        return reserva.fecha.toDateString() === new Date(fecha).toDateString() && reserva.hora === hora;
      });
  
      if (reservaExistente) {
        return res.status(400).json({ msg: 'La pista ya está reservada para esta fecha y hora' });
      }
  
      // Si todo está bien, pasar al siguiente middleware
      next();
   
  };

  module.exports = {
    validarReserva
  }
  