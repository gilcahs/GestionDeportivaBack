const { Router } = require('express');

const { check } = require('express-validator');
const { deportePost, deportesGet, eliminarDeporte, actualizarDeporte } = require('../controllers/deportes');
const { validarCampos } = require('../middlewares/validar-campos');
const { checkDeporteName } = require('../middlewares/validar-deportes');
const { validateHorario } = require('../middlewares/validar-pistas');
const router = Router();

router.get('/', deportesGet)

router.post('/', [
    check('nombre', 'El nombre no puede estar vacio').not().isEmpty(),
    check('nombre', 'El nombre debe tener minimo 4 caracteres').isLength( { min: 3 }),
    checkDeporteName,
    validarCampos
], deportePost)
router.delete('/:id', [
    check('deporteId', 'El id del deporte es obligatorio').not().isEmpty(),
    check('deporteId', 'El id del deporte no es válido').isMongoId()
], eliminarDeporte);
router.patch('/:id', [
    check('deporteId', 'El id del deporte es obligatorio').not().isEmpty(),
    check('deporteId', 'El id del deporte no es válido').isMongoId()
], actualizarDeporte);



module.exports = router;