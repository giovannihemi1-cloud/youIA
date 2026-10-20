const express = require('express');
  const cors = require('cors');

  const app = express();
  const PORT = process.env.PORT || 3000;

  // Middleware
  app.use(cors());
  app.use(express.json());

  // Base de datos en memoria (estabilidad total)
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

  // RUTA DE SALUD - Vital para que Railway no mate el servidor
  app.get('/', (req, res) => {
      res.send('🚀 YouIA Server: ESTABLE Y ONLINE');
  });

  // Obtener videos
  app.get('/api/videos', (req, res) => {
      res.json(videosDatabase);
  });

  // Subida simulada (para evitar crasheos de disco)
  app.post('/api/upload', (req, res) => {
      const { title, description } = req.body;

      if (!title) {
          return res.status(400).json({ error: 'Título requerido' });
      }

      const newVideo = {
          id: videosDatabase.length + 1,
          title: title,
          channel: 'Usuario YouIA',
          views: '0',
          time: 'ahora mismo',
          duration: '0:00',
          thumb: 'https://picsum.photos/seed/' + Math.random() +
  '/400/225',
          avatar: 'https://i.pravatar.cc/150?u=' + Math.random(),
          url: 'https://sample-videos.com/video123.mp4' // URL
  simulada
      };

      videosDatabase.push(newVideo);
      res.status(201).json({ message: 'Video registrado con éxito',
  video: newVideo });
  });

  app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Servidor Blindado corriendo en puerto
  ${PORT}`);
  });

  3. CUIDADO AQUÍ: También tenemos que actualizar el script.js porque
     ya no enviaremos el archivo físico (que es lo que hacía
     crashear al servidor), sino solo la información del video.

  Actualiza tu script.js en GitHub con este cambio en la función de
  publicar:

  document.getElementById('btnPublish').onclick = async () => {
      const title = document.getElementById('videoTitle').value;
      const desc = document.getElementById('videoDesc').value;

      if(title && desc) {
          try {
              const response = await
  fetch(`${API_BASE_URL}/api/upload`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ title, description: desc })
              });

              if(response.ok) {
                  alert(`¡Felicidades! Tu creación "${title}" ha sido
  registrada en YouIA.`);
                  modal.style.display = 'none';
                  loadVideos();
              } else {
                  alert("Hubo un error al subir el video.");
              }
          } catch (error) {
              alert("No se pudo conectar con el servidor.");
          }
      } else {
          alert("Por favor completa el título y la descripción.");
      }
  };
