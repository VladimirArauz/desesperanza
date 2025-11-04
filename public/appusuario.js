// ✅ Importaciones
const express = require('express');
const mysql = require('mysql2/promise');
const path = require('path');
const app = express();

// ✅ Para leer JSON y formularios
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Ruta estática para los archivos en /public
app.use(express.static(path.join(__dirname)));

// ✅ Conexión a MySQL
const db = mysql.createPool({
    host: "localhost",
    user: "root",        // <-- cámbialo si tu usuario es diferente
    password: "",        // <-- cámbialo si tu MySQL tiene contraseña
    database: "desesperanza"
});

// ✅ Mostrar formulario de registro
app.get('/registro', (req, res) => {
    res.sendFile(path.join(__dirname, 'indexregistro.html'));
});

// ✅ Mostrar formulario de login
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'indexlogin.html'));
});

// ✅ Guardar usuario en la BD (REGISTRO)
app.post('/crear-usuario', async (req, res) => {
    const { nombre, contraseña } = req.body;

    try {
        await db.query(
            "INSERT INTO usuario (nombre, contraseña) VALUES (?, ?)",
            [nombre, contraseña]
        );
        res.send(`<h2>Usuario registrado con éxito ✅</h2><a href="/login">Ir a Login</a>`);
    } catch (error) {
        console.error(error);
        res.send("❌ Error guardando el usuario");
    }
});

// ✅ Verificar login
app.post('/validar-login', async (req, res) => {
    const { nombre, contraseña } = req.body;

    try {
        const [rows] = await db.query(
            "SELECT * FROM usuario WHERE nombre = ? AND contraseña = ?",
            [nombre, contraseña]
        );

        if (rows.length > 0) {
            res.send(`<h2>✅ Bienvenido ${nombre}</h2>`);
        } else {
            res.send("❌ Usuario o contraseña incorrectos");
        }

    } catch (error) {
        console.error(error);
        res.send("❌ Error durante el login");
    }
});

// ✅ Iniciar servidor
app.listen(3000, () => {
    console.log("Servidor corriendo en http://localhost:3000");
});
