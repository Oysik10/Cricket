import * as THREE from 'https://cdn.skypack.dev/three@0.136.0';

export function makeCricketPitch(params) {
    const group = new THREE.Group();

    const pitchGeom = new THREE.PlaneGeometry(params.pitchWidth, params.pitchLength);
    const pitchMat = new THREE.MeshStandardMaterial({ color: params.pitchColor });
    const pitch = new THREE.Mesh(pitchGeom, pitchMat);
    pitch.rotation.x = -Math.PI / 2;
    group.add(pitch);

    const stumpGeom = new THREE.CylinderGeometry(0.08, 0.08, params.stumpHeight);
    const stumpMat = new THREE.MeshStandardMaterial({ color: params.stumpColor });

    const createWicket = (zPos) => {
        const wicketGroup = new THREE.Group();
        for (let i = -1; i <= 1; i++) {
            const stump = new THREE.Mesh(stumpGeom, stumpMat);
            stump.position.set(i * 0.25, params.stumpHeight / 2, 0);
            wicketGroup.add(stump);
        }
        wicketGroup.position.z = zPos;
        return wicketGroup;
    };

    const batterWicket = createWicket(params.pitchLength / 2 - 0.5);
    const bowlerWicket = createWicket(-params.pitchLength / 2 + 0.5);
    group.add(batterWicket, bowlerWicket);

    const ball = new THREE.Mesh(
        new THREE.SphereGeometry(0.15),
        new THREE.MeshStandardMaterial({ color: 0x8b0000 })
    );
    ball.visible = false;
    group.add(ball);

    return { group, ball, batterWicket };
}

export function createPlayer(jerseyColor = 0xffffff) {
    const playerGroup = new THREE.Group();
    const bodyMat = new THREE.MeshStandardMaterial({ color: jerseyColor });
    const skinMat = new THREE.MeshStandardMaterial({ color: 0xffdbac });

    const torso = new THREE.Mesh(new THREE.BoxGeometry(0.8, 1.2, 0.5), bodyMat);
    torso.position.y = 1.6;
    playerGroup.add(torso);

    const head = new THREE.Mesh(new THREE.SphereGeometry(0.32), skinMat);
    head.position.y = 0.8;
    torso.add(head);

    const legGeom = new THREE.BoxGeometry(0.3, 1.1, 0.3);
    const leftLeg = new THREE.Mesh(legGeom, bodyMat);
    leftLeg.position.set(-0.22, -1.1, 0);
    torso.add(leftLeg);

    const rightLeg = new THREE.Mesh(legGeom, bodyMat);
    rightLeg.position.set(0.22, -1.1, 0);
    torso.add(rightLeg);

    if (jerseyColor === 0xffffff) {
        const bat = new THREE.Mesh(
            new THREE.BoxGeometry(0.25, 1.3, 0.1),
            new THREE.MeshStandardMaterial({ color: 0x654321 })
        );
        bat.position.set(0.6, 0.2, 0.5);
        bat.rotation.x = Math.PI / 4;
        playerGroup.add(bat);
    }

    return playerGroup;
}