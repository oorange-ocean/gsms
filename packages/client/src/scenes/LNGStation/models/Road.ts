import * as THREE from 'three';

export class Road {
  private mesh: THREE.Group;

  constructor() {
    this.mesh = new THREE.Group();
  }

  // 创建道路段
  public createRoadSection(length: number = 10, width: number = 4): THREE.Group {
    const road = new THREE.Group();

    // 路基 - 增加厚度并降低位置
    const baseGeometry = new THREE.BoxGeometry(width + 0.8, length, 0.15);
    const baseMaterial = new THREE.MeshStandardMaterial({
      color: 0x666666,
      roughness: 1
    });
    const base = new THREE.Mesh(baseGeometry, baseMaterial);
    base.position.y = 0.075;
    base.receiveShadow = true;

    // 主路面 - 增加厚度并提高位置
    const roadGeometry = new THREE.BoxGeometry(width, length, 0.08);
    const roadMaterial = new THREE.MeshStandardMaterial({
      color: 0x333333,
      roughness: 0.7,
      metalness: 0.1
    });
    const roadMesh = new THREE.Mesh(roadGeometry, roadMaterial);
    roadMesh.position.y = 0.19; // 提高位置
    roadMesh.receiveShadow = true;

    // 路肩 - 调整高度
    const shoulderLeft = new THREE.BoxGeometry(0.3, length, 0.1);
    const shoulderRight = new THREE.BoxGeometry(0.3, length, 0.1);
    const shoulderMaterial = new THREE.MeshStandardMaterial({
      color: 0x777777,
      roughness: 0.9
    });
    
    const leftShoulder = new THREE.Mesh(shoulderLeft, shoulderMaterial);
    const rightShoulder = new THREE.Mesh(shoulderRight, shoulderMaterial);
    
    leftShoulder.position.set(-width/2 - 0.15, 0, 0.17);
    rightShoulder.position.set(width/2 + 0.15, 0, 0.17);

    // 道路标线 - 进一步提高位置
    const lineGeometry = new THREE.BoxGeometry(0.12, length, 0.015);
    const lineMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.4
    });
    
    const leftLine = new THREE.Mesh(lineGeometry, lineMaterial);
    leftLine.position.set(-width/2 + 0.2, 0, 0.23);
    
    const rightLine = new THREE.Mesh(lineGeometry, lineMaterial);
    rightLine.position.set(width/2 - 0.2, 0, 0.23);

    road.add(base);
    road.add(roadMesh);
    road.add(leftShoulder);
    road.add(rightShoulder);
    road.add(leftLine);
    road.add(rightLine);

    // 整体抬高一点
    road.position.y = 0.01;
    road.rotation.x = -Math.PI / 2;

    return road;
  }

  // 创建转弯
  public createCorner(radius: number = 5, width: number = 4): THREE.Group {
    const corner = new THREE.Group();
    
    // 路基
    const baseShape = new THREE.Shape();
    baseShape.moveTo(0, 0);
    baseShape.absarc(0, 0, radius + width/2 + 0.4, 0, Math.PI/2, false);
    baseShape.lineTo(radius, 0);
    baseShape.absarc(0, 0, radius - width/2 - 0.4, Math.PI/2, 0, true);
    
    const baseGeometry = new THREE.ExtrudeGeometry(baseShape, {
      depth: 0.15,
      bevelEnabled: false
    });
    
    const baseMaterial = new THREE.MeshStandardMaterial({
      color: 0x666666,
      roughness: 1
    });
    
    const base = new THREE.Mesh(baseGeometry, baseMaterial);
    base.rotation.x = -Math.PI / 2;
    base.position.y = 0.075;

    // 路面
    const roadShape = new THREE.Shape();
    roadShape.moveTo(0, 0);
    roadShape.absarc(0, 0, radius + width/2, 0, Math.PI/2, false);
    roadShape.lineTo(radius, 0);
    roadShape.absarc(0, 0, radius - width/2, Math.PI/2, 0, true);
    
    const roadGeometry = new THREE.ExtrudeGeometry(roadShape, {
      depth: 0.08,
      bevelEnabled: false
    });
    
    const roadMaterial = new THREE.MeshStandardMaterial({
      color: 0x333333,
      roughness: 0.7,
      metalness: 0.1
    });
    
    const roadMesh = new THREE.Mesh(roadGeometry, roadMaterial);
    roadMesh.rotation.x = -Math.PI / 2;
    roadMesh.position.y = 0.19;

    corner.add(base);
    corner.add(roadMesh);
    
    // 整体抬高一点
    corner.position.y = 0.01;
    
    return corner;
  }

  public getMesh(): THREE.Group {
    return this.mesh;
  }

  public setPosition(x: number, y: number, z: number): void {
    this.mesh.position.set(x, y, z);
  }
} 