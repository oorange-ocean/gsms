import * as THREE from 'three';

export class Building {
  private mesh: THREE.Group;

  constructor() {
    this.mesh = new THREE.Group();
  }

  // 创建控制室
  public createControlRoom(): THREE.Group {
    const building = new THREE.Group();

    // 主体建筑
    const bodyGeometry = new THREE.BoxGeometry(8, 4, 6);
    const bodyMaterial = new THREE.MeshPhongMaterial({
      color: 0xcccccc,
      shininess: 30
    });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.y = 2;
    body.castShadow = true;
    body.receiveShadow = true;

    // 屋顶
    const roofGeometry = new THREE.BoxGeometry(9, 0.5, 7);
    const roofMaterial = new THREE.MeshPhongMaterial({
      color: 0x666666,
      shininess: 30
    });
    const roof = new THREE.Mesh(roofGeometry, roofMaterial);
    roof.position.y = 4.25;
    roof.castShadow = true;

    // 门
    const doorGeometry = new THREE.BoxGeometry(1.5, 2.5, 0.1);
    const doorMaterial = new THREE.MeshPhongMaterial({
      color: 0x333333,
      shininess: 50
    });
    const door = new THREE.Mesh(doorGeometry, doorMaterial);
    door.position.set(0, 1.25, 3);
    
    // 窗户
    const windows = this.createWindows();

    building.add(body);
    building.add(roof);
    building.add(door);
    building.add(windows);

    return building;
  }

  private createWindows(): THREE.Group {
    const windows = new THREE.Group();
    const windowGeometry = new THREE.BoxGeometry(1.5, 1.2, 0.1);
    const windowMaterial = new THREE.MeshPhongMaterial({
      color: 0x88ccff,
      shininess: 90,
      transparent: true,
      opacity: 0.6
    });

    // 前面窗户
    const frontPositions = [-2, 2];
    frontPositions.forEach(x => {
      const window = new THREE.Mesh(windowGeometry, windowMaterial);
      window.position.set(x, 2.5, 3);
      windows.add(window);
    });

    // 侧面窗户
    const sidePositions = [-3, 0, 3];
    sidePositions.forEach(z => {
      const window = new THREE.Mesh(windowGeometry, windowMaterial);
      window.rotation.y = Math.PI / 2;
      window.position.set(-4, 2.5, z);
      windows.add(window);
    });

    return windows;
  }

  public getMesh(): THREE.Group {
    return this.mesh;
  }

  public setPosition(x: number, y: number, z: number): void {
    this.mesh.position.set(x, y, z);
  }
} 