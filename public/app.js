// ✅ Importaciones
const express = require('express');
const mysql = require('mysql2/promise');

const app = express();

// ✅ Conexión a la base de datos
const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'N0M3L0', 
  database: 'desesperanza',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// ✅ Permite leer datos del formulario
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ✅ Servir archivos estáticos desde /public
app.use(express.static('public'));

// ✅ Ruta principal
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// ✅ Mostrar catálogo de panes
app.get('/panes', async (req, res) => {
  const [rows] = await db.query('SELECT * FROM panes');
  res.json(rows);
});

// ✅ Agregar pan
app.post('/agregar', async (req, res) => {
  const { nombre, costo, descripcion } = req.body;
  await db.query('INSERT INTO panes (nombre, costo, descripcion) VALUES (?, ?, ?)', [nombre, costo, descripcion]);
  res.redirect('/index.html');
});

// ✅ Eliminar pan
app.get('/eliminar/:id', async (req, res) => {
  const { id } = req.params;
  await db.query('DELETE FROM panes WHERE id = ?', [id]);
  res.redirect('/index.html');
});

// ✅ Modificar pan
app.post('/modificar/:id', async (req, res) => {
  const { id } = req.params;
  const { nombre, costo, descripcion } = req.body;
  await db.query('UPDATE panes SET nombre=?, costo=?, descripcion=? WHERE id=?', [nombre, costo, descripcion, id]);
  res.redirect('/index.html');
});

// ✅ Iniciar servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});

