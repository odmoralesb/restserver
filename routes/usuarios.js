const { Router } = require('express');
const { check } = require('express-validator');

const {
    validarCampos,
    validarJWT,
    esAdminRole,
    tieneRole
} = require('../middlewares');

const {
    esRoleValido,
    emailExiste,
    existeUsuarioPorID
} = require('../helpers/db-validators');

const {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosPatch,
    usuariosDelete
} = require('../controllers/usuarios');

const router = Router();

router.get('/', usuariosGet);

router.post(
    '/',
    [
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check(
            'password',
            'El password debe ser  igual o mayor a 6 letras'
        ).isLength({ min: 6 }),
        check('correo', 'El correo no es válido').isEmail().not().isEmpty(),
        check('correo').custom(emailExiste),
        // check('rol', 'No es un rol válido').isIn(['ADMIN_ROLE', 'USER_ROLE']),
        // check('rol').custom((rol) => esRoleValido(rol)),  //esto es lo mismo de abajo en forma resumida
        check('rol').custom(esRoleValido),
        validarCampos
    ],
    usuariosPost
);

router.put(
    '/:id',
    [
        check('id', 'No es un ID válido').isMongoId(),
        check('id').custom(existeUsuarioPorID),
        check('rol').custom(esRoleValido),
        validarCampos
    ],
    usuariosPut
);

router.patch('/', usuariosPatch);

router.delete(
    '/:id',
    [
        validarJWT,
        // esAdminRole,
        tieneRole('ADMIN_ROLE', 'VENTAS_ROLE'),
        check('id', 'No es un ID válido').isMongoId(),
        check('id').custom(existeUsuarioPorID),
        validarCampos
    ],
    usuariosDelete
);

module.exports = router;
