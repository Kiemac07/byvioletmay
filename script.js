document.addEventListener('DOMContentLoaded', () => {
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open);
    });
    nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
      nav.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    }));
  }

  const lightbox = document.querySelector('.lightbox');
  if (!lightbox) return;
  const boxImage = lightbox.querySelector('.lightbox-image');
  const boxVideo = lightbox.querySelector('.lightbox-video');
  const closeBtn = lightbox.querySelector('.lightbox-close');
  const prevBtn = lightbox.querySelector('.lightbox-prev');
  const nextBtn = lightbox.querySelector('.lightbox-next');
  const items = [...document.querySelectorAll('[data-gallery-item="true"]')];
  let currentIndex = -1;
  let touchStartX = 0;

  function closeLightbox() {
    if (boxVideo) {
      boxVideo.pause();
      boxVideo.currentTime = 0;
      boxVideo.removeAttribute('src');
      boxVideo.load();
    }
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
    if (boxImage) boxImage.removeAttribute('src');
    currentIndex = -1;
  }

  function updateNav() {
    const show = items.length > 1;
    if (prevBtn) prevBtn.hidden = !show;
    if (nextBtn) nextBtn.hidden = !show;
  }

  async function showItem(index) {
    if (!items.length) return;
    currentIndex = (index + items.length) % items.length;
    const el = items[currentIndex];
    const imageSrc = el.dataset.lightboxImage;
    const videoSrc = el.dataset.lightboxVideo;

    if (boxVideo) {
      boxVideo.pause();
      boxVideo.removeAttribute('src');
      boxVideo.load();
      boxVideo.style.display = 'none';
    }
    if (boxImage) {
      boxImage.removeAttribute('src');
      boxImage.style.display = 'none';
    }

    if (imageSrc && boxImage) {
      boxImage.src = imageSrc;
      boxImage.alt = el.dataset.alt || '';
      boxImage.style.display = 'block';
    } else if (videoSrc && boxVideo) {
      boxVideo.src = videoSrc;
      boxVideo.controls = false;
      boxVideo.loop = false;
      boxVideo.style.display = 'block';
      try { await boxVideo.play(); } catch (e) {}
    }
    updateNav();
  }

  function openAt(index) {
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
    showItem(index);
  }

  items.forEach((el, index) => el.addEventListener('click', () => openAt(index)));
  closeBtn?.addEventListener('click', closeLightbox);
  prevBtn?.addEventListener('click', e => { e.stopPropagation(); showItem(currentIndex - 1); });
  nextBtn?.addEventListener('click', e => { e.stopPropagation(); showItem(currentIndex + 1); });
  lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', e => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') showItem(currentIndex - 1);
    if (e.key === 'ArrowRight') showItem(currentIndex + 1);
  });
  boxVideo?.addEventListener('ended', closeLightbox);
  lightbox.addEventListener('touchstart', e => { touchStartX = e.changedTouches[0].screenX; }, {passive:true});
  lightbox.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].screenX - touchStartX;
    if (Math.abs(dx) < 55 || currentIndex < 0) return;
    showItem(currentIndex + (dx < 0 ? 1 : -1));
  }, {passive:true});
  updateNav();
});