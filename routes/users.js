const express = require('express');
const router = express.Router();
const { createUser, getUser, getAllUsers, updateUser, deleteUser, validateUser } = require('../database');

// Middleware para verificar autenticación
function isAuthenticated(req, res, next) {
    if (req.session.user) {
        next();
    } else {
        res.status(401).send('Acceso no autorizado');
    }
}

// Crear un usuario
router.post('/users', (req, res) => {
    const { user, password } = req.body;
    try {
        createUser(user, password);
        res.status(201).send('Usuario creado');
    } catch (err) {
        res.status(500).send("Error al crear el usuario");
    }
});

// Obtener todos los usuarios
router.get('/users', isAuthenticated, (req, res) => {
    res.json(getAllUsers());
});

// Obtener un usuario por su nombre
router.get('/users/:user', isAuthenticated, (req, res) => {
    const user = req.params.user;
    try {
        const userObj = getUser(user);
        if (userObj) {
            res.json(userObj);
        } else {
            res.status(404).send('Usuario no encontrado');
        }
    } catch (err) {
        res.status(500).send('Error al buscar el usuario');
    }
});

// Actualizar un usuario
router.put('/users/:user', isAuthenticated, (req, res) => {
    const user = req.params.user;
    const { new_user, password } = req.body;
    try {
        updateUser(user, new_user, password);
        res.status(200).send('Usuario actualizado');
    } catch (err) {
        res.status(500).send('Error al actualizar el usuario');
    }
});

// Eliminar un usuario
router.delete('/users/:user', isAuthenticated, (req, res) => {
    const user = req.params.user;
    try {
        deleteUser(user);
        res.status(200).send('Usuario eliminado');
    } catch (err) {
        res.status(500).send('Error al eliminar el usuario');
    }
});

// Login de usuario
router.post('/login', (req, res) => {
    const { user, password } = req.body;
    try {
        const userObj = getUser(user);
        if (userObj && validateUser(user, password)) {
            req.session.user = user; // Almacena el usuario en la sesión
            res.status(200).send('Login correcto');
        } else {
            res.status(401).send('Login incorrecto');
        }
    } catch (err) {
        res.status(500).send('Error en el servidor');
    }
});

// Logout de usuario
router.post('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).send('Error al cerrar sesión');
        }
        res.clearCookie('connect.sid'); // Limpia la cookie de sesión
        res.status(200).send('Sesión cerrada');
    });
});

module.exports = router;
