const { response, request } = require('express');

const { Producto } = require('../models');

const existeNombreProducto = async (req = request, res = response, next) => {
    const { nombre } = req.body;
    const producto = await Producto.findOne({ nombre: nombre.toUpperCase() });
    if (producto) {
        return res.status(400).json({
            msg: `el producto ${nombre} ya existe`
        });
    }
    next();
};

module.exports = {
    existeNombreProducto
};
