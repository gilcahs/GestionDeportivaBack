const { Router } = require('express');

const { check } = require('express-validator');
const { pistaPost, hacerReserva, getPistaById, horariosPut, getPistasByDeporte, getPistasDisponibles, getAllPistas } = require('../controllers/pistas');
const { validarReserva } = require('../middlewares/validar-reserva');
const { validarCampos } = require('../middlewares/validar-campos');
const { validateHorario, checkPistaName, overlappingHorarios, validarFecha } = require('../middlewares/validar-pistas');
const { existePistaPorId, existeDeportePorId } = require('../helpers/db-validators');

const router = Router();


router.get('/', getAllPistas)

router.get('/:id', [
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom(existePistaPorId),
    validarCampos
], getPistaById);

router.post('/', [
    validateHorario,
    check('nombre', 'El nombre no puede estar vacio').not().isEmpty(),
    check('nombre', 'El nombre debe tener minimo 4 caracteres').isLength( { min: 4 }),
    check('deporte').custom(existeDeportePorId),
    checkPistaName,
    validarCampos
], pistaPost)

router.post('/:id/reserva', [
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom(existePistaPorId),
    check('fecha', 'La reserva debe introducir la fecha').not().isEmpty(),
    check('fecha', 'No se reconoce la fecha').isDate(),
    check('hora', 'La reserva debe introducir la hora').not().isEmpty(),
    check('hora', 'El formato de la hora no es correcto').isLength({min: 11}),
    check('usuario', 'Se debe introducir el usuario').not().isEmpty(),
    validarReserva,
    validarCampos
], hacerReserva)

router.put('/:id/horarios',[
    check('horarios').not().isEmpty(),
    //overlappingHorarios,
    validarCampos
], horariosPut)


router.get('/:deporte/:fecha', [
    check('deporte', 'No es un ID valido').isMongoId(),
    check('deporte').custom(existeDeportePorId),
    validarFecha,
    validarCampos,

    
],
getPistasDisponibles)

router.get('/deportes/reservas/:idDeporte',
    [
        check('deporteId', 'El id del deporte es obligatorio').not().isEmpty(),
        check('deporteId', 'El id del deporte no es válido').isMongoId()
    ],
    getPistasByDeporte
);


module.exports = router;