/* ============================================================
 AMU DIIII BIRTHDAY SURPRISE
 FINAL MOBILE + VERCEL FIXED SCRIPT
============================================================ */


/* ---------- Scene Navigation ---------- */

const SCENE_ORDER = [
"loading",
"welcome",
"cake",
"gift",
"gallery",
"message",
"final"
];


function goToScene(name){

    const target = document.getElementById(
        "section-" + name
    );


    if(!target) return;


    document
    .querySelectorAll(".journey-section")
    .forEach(section=>{

        section.classList.remove("active");

    });


    target.classList.add("active");


    updateJourneyDots(name);


    window.scrollTo({
        top:0,
        behavior:"smooth"
    });



    if(name==="final"){

        startFinaleEffects();

    }

}





function updateJourneyDots(name){

document
.querySelectorAll(".journey-dot")
.forEach(dot=>{

dot.classList.toggle(
"active",
dot.dataset.target===name
);

});

}





function initNavigation(){


document
.querySelectorAll(".journey-next")
.forEach(button=>{


button.addEventListener(
"click",
function(e){

e.preventDefault();

e.stopPropagation();


const target=this.dataset.target;


if(target){

goToScene(target);

}


},
{passive:false}

);



});



/* Dot navigation */


document
.querySelectorAll(".journey-dot")
.forEach(dot=>{


dot.addEventListener(
"click",
()=>{


goToScene(
dot.dataset.target
);


});


});


}





/* ---------- Ambient ---------- */


function initAmbient(){


const root=document.getElementById("ambient");


if(!root)return;



const stars=document.createElement("div");

stars.className="stars-bg";

root.appendChild(stars);




const moon=document.createElement("div");

moon.className="moon";

moon.textContent="🌙";

root.appendChild(moon);



}




/* ---------- Confetti ---------- */


function burstConfetti(count=80){


const root=document.getElementById(
"confettiRoot"
);


if(!root)return;



for(let i=0;i<count;i++){


const piece=document.createElement("div");


piece.className="confetti-piece";


piece.style.left=
Math.random()*100+"%";


piece.style.background=
[
"#ff6fae",
"#ffd166",
"#b98cff",
"#6fe8d0"
]
[
Math.floor(
Math.random()*4
)
];



piece.style.animationDuration=
(2+Math.random()*3)+"s";



root.appendChild(piece);



setTimeout(()=>{

piece.remove();

},5000);



}


}




/* ---------- Fireworks ---------- */


let canvas;
let ctx;
let particles=[];



function initFireworks(){


canvas=document.getElementById(
"fireworksCanvas"
);


if(!canvas)return;



ctx=canvas.getContext("2d");



function resize(){

canvas.width=
window.innerWidth;

canvas.height=
window.innerHeight;

}


resize();


window.addEventListener(
"resize",
resize
);



animateFireworks();



}





function animateFireworks(){


if(!ctx)return;


ctx.clearRect(
0,
0,
canvas.width,
canvas.height
);



particles.forEach(p=>{


p.x+=p.vx;

p.y+=p.vy;

p.alpha-=0.015;



ctx.globalAlpha=p.alpha;

ctx.fillStyle=p.color;


ctx.beginPath();

ctx.arc(
p.x,
p.y,
3,
0,
Math.PI*2
);


ctx.fill();



});



particles=
particles.filter(
p=>p.alpha>0
);



requestAnimationFrame(
animateFireworks
);


}




function createFirework(){


if(!canvas)return;


let x=Math.random()*canvas.width;

let y=Math.random()*300;



for(let i=0;i<40;i++){


let angle=
Math.PI*2*i/40;


particles.push({

x:x,

y:y,

vx:Math.cos(angle)*3,

vy:Math.sin(angle)*3,

alpha:1,

color:
"#"+Math.floor(
Math.random()*16777215
).toString(16)

});


}


}





function fireworksBurst(){


for(let i=0;i<6;i++){


setTimeout(
createFirework,
i*300
);


}



}






/* ---------- Loading ---------- */


function initLoadingCountdown(){


let count=3;


const el=document.getElementById(
"loadingCountdown"
);



if(!el)return;



let timer=setInterval(()=>{


count--;



if(count>0){


el.textContent=count;


el.style.animation="none";

void el.offsetWidth;


el.style.animation=
"countPulse 1s ease";


}


else{


clearInterval(timer);


el.textContent="🎉";



setTimeout(()=>{


goToScene(
"welcome"
);


},800);



}



},1000);



}





/* ---------- Cake ---------- */


function initCakeScene(){


const btn=document.getElementById(
"blowBtn"
);


if(!btn)return;



const flames=
document.querySelectorAll(
".flame"
);


const wish=
document.getElementById(
"wishText"
);


const next=
document.getElementById(
"cakeNextBtn"
);



btn.addEventListener(
"click",
()=>{


flames.forEach(
f=>f.classList.add("out")
);



wish.classList.remove(
"hidden"
);



next.classList.remove(
"hidden"
);



burstConfetti();

fireworksBurst();



}

);



}





/* ---------- Gift ---------- */


function initGiftScene(){


const btn=
document.getElementById(
"openGiftBtn"
);



if(!btn)return;



const box=
document.getElementById(
"giftBox"
);



const reveal=
document.getElementById(
"giftReveal"
);



const next=
document.getElementById(
"giftNextBtn"
);




btn.addEventListener(
"click",
()=>{


box.classList.add(
"open"
);



reveal.classList.remove(
"hidden"
);



next.classList.remove(
"hidden"
);



burstConfetti();



}

);



}






/* ---------- Gallery ---------- */


function initGalleryScene(){


const grid=
document.getElementById(
"galleryGrid"
);


if(!grid)return;



let images=[

"img1.jpg",

"img2.jpg",

"img4.jpg",

"img6.jpeg",

"img7.jpeg",

"img8.jpeg"

];



images.forEach(src=>{


let img=document.createElement(
"img"
);


img.src=src;


img.loading="lazy";


img.className="polaroid";


grid.appendChild(img);



});



}






/* ---------- Letter ---------- */


function initMessageScene(){


const envelope=
document.getElementById(
"envelope"
);



if(!envelope)return;



const letter=
document.getElementById(
"letterFull"
);



const next=
document.getElementById(
"messageNextBtn"
);




envelope.addEventListener(
"click",
()=>{


envelope.classList.add(
"open"
);



setTimeout(()=>{


letter.classList.remove(
"hidden"
);


next.classList.remove(
"hidden"
);


},700);



});



}






/* ---------- Music ---------- */


function initMusicPlayer(){


const audio=
document.getElementById(
"bgAudio"
);


const btn=
document.getElementById(
"playPauseBtn"
);



if(!audio||!btn)return;



btn.onclick=()=>{


if(audio.paused){


audio.play();


btn.textContent="⏸";


}

else{


audio.pause();


btn.textContent="▶";


}


};



}





/* ---------- Final ---------- */


let finalStarted=false;



function startFinaleEffects(){


if(finalStarted)return;


finalStarted=true;


fireworksBurst();


burstConfetti(150);


setInterval(
createFirework,
1200
);


}







/* ---------- Start ---------- */


document.addEventListener(
"DOMContentLoaded",
()=>{


initNavigation();

initAmbient();

initFireworks();

initLoadingCountdown();

initCakeScene();

initGiftScene();

initGalleryScene();

initMessageScene();

initMusicPlayer();



}
);