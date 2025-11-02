// ✅ Importaciones
const express = require('express');
const mysql = require('mysql2/promise');
const multer = require('multer');
const path = require('path');

const app = express();

// ✅ Configurar Multer para leer imágenes
const storage = multer.memoryStorage();  // <-- Guarda imagen en memoria como Buffer
const upload = multer({ storage });

// ✅ Conexión a la base de datos
const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'n0m3l0', 
  database: 'desesperanza',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// ✅ Permite leer formularios
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ✅ Archivos estáticos
app.use(express.static('public'));

// ✅ Ruta principal
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// ✅ Mostrar catálogo de panes
app.get('/panes', async (req, res) => {
  const [rows] = await db.query('SELECT id, nombre, costo, descripcion, imagen FROM panes');
  res.json(rows);
});

// ✅ Agregar pan con imagen BLOB
app.post('/agregar', upload.single('imagen'), async (req, res) => {
  const { nombre, costo, descripcion } = req.body;
  const imagen = req.file ? req.file.buffer : null;

  await db.query(
    'INSERT INTO panes (nombre, costo, descripcion, imagen) VALUES (?, ?, ?, ?)',
    [nombre, costo, descripcion, imagen]
  );

  res.redirect('/index.html');
});

// ✅ Eliminar pan
app.get('/eliminar/:id', async (req, res) => {
  const { id } = req.params;
  await db.query('DELETE FROM panes WHERE id = ?', [id]);
  res.redirect('/index.html');
});

// ✅ Modificar pan con imagen (opcional)
app.post('/modificar/:id', upload.single('imagen'), async (req, res) => {
  const { id } = req.params;
  const { nombre, costo, descripcion } = req.body;
  const imagen = req.file ? req.file.buffer : null;

  if (imagen) {
    await db.query(
      'UPDATE panes SET nombre=?, costo=?, descripcion=?, imagen=? WHERE id=?',
      [nombre, costo, descripcion, imagen, id]
    );
  } else {
    await db.query(
      'UPDATE panes SET nombre=?, costo=?, descripcion=? WHERE id=?',
      [nombre, costo, descripcion, id]
    );
  }

  res.redirect('/index.html');
});

// ✅ Servir la imagen por ruta (útil para mostrar en HTML)
app.get('/imagen/:id', async (req, res) => {
  const { id } = req.params;
  const [rows] = await db.query('SELECT imagen FROM panes WHERE id=?', [id]);

  if (rows.length === 0 || !rows[0].imagen) {
    return res.status(404).send('Imagen no encontrada');
  }

  res.setHeader('Content-Type', 'image/jpeg');
  res.send(rows[0].imagen);
});

// ✅ Iniciar servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});

