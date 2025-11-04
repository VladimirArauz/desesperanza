const express = require('express');
const mysql = require('mysql2/promise');
const multer = require('multer');
const cors = require('cors');
const session = require('express-session');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.use(session({
    secret: "desesperanzaSecret",
    resave: false,
    saveUninitialized: true
}));

const storage = multer.memoryStorage();
const upload = multer({ storage });

const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'n0m3l0',
    database: 'desesperanza'
});

/* ------------------------------------------------------------------
   ✅   SECCIÓN PANES
-------------------------------------------------------------------*/

// Obtener todos los panes
app.get('/api/panes', async (req, res) => {
    try {
        const [rows] = await db.query(
            'SELECT id, nombre, costo, cantidad, descripcion, TO_BASE64(imagen) as imagen FROM panes'
        );
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al obtener los panes');
    }
});

// Obtener pan por ID
app.get('/api/panes/:id', async (req, res) => {
    try {
        const [rows] = await db.query(
            'SELECT id, nombre, costo, cantidad, descripcion, TO_BASE64(imagen) as imagen FROM panes WHERE id=?',
            [req.params.id]
        );
        res.json(rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al obtener el pan');
    }
});

// Insertar pan
app.post('/api/panes', upload.single('imagen'), async (req, res) => {
    try {
        const { nombre, costo, cantidad, descripcion } = req.body;
        const imagen = req.file ? req.file.buffer : null;

        await db.query(
            'INSERT INTO panes (nombre, costo, cantidad, descripcion, imagen) VALUES (?, ?, ?, ?, ?)',
            [nombre, costo, cantidad, descripcion, imagen]
        );

        res.sendStatus(201);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al agregar el pan');
    }
});

// Actualizar pan
app.put('/api/panes/:id', upload.single('imagen'), async (req, res) => {
    try {
        const { nombre, costo, cantidad, descripcion } = req.body;
        const imagen = req.file ? req.file.buffer : null;

        if (imagen) {
            await db.query(
                'UPDATE panes SET nombre=?, costo=?, cantidad=?, descripcion=?, imagen=? WHERE id=?',
                [nombre, costo, cantidad, descripcion, imagen, req.params.id]
            );
        } else {
            await db.query(
                'UPDATE panes SET nombre=?, costo=?, cantidad=?, descripcion=? WHERE id=?',
                [nombre, costo, cantidad, descripcion, req.params.id]
            );
        }

        res.sendStatus(200);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al actualizar el pan');
    }
});

// Eliminar pan
app.delete('/api/panes/:id', async (req, res) => {
    try {
        await db.query('DELETE FROM panes WHERE id=?', [req.params.id]);
        res.sendStatus(200);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al eliminar el pan');
    }
});

/* ------------------------------------------------------------------
   ✅  SECCIÓN USUARIOS: REGISTRO - LOGIN - LOGOUT
-------------------------------------------------------------------*/

// Registrar usuario
app.post("/api/registro", async (req, res) => {
    try {
        const { nombre, contraseña } = req.body;

        await db.query(
            "INSERT INTO usuario (nombre, contraseña) VALUES (?, ?)",
            [nombre, contraseña]
        );

        res.sendStatus(201);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error al registrar usuario");
    }
});

// Login usuario
app.post("/api/login", async (req, res) => {
    try {
        const { nombre, contraseña } = req.body;

        const [rows] = await db.query(
            "SELECT * FROM usuario WHERE nombre=? AND contraseña=?",
            [nombre, contraseña]
        );

        if (rows.length > 0) {
            req.session.usuario = nombre;
            res.json({ login: true, usuario: nombre });
        } else {
            res.status(401).send("Credenciales incorrectas");
        }
    } catch (err) {
        console.error(err);
        res.status(500).send("Error al iniciar sesión");
    }
});

// Logout
app.get("/api/logout", (req, res) => {
    req.session.destroy();
    res.send("Sesión cerrada");
});

// Ver sesión
app.get("/api/sesion", (req, res) => {
    if (req.session.usuario) {
        res.json({ usuario: req.session.usuario });
    } else {
        res.json({ usuario: null });
    }
});

/* ------------------------------------------------------------------*/

const PORT = 3000;
app.listen(PORT, () => console.log(`✅ Servidor corriendo en http://localhost:${PORT}`));
