const { Router } = require('express');

const { check } = require('express-validator');
const {
    validarJWT,
    validarCampos,
    existeNombreCategoria,
    esAdminRole
} = require('../middlewares');

const { existeCategoriaID } = require('../helpers/db-validators');

const {
    crearCategoria,
    obtenerCategorias,
    obtenerCategoria,
    actualizarCategoria,
    borrarCategoria
} = require('../controllers/categorias');

const router = Router();

// Obtener todas las categorias
router.get('/', obtenerCategorias);

// Obtener una categoria por id - publico
router.get(
    '/:id',
    [
        check('id', 'No es un ID válido').isMongoId(),
        check('id').custom(existeCategoriaID),
        validarCampos
    ],
    obtenerCategoria
);

// Crear categoria - privado - cualquier persona con token valido
router.post(
    '/',
    [
        validarJWT,
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        existeNombreCategoria,
        validarCampos
    ],
    crearCategoria
);

// Actualizar - privado - cualquiera con token valido
router.put(
    '/:id',
    [
        validarJWT,
        check('id', 'No es un ID válido').isMongoId(),
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('id').custom(existeCategoriaID),
        existeNombreCategoria,
        validarCampos
    ],
    actualizarCategoria
);

// Borrar categoria - solo por Admin
router.delete(
    '/:id',
    [
        validarJWT,
        esAdminRole,
        check('id', 'No es un ID válido').isMongoId(),
        check('id').custom(existeCategoriaID),
        validarCampos
    ],
    borrarCategoria
);

module.exports = router;
