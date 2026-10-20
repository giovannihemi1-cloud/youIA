const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.')); // Sirve los archivos HTML, CSS, JS

// Configuración de Multer para guardar videos en el disco duro localmente
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = 'uploads/';
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath);
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Base de datos simulada en memoria (se borrará al reiniciar el servidor)
// En el futuro usaremos MongoDB aquí
let videosDatabase = [
    {
        id: 1,
        title: "Cocinando con IA: Recetas Surrealistas",
        channel: "AI-Chef Master",
        views: "1.2M",
        time: "2 days ago",
        duration: "10:45",
        thumb: "https://picsum.photos/seed/ia1/400/225",
        avatar: "https://i.pravatar.cc/150?u=ia1",
        url: ""
    }
];

// RUTAS API

// 1. Obtener todos los videos
app.get('/api/videos', (req, res) => {
    res.json(videosDatabase);
});

// 2. Subir un video nuevo
app.post('/api/upload', upload.single('video'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No se subió ningún archivo' });
    }

    const newVideo = {
        id: videosDatabase.length + 1,
        title: req.body.title || 'Video sin título',
        channel: 'Usuario YouIA',
        views: '0',
        time: 'ahora mismo',
        duration: '0:00',
        thumb: 'https://picsum.photos/seed/' + Math.random() + '/400/225',
        avatar: 'https://i.pravatar.cc/150?u=' + Math.random(),
        url: `/uploads/${req.file.filename}`
    };

    videosDatabase.push(newVideo);
    res.status(201).json({ message: 'Video subido con éxito', video: newVideo });
});

app.listen(PORT, () => {
    console.log(`🚀 Servidor de YouIA corriendo en http://localhost:${PORT}`);
});
