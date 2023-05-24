const {Pista} = require('../models/pista');



const validateHorario = (req, res, next) => {
    const dias = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado', 'Domingo'];
    const { horariosDisponibles } = req.body;
  
    for (let i = 0; i < dias.length; i++) {
      const dia = dias[i];
      const horario = horariosDisponibles[dia];

      if (horario) {
        console.log(horario);
        if (!Array.isArray(horario)) {
            return res.status(400).json({ message: `El horario de ${dia} debe ser un arreglo` });
          }
      
          for (let j = 0; j < horario.length; j++) {
            const hora = horario[j];
      
            if (typeof hora !== 'string') {
              return res.status(400).json({ message: `El horario de ${dia} debe contener solo cadenas de caracteres` });
            }
      
            if (!hora.match(/^\d{2}:\d{2}-\d{2}:\d{2}$/)) {
              return res.status(400).json({ message: `El horario de ${dia} debe tener el formato hh:mm-hh:mm` });
            }
          }
      }
  
      
    }
  
    next();
  };



const checkPistaName = async (req, res, next) => {
  const { nombre } = req.body;

    const pista = await Pista.findOne({ nombre: nombre });

    if (pista) {
      return res.status(400).json({ msg: 'El nombre de la pista ya existe' });
    }

    next();
 
};





const overlappingHorarios = async(req, res, next) => {
    const { horarios } = req.body;
    //const { horariosDisponibles } = req.pista;
    const pistaId = req.params.id;
    // Buscar la pista por su ID
    const pista = await Pista.findById(pistaId)
    const {horariosDisponibles} = pista

    if (!horarios || !pistaId ) {
      return res.status(400).json({ msg: 'Faltan datos necesarios para realizar la reserva' });
    }

    console.log(horariosDisponibles);
  
    // Función para comprobar si un horario ya existe en la pista
    const horarioExists = (day, start, end) => {
      const horarioDay = horariosDisponibles[day];
      return horarioDay.some((horario) => {
        const [existingStart, existingEnd] = horario.split("-");
        return (
          (start >= existingStart && start < existingEnd) ||
          (end > existingStart && end <= existingEnd) ||
          (start <= existingStart && end >= existingEnd)
        );
      });
    };
  
    // Comprobar que los horarios nuevos no interfieren con los horarios existentes
    const overlapping = Object.entries(horarios).some(([day, newHorarios]) => {
      if (!newHorarios || newHorarios.length === 0) return false;
      return newHorarios.some((newHorario) => {
        const [newStart, newEnd] = newHorario.split("-");
        return horarioExists(day, newStart, newEnd);
      });
    });
  
    if (overlapping) {
      return res
        .status(400)
        .json({ error: "Los horarios especificados se solapan con los horarios ya existentes" });
    }
  
    next();
  };

  const validarDeporte = (req, res, next) => {
    const { deporte } = req.body;
    if (!deporte) {
      return res.status(400).json({ error: 'Falta el deporte' });
    }
    if (!deporte.nombre) {
      return res.status(400).json({ error: 'Falta el nombre del deporte' });
    }
    
    // Aquí puedes hacer una validación adicional, como verificar que el deporte exista en una lista predefinida de deportes
  
    next();
  };

  const validarFecha = (req, res, next) => {
    const fecha = req.params.fecha;
    console.log(req.params.fecha);
  
    if (!fecha) {
      return res.status(400).json({ message: 'La fecha es requerida' });
    }
  
    const fechaActual = new Date();
    console.log(fechaActual);
    const fechaParametro = new Date(fecha);
  
    if (fechaParametro < fechaActual) {
      return res.status(400).json({ message: 'La fecha debe ser posterior a la actual' });
    }
  
    req.fecha = fechaParametro;
    next();
  };
  
  
  






module.exports = {
    validateHorario,
    checkPistaName,
    overlappingHorarios,
    validarDeporte,
    validarFecha
}
  