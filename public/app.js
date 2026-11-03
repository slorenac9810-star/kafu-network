document.addEventListener('DOMContentLoaded', () => {
  loadFeed();

  // NAVEGACIÓN LATERAL
  const navItems = document.querySelectorAll('.nav-item[data-target]');
  const views = document.querySelectorAll('.view-section');

  navItems.forEach(item => {
    item.addEventListener('click', () => {
      const targetView = item.getAttribute('data-target');
      navItems.forEach(i => i.classList.remove('active'));
      item.classList.add('active');
      views.forEach(v => v.classList.add('hidden'));
      const activeView = document.getElementById(targetView);
      if (activeView) activeView.classList.remove('hidden');

      if (targetView === 'feed-view') loadFeed();
    });
  });

  // MODALES
  const postModal = document.getElementById('post-modal');
  const settingsModal = document.getElementById('settings-modal');

  document.getElementById('open-modal-btn').onclick = () => postModal.classList.remove('hidden');
  document.getElementById('close-modal-btn').onclick = () => postModal.classList.add('hidden');

  document.getElementById('open-settings-btn').onclick = () => settingsModal.classList.remove('hidden');
  document.getElementById('close-settings-modal').onclick = () => settingsModal.classList.add('hidden');

  document.getElementById('open-story-modal').onclick = () => {
    alert("Función de agregar Story activada ✨");
  };

  // CREAR PUBLICACIÓN CON SOPORTE PARA FOTO DE TELÉFONO O URL
  const publishBtn = document.getElementById('publish-btn');
  if (publishBtn) {
    publishBtn.onclick = async () => {
      const caption = document.getElementById('post-caption').value.trim();
      const imageUrlInput = document.getElementById('post-image-url').value.trim();
      const fileInput = document.getElementById('post-file-input');

      let finalImageUrl = imageUrlInput;

      if (fileInput && fileInput.files && fileInput.files[0]) {
        const file = fileInput.files[0];
        const reader = new FileReader();
        reader.onload = async function(uploadEvent) {
          finalImageUrl = uploadEvent.target.result;
          await enviarPublicacion(caption, finalImageUrl);
        };
        reader.readAsDataURL(file);
        return;
      }

      await enviarPublicacion(caption, finalImageUrl);
    };
  }

  async function enviarPublicacion(caption, image) {
    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ caption, image, author: 'angiesoler' })
      });

      if (res.ok) {
        document.getElementById('post-caption').value = '';
        document.getElementById('post-image-url').value = '';
        const fileInput = document.getElementById('post-file-input');
        if (fileInput) fileInput.value = '';

        document.getElementById('post-modal').classList.add('hidden');
        loadFeed();
      }
    } catch (e) {
      console.error("Error al publicar:", e);
    }
  }

  // CARGAR FEED
  async function loadFeed() {
    try {
      const res = await fetch('/api/posts');
      const posts = await res.json();
      const container = document.getElementById('posts-container');
      if (!container) return;
      container.innerHTML = '';

      posts.forEach(post => {
        container.innerHTML += `
          <article class="post-card">
            <div class="post-header">
              <div class="post-user" onclick="window.openProfile('${post.author}')">
                <img src="${post.avatar}" alt="Avatar">
                <span>${post.author}</span>
              </div>
            </div>
            <div class="post-image-container"><img src="${post.image}" alt="Post"></div>
            <div class="post-caption"><span>${post.author}</span> ${post.caption}</div>
          </article>
        `;
      });
    } catch (e) {
      console.error("Error cargando feed:", e);
    }
  }

  // PERFIL
  window.openProfile = async function(username) {
    views.forEach(v => v.classList.add('hidden'));
    document.getElementById('profile-view').classList.remove('hidden');

    try {
      const res = await fetch(`/api/user/${username}`);
      const data = await res.json();

      document.getElementById('profile-avatar').src = data.user.avatar;
      document.getElementById('profile-username').innerText = `@${data.user.username}`;
      document.getElementById('profile-name').innerText = data.user.name;
      document.getElementById('profile-bio').innerText = data.user.bio;
      document.getElementById('profile-posts-count').innerText = data.posts.length;

      const grid = document.getElementById('user-posts-grid');
      grid.innerHTML = '';
      data.posts.forEach(p => grid.innerHTML += `<img src="${p.image}" alt="Post">`);
    } catch (e) {
      console.error("Error abriendo perfil:", e);
    }
  };

  document.getElementById('my-profile-btn').onclick = () => openProfile('angiesoler');
});