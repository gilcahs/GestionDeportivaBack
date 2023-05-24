const {Schema, model} = require('mongoose');

const reservaSchema = Schema({
    fecha: { type: Date, required: true },
    hora: { type: String, required: true },
  usuario: {
    type: String,
    required: true
  },
  pista: {
    type: Schema.Types.ObjectId,
    ref: 'Pista',
    required: true
  }
});

const deporteSchema = Schema({
  nombre: {
    type: String,
    required: true
  },
  icono: {
    type: String
  }
})

const horarioSchema = new Schema({
    Lunes: [{ type: String }],
    Martes: [{ type: String }],
    Miercoles: [{ type: String }],
    Jueves: [{ type: String }],
    Viernes: [{ type: String }],
    Sabado: [{ type: String }],
    Domingo: [{ type: String }]
  }, { minimize: false });

const pistaSchema = Schema({
  nombre: {
    type: String,
    required: true
  },
  horariosDisponibles: { type: horarioSchema },
//   horariosDisponibles: {
//     type: [String],

//     required: true
//   },
  reservas: [reservaSchema],
  deporte: {
    type: Schema.Types.ObjectId,
    ref: 'Deporte',
    required: true
  }
});

pistaSchema.methods.toJSON = function(){
    const { __v,  _id, ...pista } = this.toObject();
    pista.uid = _id;
    return pista;
}

// pistaSchema.methods.horarioDisponible = function(horario) {
//   const index = this.horariosDisponibles.indexOf(horario);
//   if (index === -1) {
//     return false;
//   }
//   const reserva = this.reservas.find((reserva) => reserva.horario === horario);
//   return reserva ? false : true;
// };




const Pista = model('Pista', pistaSchema);
const Reserva = model('Reserva', reservaSchema);
const Deporte = model('Deporte', deporteSchema)

module.exports = { Pista, Reserva, Deporte };

