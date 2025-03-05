import * as THREE from 'three';

export class Fence {
  private mesh: THREE.Group;

  constructor() {
    this.mesh = new THREE.Group();
  }

  // 创建围墙段
  public createWallSection(length: number = 10): THREE.Group {
    const section = new THREE.Group();

    // 墙体
    const wallGeometry = new THREE.BoxGeometry(length, 2.5, 0.2);
    const wallMaterial = new THREE.MeshPhongMaterial({
      color: 0xcccccc,
      shininess: 30
    });
    const wall = new THREE.Mesh(wallGeometry, wallMaterial);
    wall.position.y = 1.25;

    // 柱子
    const postGeometry = new THREE.BoxGeometry(0.4, 3, 0.4);
    const postMaterial = new THREE.MeshPhongMaterial({
      color: 0x999999,
      shininess: 30
    });

    // 添加柱子
    const posts = Math.ceil(length / 2);
    for (let i = 0; i <= posts; i++) {
      const post = new THREE.Mesh(postGeometry, postMaterial);
      post.position.set(-length/2 + i * 2, 1.5, 0);
      section.add(post);
    }

    section.add(wall);
    section.castShadow = true;
    section.receiveShadow = true;

    return section;
  }

  // 创建铁丝网围栏段
  public createFenceSection(length: number = 10): THREE.Group {
    const section = new THREE.Group();

    // 围栏框架
    const frameGeometry = new THREE.BoxGeometry(length, 2, 0.05);
    const frameMaterial = new THREE.MeshPhongMaterial({
      color: 0x666666,
      shininess: 30
    });
    const frame = new THREE.Mesh(frameGeometry, frameMaterial);
    frame.position.y = 1;

    // 立柱
    const postGeometry = new THREE.CylinderGeometry(0.05, 0.05, 2.5, 8);
    const posts = Math.ceil(length / 2);
    for (let i = 0; i <= posts; i++) {
      const post = new THREE.Mesh(postGeometry, frameMaterial);
      post.position.set(-length/2 + i * 2, 1.25, 0);
      section.add(post);
    }

    section.add(frame);
    section.castShadow = true;
    section.receiveShadow = true;

    return section;
  }

  public getMesh(): THREE.Group {
    return this.mesh;
  }

  public setPosition(x: number, y: number, z: number): void {
    this.mesh.position.set(x, y, z);
  }
} 