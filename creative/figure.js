import * as THREE from 'three';

export function makeCricketPitch(params) {
    const group = new THREE.Group();

    const pitchTex = new THREE.TextureLoader().load('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/hardwood2_diffuse.jpg');
    pitchTex.wrapS = pitchTex.wrapT = THREE.RepeatWrapping;
    pitchTex.repeat.set(1, 4);

    const pitch = new THREE.Mesh(
        new THREE.PlaneGeometry(params.pitchWidth, params.pitchLength),
        new THREE.MeshStandardMaterial({ map: pitchTex, color: 0xd2b28c })
    );
    pitch.rotation.x = -Math.PI / 2;
    pitch.receiveShadow = true;
    group.add(pitch);

    const stumpGeom = new THREE.CylinderGeometry(0.06, 0.06, params.stumpHeight);
    const stumpMat = new THREE.MeshStandardMaterial({ color: 0xffd700, metalness: 0.5, roughness: 0.2 });

    const createWicket = (zPos) => {
        const wicketGroup = new THREE.Group();
        for (let i = -1; i <= 1; i++) {
            const stump = new THREE.Mesh(stumpGeom, stumpMat);
            stump.position.set(i * 0.22, params.stumpHeight / 2, 0);
            stump.castShadow = true;
            wicketGroup.add(stump);
        }
        wicketGroup.position.z = zPos;
        return wicketGroup;
    };

    group.add(createWicket(params.pitchLength / 2 - 0.5));
    group.add(createWicket(-params.pitchLength / 2 + 0.5));

    const ball = new THREE.Mesh(
        new THREE.SphereGeometry(0.13),
        new THREE.MeshStandardMaterial({ color: 0x8b0000, roughness: 0.3 })
    );
    ball.castShadow = true;
    ball.visible = false;
    group.add(ball);

    return { group, ball };
}

export function createPlayer(jerseyColor = 0xffffff) {
    const group = new THREE.Group();
    const bodyMat = new THREE.MeshStandardMaterial({ color: jerseyColor });
    const skinMat = new THREE.MeshStandardMaterial({ color: 0xffdbac });

    const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.25, 1.2, 8), bodyMat);
    torso.position.y = 1.6;
    torso.castShadow = true;
    group.add(torso);

    const head = new THREE.Mesh(new THREE.SphereGeometry(0.28), skinMat);
    head.position.y = 0.8;
    torso.add(head);

    const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.29, 0.29, 0.1), bodyMat);
    cap.position.y = 0.25;
    head.add(cap);

    const armGeom = new THREE.CylinderGeometry(0.1, 0.08, 0.9);
    const lArm = new THREE.Mesh(armGeom, bodyMat); lArm.position.set(-0.45, 0.2, 0); torso.add(lArm);
    const rArm = new THREE.Mesh(armGeom, bodyMat); rArm.position.set(0.45, 0.2, 0); torso.add(rArm);

    const legGeom = new THREE.CylinderGeometry(0.15, 0.1, 1.1);
    const lLeg = new THREE.Mesh(legGeom, bodyMat); lLeg.position.set(-0.2, -1.1, 0); torso.add(lLeg);
    const rLeg = new THREE.Mesh(legGeom, bodyMat); rLeg.position.set(0.2, -1.1, 0); torso.add(rLeg);

    if (jerseyColor === 0xffffff) {
        const batGroup = new THREE.Group();
        batGroup.position.set(0.5, 0, 0.3);
        const bat = new THREE.Mesh(new THREE.BoxGeometry(0.25, 1.2, 0.1), new THREE.MeshStandardMaterial({ color: 0x654321 }));
        bat.position.y = -0.5;
        batGroup.add(bat);
        batGroup.rotation.x = Math.PI / 4;
        torso.add(batGroup);
    }

    return group;
}