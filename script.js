/* ==========================================================
script.js
PART 1 / ?
Premium Lite Birthday Website
========================================================== */

"use strict";

/* ==========================================================
ELEMENTS
========================================================== */

const screens = document.querySelectorAll(".screen");

const hero = document.getElementById("hero");
const giftSection = document.getElementById("giftSection");
const letterSection = document.getElementById("letterSection");
const gallerySection = document.getElementById("gallerySection");
const cakeSection = document.getElementById("cakeSection");
const finalSection = document.getElementById("finalSection");

const startBtn = document.getElementById("startBtn");
const giftBox = document.getElementById("giftBox");
const nextGallery = document.getElementById("nextGallery");
const cakeBtn = document.getElementById("cakeBtn");
const celebrateBtn = document.getElementById("celebrateBtn");
const restartBtn = document.getElementById("restartBtn");

const loader = document.getElementById("loader");

const bgMusic = document.getElementById("bgMusic");
const musicBtn = document.getElementById("musicBtn");
const musicIcon = document.getElementById("musicIcon");

const typewriter = document.getElementById("typewriter");

const galaxyCanvas = document.getElementById("galaxy");
const galaxyCtx = galaxyCanvas.getContext("2d");

const fireworksCanvas = document.getElementById("fireworksCanvas");
const fireworksCtx = fireworksCanvas.getContext("2d");

const confettiCanvas = document.getElementById("confettiCanvas");
const confettiCtx = confettiCanvas.getContext("2d");

/* ==========================================================
LETTER
========================================================== */

const birthdayLetter = `Dear Beautiful ❤️,

Happy Birthday!

Today is all about celebrating YOU.

Thank you for bringing happiness,
kindness and endless smiles
into everyone's life.

May every dream come true.

May every morning begin
with hope.

May every evening end
with peace.

May this year bring success,
love, health and unforgettable
memories.

Always keep smiling...

Happy Birthday once again. 🎂❤️`;

/* ==========================================================
HELPERS
========================================================== */

function showScreen(screen){

    screens.forEach(s=>{

        s.classList.remove("active");

    });

    screen.classList.add("active");

}

/* ==========================================================
LOADER
========================================================== */

window.addEventListener("load",()=>{

    setTimeout(()=>{

        loader.classList.add("hide");

        gsap.from(".hero-card",{

            y:80,
            opacity:0,
            duration:1.2,
            ease:"power3.out"

        });

    },1200);

});

/* ==========================================================
MUSIC
========================================================== */

let musicPlaying=false;

musicBtn.addEventListener("click",()=>{

    if(musicPlaying){

        bgMusic.pause();

        musicIcon.textContent="▶";

    }else{

        bgMusic.play();

        musicIcon.textContent="❚❚";

    }

    musicPlaying=!musicPlaying;

});

/* ==========================================================
START BUTTON
========================================================== */

startBtn.addEventListener("click",()=>{

    showScreen(giftSection);

    gsap.from("#giftBox",{

        scale:.5,
        opacity:0,
        rotation:180,
        duration:1,
        ease:"back.out(1.7)"

    });

});

/* ==========================================================
GIFT OPENING
========================================================== */

giftBox.addEventListener("click",()=>{

    giftBox.classList.add("open");

    gsap.to("#giftBox",{

        scale:1.15,
        duration:.4,
        yoyo:true,
        repeat:1

    });

    createConfetti();

    setTimeout(()=>{

        showScreen(letterSection);

        startTypewriter();

    },1800);

});
/* ==========================================================
script.js
PART 2 / ?
========================================================== */

/* ==========================================================
TYPEWRITER
========================================================== */

let typingIndex = 0;
let typingFinished = false;

function startTypewriter() {

    typewriter.textContent = "";
    typingIndex = 0;
    typingFinished = false;

    typeWriterLoop();

}

function typeWriterLoop() {

    if (typingIndex < birthdayLetter.length) {

        typewriter.textContent += birthdayLetter.charAt(typingIndex);

        typingIndex++;

        typewriter.scrollTop = typewriter.scrollHeight;

        setTimeout(typeWriterLoop, 35);

    } else {

        typingFinished = true;

        gsap.from("#nextGallery", {
            opacity: 0,
            y: 30,
            duration: .8,
            ease: "power2.out"
        });

    }

}

/* ==========================================================
LETTER -> GALLERY
========================================================== */

nextGallery.addEventListener("click", () => {

    showScreen(gallerySection);

    gsap.from(".photo", {

        opacity: 0,
        y: 80,
        stagger: .12,
        duration: .8,
        ease: "power3.out"

    });

});

/* ==========================================================
GALLERY -> CAKE
========================================================== */

cakeBtn.addEventListener("click", () => {

    showScreen(cakeSection);

    gsap.from(".cake", {

        scale: 0,
        rotation: 360,
        duration: 1.2,
        ease: "elastic.out(1,.5)"

    });

});

/* ==========================================================
CAKE -> FINAL
========================================================== */

celebrateBtn.addEventListener("click", () => {

    createFireworks();

    createConfetti();

    setTimeout(() => {

        showScreen(finalSection);

        gsap.from(".final-card", {

            opacity: 0,
            scale: .7,
            duration: 1,
            ease: "back.out(1.8)"

        });

        gsap.from(".wish-item", {

            opacity: 0,
            y: 40,
            stagger: .08,
            duration: .6

        });

    }, 1200);

});

/* ==========================================================
RESTART
========================================================== */

restartBtn.addEventListener("click", () => {

    location.reload();

});

/* ==========================================================
GSAP FLOATING EFFECT
========================================================== */

gsap.to(".heart", {

    y: -12,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut",
    duration: 1.2

});

gsap.to(".music-btn", {

    scale: 1.08,
    repeat: -1,
    yoyo: true,
    duration: 1

});

gsap.to(".particles span", {

    opacity: .9,
    stagger: .15,
    repeat: -1,
    yoyo: true,
    duration: 2

});
/* ==========================================================
script.js
PART 3 / ?
Galaxy Background + Confetti + Fireworks
========================================================== */

/* ==========================================================
CANVAS SIZE
========================================================== */

function resizeCanvas() {

    galaxyCanvas.width = window.innerWidth;
    galaxyCanvas.height = window.innerHeight;

    fireworksCanvas.width = window.innerWidth;
    fireworksCanvas.height = window.innerHeight;

    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;

}

resizeCanvas();

window.addEventListener("resize", resizeCanvas);

/* ==========================================================
GALAXY BACKGROUND
========================================================== */

const stars = [];

const STAR_COUNT = 220;

for (let i = 0; i < STAR_COUNT; i++) {

    stars.push({

        x: Math.random() * galaxyCanvas.width,

        y: Math.random() * galaxyCanvas.height,

        r: Math.random() * 2.2,

        speed: 0.2 + Math.random() * 0.7,

        alpha: Math.random()

    });

}

function drawGalaxy() {

    galaxyCtx.clearRect(
        0,
        0,
        galaxyCanvas.width,
        galaxyCanvas.height
    );

    for (const star of stars) {

        galaxyCtx.beginPath();

        galaxyCtx.fillStyle =
            `rgba(255,255,255,${star.alpha})`;

        galaxyCtx.arc(
            star.x,
            star.y,
            star.r,
            0,
            Math.PI * 2
        );

        galaxyCtx.fill();

        star.y += star.speed;

        if (star.y > galaxyCanvas.height) {

            star.y = -5;
            star.x = Math.random() * galaxyCanvas.width;

        }

    }

    requestAnimationFrame(drawGalaxy);

}

drawGalaxy();

/* ==========================================================
CONFETTI
========================================================== */

const confetti = [];

function createConfetti() {

    confetti.length = 0;

    for (let i = 0; i < 180; i++) {

        confetti.push({

            x: Math.random() * confettiCanvas.width,

            y: -20,

            size: 4 + Math.random() * 8,

            speed: 2 + Math.random() * 5,

            rotate: Math.random() * 360,

            color: [

                "#ff4d88",
                "#ffd54f",
                "#4fc3f7",
                "#8d6bff",
                "#ffffff"

            ][Math.floor(Math.random() * 5)]

        });

    }

}

function drawConfetti() {

    confettiCtx.clearRect(
        0,
        0,
        confettiCanvas.width,
        confettiCanvas.height
    );

    confetti.forEach((c) => {

        confettiCtx.save();

        confettiCtx.translate(c.x, c.y);

        confettiCtx.rotate(c.rotate);

        confettiCtx.fillStyle = c.color;

        confettiCtx.fillRect(
            -c.size / 2,
            -c.size / 2,
            c.size,
            c.size
        );

        confettiCtx.restore();

        c.y += c.speed;

        c.rotate += 0.08;

    });

    requestAnimationFrame(drawConfetti);

}

drawConfetti();
/* ==========================================================
script.js
PART 4 / FINAL
Fireworks + Mobile Fixes + Finish
========================================================== */

/* ==========================================================
FIREWORKS
========================================================== */

const fireworks = [];

function randomColor() {

    const colors = [
        "#ff4d88",
        "#ffd54f",
        "#4fc3f7",
        "#8d6bff",
        "#ffffff",
        "#7cffb2",
        "#ff8a65"
    ];

    return colors[Math.floor(Math.random() * colors.length)];

}

function createFireworks() {

    for (let i = 0; i < 10; i++) {

        const cx =
            Math.random() * fireworksCanvas.width;

        const cy =
            120 + Math.random() * (fireworksCanvas.height * 0.45);

        for (let j = 0; j < 40; j++) {

            const angle =
                (Math.PI * 2 * j) / 40;

            const speed =
                2 + Math.random() * 4;

            fireworks.push({

                x: cx,
                y: cy,

                dx: Math.cos(angle) * speed,
                dy: Math.sin(angle) * speed,

                life: 100,

                radius: 2 + Math.random() * 2,

                color: randomColor()

            });

        }

    }

}

function drawFireworks() {

    fireworksCtx.clearRect(
        0,
        0,
        fireworksCanvas.width,
        fireworksCanvas.height
    );

    for (let i = fireworks.length - 1; i >= 0; i--) {

        const p = fireworks[i];

        fireworksCtx.beginPath();

        fireworksCtx.fillStyle = p.color;

        fireworksCtx.arc(
            p.x,
            p.y,
            p.radius,
            0,
            Math.PI * 2
        );

        fireworksCtx.fill();

        p.x += p.dx;
        p.y += p.dy;

        p.dy += 0.03;

        p.life--;

        if (p.life <= 0) {

            fireworks.splice(i, 1);

        }

    }

    requestAnimationFrame(drawFireworks);

}

drawFireworks();

/* ==========================================================
MOBILE FRIENDLY
========================================================== */

[
    startBtn,
    giftBox,
    nextGallery,
    cakeBtn,
    celebrateBtn,
    restartBtn,
    musicBtn
].forEach((element) => {

    if (!element) return;

    element.style.touchAction = "manipulation";

    element.addEventListener(
        "touchstart",
        () => {},
        { passive: true }
    );

});

/* ==========================================================
AUTO PLAY MUSIC
========================================================== */

function startMusic() {

    if (musicPlaying) return;

    bgMusic.play()
        .then(() => {

            musicPlaying = true;
            musicIcon.textContent = "❚❚";

        })
        .catch(() => {});

}

document.addEventListener(
    "click",
    startMusic,
    { once: true }
);

document.addEventListener(
    "touchstart",
    startMusic,
    { once: true, passive: true }
);

/* ==========================================================
PREVENT DOUBLE TAP ZOOM
========================================================== */

let lastTouch = 0;

document.addEventListener(
    "touchend",
    (e) => {

        const now = Date.now();

        if (now - lastTouch <= 300) {

            e.preventDefault();

        }

        lastTouch = now;

    },
    { passive: false }
);

/* ==========================================================
END
========================================================== */

console.log(
    "🎂 Premium Lite Birthday Website Loaded Successfully ❤️"
);