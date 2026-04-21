import * as THREE from 'https://cdn.skypack.dev/three@0.136.0';
import { OrbitControls } from 'https://cdn.skypack.dev/three@0.136.0/examples/jsm/controls/OrbitControls.js';
import { makeCricketPitch, createPlayer } from './figure.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb);

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 10, 25);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

const ambient = new THREE.AmbientLight(0xffffff, 0.7);
scene.add(ambient);
const sun = new THREE.DirectionalLight(0xffffff, 1.0);
sun.position.set(10, 20, 10);
scene.add(sun);

const groundGeom = new THREE.PlaneGeometry(500, 500);
const groundMat = new THREE.MeshStandardMaterial({ color: 0x348C31 }); // Strong Green
const ground = new THREE.Mesh(groundGeom, groundMat);
ground.rotation.x = -Math.PI / 2;
ground.position.y = -0.1;
scene.add(ground);

const pitchParams = { pitchWidth: 4, pitchLength: 22, pitchColor: 0xd2b28c, stumpHeight: 1.2, stumpColor: 0xffd700 };
const { group: pitch, ball } = makeCricketPitch(pitchParams);
scene.add(pitch);

const batsman = createPlayer(0xffffff); 
batsman.position.set(0, 0, 10);
scene.add(batsman);

const bowler = createPlayer(0xff3333); 
bowler.position.set(0, 0, -10);
bowler.rotation.y = Math.PI;
scene.add(bowler);

let score = 0;
let gameState = 'WAITING';
let currentOdds = {};
let ballVel = new THREE.Vector3();
let selectedShot = null;

function generateOdds() {
    currentOdds = {
        '0': { hit: 95, out: 2, pwr: 0.1 },
        '1': { hit: 85, out: 5, pwr: 0.4 },
        '4': { hit: 60, out: 15, pwr: 0.9 },
        '6': { hit: 40, out: 30, pwr: 1.5 }
    };
    updateUI();
}

const ui = document.createElement('div');
ui.style.cssText = 'position:fixed; top:0; left:0; width:100%; height:100%; pointer-events:none; color:white; font-family: sans-serif; text-shadow: 1px 1px 5px black;';
document.body.appendChild(ui);

function updateUI() {
    ui.innerHTML = `
        <div style="margin-top:20px; font-size: 24px;">Score: ${score}</div>
        <div style="font-size: 18px; color: #ffcc00;">${gameState === 'WAITING' ? 'Choose Shot: 0, 1, 4, 6' : 'Action!'}</div>
        <div style="position:absolute; right:20px; top:20px; background:rgba(0,0,0,0.6); padding:15px; border-radius:8px; text-align:left;">
            <b>Shot Odds (Next Ball):</b><hr>
            ${Object.keys(currentOdds).map(k => `[${k}] Hit: ${currentOdds[k].hit}% | Out: ${currentOdds[k].out}%`).join('<br>')}
        </div>
    `;
}

window.addEventListener('keydown', (e) => {
    if (gameState !== 'WAITING') return;
    if (currentOdds[e.key]) {
        selectedShot = e.key;
        gameState = 'BOWLING';
        ball.visible = true;
        ball.position.set(0, 1.5, -10);
        updateUI();
    }
});

function animate() {
    requestAnimationFrame(animate);
    controls.update();

    if (gameState === 'BOWLING') {
        ball.position.z += 0.45;
        ball.position.y = Math.abs(Math.sin(ball.position.z * 0.4)) * 0.7 + 0.2;

        if (ball.position.z >= 9.8) {
            const chance = Math.random() * 100;
            const odds = currentOdds[selectedShot];
            if (chance < odds.out) {
                gameState = 'OUT_RESULT';
                ballVel.set(0, 0, 0.2);
            } else if (chance < odds.hit) {
                gameState = 'HIT_RESULT';
                score += parseInt(selectedShot);
                ballVel.set((Math.random() - 0.5) * odds.pwr, odds.pwr * 0.5, -odds.pwr);
            } else {
                gameState = 'HIT_RESULT';
                ballVel.set(0.1, 0, 0.4); // Missed
            }
        }
    }

    if (gameState === 'HIT_RESULT' || gameState === 'OUT_RESULT') {
        ball.position.add(ballVel);
        ballVel.y -= 0.01; // Gravity
        if (ball.position.y < 0.1) { ball.position.y = 0.1; ballVel.y *= -0.4; }

        if (gameState === 'OUT_RESULT' && ball.position.z > 10.5) {
            alert("OUT! Clean Bowled. Final Score: " + score);
            location.reload();
        }

        if (ball.position.length() > 60) {
            gameState = 'WAITING';
            ball.visible = false;
            generateOdds();
        }
    }

    renderer.render(scene, camera);
}

generateOdds();
animate();