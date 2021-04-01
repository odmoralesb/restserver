const { response } = require('express');
const { Producto } = require('../models');

// obtenerProductos - paginado - total - populate
const obtenerProductos = async (req = request, res = response) => {
    //
    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true };

    const [total, productos] = await Promise.all([
        Producto.countDocuments(query),
        Producto.find(query)
            .populate('usuario', 'nombre')
            .populate('categoria', 'nombre')
            .skip(Number(desde))
            .limit(Number(limite))
    ]);

    res.json({
        total,
        productos
    });
};

// obtenerProducto - populate
const obtenerProducto = async (req = request, res = response) => {
    //
    const { id } = req.params;
    const producto = await Producto.findById(id)
        .populate('usuario', 'nombre')
        .populate('categoria', 'nombre');
    res.status(200).json(producto);
    //
};

// Crear Producto
const crearProducto = async (req, res = response) => {
    //
    const {
        nombre,
        categoria,
        precio = 0,
        descripcion = '',
        disponible = true
    } = req.body;

    // Generar la data a guardar
    const data = {
        nombre: nombre.toUpperCase(),
        categoria,
        precio,
        descripcion,
        disponible,
        usuario: req.usuario._id
    };

    const producto = await new Producto(data);

    // Guardar DB
    await producto.save();

    res.status(201).json(producto);
    //
};

// actualizarProducto

const actualizarProducto = async (req = request, res = response) => {
    //
    const { id } = req.params;
    const { nombre, precio, descripcion, disponible, categoria } = req.body;
    const productoOld = await Producto.findById(id);

    const producto = await Producto.findByIdAndUpdate(
        id,
        {
            nombre: nombre ? nombre.toUpperCase() : productoOld.nombre,
            precio: precio ? precio : productoOld.precio,
            descripcion: descripcion ? descripcion : productoOld.descripcion,
            disponible: disponible ? disponible : productoOld.disponible,
            categoria: categoria ? categoria : productoOld.categoria,
            usuario: req.usuario._id
        },
        { new: true }
    );
    res.status(201).json(producto);
    //
};

// borrarProducto - estado:false
const borrarProducto = async (req = request, res = response) => {
    //
    const { id } = req.params;
    const producto = await Producto.findByIdAndUpdate(
        id,
        { estado: false },
        { new: true }
    );
    res.status(200).json(producto);
    //
};

module.exports = {
    crearProducto,
    obtenerProductos,
    obtenerProducto,
    actualizarProducto,
    borrarProducto
};
