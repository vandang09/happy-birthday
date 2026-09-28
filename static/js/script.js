(() => {
  const config = window.BIRTHDAY_CONFIG || {};
  const opening = document.getElementById('welcome');
  const celebration = document.getElementById('celebration');
  const audio = document.getElementById('birthdayMusic');
  const musicToggle = document.getElementById('musicToggle');
  const musicMute = document.getElementById('musicMute');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const gallery = Array.isArray(config.gallery) ? config.gallery : [];
  const photos = Array.from(document.querySelectorAll('[data-gallery-index]'));
  const lightbox = document.getElementById('lightbox');
  const lightboxImage = document.getElementById('lightboxImage');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxCount = document.getElementById('lightboxCount');
  let currentPhoto = 0;
  let heartClicks = 0;
  let giftOpened = false;
  let candlesBlown = false;
  let confettiFrame = 0;

  function revealOnScroll() {
    const items = document.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window)) {
      items.forEach((item) => item.classList.add('is-visible'));
      return;
    }
    const observer = new IntersectionObserver((entries, currentObserver) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          currentObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -28px 0px' });
    items.forEach((item) => observer.observe(item));
  }

  function burstConfetti(amount = 105) {
    if (reduceMotion) return;
    const canvas = document.getElementById('confettiCanvas');
    const context = canvas.getContext('2d');
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    const palette = ['#dc6149', '#dda94d', '#526f52', '#e9a58c', '#8caa91', '#f4d78c'];
    const pieces = [];
    let startedAt = 0;
    let width = 0;
    let height = 0;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * pixelRatio;
      canvas.height = height * pixelRatio;
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    };
    resize();
    for (let index = 0; index < amount; index += 1) {
      pieces.push({
        x: width * (0.22 + Math.random() * 0.56),
        y: height * (0.18 + Math.random() * 0.22),
        size: 4 + Math.random() * 6,
        color: palette[index % palette.length],
        vx: (Math.random() - 0.5) * 7,
        vy: -3 - Math.random() * 6,
        rotation: Math.random() * 6,
        spin: (Math.random() - 0.5) * 0.18,
      });
    }

    window.cancelAnimationFrame(confettiFrame);
    const draw = (time) => {
      if (!startedAt) startedAt = time;
      context.clearRect(0, 0, width, height);
      pieces.forEach((piece) => {
        piece.x += piece.vx;
        piece.y += piece.vy;
        piece.vy += 0.12;
        piece.rotation += piece.spin;
        context.save();
        context.translate(piece.x, piece.y);
        context.rotate(piece.rotation);
        context.fillStyle = piece.color;
        context.fillRect(-piece.size / 2, -piece.size / 2, piece.size, piece.size * 1.45);
        context.restore();
      });
      if (time - startedAt < 2400) {
        confettiFrame = window.requestAnimationFrame(draw);
      } else {
        context.clearRect(0, 0, width, height);
      }
    };
    confettiFrame = window.requestAnimationFrame(draw);
  }

  function openCelebration() {
    opening.setAttribute('aria-hidden', 'true');
    celebration.inert = false;
    celebration.classList.add('is-open');
    opening.classList.add('is-leaving');
    document.body.classList.remove('is-locked');
    burstConfetti(115);
    window.setTimeout(() => {
      opening.hidden = true;
      document.getElementById('message').scrollIntoView({ behavior: reduceMotion ? 'instant' : 'smooth' });
    }, 760);
  }

  function escapeXml(value) {
    return String(value).replace(/[&<>"']/g, (character) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;',
    })[character]);
  }

  function fallbackImage(index) {
    const colors = [
      ['#d7dfcf', '#526f52'], ['#ead9c4', '#b98151'], ['#e8c9b9', '#dc6149'],
      ['#d4dfdc', '#476c69'], ['#e8dfbb', '#9d803b'], ['#e4d2d0', '#9d625a'],
    ];
    const [background, foreground] = colors[index % colors.length];
    const caption = escapeXml((gallery[index] && gallery[index].caption) || 'A birthday memory');
    const mark = ['✿', '☼', '♡', '✷', '❋', '✦'][index % 6];
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800"><rect width="800" height="800" fill="${background}"/><circle cx="400" cy="360" r="220" fill="none" stroke="${foreground}" stroke-opacity=".32" stroke-width="3"/><text x="400" y="425" fill="${foreground}" font-family="Georgia,serif" font-size="200" text-anchor="middle">${mark}</text><text x="400" y="690" fill="${foreground}" font-family="Georgia,serif" font-size="24" text-anchor="middle">${caption}</text></svg>`;
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  }

  photos.forEach((button) => {
    const image = button.querySelector('img');
    const index = Number(button.dataset.galleryIndex);
    image.addEventListener('load', () => image.classList.add('is-loaded'));
    image.addEventListener('error', () => {
      image.dataset.unavailable = 'true';
      image.classList.add('is-loaded');
      image.src = fallbackImage(index);
    }, { once: true });
    if (image.complete && image.naturalWidth > 0) image.classList.add('is-loaded');
    button.addEventListener('click', () => showPhoto(index));
  });

  function showPhoto(index) {
    if (!gallery.length) return;
    currentPhoto = (index + gallery.length) % gallery.length;
    const cardImage = photos[currentPhoto].querySelector('img');
    lightboxImage.alt = cardImage.alt;
    lightboxImage.onerror = () => {
      lightboxImage.onerror = null;
      lightboxImage.src = fallbackImage(currentPhoto);
    };
    lightboxImage.src = cardImage.dataset.unavailable === 'true'
      ? fallbackImage(currentPhoto)
      : cardImage.src;
    lightboxCaption.textContent = gallery[currentPhoto].caption;
    lightboxCount.textContent = `${String(currentPhoto + 1).padStart(2, '0')} / ${String(gallery.length).padStart(2, '0')}`;
    if (!lightbox.open) lightbox.showModal();
  }

  document.getElementById('openSurprise').addEventListener('click', openCelebration);
  document.getElementById('closeLightbox').addEventListener('click', () => lightbox.close());
  document.getElementById('previousPhoto').addEventListener('click', () => showPhoto(currentPhoto - 1));
  document.getElementById('nextPhoto').addEventListener('click', () => showPhoto(currentPhoto + 1));
  lightbox.addEventListener('click', (event) => {
    if (event.target === lightbox) lightbox.close();
  });
  lightbox.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') showPhoto(currentPhoto - 1);
    if (event.key === 'ArrowRight') showPhoto(currentPhoto + 1);
    if (event.key === 'Escape') {
      event.preventDefault();
      lightbox.close();
    }
  });

  document.getElementById('makeWish').addEventListener('click', (event) => {
    if (candlesBlown) return;
    candlesBlown = true;
    event.currentTarget.disabled = true;
    document.querySelector('.cake-scene').classList.add('blown');
    const result = document.getElementById('wishResult');
    result.hidden = false;
    result.textContent = 'Make a wish... ✨';
    window.setTimeout(() => {
      result.textContent = 'May all your wishes come true! ♥';
      burstConfetti(58);
    }, 1550);
  });

  document.getElementById('openGift').addEventListener('click', (event) => {
    if (giftOpened) return;
    giftOpened = true;
    event.currentTarget.classList.add('is-open');
    event.currentTarget.setAttribute('aria-expanded', 'true');
    const message = document.getElementById('giftMessage');
    message.hidden = false;
    burstConfetti(95);
  });

  const secretHeart = document.getElementById('secretHeart');
  const revealSecret = () => {
    heartClicks += 1;
    secretHeart.textContent = '♥'.repeat(Math.min(heartClicks, 5));
    if (heartClicks >= 5) document.getElementById('secretMessage').hidden = false;
  };
  secretHeart.addEventListener('click', revealSecret);
  secretHeart.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      revealSecret();
    }
  });

  musicToggle.addEventListener('click', async () => {
    if (audio.paused) {
      try {
        await audio.play();
        musicToggle.setAttribute('aria-pressed', 'true');
        musicToggle.setAttribute('aria-label', 'Pause birthday music');
        musicToggle.title = 'Pause birthday music';
      } catch {
        musicToggle.setAttribute('aria-label', 'Add birthday.mp3 to static/music to play music');
        musicToggle.title = 'Add birthday.mp3 to static/music to play music';
      }
    } else {
      audio.pause();
      musicToggle.setAttribute('aria-pressed', 'false');
      musicToggle.setAttribute('aria-label', 'Play birthday music');
      musicToggle.title = 'Play birthday music';
    }
  });

  musicMute.addEventListener('click', () => {
    audio.muted = !audio.muted;
    musicMute.setAttribute('aria-pressed', String(audio.muted));
    musicMute.setAttribute('aria-label', audio.muted ? 'Unmute birthday music' : 'Mute birthday music');
    musicMute.title = audio.muted ? 'Unmute birthday music' : 'Mute birthday music';
    musicMute.textContent = audio.muted ? '🔇' : '🔊';
  });

  audio.addEventListener('error', () => {
    musicToggle.setAttribute('aria-pressed', 'false');
    musicToggle.setAttribute('aria-label', 'Add birthday.mp3 to static/music to play music');
    musicToggle.title = 'Add birthday.mp3 to static/music to play music';
  });

  revealOnScroll();
})();
