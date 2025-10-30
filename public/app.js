// ✅ Mostrar catálogo
app.get('/panes', async (req, res) => {
    const [rows] = await db.query('SELECT * FROM panes');
    res.json(rows);
});

// ✅ Agregar pan
app.post('/agregar', async (req, res) => {
    const { nombre, costo, descripcion } = req.body;
    await db.query('INSERT INTO panes (nombre, costo, descripcion) VALUES (?, ?, ?)', [nombre, costo, descripcion]);
    res.redirect('/catalogo.html');
});

// ✅ Eliminar pan
app.get('/eliminar/:id', async (req, res) => {
    const { id } = req.params;
    await db.query('DELETE FROM panes WHERE id = ?', [id]);
    res.redirect('/catalogo.html');
});

// ✅ Modificar pan
app.post('/modificar/:id', async (req, res) => {
    const { id } = req.params;
    const { nombre, costo, descripcion } = req.body;
    await db.query('UPDATE panes SET nombre=?, costo=?, descripcion=? WHERE id=?', [nombre, costo, descripcion, id]);
    res.redirect('/catalogo.html');
});
