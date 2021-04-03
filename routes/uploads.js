const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos, validarArchivoSubir } = require('../middlewares');

const {
    cargarArchivo,
    actualizarImagen,
    actualizarImagenCloudinary,
    mostrarImagen
} = require('../controllers/uploads');

const { coleccionesPermitidas } = require('../helpers');

const router = Router();

router.post('/', validarArchivoSubir, cargarArchivo);

router.put(
    '/:coleccion/:id',
    [
        validarArchivoSubir,
        check('id', 'El id debe ser un MongoId Valido').isMongoId(),
        check('coleccion').custom((c) =>
            coleccionesPermitidas(c, ['usuarios', 'productos'])
        ),
        validarCampos
    ],
    actualizarImagenCloudinary
    //actualizarImagen
);

router.get(
    '/:coleccion/:id',
    [
        check('id', 'El id debe ser un MongoId Valido').isMongoId(),
        check('coleccion').custom((c) =>
            coleccionesPermitidas(c, ['usuarios', 'productos'])
        ),
        validarCampos
    ],
    mostrarImagen
);

module.exports = router;
