const { response } = require('express');
const { ObjectId } = require('mongoose').Types;

const { Usuario, Categoria, Producto } = require('../models');

const coleccionesPermitidas = ['usuarios', 'categorias', 'productos', 'roles'];

const buscarUsuarios = async (termino = '', res = response) => {
    const esMongoID = ObjectId.isValid(termino);

    if (esMongoID) {
        const usuario = await Usuario.findById(termino);
        return res.json({ results: [usuario ? usuario : []] });
    }

    const regex = new RegExp(termino, 'i');

    const usuarios = await Usuario.find({
        $or: [{ nombre: regex }, { correo: regex }],
        $and: [{ estado: true }]
    });

    const total = await Usuario.count({
        $or: [{ nombre: regex }, { correo: regex }],
        $and: [{ estado: true }]
    });

    return res.json({
        total,
        results: usuarios
    });
};

const buscaCategorias = async (termino = '', res = response) => {
    const esMongoID = ObjectId.isValid(termino);

    if (esMongoID) {
        const categoria = await Categoria.findById(termino);
        return res
            .json({ results: [categoria ? categoria : []] })
            .populate('categoria', 'nombre');
    }

    const regex = new RegExp(termino, 'i');

    const categoria = await Categoria.find({
        nombre: regex,
        estado: true
    }).populate('usuario', 'nombre');

    const total = await Categoria.countDocuments({
        nombre: regex,
        estado: true
    });

    return res.json({
        total,
        results: categoria
    });
};

const buscaProductos = async (termino = '', res = response) => {
    const esMongoID = ObjectId.isValid(termino);

    if (esMongoID) {
        const producto = await Producto.findById(termino)
            .populate('categoria', 'nombre')
            .populate('usuario', 'nombre');
        return res.json({ results: [producto ? producto : []] });
    }

    const regex = new RegExp(termino, 'i');

    const producto = await Producto.find({
        $or: [{ nombre: regex }, { descripcion: regex }],
        $and: [{ estado: true }]
    })
        .populate('categoria', 'nombre')
        .populate('usuario', 'nombre');

    const total = await Producto.countDocuments({
        nombre: regex,
        estado: true
    });

    return res.json({
        total,
        results: producto
    });
};

const buscar = (req, res = response) => {
    const { coleccion, termino } = req.params;

    if (!coleccionesPermitidas.includes(coleccion)) {
        return res.status(400).json({
            msg: `Las colecciones permitidas son ${coleccionesPermitidas}`
        });
    }

    switch (coleccion) {
        //
        case 'usuarios':
            buscarUsuarios(termino, res);
            break;

        case 'categorias':
            buscaCategorias(termino, res);
            break;

        case 'productos':
            buscaProductos(termino, res);
            break;

        default:
            return res.status(500).json({
                msg: 'Falto incluir esta busqueda'
            });
    }
};

module.exports = {
    buscar
};
