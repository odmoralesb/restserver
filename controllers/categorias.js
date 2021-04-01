const { response } = require('express');
const { Categoria } = require('../models');

// obtenerCategorias - paginado - total - populate
const obtenerCategorias = async (req = request, res = response) => {
    //
    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true };

    const [total, categorias] = await Promise.all([
        Categoria.countDocuments(query),
        Categoria.find(query)
            .populate('usuario', 'nombre')
            .skip(Number(desde))
            .limit(Number(limite))
    ]);

    res.json({
        total,
        categorias
    });
};

// obtenerCategoria - populate
const obtenerCategoria = async (req = request, res = response) => {
    //
    const { id } = req.params;
    const categoria = await Categoria.findById(id).populate(
        'usuario',
        'nombre'
    );
    res.status(200).json(categoria);
    //
};

const crearCategoria = async (req, res = response) => {
    const nombre = req.body.nombre.toUpperCase();

    // Generar la data a guardar
    const data = {
        nombre,
        usuario: req.usuario._id
    };

    const categoria = await new Categoria(data);

    // Guardar DB
    await categoria.save();

    res.status(201).json(categoria);
};

// actualizarCategoria

const actualizarCategoria = async (req = request, res = response) => {
    //
    const { id } = req.params;
    const { nombre } = req.body;
    const categoria = await Categoria.findByIdAndUpdate(
        id,
        {
            nombre: nombre.toUpperCase(),
            usuario: req.usuario._id
        },
        { new: true }
    );
    res.status(201).json(categoria);
    //
};

// borrarCategoria - estado:false

const borrarCategoria = async (req = request, res = response) => {
    //
    const { id } = req.params;
    const categoria = await Categoria.findByIdAndUpdate(
        id,
        { estado: false },
        { new: true }
    );
    res.status(200).json(categoria);
    //
};

module.exports = {
    crearCategoria,
    obtenerCategorias,
    obtenerCategoria,
    actualizarCategoria,
    borrarCategoria
};
