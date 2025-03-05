import * as THREE from 'three';

export class FireFighting {
  private mesh: THREE.Group;

  constructor() {
    this.mesh = new THREE.Group();
  }

  // 创建消防栓
  public createHydrant(): THREE.Group {
    const hydrant = new THREE.Group();

    // 主体
    const bodyGeometry = new THREE.CylinderGeometry(0.2, 0.25, 1, 12);
    const bodyMaterial = new THREE.MeshPhongMaterial({
      color: 0xff0000,
      shininess: 70
    });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.y = 0.5;

    // 阀门接口
    const valveGeometry = new THREE.CylinderGeometry(0.1, 0.1, 0.3, 12);
    const valve = new THREE.Mesh(valveGeometry, bodyMaterial);
    valve.rotation.z = Math.PI / 2;
    valve.position.set(0.25, 0.7, 0);

    hydrant.add(body);
    hydrant.add(valve);
    hydrant.castShadow = true;
    hydrant.receiveShadow = true;

    return hydrant;
  }

  // 创建消防水炮
  public createWaterCannon(): THREE.Group {
    const cannon = new THREE.Group();

    // 底座
    const baseGeometry = new THREE.CylinderGeometry(0.4, 0.5, 0.3, 16);
    const baseMaterial = new THREE.MeshPhongMaterial({
      color: 0xcc0000,
      shininess: 50
    });
    const base = new THREE.Mesh(baseGeometry, baseMaterial);

    // 炮管
    const barrelGeometry = new THREE.CylinderGeometry(0.15, 0.2, 1.5, 16);
    const barrel = new THREE.Mesh(barrelGeometry, baseMaterial);
    barrel.rotation.x = -Math.PI / 4;
    barrel.position.set(0, 0.5, 0.5);

    cannon.add(base);
    cannon.add(barrel);
    cannon.castShadow = true;
    cannon.receiveShadow = true;

    return cannon;
  }

  // 创建消防水池
  public createWaterPool(): THREE.Group {
    const pool = new THREE.Group();

    // 水池主体
    const poolGeometry = new THREE.BoxGeometry(6, 1, 4);
    const poolMaterial = new THREE.MeshPhongMaterial({
      color: 0x666666,
      shininess: 30
    });
    const poolBody = new THREE.Mesh(poolGeometry, poolMaterial);

    // 水面
    const waterGeometry = new THREE.PlaneGeometry(5.8, 3.8);
    const waterMaterial = new THREE.MeshPhongMaterial({
      color: 0x3366ff,
      transparent: true,
      opacity: 0.6
    });
    const water = new THREE.Mesh(waterGeometry, waterMaterial);
    water.rotation.x = -Math.PI / 2;
    water.position.y = 0.45;

    pool.add(poolBody);
    pool.add(water);
    pool.receiveShadow = true;

    return pool;
  }

  public getMesh(): THREE.Group {
    return this.mesh;
  }

  public setPosition(x: number, y: number, z: number): void {
    this.mesh.position.set(x, y, z);
  }
} 