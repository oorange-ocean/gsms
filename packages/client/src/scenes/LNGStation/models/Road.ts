import * as THREE from 'three';

export class Road {
  private mesh: THREE.Group;

  constructor() {
    this.mesh = new THREE.Group();
  }

  // 创建道路段
  public createRoadSection(length: number = 10, width: number = 4): THREE.Group {
    const road = new THREE.Group();

    // 路基 - 添加一个略高于地面的基础层
    const baseGeometry = new THREE.BoxGeometry(width + 0.6, length, 0.1);
    const baseMaterial = new THREE.MeshStandardMaterial({
      color: 0x666666,
      roughness: 1
    });
    const base = new THREE.Mesh(baseGeometry, baseMaterial);
    base.position.y = 0.05;
    base.receiveShadow = true;

    // 主路面
    const roadGeometry = new THREE.BoxGeometry(width, length, 0.05);
    const roadMaterial = new THREE.MeshStandardMaterial({
      color: 0x333333,
      roughness: 0.7,
      metalness: 0.1
    });
    const roadMesh = new THREE.Mesh(roadGeometry, roadMaterial);
    roadMesh.position.y = 0.1; // 放在路基上面
    roadMesh.receiveShadow = true;

    // 路肩 - 现在作为路基的一部分，不需要单独的平面
    const shoulderLeft = new THREE.BoxGeometry(0.2, length, 0.08);
    const shoulderRight = new THREE.BoxGeometry(0.2, length, 0.08);
    const shoulderMaterial = new THREE.MeshStandardMaterial({
      color: 0x777777,
      roughness: 0.9
    });
    
    const leftShoulder = new THREE.Mesh(shoulderLeft, shoulderMaterial);
    const rightShoulder = new THREE.Mesh(shoulderRight, shoulderMaterial);
    
    leftShoulder.position.set(-width/2 - 0.1, 0, 0.09);
    rightShoulder.position.set(width/2 + 0.1, 0, 0.09);

    // 道路标线 - 稍微抬高以避免z-fighting
    const lineGeometry = new THREE.BoxGeometry(0.1, length, 0.01);
    const lineMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.4
    });
    
    const leftLine = new THREE.Mesh(lineGeometry, lineMaterial);
    leftLine.position.set(-width/2 + 0.2, 0, 0.13);
    
    const rightLine = new THREE.Mesh(lineGeometry, lineMaterial);
    rightLine.position.set(width/2 - 0.2, 0, 0.13);

    // 将所有部件添加到组中
    road.add(base);
    road.add(roadMesh);
    road.add(leftShoulder);
    road.add(rightShoulder);
    road.add(leftLine);
    road.add(rightLine);

    // 整体旋转，使其平行于地面
    road.rotation.x = -Math.PI / 2;

    return road;
  }

  // 创建转弯
  public createCorner(radius: number = 5, width: number = 4): THREE.Group {
    const corner = new THREE.Group();
    
    // 创建弯道路基
    const baseShape = new THREE.Shape();
    baseShape.moveTo(0, 0);
    baseShape.absarc(0, 0, radius + width/2 + 0.3, 0, Math.PI/2, false);
    baseShape.lineTo(radius, 0);
    baseShape.absarc(0, 0, radius - width/2 - 0.3, Math.PI/2, 0, true);
    
    const baseGeometry = new THREE.ExtrudeGeometry(baseShape, {
      depth: 0.1,
      bevelEnabled: false
    });
    
    const baseMaterial = new THREE.MeshStandardMaterial({
      color: 0x666666,
      roughness: 1
    });
    
    const base = new THREE.Mesh(baseGeometry, baseMaterial);
    base.rotation.x = -Math.PI / 2;
    base.position.y = 0.05;

    // 创建弯道路面
    const roadShape = new THREE.Shape();
    roadShape.moveTo(0, 0);
    roadShape.absarc(0, 0, radius + width/2, 0, Math.PI/2, false);
    roadShape.lineTo(radius, 0);
    roadShape.absarc(0, 0, radius - width/2, Math.PI/2, 0, true);
    
    const roadGeometry = new THREE.ExtrudeGeometry(roadShape, {
      depth: 0.05,
      bevelEnabled: false
    });
    
    const roadMaterial = new THREE.MeshStandardMaterial({
      color: 0x333333,
      roughness: 0.7,
      metalness: 0.1
    });
    
    const roadMesh = new THREE.Mesh(roadGeometry, roadMaterial);
    roadMesh.rotation.x = -Math.PI / 2;
    roadMesh.position.y = 0.1;

    corner.add(base);
    corner.add(roadMesh);
    
    return corner;
  }

  public getMesh(): THREE.Group {
    return this.mesh;
  }

  public setPosition(x: number, y: number, z: number): void {
    this.mesh.position.set(x, y, z);
  }
} 