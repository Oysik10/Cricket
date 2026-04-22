import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { makeCricketPitch, createPlayer } from './figure.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xa7dbf1); // Nicer Sky

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 12, 28);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.shadowMap.enabled = true;
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

scene.add(new THREE.AmbientLight(0xffffff, 0.5));
const sun = new THREE.DirectionalLight(0xffffff, 1.2);
sun.position.set(10, 20, 15);
sun.castShadow = true;
sun.shadow.camera.left = -20; sun.shadow.camera.right = 20;
sun.shadow.camera.top = 20; sun.shadow.camera.bottom = -20;
scene.add(sun);

const grassTex = new THREE.TextureLoader().load('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/terrain/grasslight-big.jpg');
grassTex.wrapS = grassTex.wrapT = THREE.RepeatWrapping;
grassTex.repeat.set(25, 25);
const ground = new THREE.Mesh(new THREE.PlaneGeometry(200, 200), new THREE.MeshStandardMaterial({ map: grassTex, color: 0x348C31 }));
ground.rotation.x = -Math.PI / 2;
ground.receiveShadow = true;
scene.add(ground);

const { group: pitch, ball } = makeCricketPitch({ pitchWidth: 4, pitchLength: 22, stumpHeight: 1.2, stumpColor: 0xffd700 });
scene.add(pitch);

const batsman = createPlayer(0xffffff); batsman.position.set(0, 0, 10); batsman.rotation.y = -Math.PI/1.2; scene.add(batsman);
const bowler = createPlayer(0xff3333); bowler.position.set(0, 0, -10); bowler.rotation.y = Math.PI; scene.add(bowler);

let score = 0;
let gameState = 'WAITING';
let currentOdds = {};
let ballVel = new THREE.Vector3();
let selectedShot = null;

function generateOdds() {
    currentOdds = {
        '0': { hit: 90 + Math.random() * 8, out: 1 + Math.random() * 2, pwr: 0.1 },
        '1': { hit: 70 + Math.random() * 20, out: 3 + Math.random() * 5, pwr: 0.4 },
        '4': { hit: 40 + Math.random() * 25, out: 10 + Math.random() * 15, pwr: 1.1 },
        '6': { hit: 20 + Math.random() * 25, out: 20 + Math.random() * 25, pwr: 1.7 }
    };
    updateHUD();
}

const ui = document.createElement('div');
ui.style.cssText = 'position:fixed; top:0; left:0; width:100%; height:100%; pointer-events:none; font-family:Arial; color:white;';
ui.innerHTML = `
    <div id="hud" style="padding:20px; font-size:32px; font-weight:bold; text-shadow:2px 2px 4px black;">Score: 0</div>
    <div id="odds-panel" style="position:absolute; right:20px; top:20px; background:rgba(0,0,0,0.8); padding:15px; border-radius:10px; border:2px solid #ffcc00;"></div>
    <div id="result-overlay" style="display:none; position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); background:white; color:black; padding:40px; border-radius:20px; text-align:center; box-shadow:0 0 50px rgba(0,0,0,0.5); min-width:300px;">
        <h1 id="res-title" style="margin:0; font-size:48px;">HIT!</h1>
        <p id="res-msg" style="font-size:24px;">A magnificent six!</p>
    </div>
`;
document.body.appendChild(ui);

function updateHUD() {
    document.getElementById('hud').innerText = `Score: ${score}`;
    let oddsHtml = `<b style="color:#ffcc00">SHOT ODDS</b><hr>`;
    for (let k in currentOdds) {
        oddsHtml += `<div>[${k}] Hit: ${currentOdds[k].hit.toFixed(0)}% | Risk: ${currentOdds[k].out.toFixed(0)}%</div>`;
    }
    document.getElementById('odds-panel').innerHTML = oddsHtml;
}

function showResult(title, msg, color) {
    const overlay = document.getElementById('result-overlay');
    document.getElementById('res-title').innerText = title;
    document.getElementById('res-title').style.color = color;
    document.getElementById('res-msg').innerText = msg;
    overlay.style.display = 'block';
    setTimeout(() => { if(title !== "GAME OVER") overlay.style.display = 'none'; }, 2000);
}

window.addEventListener('keydown', (e) => {
    if (gameState !== 'WAITING' || !currentOdds[e.key]) return;
    selectedShot = e.key;
    gameState = 'BOWLING';
    ball.visible = true;
    ball.position.set(0, 1.8, -10);
});

function animate() {
    requestAnimationFrame(animate);
    controls.update();

    if (gameState === 'BOWLING') {
        ball.position.z += 0.5;
        ball.position.y = Math.abs(Math.sin(ball.position.z * 0.4)) * 0.8 + 0.2;

        if (ball.position.z >= 9.8) {
            const chance = Math.random() * 100;
            const odds = currentOdds[selectedShot];
            if (chance < odds.out) {
                gameState = 'GAME_OVER';
                ballVel.set(0, 0, 0.2);
                showResult("GAME OVER", `Bowled! Final Score: ${score}`, "red");
                setTimeout(() => location.reload(), 4000);
            } else if (chance < odds.hit) {
                gameState = 'RESULT';
                const run = parseInt(selectedShot);
                score += run;
                ballVel.set((Math.random() - 0.5) * odds.pwr, odds.pwr * 0.5, -odds.pwr);
                showResult(run === 0 ? "DOT BALL" : run + " RUNS", "Great shot!", "#4CAF50");
            } else {
                gameState = 'RESULT';
                ballVel.set(0.2, 0, 0.5);
                showResult("MISS", "Swing and a miss!", "orange");
            }
        }
    }

    if (gameState === 'RESULT' || gameState === 'GAME_OVER') {
        ball.position.add(ballVel);
        ballVel.y -= 0.015;
        if (ball.position.y < 0.1) { ball.position.y = 0.1; ballVel.y *= -0.3; }
        if (ball.position.length() > 60 && gameState !== 'GAME_OVER') {
            gameState = 'WAITING';
            ball.visible = false;
            generateOdds();
        }
    }
    renderer.render(scene, camera);
}

generateOdds();
animate();