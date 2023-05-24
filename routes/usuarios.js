const { Router } = require('express');

const { check } = require('express-validator');

const { usuariosGet, usuariosPost, usuariosPut, usuariosDelete, usuariosPatch } = require('../controllers/usuarios');

const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { esAdminRole, tieneRole } = require('../middlewares/validar-roles');

const { esRoleValido, emailExiste, existeUsuarioPorId } = require('../helpers/db-validators');

const router = Router();

router.get('/',  usuariosGet);
router.put('/:id', [
  check('id', 'No es un id valido').isMongoId(),
  check( 'id').custom( existeUsuarioPorId ),
  validarCampos
], usuariosPut);
router.post('/', [
  
  check('nombre', 'El nombre es obligatorio').not().isEmpty(),
  check('password', 'El password debe tener mas de 6 caracteres').isLength( { min: 6 }),
  check('correo', 'El correo no es valido').isEmail(),
  check('correo', 'El correo no es valido').custom( emailExiste),
  //check('rol', 'No es un rol valido').isIn([ 'ADMIN_ROLE', 'USER_ROLE']),
  check('rol').custom( esRoleValido),
  validarCampos
] ,usuariosPost);
router.patch('/', usuariosPatch)
router.delete('/:id', [
  
  validarJWT,
  //esAdminRole,
  tieneRole('ADMIN_ROLE', 'VENTAS_ROLE'),
  check('id', 'No es un ID valido').isMongoId(),
  check('id').custom(existeUsuarioPorId),
  validarCampos
], usuariosDelete);


module.exports = router;