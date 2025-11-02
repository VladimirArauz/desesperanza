const express = require('express');
const mysql = require('mysql2/promise');
const multer = require('multer');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Configurar multer para almacenar imagen en memoria (buffer)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Conexión a MySQL
const db = mysql.createPool({
    host: 'localhost',
    user: 'root',       // Cambia por tu usuario
    password: '',       // Cambia por tu contraseña
    database: 'desesperanza'
});

// ---------------------- RUTAS ----------------------

// Obtener todos los panes
app.get('/api/panes', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT id, nombre, costo, descripcion, TO_BASE64(imagen) as imagen FROM panes');
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al obtener los panes');
    }
});

// Obtener un pan por ID
app.get('/api/panes/:id', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT id, nombre, costo, descripcion, TO_BASE64(imagen) as imagen FROM panes WHERE id=?', [req.params.id]);
        res.json(rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al obtener el pan');
    }
});

// Agregar un pan
app.post('/api/panes', upload.single('imagen'), async (req, res) => {
    try {
        const { nombre, costo, descripcion } = req.body;
        const imagen = req.file ? req.file.buffer : null;

        await db.query('INSERT INTO panes (nombre, costo, descripcion, imagen) VALUES (?, ?, ?, ?)', [nombre, costo, descripcion, imagen]);
        res.sendStatus(201);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al agregar el pan');
    }
});

// Actualizar un pan
app.put('/api/panes/:id', upload.single('imagen'), async (req, res) => {
    try {
        const { nombre, costo, descripcion } = req.body;
        const imagen = req.file ? req.file.buffer : null;

        if (imagen) {
            await db.query('UPDATE panes SET nombre=?, costo=?, descripcion=?, imagen=? WHERE id=?', [nombre, costo, descripcion, imagen, req.params.id]);
        } else {
            await db.query('UPDATE panes SET nombre=?, costo=?, descripcion=? WHERE id=?', [nombre, costo, descripcion, req.params.id]);
        }

        res.sendStatus(200);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al actualizar el pan');
    }
});

// Eliminar un pan
app.delete('/api/panes/:id', async (req, res) => {
    try {
        await db.query('DELETE FROM panes WHERE id=?', [req.params.id]);
        res.sendStatus(200);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al eliminar el pan');
    }
});

// ---------------------- INICIAR SERVIDOR ----------------------
const PORT = 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));

