const express = require("express");
const mysql = require("mysql2/promise");
const multer = require("multer");
const upload = multer();
const app = express();

app.use(express.json());
app.use(express.static("public"));

const db = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "N0M3L0",
    database: "desesperanza"
});

// Obtener panes
app.get("/panes", async (req, res) => {
    const [rows] = await db.query(
        "SELECT id, nombre, precio, descripcion, cantidad, TO_BASE64(imagen) AS imagen FROM panes"
    );
    res.json(rows);
});

// Insertar pan
app.post("/panes", upload.single("imagen"), async (req, res) => {
    const { nombre, precio, descripcion, cantidad } = req.body;
    const imagen = req.file ? req.file.buffer : null;

    await db.query(
        "INSERT INTO panes (nombre, precio, descripcion, cantidad, imagen) VALUES (?, ?, ?, ?, ?)",
        [nombre, precio, descripcion, cantidad, imagen]
    );

    res.json({ mensaje: "Pan agregado" });
});

// Editar pan
app.put("/panes/:id", async (req, res) => {
    const { nombre, precio, descripcion, cantidad } = req.body;
    await db.query(
        "UPDATE panes SET nombre=?, precio=?, descripcion=?, cantidad=? WHERE id=?",
        [nombre, precio, descripcion, cantidad, req.params.id]
    );
    res.json({ mensaje: "Pan actualizado" });
});

// Eliminar pan
app.delete("/panes/:id", async (req, res) => {
    await db.query("DELETE FROM panes WHERE id=?", [req.params.id]);
    res.json({ mensaje: "Pan eliminado" });
});

// Servidor
app.listen(3000, () =>
    console.log("✅ Servidor corriendo en http://localhost:3000")
);
