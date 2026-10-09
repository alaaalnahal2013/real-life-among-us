/* ================================================================
   VOXEL SOULS — game.js
   Minecraft-style voxel world + Dark Souls combat
   
   Systems: Voxel World Gen, Player Controller, Combat (stamina,
   dodge roll, lock-on, estus), Boss AI, Bonfire/Respawn, Particles
   ================================================================ */

// ─── CONSTANTS ──────────────────────────────────────────────────
const WORLD = {
    SIZE: 64,
    HEIGHT: 20,
    BLOCK: 1,
    ARENA_CENTER: { x: 32, z: 32 },
    ARENA_RADIUS: 18,
    TREE_COUNT: 30,
    BONFIRE_POS: { x: 32, y: 0, z: 15 }
};

const PLAYER = {
    MAX_HP: 100,
    MAX_STAMINA: 120,
    SPEED: 8,
    SPRINT_MULT: 1.6,
    DODGE_COST: 30,
    DODGE_SPEED: 18,
    DODGE_DURATION: 0.45,
    DODGE_IFRAMES: 0.3,
    ATTACK_COST: 20,
    ATTACK_DAMAGE: 12,
    ATTACK_RANGE: 3.0,
    ATTACK_DURATION: 0.5,
    STAMINA_REGEN: 35,
    STAMINA_REGEN_DELAY: 0.8,
    ESTUS_COUNT: 5,
    ESTUS_HEAL: 40,
    ESTUS_DURATION: 1.2,
    HEIGHT: 1.7,
    RADIUS: 0.4,
    GRAVITY: 25,
    JUMP_FORCE: 9
};

const BOSS = {
    MAX_HP: 500,
    PHASE2_HP: 250,
    SPEED: 4,
    AGGRO_RANGE: 22,
    ATTACK_RANGE: 3.5,
    ATTACK1_DAMAGE: 25,
    ATTACK2_DAMAGE: 35,
    SLAM_DAMAGE: 45,
    CHARGE_DAMAGE: 30,
    ATTACK_COOLDOWN: 2.0,
    SIZE: { w: 2.5, h: 4, d: 2.5 },
    SPAWN: { x: 32, y: 0, z: 48 }
};

// ─── PALETTE — earthy Minecraft-meets-Dark Souls ───────────────
const PALETTE = {
    grass_top:    0x4a7a3a,
    grass_side:   0x6b4e2a,
    dirt:         0x5c3d1e,
    stone:        0x6e6e6e,
    stone_dark:   0x4a4a4a,
    wood:         0x6b4226,
    leaves:       0x2d5a1e,
    leaves_dark:  0x1e3d12,
    sand:         0xc4a35a,
    water:        0x2980b9,
    bonfire:      0x4a3520,
    boss_body:    0x2c1a3d,
    boss_accent:  0x8b2020,
    boss_eye:     0xff3300,
    arena_stone:  0x3d3d3d,
    arena_brick:  0x5a4a3a,
    pillar:       0x7a6a5a
};

// ─── GLOBALS ────────────────────────────────────────────────────
let scene, camera, renderer, clock;
let player, boss, bonfire;
let worldBlocks = [];
let particles = [];
let gameState = 'title'; // title, playing, dead, victory
let inputState = {
    forward: false, backward: false, left: false, right: false,
    attack: false, dodge: false, lockOn: false, useEstus: false,
    interact: false, mouseX: 0, mouseY: 0, mouseDX: 0, mouseDY: 0
};
let isPointerLocked = false;
let minimapCtx;

// ─── DOM REFS ───────────────────────────────────────────────────
const DOM = {};

// ─── INIT ───────────────────────────────────────────────────────
window.addEventListener('DOMContentLoaded', () => {
    cacheDom();
    initThree();
    initInput();
    clock = new THREE.Clock();
    animate();

    DOM.startBtn.addEventListener('click', startGame);
    DOM.respawnBtn.addEventListener('click', respawnPlayer);
    DOM.restartBtn.addEventListener('click', restartGame);
});

function cacheDom() {
    DOM.container = document.getElementById('game-container');
    DOM.hud = document.getElementById('hud');
    DOM.titleScreen = document.getElementById('title-screen');
    DOM.deathScreen = document.getElementById('death-screen');
    DOM.victoryScreen = document.getElementById('victory-screen');
    DOM.loadingScreen = document.getElementById('loading-screen');
    DOM.healthBar = document.getElementById('health-bar');
    DOM.healthDamage = document.getElementById('health-bar-damage');
    DOM.healthText = document.getElementById('health-text');
    DOM.staminaBar = document.getElementById('stamina-bar');
    DOM.staminaText = document.getElementById('stamina-text');
    DOM.estusCount = document.getElementById('estus-count');
    DOM.bossContainer = document.getElementById('boss-bar-container');
    DOM.bossBar = document.getElementById('boss-bar');
    DOM.bossDamage = document.getElementById('boss-bar-damage');
    DOM.lockOnIndicator = document.getElementById('lock-on-indicator');
    DOM.interactionPrompt = document.getElementById('interaction-prompt');
    DOM.controlsHint = document.getElementById('controls-hint');
    DOM.minimap = document.getElementById('minimap');
    DOM.startBtn = document.getElementById('start-btn');
    DOM.respawnBtn = document.getElementById('respawn-btn');
    DOM.restartBtn = document.getElementById('restart-btn');
    minimapCtx = DOM.minimap.getContext('2d');
}

// ─── THREE.JS SETUP ────────────────────────────────────────────
function initThree() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0d0d15);
    scene.fog = new THREE.FogExp2(0x0d0d15, 0.018);

    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 200);
    camera.position.set(32, 10, 10);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.7;
    DOM.container.appendChild(renderer.domElement);

    // Lighting — moody, dark with warm fire accents
    const ambient = new THREE.AmbientLight(0x1a1a2e, 0.4);
    scene.add(ambient);

    const dirLight = new THREE.DirectionalLight(0x4a4a6a, 0.3);
    dirLight.position.set(-30, 40, -20);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.set(2048, 2048);
    dirLight.shadow.camera.near = 1;
    dirLight.shadow.camera.far = 100;
    dirLight.shadow.camera.left = -40;
    dirLight.shadow.camera.right = 40;
    dirLight.shadow.camera.top = 40;
    dirLight.shadow.camera.bottom = -40;
    scene.add(dirLight);

    // Hemisphere for subtle sky/ground ambient
    const hemi = new THREE.HemisphereLight(0x1a1a3e, 0x2d1a0a, 0.2);
    scene.add(hemi);

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

// ─── INPUT ──────────────────────────────────────────────────────
function initInput() {
    document.addEventListener('keydown', (e) => {
        if (gameState !== 'playing') return;
        switch (e.code) {
            case 'KeyW': inputState.forward = true; break;
            case 'KeyS': inputState.backward = true; break;
            case 'KeyA': inputState.left = true; break;
            case 'KeyD': inputState.right = true; break;
            case 'Space':
                e.preventDefault();
                if (!inputState.dodge) { inputState.dodge = true; }
                break;
            case 'Tab':
                e.preventDefault();
                inputState.lockOn = true;
                break;
            case 'KeyR': inputState.useEstus = true; break;
            case 'KeyE': inputState.interact = true; break;
        }
    });

    document.addEventListener('keyup', (e) => {
        switch (e.code) {
            case 'KeyW': inputState.forward = false; break;
            case 'KeyS': inputState.backward = false; break;
            case 'KeyA': inputState.left = false; break;
            case 'KeyD': inputState.right = false; break;
        }
    });

    document.addEventListener('mousedown', (e) => {
        if (gameState !== 'playing') return;
        if (e.button === 0) {
            if (!isPointerLocked) {
                DOM.container.requestPointerLock();
                return;
            }
            inputState.attack = true;
        }
    });

    document.addEventListener('mousemove', (e) => {
        if (!isPointerLocked) return;
        inputState.mouseDX += e.movementX;
        inputState.mouseDY += e.movementY;
    });

    document.addEventListener('pointerlockchange', () => {
        isPointerLocked = document.pointerLockElement === DOM.container;
    });
}

// ─── SIMPLE NOISE (value noise for terrain) ─────────────────────
function hashXZ(x, z) {
    let h = x * 374761393 + z * 668265263 + 1234567;
    h = (h ^ (h >> 13)) * 1274126177;
    h = h ^ (h >> 16);
    return (h & 0x7fffffff) / 0x7fffffff;
}

function smoothNoise(x, z) {
    const ix = Math.floor(x), iz = Math.floor(z);
    const fx = x - ix, fz = z - iz;
    const sx = fx * fx * (3 - 2 * fx);
    const sz = fz * fz * (3 - 2 * fz);
    const n00 = hashXZ(ix, iz);
    const n10 = hashXZ(ix + 1, iz);
    const n01 = hashXZ(ix, iz + 1);
    const n11 = hashXZ(ix + 1, iz + 1);
    return n00 * (1 - sx) * (1 - sz) + n10 * sx * (1 - sz) + n01 * (1 - sx) * sz + n11 * sx * sz;
}

function terrainHeight(x, z) {
    // Arena area is flat
    const dx = x - WORLD.ARENA_CENTER.x;
    const dz = z - WORLD.ARENA_CENTER.z;
    const distFromCenter = Math.sqrt(dx * dx + dz * dz);
    if (distFromCenter < WORLD.ARENA_RADIUS + 3) {
        return 0;
    }
    let h = 0;
    h += smoothNoise(x * 0.06, z * 0.06) * 6;
    h += smoothNoise(x * 0.15, z * 0.15) * 3;
    h += smoothNoise(x * 0.3, z * 0.3) * 1;
    return Math.floor(h);
}

// ─── WORLD GENERATION ───────────────────────────────────────────
function generateWorld() {
    // Clear previous
    worldBlocks.forEach(b => scene.remove(b));
    worldBlocks = [];

    const geometries = {};
    const materials = {};

    function getBlockGeo() {
        if (!geometries.block) geometries.block = new THREE.BoxGeometry(1, 1, 1);
        return geometries.block;
    }

    function getMat(color) {
        if (!materials[color]) {
            materials[color] = new THREE.MeshLambertMaterial({ color });
        }
        return materials[color];
    }

    // Use instanced meshes for performance
    const blockData = []; // {x, y, z, color}

    for (let x = 0; x < WORLD.SIZE; x++) {
        for (let z = 0; z < WORLD.SIZE; z++) {
            const h = terrainHeight(x, z);
            const dx = x - WORLD.ARENA_CENTER.x;
            const dz = z - WORLD.ARENA_CENTER.z;
            const distFromCenter = Math.sqrt(dx * dx + dz * dz);
            const inArena = distFromCenter < WORLD.ARENA_RADIUS;
            const arenaEdge = distFromCenter < WORLD.ARENA_RADIUS + 3 && distFromCenter >= WORLD.ARENA_RADIUS;

            // Top block
            let topColor;
            if (inArena) {
                topColor = PALETTE.arena_stone;
            } else if (arenaEdge) {
                topColor = PALETTE.arena_brick;
            } else if (h > 4) {
                topColor = PALETTE.stone;
            } else {
                topColor = PALETTE.grass_top;
            }
            blockData.push({ x, y: h, z, color: topColor });

            // Fill below
            const fillDepth = inArena ? 2 : Math.min(3, h + 2);
            for (let d = 1; d <= fillDepth; d++) {
                const belowColor = d === 1 ? PALETTE.dirt : PALETTE.stone_dark;
                blockData.push({ x, y: h - d, z, color: belowColor });
            }

            // Arena wall pillars
            if (arenaEdge && (Math.floor(distFromCenter) % 4 === 0)) {
                for (let py = 1; py <= 5; py++) {
                    blockData.push({ x, y: py, z, color: PALETTE.pillar });
                }
            }
        }
    }

    // Group blocks by color for instanced rendering
    const colorGroups = {};
    blockData.forEach(b => {
        const key = b.color;
        if (!colorGroups[key]) colorGroups[key] = [];
        colorGroups[key].push(b);
    });

    Object.entries(colorGroups).forEach(([color, blocks]) => {
        const mesh = new THREE.InstancedMesh(getBlockGeo(), getMat(parseInt(color)), blocks.length);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        const dummy = new THREE.Object3D();
        blocks.forEach((b, i) => {
            dummy.position.set(b.x + 0.5, b.y + 0.5, b.z + 0.5);
            dummy.updateMatrix();
            mesh.setMatrixAt(i, dummy.matrix);
        });
        mesh.instanceMatrix.needsUpdate = true;
        scene.add(mesh);
        worldBlocks.push(mesh);
    });

    // Trees — outside arena
    for (let i = 0; i < WORLD.TREE_COUNT; i++) {
        const tx = Math.floor(Math.random() * WORLD.SIZE);
        const tz = Math.floor(Math.random() * WORLD.SIZE);
        const dx = tx - WORLD.ARENA_CENTER.x;
        const dz = tz - WORLD.ARENA_CENTER.z;
        if (Math.sqrt(dx * dx + dz * dz) < WORLD.ARENA_RADIUS + 5) continue;
        const th = terrainHeight(tx, tz);
        if (th < 0) continue;
        buildTree(tx, th + 1, tz);
    }

    // Arena structures — broken pillars
    for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 3) {
        const px = WORLD.ARENA_CENTER.x + Math.cos(angle) * (WORLD.ARENA_RADIUS - 3);
        const pz = WORLD.ARENA_CENTER.z + Math.sin(angle) * (WORLD.ARENA_RADIUS - 3);
        const pillarH = 3 + Math.floor(Math.random() * 4);
        for (let py = 1; py <= pillarH; py++) {
            const block = createBlock(Math.floor(px), py, Math.floor(pz), PALETTE.pillar);
            scene.add(block);
            worldBlocks.push(block);
        }
    }
}

function buildTree(x, baseY, z) {
    // Trunk
    const trunkH = 3 + Math.floor(Math.random() * 3);
    for (let y = 0; y < trunkH; y++) {
        const block = createBlock(x, baseY + y, z, PALETTE.wood);
        scene.add(block);
        worldBlocks.push(block);
    }
    // Leaves - sphere-ish
    const topY = baseY + trunkH;
    for (let lx = -2; lx <= 2; lx++) {
        for (let lz = -2; lz <= 2; lz++) {
            for (let ly = -1; ly <= 2; ly++) {
                const dist = Math.sqrt(lx * lx + lz * lz + ly * ly);
                if (dist <= 2.3 && Math.random() > 0.15) {
                    const leafColor = Math.random() > 0.4 ? PALETTE.leaves : PALETTE.leaves_dark;
                    const block = createBlock(x + lx, topY + ly, z + lz, leafColor);
                    scene.add(block);
                    worldBlocks.push(block);
                }
            }
        }
    }
}

function createBlock(x, y, z, color) {
    const geo = new THREE.BoxGeometry(1, 1, 1);
    const mat = new THREE.MeshLambertMaterial({ color });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(x + 0.5, y + 0.5, z + 0.5);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    return mesh;
}

// ─── BONFIRE ────────────────────────────────────────────────────
function createBonfire() {
    bonfire = new THREE.Group();
    bonfire.position.set(WORLD.BONFIRE_POS.x + 0.5, 1, WORLD.BONFIRE_POS.z + 0.5);

    // Stone base ring
    const baseGeo = new THREE.CylinderGeometry(1.2, 1.4, 0.4, 8);
    const baseMat = new THREE.MeshLambertMaterial({ color: PALETTE.bonfire });
    const base = new THREE.Mesh(baseGeo, baseMat);
    base.position.y = -0.3;
    bonfire.add(base);

    // Logs
    for (let i = 0; i < 4; i++) {
        const logGeo = new THREE.CylinderGeometry(0.1, 0.12, 1, 5);
        const logMat = new THREE.MeshLambertMaterial({ color: 0x4a2810 });
        const log = new THREE.Mesh(logGeo, logMat);
        const angle = (i / 4) * Math.PI * 2;
        log.position.set(Math.cos(angle) * 0.3, 0.1, Math.sin(angle) * 0.3);
        log.rotation.z = Math.PI / 4 + Math.random() * 0.5;
        log.rotation.y = angle;
        bonfire.add(log);
    }

    // Fire light
    const fireLight = new THREE.PointLight(0xff6600, 2, 15);
    fireLight.position.y = 1;
    fireLight.castShadow = true;
    bonfire.add(fireLight);
    bonfire.userData.light = fireLight;

    // Second warm light
    const warmLight = new THREE.PointLight(0xffaa33, 0.8, 10);
    warmLight.position.y = 0.5;
    bonfire.add(warmLight);
    bonfire.userData.warmLight = warmLight;

    scene.add(bonfire);
}

// ─── PLAYER ─────────────────────────────────────────────────────
function createPlayer() {
    player = {
        hp: PLAYER.MAX_HP,
        maxHp: PLAYER.MAX_HP,
        stamina: PLAYER.MAX_STAMINA,
        maxStamina: PLAYER.MAX_STAMINA,
        estus: PLAYER.ESTUS_COUNT,
        position: new THREE.Vector3(WORLD.BONFIRE_POS.x + 0.5, 2, WORLD.BONFIRE_POS.z - 2 + 0.5),
        velocity: new THREE.Vector3(),
        yaw: 0,
        pitch: 0,
        onGround: false,
        // States
        isAttacking: false,
        attackTimer: 0,
        isDodging: false,
        dodgeTimer: 0,
        dodgeDir: new THREE.Vector3(),
        isInvincible: false,
        isUsingEstus: false,
        estusTimer: 0,
        staminaRegenTimer: 0,
        lockedOn: false,
        // Combat timing
        attackCooldown: 0,
        hitCooldown: 0,
        comboCount: 0,
        // Model
        mesh: null,
        weaponMesh: null,
        // camera
        cameraDistance: 6,
        cameraHeight: 3,
    };

    // Player voxel body
    const bodyGroup = new THREE.Group();

    // Torso
    const torsoGeo = new THREE.BoxGeometry(0.7, 0.9, 0.5);
    const torsoMat = new THREE.MeshLambertMaterial({ color: 0x3a3a3a });
    const torso = new THREE.Mesh(torsoGeo, torsoMat);
    torso.position.y = 0.9;
    bodyGroup.add(torso);

    // Head
    const headGeo = new THREE.BoxGeometry(0.5, 0.5, 0.5);
    const headMat = new THREE.MeshLambertMaterial({ color: 0xc4956a });
    const head = new THREE.Mesh(headGeo, headMat);
    head.position.y = 1.6;
    bodyGroup.add(head);

    // Helmet
    const helmetGeo = new THREE.BoxGeometry(0.55, 0.3, 0.55);
    const helmetMat = new THREE.MeshLambertMaterial({ color: 0x5a5a5a });
    const helmet = new THREE.Mesh(helmetGeo, helmetMat);
    helmet.position.y = 1.75;
    bodyGroup.add(helmet);

    // Left arm
    const armGeo = new THREE.BoxGeometry(0.25, 0.8, 0.25);
    const armMat = new THREE.MeshLambertMaterial({ color: 0x3a3a3a });
    const leftArm = new THREE.Mesh(armGeo, armMat);
    leftArm.position.set(-0.5, 0.9, 0);
    bodyGroup.add(leftArm);

    // Right arm (weapon arm)
    const rightArm = new THREE.Mesh(armGeo.clone(), armMat.clone());
    rightArm.position.set(0.5, 0.9, 0);
    bodyGroup.add(rightArm);
    player.rightArm = rightArm;

    // Legs
    const legGeo = new THREE.BoxGeometry(0.28, 0.5, 0.3);
    const legMat = new THREE.MeshLambertMaterial({ color: 0x2a2a2a });
    const leftLeg = new THREE.Mesh(legGeo, legMat);
    leftLeg.position.set(-0.2, 0.25, 0);
    bodyGroup.add(leftLeg);
    const rightLeg = new THREE.Mesh(legGeo.clone(), legMat.clone());
    rightLeg.position.set(0.2, 0.25, 0);
    bodyGroup.add(rightLeg);
    player.leftLeg = leftLeg;
    player.rightLeg = rightLeg;

    // Sword
    const swordGroup = new THREE.Group();
    const bladeGeo = new THREE.BoxGeometry(0.08, 1.4, 0.15);
    const bladeMat = new THREE.MeshLambertMaterial({ color: 0xaaaaaa });
    const blade = new THREE.Mesh(bladeGeo, bladeMat);
    blade.position.y = 0.7;
    swordGroup.add(blade);
    const hiltGeo = new THREE.BoxGeometry(0.12, 0.25, 0.3);
    const hiltMat = new THREE.MeshLambertMaterial({ color: 0x6b4226 });
    const hilt = new THREE.Mesh(hiltGeo, hiltMat);
    swordGroup.add(hilt);
    swordGroup.position.set(0.5, 0.6, 0.3);
    bodyGroup.add(swordGroup);
    player.weaponMesh = swordGroup;

    bodyGroup.castShadow = true;
    bodyGroup.position.copy(player.position);
    scene.add(bodyGroup);
    player.mesh = bodyGroup;
}

// ─── BOSS ───────────────────────────────────────────────────────
function createBoss() {
    boss = {
        hp: BOSS.MAX_HP,
        maxHp: BOSS.MAX_HP,
        position: new THREE.Vector3(BOSS.SPAWN.x + 0.5, 1, BOSS.SPAWN.z + 0.5),
        velocity: new THREE.Vector3(),
        state: 'idle', // idle, chase, attack1, attack2, slam, charge, stagger, phase_transition
        stateTimer: 0,
        attackCooldown: BOSS.ATTACK_COOLDOWN,
        phase: 1,
        facingAngle: 0,
        mesh: null,
        hitCooldown: 0,
        isActive: false,
        staggerCount: 0,
        attackCombo: 0,
        targetAngle: 0,
        roarPlayed: false,
        // hit tracking
        lastAttackHit: false,
        attackHitbox: null,
    };

    const bossGroup = new THREE.Group();

    // Body — large blocky demon
    const bodyGeo = new THREE.BoxGeometry(2.5, 2.5, 2);
    const bodyMat = new THREE.MeshLambertMaterial({ color: PALETTE.boss_body });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.position.y = 2.5;
    bossGroup.add(body);

    // Shoulder pads
    const shoulderGeo = new THREE.BoxGeometry(0.8, 0.8, 0.8);
    const shoulderMat = new THREE.MeshLambertMaterial({ color: PALETTE.boss_accent });
    const leftShoulder = new THREE.Mesh(shoulderGeo, shoulderMat);
    leftShoulder.position.set(-1.5, 3.3, 0);
    bossGroup.add(leftShoulder);
    const rightShoulder = new THREE.Mesh(shoulderGeo.clone(), shoulderMat.clone());
    rightShoulder.position.set(1.5, 3.3, 0);
    bossGroup.add(rightShoulder);

    // Head
    const headGeo = new THREE.BoxGeometry(1.2, 1.0, 1.0);
    const headMat = new THREE.MeshLambertMaterial({ color: PALETTE.boss_body });
    const head = new THREE.Mesh(headGeo, headMat);
    head.position.y = 4.2;
    bossGroup.add(head);
    boss.headMesh = head;

    // Horns
    const hornGeo = new THREE.ConeGeometry(0.15, 0.8, 4);
    const hornMat = new THREE.MeshLambertMaterial({ color: 0x4a3020 });
    const leftHorn = new THREE.Mesh(hornGeo, hornMat);
    leftHorn.position.set(-0.4, 4.8, 0);
    leftHorn.rotation.z = 0.3;
    bossGroup.add(leftHorn);
    const rightHorn = new THREE.Mesh(hornGeo.clone(), hornMat.clone());
    rightHorn.position.set(0.4, 4.8, 0);
    rightHorn.rotation.z = -0.3;
    bossGroup.add(rightHorn);

    // Eyes — glowing
    const eyeGeo = new THREE.BoxGeometry(0.2, 0.15, 0.1);
    const eyeMat = new THREE.MeshBasicMaterial({ color: PALETTE.boss_eye });
    const leftEye = new THREE.Mesh(eyeGeo, eyeMat);
    leftEye.position.set(-0.3, 4.3, 0.55);
    bossGroup.add(leftEye);
    const rightEye = new THREE.Mesh(eyeGeo.clone(), eyeMat.clone());
    rightEye.position.set(0.3, 4.3, 0.55);
    bossGroup.add(rightEye);

    // Arms
    const armGeo = new THREE.BoxGeometry(0.7, 2, 0.7);
    const armMat = new THREE.MeshLambertMaterial({ color: PALETTE.boss_body });
    const leftArm = new THREE.Mesh(armGeo, armMat);
    leftArm.position.set(-1.7, 1.8, 0);
    bossGroup.add(leftArm);
    boss.leftArm = leftArm;
    const rightArm = new THREE.Mesh(armGeo.clone(), armMat.clone());
    rightArm.position.set(1.7, 1.8, 0);
    bossGroup.add(rightArm);
    boss.rightArm = rightArm;

    // Weapon — giant mace
    const maceShaft = new THREE.BoxGeometry(0.2, 2.5, 0.2);
    const maceMat = new THREE.MeshLambertMaterial({ color: 0x3a2a1a });
    const shaft = new THREE.Mesh(maceShaft, maceMat);
    shaft.position.set(1.9, 0.5, 0.5);
    bossGroup.add(shaft);
    const maceHead = new THREE.BoxGeometry(0.8, 0.8, 0.8);
    const maceHeadMat = new THREE.MeshLambertMaterial({ color: 0x5a5a5a });
    const mHead = new THREE.Mesh(maceHead, maceHeadMat);
    mHead.position.set(1.9, -0.5, 0.5);
    bossGroup.add(mHead);
    boss.weapon = shaft;

    // Boss glow light
    const bossLight = new THREE.PointLight(0xff2200, 0.8, 8);
    bossLight.position.y = 3;
    bossGroup.add(bossLight);
    boss.glowLight = bossLight;

    // Legs
    const legGeo = new THREE.BoxGeometry(0.8, 1.2, 0.8);
    const legMat = new THREE.MeshLambertMaterial({ color: 0x1a0d2e });
    const leftLeg = new THREE.Mesh(legGeo, legMat);
    leftLeg.position.set(-0.7, 0.6, 0);
    bossGroup.add(leftLeg);
    const rightLeg = new THREE.Mesh(legGeo.clone(), legMat.clone());
    rightLeg.position.set(0.7, 0.6, 0);
    bossGroup.add(rightLeg);
    boss.leftLeg = leftLeg;
    boss.rightLeg = rightLeg;

    bossGroup.position.copy(boss.position);
    bossGroup.castShadow = true;
    scene.add(bossGroup);
    boss.mesh = bossGroup;
}

// ─── GAME STATE MANAGEMENT ──────────────────────────────────────
function startGame() {
    DOM.titleScreen.classList.add('hidden');
    DOM.loadingScreen.classList.remove('hidden');

    setTimeout(() => {
        generateWorld();
        createBonfire();
        createPlayer();
        createBoss();

        DOM.loadingScreen.classList.add('hidden');
        DOM.hud.classList.remove('hidden');
        gameState = 'playing';

        DOM.container.requestPointerLock();
    }, 100);
}

function respawnPlayer() {
    DOM.deathScreen.classList.add('hidden');
    player.hp = player.maxHp;
    player.stamina = player.maxStamina;
    player.estus = PLAYER.ESTUS_COUNT;
    player.position.set(WORLD.BONFIRE_POS.x + 0.5, 2, WORLD.BONFIRE_POS.z - 2 + 0.5);
    player.velocity.set(0, 0, 0);
    player.isAttacking = false;
    player.isDodging = false;
    player.isUsingEstus = false;
    player.isInvincible = false;
    player.attackTimer = 0;
    player.dodgeTimer = 0;
    player.lockedOn = false;
    DOM.lockOnIndicator.classList.add('hidden');

    // Reset boss
    boss.hp = boss.maxHp;
    boss.state = 'idle';
    boss.stateTimer = 0;
    boss.phase = 1;
    boss.isActive = false;
    boss.roarPlayed = false;
    boss.staggerCount = 0;
    boss.position.set(BOSS.SPAWN.x + 0.5, 1, BOSS.SPAWN.z + 0.5);
    boss.mesh.position.copy(boss.position);
    DOM.bossContainer.classList.add('hidden');

    gameState = 'playing';
    DOM.container.requestPointerLock();
}

function restartGame() {
    DOM.victoryScreen.classList.add('hidden');
    respawnPlayer();
}

function playerDied() {
    gameState = 'dead';
    document.exitPointerLock();
    DOM.deathScreen.classList.remove('hidden');
}

function bossDefeated() {
    gameState = 'victory';
    document.exitPointerLock();
    setTimeout(() => {
        DOM.victoryScreen.classList.remove('hidden');
    }, 1500);
}

// ─── COLLISION ──────────────────────────────────────────────────
function getTerrainHeightAt(x, z) {
    const bx = Math.floor(x);
    const bz = Math.floor(z);
    if (bx < 0 || bx >= WORLD.SIZE || bz < 0 || bz >= WORLD.SIZE) return -10;
    return terrainHeight(bx, bz) + 1; // top of block
}

function isBlocked(x, y, z) {
    const bx = Math.floor(x);
    const bz = Math.floor(z);
    if (bx < 0 || bx >= WORLD.SIZE || bz < 0 || bz >= WORLD.SIZE) return true;
    const groundH = terrainHeight(bx, bz) + 1;
    return y < groundH;
}

// ─── PLAYER UPDATE ──────────────────────────────────────────────
function updatePlayer(dt) {
    if (gameState !== 'playing') return;
    const p = player;

    // --- Mouse look ---
    const sensitivity = 0.002;
    p.yaw -= inputState.mouseDX * sensitivity;
    p.pitch -= inputState.mouseDY * sensitivity;
    p.pitch = Math.max(-1.2, Math.min(1.2, p.pitch));
    inputState.mouseDX = 0;
    inputState.mouseDY = 0;

    // --- Stamina regen ---
    p.staminaRegenTimer = Math.max(0, p.staminaRegenTimer - dt);
    if (p.staminaRegenTimer <= 0 && !p.isAttacking && !p.isDodging) {
        p.stamina = Math.min(p.maxStamina, p.stamina + PLAYER.STAMINA_REGEN * dt);
    }

    // --- Cooldowns ---
    p.attackCooldown = Math.max(0, p.attackCooldown - dt);
    p.hitCooldown = Math.max(0, p.hitCooldown - dt);

    // --- Estus healing ---
    if (inputState.useEstus && !p.isUsingEstus && !p.isDodging && !p.isAttacking && p.estus > 0 && p.hp < p.maxHp) {
        p.isUsingEstus = true;
        p.estusTimer = PLAYER.ESTUS_DURATION;
        p.estus--;
        spawnParticles(p.position.x, p.position.y + 1, p.position.z, 0xff8800, 15, 0.5);
    }
    inputState.useEstus = false;

    if (p.isUsingEstus) {
        p.estusTimer -= dt;
        p.hp = Math.min(p.maxHp, p.hp + (PLAYER.ESTUS_HEAL / PLAYER.ESTUS_DURATION) * dt);
        if (p.estusTimer <= 0) {
            p.isUsingEstus = false;
        }
    }

    // --- Dodge roll ---
    if (inputState.dodge && !p.isDodging && !p.isAttacking && !p.isUsingEstus && p.stamina >= PLAYER.DODGE_COST) {
        p.isDodging = true;
        p.dodgeTimer = PLAYER.DODGE_DURATION;
        p.stamina -= PLAYER.DODGE_COST;
        p.staminaRegenTimer = PLAYER.STAMINA_REGEN_DELAY;
        p.isInvincible = true;

        // Dodge direction: use movement input or backward
        const dir = new THREE.Vector3();
        if (inputState.forward) dir.z -= 1;
        if (inputState.backward) dir.z += 1;
        if (inputState.left) dir.x -= 1;
        if (inputState.right) dir.x += 1;
        if (dir.length() < 0.01) dir.z += 1; // default: backward

        // Rotate by camera yaw
        const cos = Math.cos(p.yaw);
        const sin = Math.sin(p.yaw);
        const rx = dir.x * cos + dir.z * sin;
        const rz = -dir.x * sin + dir.z * cos;
        p.dodgeDir.set(rx, 0, rz).normalize();

        spawnParticles(p.position.x, p.position.y + 0.5, p.position.z, 0x888888, 8, 0.3);
    }
    inputState.dodge = false;

    if (p.isDodging) {
        p.dodgeTimer -= dt;
        p.position.x += p.dodgeDir.x * PLAYER.DODGE_SPEED * dt;
        p.position.z += p.dodgeDir.z * PLAYER.DODGE_SPEED * dt;
        if (p.dodgeTimer <= PLAYER.DODGE_DURATION - PLAYER.DODGE_IFRAMES) {
            p.isInvincible = false;
        }
        if (p.dodgeTimer <= 0) {
            p.isDodging = false;
            p.isInvincible = false;
        }
    }

    // --- Attack ---
    if (inputState.attack && !p.isAttacking && !p.isDodging && !p.isUsingEstus && p.attackCooldown <= 0 && p.stamina >= PLAYER.ATTACK_COST) {
        p.isAttacking = true;
        p.attackTimer = PLAYER.ATTACK_DURATION;
        p.stamina -= PLAYER.ATTACK_COST;
        p.staminaRegenTimer = PLAYER.STAMINA_REGEN_DELAY;
        p.attackCooldown = PLAYER.ATTACK_DURATION + 0.1;
        p.comboCount = (p.comboCount + 1) % 3;

        // Check boss hit at attack midpoint
        setTimeout(() => {
            if (boss && boss.hp > 0) {
                const dist = p.position.distanceTo(boss.position);
                if (dist < PLAYER.ATTACK_RANGE + 1.5) {
                    const dmg = PLAYER.ATTACK_DAMAGE + (p.comboCount === 2 ? 5 : 0);
                    damageBoss(dmg);
                }
            }
        }, PLAYER.ATTACK_DURATION * 400);
    }
    inputState.attack = false;

    if (p.isAttacking) {
        p.attackTimer -= dt;
        // Sword swing animation
        const swing = Math.sin((1 - p.attackTimer / PLAYER.ATTACK_DURATION) * Math.PI);
        if (p.weaponMesh) {
            p.weaponMesh.rotation.x = -swing * 1.8;
            p.weaponMesh.rotation.z = swing * 0.3 * (p.comboCount === 1 ? -1 : 1);
        }
        if (p.attackTimer <= 0) {
            p.isAttacking = false;
            if (p.weaponMesh) {
                p.weaponMesh.rotation.x = 0;
                p.weaponMesh.rotation.z = 0;
            }
        }
    }

    // --- Lock-on ---
    if (inputState.lockOn) {
        if (boss && boss.hp > 0 && boss.isActive) {
            p.lockedOn = !p.lockedOn;
            DOM.lockOnIndicator.classList.toggle('hidden', !p.lockedOn);
        }
        inputState.lockOn = false;
    }

    // --- Movement (not during dodge/estus) ---
    if (!p.isDodging && !p.isUsingEstus) {
        const moveDir = new THREE.Vector3();
        if (inputState.forward) moveDir.z -= 1;
        if (inputState.backward) moveDir.z += 1;
        if (inputState.left) moveDir.x -= 1;
        if (inputState.right) moveDir.x += 1;

        if (moveDir.length() > 0) {
            moveDir.normalize();
            // Rotate by camera yaw
            const cos = Math.cos(p.yaw);
            const sin = Math.sin(p.yaw);
            const rx = moveDir.x * cos + moveDir.z * sin;
            const rz = -moveDir.x * sin + moveDir.z * cos;

            const speed = p.isAttacking ? PLAYER.SPEED * 0.3 : PLAYER.SPEED;
            p.position.x += rx * speed * dt;
            p.position.z += rz * speed * dt;

            // Walking animation
            const walkT = performance.now() * 0.008;
            if (p.leftLeg) p.leftLeg.rotation.x = Math.sin(walkT) * 0.6;
            if (p.rightLeg) p.rightLeg.rotation.x = Math.sin(walkT + Math.PI) * 0.6;
        } else {
            if (p.leftLeg) p.leftLeg.rotation.x *= 0.85;
            if (p.rightLeg) p.rightLeg.rotation.x *= 0.85;
        }
    }

    // --- Gravity & ground collision ---
    p.velocity.y -= PLAYER.GRAVITY * dt;
    p.position.y += p.velocity.y * dt;

    const groundH = getTerrainHeightAt(p.position.x, p.position.z);
    if (p.position.y <= groundH) {
        p.position.y = groundH;
        p.velocity.y = 0;
        p.onGround = true;
    } else {
        p.onGround = false;
    }

    // Keep in world bounds
    p.position.x = Math.max(1, Math.min(WORLD.SIZE - 1, p.position.x));
    p.position.z = Math.max(1, Math.min(WORLD.SIZE - 1, p.position.z));

    // --- Lock-on camera adjust ---
    if (p.lockedOn && boss && boss.hp > 0) {
        const toBoss = new THREE.Vector3().subVectors(boss.position, p.position);
        const targetYaw = Math.atan2(-toBoss.x, -toBoss.z);
        // Smooth turn toward boss
        let yawDiff = targetYaw - p.yaw;
        while (yawDiff > Math.PI) yawDiff -= Math.PI * 2;
        while (yawDiff < -Math.PI) yawDiff += Math.PI * 2;
        p.yaw += yawDiff * 5 * dt;
    }

    // --- Update mesh ---
    p.mesh.position.copy(p.position);

    // Dodge roll visual
    if (p.isDodging) {
        const rollProgress = 1 - (p.dodgeTimer / PLAYER.DODGE_DURATION);
        p.mesh.rotation.x = Math.sin(rollProgress * Math.PI * 2) * 1.2;
    } else {
        p.mesh.rotation.x = 0;
    }

    // Face direction
    p.mesh.rotation.y = p.yaw + Math.PI;

    // --- Bonfire interaction ---
    const bonfireDist = p.position.distanceTo(bonfire.position);
    if (bonfireDist < 3) {
        DOM.interactionPrompt.classList.remove('hidden');
        if (inputState.interact) {
            p.hp = p.maxHp;
            p.stamina = p.maxStamina;
            p.estus = PLAYER.ESTUS_COUNT;
            spawnParticles(bonfire.position.x, bonfire.position.y + 1, bonfire.position.z, 0xff6600, 30, 1);
            inputState.interact = false;
        }
    } else {
        DOM.interactionPrompt.classList.add('hidden');
        inputState.interact = false;
    }

    // --- Camera ---
    updateCamera(dt);
}

function updateCamera(dt) {
    const p = player;
    // Third-person camera
    const camDist = p.cameraDistance;
    const camH = p.cameraHeight;

    const cx = p.position.x + Math.sin(p.yaw) * camDist * Math.cos(p.pitch);
    const cy = p.position.y + camH + Math.sin(p.pitch) * camDist * 0.5;
    const cz = p.position.z + Math.cos(p.yaw) * camDist * Math.cos(p.pitch);

    camera.position.lerp(new THREE.Vector3(cx, cy, cz), 8 * dt);

    const lookTarget = new THREE.Vector3(p.position.x, p.position.y + 1.5, p.position.z);
    camera.lookAt(lookTarget);
}

// ─── BOSS AI ────────────────────────────────────────────────────
function updateBoss(dt) {
    if (!boss || boss.hp <= 0) return;

    const b = boss;
    const distToPlayer = b.position.distanceTo(player.position);

    // Activate when player is close
    if (!b.isActive && distToPlayer < BOSS.AGGRO_RANGE) {
        b.isActive = true;
        DOM.bossContainer.classList.remove('hidden');
        if (!b.roarPlayed) {
            b.roarPlayed = true;
            b.state = 'roar';
            b.stateTimer = 2.0;
            spawnParticles(b.position.x, b.position.y + 3, b.position.z, 0xff2200, 30, 1);
        }
    }

    if (!b.isActive) return;

    b.hitCooldown = Math.max(0, b.hitCooldown - dt);
    b.attackCooldown = Math.max(0, b.attackCooldown - dt);
    b.stateTimer = Math.max(0, b.stateTimer - dt);

    // Face player
    const toPlayer = new THREE.Vector3().subVectors(player.position, b.position);
    toPlayer.y = 0;
    b.targetAngle = Math.atan2(toPlayer.x, toPlayer.z);
    let angleDiff = b.targetAngle - b.facingAngle;
    while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
    while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;

    const turnSpeed = b.state === 'charge' ? 1 : 4;
    b.facingAngle += angleDiff * turnSpeed * dt;

    // Phase transition
    if (b.phase === 1 && b.hp <= BOSS.PHASE2_HP) {
        b.phase = 2;
        b.state = 'phase_transition';
        b.stateTimer = 2.0;
        spawnParticles(b.position.x, b.position.y + 3, b.position.z, 0xff0000, 50, 2);
        if (b.glowLight) b.glowLight.intensity = 2.0;
    }

    // Boss state machine
    switch (b.state) {
        case 'roar':
            // Dramatic pause
            if (b.mesh) {
                b.mesh.scale.y = 1 + Math.sin(b.stateTimer * 10) * 0.05;
            }
            if (b.stateTimer <= 0) {
                b.state = 'chase';
            }
            break;

        case 'idle':
            if (distToPlayer < BOSS.AGGRO_RANGE) {
                b.state = 'chase';
            }
            break;

        case 'chase': {
            const speed = b.phase === 2 ? BOSS.SPEED * 1.4 : BOSS.SPEED;
            const dir = toPlayer.normalize();
            b.position.x += dir.x * speed * dt;
            b.position.z += dir.z * speed * dt;

            // Walking animation
            const walkT = performance.now() * 0.005;
            if (b.leftLeg) b.leftLeg.rotation.x = Math.sin(walkT) * 0.4;
            if (b.rightLeg) b.rightLeg.rotation.x = Math.sin(walkT + Math.PI) * 0.4;

            if (distToPlayer < BOSS.ATTACK_RANGE && b.attackCooldown <= 0) {
                // Choose attack
                const roll = Math.random();
                if (b.phase === 2 && roll < 0.25) {
                    b.state = 'slam';
                    b.stateTimer = 1.2;
                } else if (b.phase === 2 && roll < 0.45) {
                    b.state = 'charge';
                    b.stateTimer = 1.0;
                    b.chargeDir = toPlayer.clone().normalize();
                } else if (roll < 0.6) {
                    b.state = 'attack2';
                    b.stateTimer = 0.9;
                } else {
                    b.state = 'attack1';
                    b.stateTimer = 0.7;
                }
                b.lastAttackHit = false;
            } else if (distToPlayer > BOSS.AGGRO_RANGE * 1.5) {
                b.state = 'idle';
            }

            // Phase 2: sometimes charge from distance
            if (b.phase === 2 && distToPlayer > 8 && distToPlayer < 18 && b.attackCooldown <= 0 && Math.random() < 0.01) {
                b.state = 'charge';
                b.stateTimer = 1.5;
                b.chargeDir = toPlayer.clone().normalize();
            }
            break;
        }

        case 'attack1': {
            // Quick swing
            const progress = 1 - (b.stateTimer / 0.7);
            if (b.rightArm) {
                b.rightArm.rotation.x = Math.sin(progress * Math.PI) * -1.5;
            }
            // Hit at midpoint
            if (progress > 0.4 && progress < 0.6 && !b.lastAttackHit) {
                if (distToPlayer < BOSS.ATTACK_RANGE + 1 && !player.isInvincible) {
                    damagePlayer(BOSS.ATTACK1_DAMAGE);
                    b.lastAttackHit = true;
                }
            }
            if (b.stateTimer <= 0) {
                b.state = 'chase';
                b.attackCooldown = b.phase === 2 ? BOSS.ATTACK_COOLDOWN * 0.6 : BOSS.ATTACK_COOLDOWN;
                if (b.rightArm) b.rightArm.rotation.x = 0;
            }
            break;
        }

        case 'attack2': {
            // Heavy swing
            const progress = 1 - (b.stateTimer / 0.9);
            if (b.rightArm) {
                b.rightArm.rotation.x = Math.sin(progress * Math.PI) * -2.0;
                b.rightArm.rotation.z = Math.sin(progress * Math.PI) * 0.5;
            }
            if (progress > 0.5 && progress < 0.7 && !b.lastAttackHit) {
                if (distToPlayer < BOSS.ATTACK_RANGE + 1.5 && !player.isInvincible) {
                    damagePlayer(BOSS.ATTACK2_DAMAGE);
                    b.lastAttackHit = true;
                }
            }
            if (b.stateTimer <= 0) {
                b.state = 'chase';
                b.attackCooldown = b.phase === 2 ? BOSS.ATTACK_COOLDOWN * 0.7 : BOSS.ATTACK_COOLDOWN * 1.2;
                if (b.rightArm) {
                    b.rightArm.rotation.x = 0;
                    b.rightArm.rotation.z = 0;
                }
            }
            break;
        }

        case 'slam': {
            // Jump slam — phase 2 only
            const progress = 1 - (b.stateTimer / 1.2);
            if (progress < 0.5) {
                // Wind up — rise
                b.position.y = 1 + progress * 6;
                if (b.leftArm) b.leftArm.rotation.x = -progress * 3;
                if (b.rightArm) b.rightArm.rotation.x = -progress * 3;
            } else {
                // Slam down
                const slamProgress = (progress - 0.5) * 2;
                b.position.y = 1 + (1 - slamProgress) * 3;
                if (slamProgress > 0.8 && !b.lastAttackHit) {
                    // AOE damage
                    if (distToPlayer < 5 && !player.isInvincible) {
                        damagePlayer(BOSS.SLAM_DAMAGE);
                        b.lastAttackHit = true;
                    }
                    spawnParticles(b.position.x, 1, b.position.z, 0x888888, 30, 1);
                    spawnParticles(b.position.x, 1, b.position.z, 0xff4400, 20, 0.8);
                }
            }
            if (b.stateTimer <= 0) {
                b.state = 'chase';
                b.position.y = 1;
                b.attackCooldown = BOSS.ATTACK_COOLDOWN * 1.5;
                if (b.leftArm) b.leftArm.rotation.x = 0;
                if (b.rightArm) b.rightArm.rotation.x = 0;
            }
            break;
        }

        case 'charge': {
            // Bull rush
            const speed = BOSS.SPEED * 3;
            if (b.chargeDir) {
                b.position.x += b.chargeDir.x * speed * dt;
                b.position.z += b.chargeDir.z * speed * dt;
            }
            // Hit check
            if (distToPlayer < 2.5 && !player.isInvincible && !b.lastAttackHit) {
                damagePlayer(BOSS.CHARGE_DAMAGE);
                b.lastAttackHit = true;
            }
            if (b.stateTimer <= 0) {
                b.state = 'chase';
                b.attackCooldown = BOSS.ATTACK_COOLDOWN;
            }
            // Stay in arena
            const dx = b.position.x - WORLD.ARENA_CENTER.x;
            const dz = b.position.z - WORLD.ARENA_CENTER.z;
            if (Math.sqrt(dx * dx + dz * dz) > WORLD.ARENA_RADIUS - 1) {
                b.state = 'chase';
                b.attackCooldown = BOSS.ATTACK_COOLDOWN * 0.5;
            }
            break;
        }

        case 'stagger': {
            if (b.mesh) {
                b.mesh.rotation.z = Math.sin(b.stateTimer * 15) * 0.1;
            }
            if (b.stateTimer <= 0) {
                b.state = 'chase';
                if (b.mesh) b.mesh.rotation.z = 0;
            }
            break;
        }

        case 'phase_transition': {
            if (b.mesh) {
                b.mesh.scale.y = 1 + Math.sin(b.stateTimer * 8) * 0.1;
            }
            // Emit particles
            if (Math.random() < 0.3) {
                spawnParticles(
                    b.position.x + (Math.random() - 0.5) * 3,
                    b.position.y + Math.random() * 4,
                    b.position.z + (Math.random() - 0.5) * 3,
                    0xff2200, 5, 0.5
                );
            }
            if (b.stateTimer <= 0) {
                b.state = 'chase';
                if (b.mesh) b.mesh.scale.y = 1;
            }
            break;
        }
    }

    // Keep boss in arena
    const bdx = b.position.x - WORLD.ARENA_CENTER.x;
    const bdz = b.position.z - WORLD.ARENA_CENTER.z;
    const bDistCenter = Math.sqrt(bdx * bdx + bdz * bdz);
    if (bDistCenter > WORLD.ARENA_RADIUS - 2) {
        const pushAngle = Math.atan2(bdx, bdz);
        b.position.x = WORLD.ARENA_CENTER.x + Math.sin(pushAngle) * (WORLD.ARENA_RADIUS - 2);
        b.position.z = WORLD.ARENA_CENTER.z + Math.cos(pushAngle) * (WORLD.ARENA_RADIUS - 2);
    }

    // Ground collision for boss
    const bGroundH = getTerrainHeightAt(b.position.x, b.position.z);
    if (b.state !== 'slam' && b.position.y < bGroundH) {
        b.position.y = bGroundH;
    }

    // Update mesh
    b.mesh.position.copy(b.position);
    b.mesh.rotation.y = b.facingAngle;

    // Phase 2 visual — glow intensity
    if (b.phase === 2 && b.glowLight) {
        b.glowLight.intensity = 1.5 + Math.sin(performance.now() * 0.005) * 0.5;
        b.glowLight.color.setHex(0xff0000);
    }
}

// ─── DAMAGE SYSTEM ──────────────────────────────────────────────
function damagePlayer(amount) {
    if (player.hitCooldown > 0) return;
    player.hp -= amount;
    player.hitCooldown = 0.5;

    // Screen flash
    flashDamage();

    // Particles
    spawnParticles(player.position.x, player.position.y + 1, player.position.z, 0xcc0000, 12, 0.4);

    if (player.hp <= 0) {
        player.hp = 0;
        playerDied();
    }
}

function damageBoss(amount) {
    if (boss.hitCooldown > 0) return;
    boss.hp -= amount;
    boss.hitCooldown = 0.2;
    boss.staggerCount++;

    // Particles
    spawnParticles(
        boss.position.x + (Math.random() - 0.5) * 2,
        boss.position.y + 2 + Math.random() * 2,
        boss.position.z + (Math.random() - 0.5) * 2,
        0xdd8800, 10, 0.3
    );

    // Stagger after several hits
    if (boss.staggerCount >= 6 && boss.state !== 'stagger' && boss.state !== 'phase_transition') {
        boss.state = 'stagger';
        boss.stateTimer = 1.5;
        boss.staggerCount = 0;
    }

    // Flash boss red
    if (boss.mesh) {
        boss.mesh.traverse(child => {
            if (child.isMesh && child.material) {
                const orig = child.material.color.getHex();
                child.material.color.setHex(0xff4444);
                setTimeout(() => child.material.color.setHex(orig), 100);
            }
        });
    }

    if (boss.hp <= 0) {
        boss.hp = 0;
        bossDefeated();
        // Death animation — shrink & particles
        const deathInterval = setInterval(() => {
            if (boss.mesh) {
                boss.mesh.scale.multiplyScalar(0.95);
                spawnParticles(
                    boss.position.x + (Math.random() - 0.5) * 3,
                    boss.position.y + Math.random() * 4,
                    boss.position.z + (Math.random() - 0.5) * 3,
                    Math.random() > 0.5 ? 0xff6600 : 0xffaa00, 5, 0.5
                );
                if (boss.mesh.scale.x < 0.1) {
                    clearInterval(deathInterval);
                    scene.remove(boss.mesh);
                }
            }
        }, 50);
    }
}

function flashDamage() {
    const flash = document.getElementById('damage-flash');
    flash.style.opacity = '1';
    setTimeout(() => flash.style.opacity = '0', 100);
}

// ─── PARTICLES ──────────────────────────────────────────────────
function spawnParticles(x, y, z, color, count, spread) {
    for (let i = 0; i < count; i++) {
        const geo = new THREE.BoxGeometry(0.12, 0.12, 0.12);
        const mat = new THREE.MeshBasicMaterial({ color, transparent: true });
        const mesh = new THREE.Mesh(geo, mat);
        mesh.position.set(
            x + (Math.random() - 0.5) * spread,
            y + (Math.random() - 0.5) * spread,
            z + (Math.random() - 0.5) * spread
        );
        scene.add(mesh);
        particles.push({
            mesh,
            velocity: new THREE.Vector3(
                (Math.random() - 0.5) * 4,
                Math.random() * 3 + 1,
                (Math.random() - 0.5) * 4
            ),
            life: 0.5 + Math.random() * 0.8,
            maxLife: 0.5 + Math.random() * 0.8
        });
    }
}

function updateParticles(dt) {
    for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life -= dt;
        p.velocity.y -= 8 * dt;
        p.mesh.position.add(p.velocity.clone().multiplyScalar(dt));
        p.mesh.material.opacity = Math.max(0, p.life / p.maxLife);
        p.mesh.scale.setScalar(p.life / p.maxLife);

        if (p.life <= 0) {
            scene.remove(p.mesh);
            p.mesh.geometry.dispose();
            p.mesh.material.dispose();
            particles.splice(i, 1);
        }
    }
}

// ─── BONFIRE FIRE PARTICLES ─────────────────────────────────────
let fireTimer = 0;
function updateBonfireEffects(dt) {
    if (!bonfire) return;
    fireTimer += dt;
    if (fireTimer > 0.05) {
        fireTimer = 0;
        const bx = bonfire.position.x;
        const by = bonfire.position.y;
        const bz = bonfire.position.z;
        spawnParticles(
            bx + (Math.random() - 0.5) * 0.5,
            by + 0.3 + Math.random() * 0.3,
            bz + (Math.random() - 0.5) * 0.5,
            Math.random() > 0.5 ? 0xff6600 : 0xffaa00, 1, 0.2
        );
    }
    // Flicker bonfire light
    if (bonfire.userData.light) {
        bonfire.userData.light.intensity = 1.5 + Math.sin(performance.now() * 0.01) * 0.5 + Math.random() * 0.3;
    }
}

// ─── UI UPDATE ──────────────────────────────────────────────────
function updateUI() {
    if (gameState !== 'playing') return;

    const hpPct = (player.hp / player.maxHp) * 100;
    const stPct = (player.stamina / player.maxStamina) * 100;

    DOM.healthBar.style.width = hpPct + '%';
    DOM.healthDamage.style.width = hpPct + '%'; // follows with delay via CSS
    DOM.healthText.textContent = `${Math.ceil(player.hp)} / ${player.maxHp}`;

    DOM.staminaBar.style.width = stPct + '%';
    DOM.staminaText.textContent = `${Math.ceil(player.stamina)} / ${player.maxStamina}`;

    DOM.estusCount.textContent = player.estus;

    // Boss bar
    if (boss && boss.isActive && boss.hp > 0) {
        const bossPct = (boss.hp / boss.maxHp) * 100;
        DOM.bossBar.style.width = bossPct + '%';
        DOM.bossDamage.style.width = bossPct + '%';
    }

    // Lock-on indicator position
    if (player.lockedOn && boss && boss.hp > 0) {
        const bossScreenPos = new THREE.Vector3().copy(boss.position);
        bossScreenPos.y += 3;
        bossScreenPos.project(camera);
        const x = (bossScreenPos.x * 0.5 + 0.5) * window.innerWidth;
        const y = (-bossScreenPos.y * 0.5 + 0.5) * window.innerHeight;
        DOM.lockOnIndicator.style.left = x + 'px';
        DOM.lockOnIndicator.style.top = y + 'px';
    }

    // Minimap
    drawMinimap();
}

function drawMinimap() {
    const ctx = minimapCtx;
    const w = 150, h = 150;
    ctx.clearRect(0, 0, w, h);

    // Background
    ctx.fillStyle = 'rgba(0,0,0,0.6)';
    ctx.fillRect(0, 0, w, h);

    const scale = w / WORLD.SIZE;

    // Arena
    ctx.beginPath();
    ctx.arc(WORLD.ARENA_CENTER.x * scale, WORLD.ARENA_CENTER.z * scale, WORLD.ARENA_RADIUS * scale, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(60,60,60,0.5)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(212,168,67,0.3)';
    ctx.stroke();

    // Bonfire
    ctx.fillStyle = '#ff6600';
    ctx.beginPath();
    ctx.arc(WORLD.BONFIRE_POS.x * scale, WORLD.BONFIRE_POS.z * scale, 3, 0, Math.PI * 2);
    ctx.fill();

    // Boss
    if (boss && boss.hp > 0 && boss.isActive) {
        ctx.fillStyle = '#ff2200';
        ctx.beginPath();
        ctx.arc(boss.position.x * scale, boss.position.z * scale, 4, 0, Math.PI * 2);
        ctx.fill();
    }

    // Player (with direction indicator)
    ctx.save();
    ctx.translate(player.position.x * scale, player.position.z * scale);
    ctx.rotate(-player.yaw);
    ctx.fillStyle = '#44aaff';
    ctx.beginPath();
    ctx.moveTo(0, -5);
    ctx.lineTo(-3, 4);
    ctx.lineTo(3, 4);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
}

// ─── MAIN LOOP ──────────────────────────────────────────────────
function animate() {
    requestAnimationFrame(animate);
    const dt = Math.min(clock.getDelta(), 0.05); // Cap delta

    if (gameState === 'playing') {
        updatePlayer(dt);
        updateBoss(dt);
        updateParticles(dt);
        updateBonfireEffects(dt);
        updateUI();
    } else {
        // Title screen — slow camera orbit
        if (gameState === 'title') {
            const t = performance.now() * 0.0003;
            camera.position.set(
                32 + Math.sin(t) * 30,
                15 + Math.sin(t * 0.5) * 5,
                32 + Math.cos(t) * 30
            );
            camera.lookAt(32, 3, 32);
        }
    }

    renderer.render(scene, camera);
}
