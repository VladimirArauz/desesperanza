const mysql = require('mysql2/promise');

// Crear conexión a la base de datos
const pool = mysql.createPool({
  host: 'localhost',     // Servidor de MySQL
  user: 'root',          // Tu usuario de MySQL
  password: 'N0M3L0', // Cambia esto
  database: 'desesperanza',   // Nombre de tu base de datos
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool;
// Importamos Express
const express = require('express');
const app = express();

// Middleware para leer archivos estáticos (HTML, CSS, JS, imágenes, etc.)
app.use(express.static('public'));

// Ruta principal
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// Iniciar el servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});
