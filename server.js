require('dotenv').config(); // Carga las variables de entorno desde .env
const express = require('express');
const session = require('express-session');
const app = express();

// Configuración del puerto y secret de sesión
const port = process.env.PORT || 3000; // Usar variable de entorno o puerto por defecto
const SESSION_SECRET = process.env.SESSION_SECRET; // Debe estar definido en el archivo .env

if (!SESSION_SECRET) {
    throw new Error("Falta la variable de entorno SESSION_SECRET");
}

// Middleware de sesión
app.use(session({
    secret: SESSION_SECRET, // Usa el secreto definido en .env
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Cambiar a true en producción con HTTPS
}));

// Middleware de express
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware para registrar solicitudes
app.use((req, res, next) => {
    console.log(req.method, req.path);
    next();
});

// Rutas
const users = require('./routes/users');
app.use("/api/", users);

// Iniciar servidor
app.listen(port, () => {
    console.log(`Server is listening at http://localhost:${port}`);
});
