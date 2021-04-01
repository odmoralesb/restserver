const { Router } = require('express');

const { check } = require('express-validator');
const {
    validarJWT,
    validarCampos,
    existeNombreProducto,
    esAdminRole
} = require('../middlewares');

const {
    existeCategoriaID,
    existeProductoID
} = require('../helpers/db-validators');

const {
    crearProducto,
    obtenerProductos,
    obtenerProducto,
    actualizarProducto,
    borrarProducto
} = require('../controllers/productos');

const router = Router();

// Obtener todos los productos
// router.get('/', (req, res) => {
//     return res.json({ msg: 'Todo Ok' });
// });

router.get('/', obtenerProductos);

// Obtener un producto por id
router.get(
    '/:id',
    [
        check('id', 'No es un ID válido').isMongoId(),
        check('id').custom(existeProductoID),
        validarCampos
    ],
    obtenerProducto
);

// Crear categoria - privado - cualquier persona con token valido
router.post(
    '/',
    [
        validarJWT,
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('categoria', 'Categoria no es un ID válido').isMongoId(),
        // validarCampos,
        // existeNombreProducto,
        check('categoria').custom(existeCategoriaID),
        validarCampos
    ],
    crearProducto
);

// Actualizar - privado - cualquiera con token valido
router.put(
    '/:id',
    [
        validarJWT,
        check('id', 'No es un ID válido').isMongoId(),
        check('categoria', 'Categoria no es un ID válido')
            .isMongoId()
            .optional(),
        check('categoria').custom(existeCategoriaID).optional(),
        check('precio', `El precio debe ser un número mayor de 0`)
            .isNumeric({
                min: 0
            })
            .optional(),
        check('disponible', 'Disponible debe ser verdadero o falso')
            .isBoolean()
            .optional(),
        validarCampos
    ],
    actualizarProducto
);

// Borrar categoria - solo por Admin
router.delete(
    '/:id',
    [
        validarJWT,
        esAdminRole,
        check('id', 'No es un ID válido').isMongoId(),
        check('id').custom(existeProductoID),
        validarCampos
    ],
    borrarProducto
);

module.exports = router;
