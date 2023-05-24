const { Router } = require('express');

const { check } = require('express-validator');
const { deportePost, deportesGet } = require('../controllers/deportes');
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


module.exports = router;