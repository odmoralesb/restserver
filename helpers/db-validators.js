const { Usuario, Categoria, Producto, Role } = require('../models');

const esRoleValido = async (rol = '') => {
    const existeRol = await Role.findOne({ rol });
    if (!existeRol) {
        throw new Error(`El rol ${rol} no está registrado en la BD`);
    }
};

const emailExiste = async (correo = '') => {
    // Verificar si el correo existe
    const existeEmail = await Usuario.findOne({ correo });
    if (existeEmail) {
        throw new Error(`El correo ${correo} está registrado en la BD`);
    }
};

const existeUsuarioPorID = async (id) => {
    // Verificar si el correo existe
    const existeUsuario = await Usuario.findById(id);
    if (!existeUsuario) {
        throw new Error(`El id ${id} no existe`);
    }
};

const existeCategoriaID = async (id) => {
    // Verificar si el correo existe
    const existeCategoria = await Categoria.findById(id);
    if (!existeCategoria) {
        throw new Error(`El id categoria ${id} no existe`);
    }
};

const existeProductoID = async (id) => {
    // Verificar si el correo existe
    const existeProducto = await Producto.findById(id);
    if (!existeProducto) {
        throw new Error(`El id producto ${id} no existe`);
    }
};

module.exports = {
    esRoleValido,
    emailExiste,
    existeUsuarioPorID,
    existeCategoriaID,
    existeProductoID
};
