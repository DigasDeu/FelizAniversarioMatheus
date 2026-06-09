// ===============================
// UNIVERSO MATHEUS - SCRIPT GERAL
// ===============================

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

// TELAS
const loadingScreen = $("#loadingScreen");
const introScreen = $("#introScreen");
const lockScreen = $("#lockScreen");
const mainApp = $("#mainApp");

// LOADING
const loadingText = $("#loadingText");
const progressBar = $("#progressBar");

// INTRO
const introTitle = $("#introTitle");
const introText = $("#introText");
const openGiftBtn = $("#openGiftBtn");
const dontOpenBtn = $("#dontOpenBtn");

// SENHA
const passwordInput = $("#passwordInput");
const unlockBtn = $("#unlockBtn");
const passwordMessage = $("#passwordMessage");
const lockIcon = $("#lockIcon");

// APP
const mainTitle = $("#mainTitle");
const nameClickArea = $("#nameClickArea");
const mainSubtitle = $("#mainSubtitle");
const birthdayMessage = $("#birthdayMessage");
const authorName = $("#authorName");
const finalTitle = $("#finalTitle");
const finalText = $("#finalText");

// GALERIA
const photoWall = $("#photoWall");
const photoModal = $("#photoModal");
const modalImage = $("#modalImage");
const modalCaption = $("#modalCaption");
const closeModal = $("#closeModal");

// TIMELINE
const timelineList = $("#timelineList");

// CARTA
const envelope = $("#envelope");
const letterPaper = $("#letterPaper");
const letterText = $("#letterText");
const heartSecret = $("#heartSecret");

// PLAYER
const audioPlayer = $("#audioPlayer");
const musicCover = $("#musicCover");
const musicArtist = $("#musicArtist");
const musicTitle = $("#musicTitle");
const musicPhrase = $("#musicPhrase");
const prevMusic = $("#prevMusic");
const playMusic = $("#playMusic");
const nextMusic = $("#nextMusic");
const musicRange = $("#musicRange");
const currentTime = $("#currentTime");
const durationTime = $("#durationTime");
const miniMusicBtn = $("#miniMusicBtn");

// SURPRESAS
const secretOne = $("#secretOne");
const secretTwo = $("#secretTwo");
const secretThree = $("#secretThree");
const secretResult = $("#secretResult");

// FINAL
const restartBtn = $("#restartBtn");
const fireworksCanvas = $("#fireworks");

// OUTROS
const toast = $("#toast");
const confettiLayer = $("#confetti-layer");
const particlesContainer = $("#particles");

// ESTADOS
let passwordErrors = 0;
let nameClicks = 0;
let currentMusicIndex = 0;
let isPlaying = false;
let typingLetter = false;
let secretGiftShown = false;


// ===============================
// INICIALIZAÇÃO
// ===============================

document.addEventListener("DOMContentLoaded", () => {
  setupTexts();
  createParticles();
  startLoading();
  setupEvents();
  renderPhotos();
  renderTimeline();
  setupRevealAnimation();
  setupFireworks();
});


// ===============================
// TEXTOS DO CONFIG
// ===============================

function setupTexts() {
  mainTitle.textContent = SITE_CONFIG.textos.principalTitulo;
  nameClickArea.textContent = SITE_CONFIG.nome;
  mainSubtitle.textContent = SITE_CONFIG.textos.principalSubtitulo;

  birthdayMessage.textContent = SITE_CONFIG.textos.mensagemInicial;

  finalTitle.textContent = SITE_CONFIG.textos.finalTitulo;
  finalText.textContent = SITE_CONFIG.textos.finalTexto;

  authorName.textContent = SITE_CONFIG.autor;

  loadMusic(0);
}


// ===============================
// TROCAR TELAS
// ===============================

function showScreen(screen) {
  $$(".screen").forEach((item) => item.classList.remove("active"));
  screen.classList.add("active");
}

function openMainApp() {
  $$(".screen").forEach((item) => item.classList.remove("active"));
  mainApp.classList.add("active");
  document.body.style.overflow = "auto";

  showToast("Acesso permitido para: pessoa especial.");
  launchConfetti(70);

  setTimeout(() => {
    if (!secretGiftShown) {
      secretGiftShown = true;
      showToast("Ainda tem mais uma coisinha escondida por aqui...");
    }
  }, 9000);
}


// ===============================
// CARREGAMENTO
// ===============================

function startLoading() {
  let progress = 0;
  let textIndex = 0;

  loadingText.textContent = SITE_CONFIG.textos.carregamento[0];

  const interval = setInterval(() => {
    progress += 2;
    progressBar.style.width = `${progress}%`;

    if (progress % 25 === 0 && textIndex < SITE_CONFIG.textos.carregamento.length - 1) {
      textIndex++;
      loadingText.textContent = SITE_CONFIG.textos.carregamento[textIndex];
    }

    if (progress >= 100) {
      clearInterval(interval);

      setTimeout(() => {
        showScreen(introScreen);
        typeIntro();
      }, 700);
    }
  }, 55);
}


// ===============================
// ABERTURA COM DIGITAÇÃO
// ===============================

function typeText(element, text, speed = 45, callback = null) {
  element.textContent = "";
  let index = 0;

  const interval = setInterval(() => {
    element.textContent += text[index];
    index++;

    if (index >= text.length) {
      clearInterval(interval);
      if (callback) callback();
    }
  }, speed);
}

function typeIntro() {
  typeText(introTitle, SITE_CONFIG.textos.aberturaTitulo, 55, () => {
    setTimeout(() => {
      typeText(introText, SITE_CONFIG.textos.aberturaTexto, 28);
    }, 400);
  });
}


// ===============================
// EVENTOS PRINCIPAIS
// ===============================

function setupEvents() {
  openGiftBtn.addEventListener("click", () => {
    showScreen(lockScreen);
    passwordInput.focus();
  });

  dontOpenBtn.addEventListener("mouseenter", moveRunawayButton);
  dontOpenBtn.addEventListener("click", () => {
    moveRunawayButton();
    showToast("Nem tenta fugir kkk");
  });

  unlockBtn.addEventListener("click", checkPassword);

  passwordInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      checkPassword();
    }
  });

  $$("[data-section]").forEach((button) => {
    button.addEventListener("click", () => {
      const sectionId = button.getAttribute("data-section");
      scrollToSection(sectionId);
    });
  });

  nameClickArea.addEventListener("click", handleNameClick);

  envelope.addEventListener("click", openLetter);
  heartSecret.addEventListener("click", () => {
    showSecret(SITE_CONFIG.frasesSecretas[2]);
    launchConfetti(50);
  });

  closeModal.addEventListener("click", closePhotoModal);
  photoModal.addEventListener("click", (event) => {
    if (event.target === photoModal) closePhotoModal();
  });

  playMusic.addEventListener("click", toggleMusic);
  prevMusic.addEventListener("click", previousMusic);
  nextMusic.addEventListener("click", nextSong);
  miniMusicBtn.addEventListener("click", toggleMusic);

  musicRange.addEventListener("input", () => {
    audioPlayer.currentTime = musicRange.value;
  });

  audioPlayer.addEventListener("timeupdate", updateMusicProgress);
  audioPlayer.addEventListener("loadedmetadata", updateMusicProgress);
  audioPlayer.addEventListener("ended", nextSong);

  secretOne.addEventListener("click", () => {
    showSecret(SITE_CONFIG.frasesSecretas[1]);
  });

  secretTwo.addEventListener("click", () => {
    showSecret("Esse site foi feito para te arrancar pelo menos um sorriso.");
    launchConfetti(40);
  });

  secretThree.addEventListener("click", () => {
    showSecret(SITE_CONFIG.frasesSecretas[3]);
    launchConfetti(120);
  });

  restartBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    showToast("Voltando para o início do universo...");
  });

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closePhotoModal();
    }
  });
}


// ===============================
// BOTÃO FUGITIVO
// ===============================

function moveRunawayButton() {
  const maxX = window.innerWidth - dontOpenBtn.offsetWidth - 40;
  const maxY = window.innerHeight - dontOpenBtn.offsetHeight - 40;

  const randomX = Math.max(20, Math.floor(Math.random() * maxX));
  const randomY = Math.max(20, Math.floor(Math.random() * maxY));

  dontOpenBtn.style.position = "fixed";
  dontOpenBtn.style.left = `${randomX}px`;
  dontOpenBtn.style.top = `${randomY}px`;
  dontOpenBtn.style.zIndex = "2000";
}


// ===============================
// SENHA
// ===============================

function checkPassword() {
  const passwordTyped = passwordInput.value.trim();

  if (passwordTyped === SITE_CONFIG.senha) {
    passwordMessage.textContent = "Acesso liberado. Bem-vindo ao seu universo.";
    lockIcon.textContent = "🔓";

    unlockBtn.disabled = true;
    passwordInput.disabled = true;

    setTimeout(() => {
      openMainApp();
    }, 1100);

    return;
  }

  const message = SITE_CONFIG.frasesErroSenha[
    passwordErrors % SITE_CONFIG.frasesErroSenha.length
  ];

  passwordMessage.textContent = message;
  passwordErrors++;

  passwordInput.value = "";
  passwordInput.focus();

  lockScreen.querySelector(".phone-lock").animate(
    [
      { transform: "translateX(0)" },
      { transform: "translateX(-10px)" },
      { transform: "translateX(10px)" },
      { transform: "translateX(0)" }
    ],
    {
      duration: 250,
      easing: "ease"
    }
  );
}


// ===============================
// NAVEGAÇÃO
// ===============================

function scrollToSection(sectionId) {
  const section = document.getElementById(sectionId);

  if (!section) return;

  section.scrollIntoView({
    behavior: "smooth",
    block: "start"
  });

  if (sectionId === "final") {
    setTimeout(() => launchConfetti(130), 500);
  }
}


// ===============================
// CLIQUE NO NOME
// ===============================

function handleNameClick() {
  nameClicks++;

  if (nameClicks < 5) {
    showToast(`Clique secreto ${nameClicks}/5`);
  }

  if (nameClicks === 5) {
    showToast("Modo festa ativado!");
    launchConfetti(160);
    nameClicks = 0;
  }
}


// ===============================
// GALERIA POLAROID
// ===============================

function renderPhotos() {
  photoWall.innerHTML = "";

  SITE_CONFIG.fotos.forEach((photo, index) => {
    const card = document.createElement("button");
    card.className = "memory-polaroid reveal";

    const positions = [
      { left: "5%", top: "40px", rotate: "-9deg" },
      { left: "36%", top: "120px", rotate: "6deg" },
      { left: "68%", top: "30px", rotate: "10deg" },
      { left: "18%", top: "390px", rotate: "7deg" },
      { left: "54%", top: "430px", rotate: "-8deg" },
      { left: "75%", top: "360px", rotate: "4deg" }
    ];

    const pos = positions[index % positions.length];

    card.style.left = pos.left;
    card.style.top = pos.top;
    card.style.transform = `rotate(${pos.rotate})`;

    card.innerHTML = `
      <img src="${photo.arquivo}" alt="${photo.legenda}">
      <p>${photo.legenda}</p>
    `;

    card.addEventListener("click", () => {
      openPhotoModal(photo.arquivo, `Memória ${index + 1} desbloqueada — ${photo.legenda}`);
    });

    photoWall.appendChild(card);
  });
}

function openPhotoModal(src, caption) {
  modalImage.src = src;
  modalCaption.textContent = caption;
  photoModal.classList.add("active");
}

function closePhotoModal() {
  photoModal.classList.remove("active");
}


// ===============================
// LINHA DO TEMPO
// ===============================

function renderTimeline() {
  timelineList.innerHTML = "";

  SITE_CONFIG.linhaDoTempo.forEach((item) => {
    const timelineItem = document.createElement("div");
    timelineItem.className = "timeline-item reveal";

    timelineItem.innerHTML = `
      <div class="timeline-dot"></div>
      <div class="timeline-card">
        <h3>${item.titulo}</h3>
        <p>${item.texto}</p>
      </div>
    `;

    timelineList.appendChild(timelineItem);
  });
}


// ===============================
// CARTINHA
// ===============================

function openLetter() {
  if (typingLetter) return;

  typingLetter = true;
  envelope.classList.add("opened");
  letterPaper.classList.add("active");

  typeLetter(SITE_CONFIG.cartinha);
}

function typeLetter(text) {
  letterText.textContent = "";
  let index = 0;

  const interval = setInterval(() => {
    letterText.textContent += text[index];
    index++;

    if (index >= text.length) {
      clearInterval(interval);
      typingLetter = false;
      showToast("Mensagem guardada desbloqueada.");
    }
  }, 24);
}


// ===============================
// PLAYER MUSICAL
// ===============================

function loadMusic(index) {
  const music = SITE_CONFIG.musicas[index];

  if (!music) return;

  currentMusicIndex = index;

  audioPlayer.src = music.arquivo;
  musicCover.src = music.capa;
  musicArtist.textContent = music.artista;
  musicTitle.textContent = music.titulo;
  musicPhrase.textContent = music.frase;

  playMusic.textContent = "▶";
  miniMusicBtn.textContent = "♪";
  isPlaying = false;
}

function toggleMusic() {
  if (!audioPlayer.src) {
    loadMusic(0);
  }

  if (isPlaying) {
    audioPlayer.pause();
    playMusic.textContent = "▶";
    miniMusicBtn.textContent = "♪";
    isPlaying = false;
  } else {
    audioPlayer.play().then(() => {
      playMusic.textContent = "⏸";
      miniMusicBtn.textContent = "⏸";
      isPlaying = true;
    }).catch(() => {
      showToast("Clique novamente para tocar a música.");
    });
  }
}

function nextSong() {
  currentMusicIndex++;

  if (currentMusicIndex >= SITE_CONFIG.musicas.length) {
    currentMusicIndex = 0;
  }

  loadMusic(currentMusicIndex);
  audioPlayer.play().then(() => {
    playMusic.textContent = "⏸";
    miniMusicBtn.textContent = "⏸";
    isPlaying = true;
  });
}

function previousMusic() {
  currentMusicIndex--;

  if (currentMusicIndex < 0) {
    currentMusicIndex = SITE_CONFIG.musicas.length - 1;
  }

  loadMusic(currentMusicIndex);
  audioPlayer.play().then(() => {
    playMusic.textContent = "⏸";
    miniMusicBtn.textContent = "⏸";
    isPlaying = true;
  });
}

function updateMusicProgress() {
  if (!audioPlayer.duration) return;

  musicRange.max = Math.floor(audioPlayer.duration);
  musicRange.value = Math.floor(audioPlayer.currentTime);

  currentTime.textContent = formatTime(audioPlayer.currentTime);
  durationTime.textContent = formatTime(audioPlayer.duration);
}

function formatTime(seconds) {
  if (isNaN(seconds)) return "0:00";

  const min = Math.floor(seconds / 60);
  const sec = Math.floor(seconds % 60);

  return `${min}:${sec < 10 ? "0" + sec : sec}`;
}


// ===============================
// SURPRESAS
// ===============================

function showSecret(message) {
  secretResult.textContent = message;
  showToast("Segredo desbloqueado.");
}


// ===============================
// TOAST
// ===============================

let toastTimer;

function showToast(message) {
  clearTimeout(toastTimer);

  toast.textContent = message;
  toast.classList.add("active");

  toastTimer = setTimeout(() => {
    toast.classList.remove("active");
  }, 3000);
}


// ===============================
// CONFETES
// ===============================

function launchConfetti(amount = 80) {
  const colors = ["#d7ad52", "#ffe7a3", "#4f8f68", "#9ed8ad", "#fff7e8"];

  for (let i = 0; i < amount; i++) {
    const confetti = document.createElement("span");
    confetti.className = "confetti";

    confetti.style.left = `${Math.random() * 100}%`;
    confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
    confetti.style.animationDelay = `${Math.random() * 0.8}s`;
    confetti.style.transform = `rotate(${Math.random() * 360}deg)`;

    confettiLayer.appendChild(confetti);

    setTimeout(() => {
      confetti.remove();
    }, 4200);
  }
}


// ===============================
// PARTÍCULAS DE FUNDO
// ===============================

function createParticles() {
  for (let i = 0; i < 45; i++) {
    const particle = document.createElement("span");
    particle.className = "particle";

    particle.style.left = `${Math.random() * 100}%`;
    particle.style.animationDuration = `${8 + Math.random() * 14}s`;
    particle.style.animationDelay = `${Math.random() * 8}s`;
    particle.style.opacity = `${0.15 + Math.random() * 0.45}`;

    particlesContainer.appendChild(particle);
  }
}


// ===============================
// REVEAL AO ROLAR
// ===============================

function setupRevealAnimation() {
  setTimeout(() => {
    const revealElements = $$(".reveal");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      {
        threshold: 0.15
      }
    );

    revealElements.forEach((el) => observer.observe(el));
  }, 500);
}


// ===============================
// FOGOS DO FINAL
// ===============================

function setupFireworks() {
  if (!fireworksCanvas) return;

  const ctx = fireworksCanvas.getContext("2d");
  let w;
  let h;
  let fireworks = [];
  let particles = [];

  function resize() {
    w = fireworksCanvas.width = fireworksCanvas.offsetWidth;
    h = fireworksCanvas.height = fireworksCanvas.offsetHeight;
  }

  window.addEventListener("resize", resize);
  resize();

  function random(min, max) {
    return Math.random() * (max - min) + min;
  }

  function createFirework() {
    fireworks.push({
      x: random(80, w - 80),
      y: h,
      targetY: random(80, h * 0.45),
      speed: random(4, 7),
      color: `hsl(${random(35, 130)}, 80%, 65%)`
    });
  }

  function explode(firework) {
    for (let i = 0; i < 45; i++) {
      const angle = Math.PI * 2 * (i / 45);
      const speed = random(1.5, 5.5);

      particles.push({
        x: firework.x,
        y: firework.y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        alpha: 1,
        color: firework.color
      });
    }
  }

  function animate() {
    ctx.clearRect(0, 0, w, h);

    if (Math.random() < 0.035) {
      createFirework();
    }

    fireworks.forEach((firework, index) => {
      firework.y -= firework.speed;

      ctx.beginPath();
      ctx.arc(firework.x, firework.y, 3, 0, Math.PI * 2);
      ctx.fillStyle = firework.color;
      ctx.fill();

      if (firework.y <= firework.targetY) {
        explode(firework);
        fireworks.splice(index, 1);
      }
    });

    particles.forEach((particle, index) => {
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.vy += 0.035;
      particle.alpha -= 0.012;

      ctx.globalAlpha = particle.alpha;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, 2.2, 0, Math.PI * 2);
      ctx.fillStyle = particle.color;
      ctx.fill();
      ctx.globalAlpha = 1;

      if (particle.alpha <= 0) {
        particles.splice(index, 1);
      }
    });

    requestAnimationFrame(animate);
  }

  animate();
}