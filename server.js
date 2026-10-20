  const express = require('express');
  const multer = require('multer');
  const cors = require('cors');
  const path = require('path');
  const fs = require('fs');

  const app = express();

  // IMPORTANTE: Railway usa la variable process.env.PORT
  const PORT = process.env.PORT || 3000;

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.static('.'));

  // Configuración de Multer más robusta
  const storage = multer.diskStorage({
      destination: (req, file, cb) => {
          const uploadPath = path.join(__dirname, 'uploads');
          try {
              if (!fs.existsSync(uploadPath)) {
                  fs.mkdirSync(uploadPath, { recursive: true });
              }
              cb(null, uploadPath);
          } catch (err) {
              cb(err);
          }
      },
      filename: (req, file, cb) => {
          cb(null, Date.now() + path.extname(file.originalname));
      }
  });

  const upload = multer({ storage: storage });

  // Base de datos simulada
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

  // Ruta de salud (Health Check) para que Railway sepa que el
  servidor vive
  app.get('/', (req, res) => {
      res.send('🚀 Servidor de YouIA está ONLINE y funcionando!');
  });

  app.get('/api/videos', (req, res) => {
      res.json(videosDatabase);
  });

  app.post('/api/upload', upload.single('video'), (req, res) => {
      if (!req.file) {
          return res.status(400).json({ error: 'No se subió ningún
  archivo' });
      }

      const newVideo = {
          id: videosDatabase.length + 1,
          title: req.body.title || 'Video sin título',
          channel: 'Usuario YouIA',
          views: '0',
          time: 'ahora mismo',
          duration: '0:00',
          thumb: 'https://picsum.photos/seed/' + Math.random() +
  '/400/225',
          avatar: 'https://i.pravatar.cc/150?u=' + Math.random(),
          url: `/uploads/${req.file.filename}`
      };

      videosDatabase.push(newVideo);
      res.status(201).json({ message: 'Video subido con éxito',
  video: newVideo });
  });

  // Manejo de errores global para evitar que el servidor se caiga
  app.use((err, req, res, next) => {
      console.error(err.stack);
      res.status(500).send('Algo salió mal en el servidor YouIA!');
  });

  app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Servidor de YouIA corriendo en puerto
  ${PORT}`);
  });
