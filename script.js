async function loadVideos() {
    const grid = document.querySelector('.video-grid');
    grid.innerHTML = '<p style="color: white; text-align: center; grid-column: 1/-1;">Cargando videos de la IA...</p>';

    try {
        const response = await fetch('/api/videos');
        const videosData = await response.json();

        grid.innerHTML = '';

        videosData.forEach(video => {
            const card = document.createElement('div');
            card.className = 'video-card';
            card.innerHTML = `
                <div class="thumbnail">
                    <img src="${video.thumb}" alt="thumbnail">
                    <span class="duration">${video.duration}</span>
                </div>
                <div class="video-info">
                    <img src="${video.avatar}" class="channel-avatar">
                    <div class="video-details">
                        <h3>${video.title}</h3>
                        <p>${video.channel}</p>
                        <p>${video.views} vistas • ${video.time}</p>
                    </div>
                </div>
            `;
            grid.appendChild(card);
        });
    } catch (error) {
        console.error("Error cargando videos:", error);
        grid.innerHTML = '<p style="color: red; text-align: center; grid-column: 1/-1;">Error al conectar con el servidor YouIA.</p>';
    }
}

// Modal Logic
const modal = document.getElementById('uploadModal');
const uploadIcon = document.querySelector('.upload-icon');
const closeBtn = document.querySelector('.close');

uploadIcon.onclick = () => modal.style.display = 'block';
closeBtn.onclick = () => modal.style.display = 'none';
window.onclick = (event) => {
    if (event.target == modal) modal.style.display = 'none';
};

document.getElementById('btnPublish').onclick = async () => {
    const title = document.getElementById('videoTitle').value;
    const desc = document.getElementById('videoDesc').value;
    const fileInput = document.getElementById('videoFile');
    const file = fileInput.files[0];

    if(!file) {
        alert("Por favor selecciona un video primero.");
        return;
    }

    if(title && desc) {
        const formData = new FormData();
        formData.append('video', file);
        formData.append('title', title);
        formData.append('description', desc);

        try {
            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData
            });

            if(response.ok) {
                alert(`¡Felicidades! Tu creación "${title}" ha sido subida al servidor de YouIA.`);
                modal.style.display = 'none';
                loadVideos(); // Recargar la lista de videos
            } else {
                alert("Hubo un error al subir el video.");
            }
        } catch (error) {
            console.error("Error en la subida:", error);
            alert("No se pudo conectar con el servidor.");
        }
    } else {
        alert("Por favor completa el título y la descripción.");
    }
};

window.onload = loadVideos;
