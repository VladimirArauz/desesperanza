const express = require('express');
const mysql = require('mysql2/promise');
const multer = require('multer');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const storage = multer.memoryStorage();
const upload = multer({ storage });

const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'n0m3l0',
    database: 'desesperanza'
});

// ✅ Obtener todos los panes (cantidad al final)
app.get('/api/panes', async (req, res) => {
    try {
        const [rows] = await db.query(
            'SELECT id, nombre, costo, descripcion, TO_BASE64(imagen) as imagen, cantidad FROM panes'
        );
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al obtener los panes');
    }
});

// ✅ Obtener uno (cantidad al final)
app.get('/api/panes/:id', async (req, res) => {
    try {
        const [rows] = await db.query(
            'SELECT id, nombre, costo, descripcion, TO_BASE64(imagen) as imagen, cantidad FROM panes WHERE id=?',
            [req.params.id]
        );
        res.json(rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al obtener el pan');
    }
});

// ✅ Insertar (cantidad al final)
app.post('/api/panes', upload.single('imagen'), async (req, res) => {
    try {
        const { nombre, costo, descripcion, cantidad } = req.body;
        const imagen = req.file ? req.file.buffer : null;

        await db.query(
            'INSERT INTO panes (nombre, costo, descripcion, imagen, cantidad) VALUES (?, ?, ?, ?, ?)',
            [nombre, costo, descripcion, imagen, cantidad]
        );
        res.sendStatus(201);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al agregar el pan');
    }
});

// ✅ Actualizar (cantidad al final)
app.put('/api/panes/:id', upload.single('imagen'), async (req, res) => {
    try {
        const { nombre, costo, descripcion, cantidad } = req.body;
        const imagen = req.file ? req.file.buffer : null;

        if (imagen) {
            await db.query(
                'UPDATE panes SET nombre=?, costo=?, descripcion=?, imagen=?, cantidad=? WHERE id=?',
                [nombre, costo, descripcion, imagen, cantidad, req.params.id]
            );
        } else {
            await db.query(
                'UPDATE panes SET nombre=?, costo=?, descripcion=?, cantidad=? WHERE id=?',
                [nombre, costo, descripcion, cantidad, req.params.id]
            );
        }

        res.sendStatus(200);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al actualizar el pan');
    }
});

app.delete('/api/panes/:id', async (req, res) => {
    try {
        await db.query('DELETE FROM panes WHERE id=?', [req.params.id]);
        res.sendStatus(200);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al eliminar el pan');
    }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));

