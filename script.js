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
  const boxImage = lightbox?.querySelector('.lightbox-image');
  const boxVideo = lightbox?.querySelector('.lightbox-video');
  const closeBtn = lightbox?.querySelector('.lightbox-close');

  function closeLightbox() {
    if (!lightbox) return;
    if (boxVideo) {
      boxVideo.pause();
      boxVideo.currentTime = 0;
      try { if (document.fullscreenElement) document.exitFullscreen(); } catch(e) {}
    }
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden','true');
    document.body.classList.remove('modal-open');
    if (boxImage) boxImage.removeAttribute('src');
    if (boxVideo) boxVideo.removeAttribute('src');
  }

  function openImage(src, alt) {
    if (!lightbox || !boxImage) return;
    if (boxVideo) boxVideo.style.display='none';
    boxImage.style.display='block';
    boxImage.src=src;
    boxImage.alt=alt || '';
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden','false');
    document.body.classList.add('modal-open');
  }

  async function openVideo(src) {
    if (!lightbox || !boxVideo) return;
    if (boxImage) boxImage.style.display='none';
    boxVideo.style.display='block';
    boxVideo.src=src;
    boxVideo.controls=true;
    boxVideo.loop=false;
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden','false');
    document.body.classList.add('modal-open');
    try {
      if (boxVideo.requestFullscreen) await boxVideo.requestFullscreen();
      else if (boxVideo.webkitEnterFullscreen) boxVideo.webkitEnterFullscreen();
    } catch(e) {}
    try { await boxVideo.play(); } catch(e) {}
  }

  document.querySelectorAll('[data-lightbox-image]').forEach(el => {
    el.addEventListener('click', () => openImage(el.dataset.lightboxImage, el.dataset.alt));
  });
  document.querySelectorAll('[data-lightbox-video]').forEach(el => {
    el.addEventListener('click', () => openVideo(el.dataset.lightboxVideo));
  });

  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  if (lightbox) lightbox.addEventListener('click', e => {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && lightbox?.classList.contains('open')) closeLightbox();
  });
  if (boxVideo) boxVideo.addEventListener('ended', closeLightbox);
});
