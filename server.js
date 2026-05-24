const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors()); 
app.use(express.json()); 
const path = require('path');

// Esto le dice a Express que sirva el index.html automáticamente en la raíz
app.use(express.static(__dirname)); 

// Por si acaso, esto asegura que al entrar a "/" cargue el HTML
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

const db = mysql.createConnection({
    host: 'kodama.proxy.rlwy.net',
    port: 53584,
    user: 'root',
    password: 'HAVZXsZARfhwMaiivmQWHZNXmTZVjbTa', 
    database: 'reservas_restaurantes'         
});

// Comprobar la conexión
db.connect(err => {
    if (err) {
        console.error('❌ Error al conectar a MySQL Workbench: ', err.message);
        return;
    }
    console.log('✅ ¡Conectado con éxito a tu MySQL en la nube!');
});

// RUTA PARA QUE EL HTML LEA LOS DATOS
app.get('/usuarios', (req, res) => {
    
    db.query('SELECT * FROM usuarios', (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results); 
    });
});

app.listen(3000, () => {
    console.log('🚀 Backend corriendo en http://localhost:3000');
});
// RUTA PARA INSERTAR UN NUEVO REGISTRO
app.post('/usuarios', (req, res) => {
    const { nombre, email } = req.body; // Recibe los datos que mande el HTML
    const query = 'INSERT INTO usuarios (nombre, email) VALUES (?, ?)';
    
    db.query(query, [nombre, email], (err, result) => {
        if (err) return res.status(500).send(err);
        res.json({ mensaje: '¡Usuario guardado con éxito!', id: result.insertId });
    });
});

// RUTA PARA ELIMINAR UN REGISTRO POR SU ID
app.delete('/usuarios/:id', (req, res) => {
    const { id } = req.params; // Captura el ID desde la URL (ej: /usuarios/5)
    const query = 'DELETE FROM usuarios WHERE id = ?';
    
    db.query(query, [id], (err, result) => {
        if (err) return res.status(500).send(err);
        res.json({ mensaje: 'Usuario eliminado correctamente' });
    });
});

// RUTA PARA EDITAR UN REGISTRO
app.put('/usuarios/:id', (req, res) => {
    const { id } = req.params;
    const { nombre, email } = req.body; // Los nuevos datos a guardar
    const query = 'UPDATE usuarios SET nombre = ?, email = ? WHERE id = ?';
    
    db.query(query, [nombre, email, id], (err, result) => {
        if (err) return res.status(500).send(err);
        res.json({ mensaje: 'Usuario actualizado correctamente' });
    });
});