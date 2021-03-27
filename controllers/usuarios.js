const { request, response } = require('express');
const Usuario = require('../models/usuario');
const bcryptjs = require('bcryptjs');

const usuariosGet = async (req = request, res = response) => {
    //

    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true };

    const [total, usuarios] = await Promise.all([
        Usuario.countDocuments(query),
        Usuario.find(query).skip(Number(desde)).limit(Number(limite))
    ]);

    const params = req.res.json({
        total,
        usuarios
    });
};

const usuariosPost = async (req, res = response) => {
    //
    const { nombre, correo, password, rol } = req.body;
    const usuario = new Usuario({ nombre, correo, password, rol });

    // Encriptar la contraseña
    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync(password, salt);

    // Guardar en BD
    await usuario.save();

    res.json({
        usuario
    });
};

const usuariosPut = async (req, res = response) => {
    const { id } = req.params;
    const { _id, password, google, correo, ...resto } = req.body;

    // Valida contra Base de Datos

    if (password) {
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync(password, salt);
    }

    const usuario = await Usuario.findByIdAndUpdate(id, resto);

    res.json(usuario);
};

const usuariosPatch = async (req, res = response) => {
    res.json({
        msg: 'patch API - controlador'
    });
};

// const usuariosDelete = async (req, res = response) => {
//     //
//     const { id } = req.params;
//     //
//     // Fisicamnente lo borramos
//     //
//     const usuario = await Usuario.findByIdAndDelete(id);
//     res.json(usuario);
// };

const usuariosDelete = async (req, res = response) => {
    //
    const { id } = req.params;
    //
    // Borramos al usuario actualizando su estado sin borralo fisicamente
    //
    const usuario = await Usuario.findByIdAndUpdate(id, { estado: false });
    const usuarioAutenticado = req.usuario;

    res.json({ usuario });
};

module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosPatch,
    usuariosDelete
};
