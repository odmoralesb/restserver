const { response, request } = require('express');

const { Categoria } = require('../models');

const existeNombreCategoria = async (req = request, res = response, next) => {
    const { nombre } = req.body;
    const categoria = await Categoria.findOne({ nombre: nombre.toUpperCase() });
    if (categoria) {
        return res.status(400).json({
            msg: `La categoria ${nombre} ya existe`
        });
    }
    next();
};

module.exports = {
    existeNombreCategoria
};
