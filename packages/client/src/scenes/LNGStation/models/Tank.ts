import * as THREE from 'three';

export class Tank {
  private mesh: THREE.Group;

  constructor() {
    this.mesh = new THREE.Group();
    this.createTank();
  }

  private createTank(): void {
    // 定义尺寸常量
    const BODY_HEIGHT = 8;
    const RADIUS = 3;
    const SUPPORT_HEIGHT = 2;
    
    // 创建主体圆柱
    const bodyGeometry = new THREE.CylinderGeometry(RADIUS, RADIUS, BODY_HEIGHT, 32);
    const bodyMaterial = new THREE.MeshPhongMaterial({
      color: 0x7a8aa3,
      shininess: 50,
    });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.y = 0;  // 将主体置于原点
    body.castShadow = true;
    body.receiveShadow = true;

    // 创建顶部半球
    const topGeometry = new THREE.SphereGeometry(RADIUS, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2);
    const topMaterial = new THREE.MeshPhongMaterial({
      color: 0x7a8aa3,
      shininess: 50,
    });
    const top = new THREE.Mesh(topGeometry, topMaterial);
    top.position.y = BODY_HEIGHT / 2;  // 放在主体顶部
    top.castShadow = true;
    top.receiveShadow = true;

    // 创建底部半球
    const bottomGeometry = new THREE.SphereGeometry(RADIUS, 32, 16, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2);
    const bottom = new THREE.Mesh(bottomGeometry, bodyMaterial);
    bottom.position.y = -BODY_HEIGHT / 2;  // 放在主体底部
    bottom.castShadow = true;
    bottom.receiveShadow = true;

    // 创建支撑结构
    const supports = this.createSupports(RADIUS + 0.5, SUPPORT_HEIGHT);

    // 创建管道接口
    const pipes = this.createPipes();

    // 添加到组中
    this.mesh.add(body);
    this.mesh.add(top);
    this.mesh.add(bottom);
    this.mesh.add(supports);
    this.mesh.add(pipes);

    // 将整个储罐抬高到正确位置
    // 修改：考虑到整体高度，将储罐抬高到支撑柱高度加上半个主体高度的位置
    const TOTAL_HEIGHT = BODY_HEIGHT + RADIUS; // 主体高度加上顶部半球的高度
    this.mesh.position.y = TOTAL_HEIGHT / 2;  // 将整个储罐向上移动
  }

  private createSupports(radius: number, height: number): THREE.Group {
    const supports = new THREE.Group();
    const supportCount = 8;

    for (let i = 0; i < supportCount; i++) {
        const angle = (i / supportCount) * Math.PI * 2;
        const supportGeometry = new THREE.BoxGeometry(0.3, height, 0.3);
        const supportMaterial = new THREE.MeshPhongMaterial({
            color: 0x5a6a83,
        });
        const support = new THREE.Mesh(supportGeometry, supportMaterial);
        
        support.position.x = Math.cos(angle) * radius;
        support.position.z = Math.sin(angle) * radius;
        support.position.y = -(4 + height/2);  // 主体底部位置减去支撑柱高度的一半
        
        support.castShadow = true;
        support.receiveShadow = true;
        supports.add(support);
    }

    return supports;
  }

  private createPipes(): THREE.Group {
    const pipes = new THREE.Group();

    // 入口管道
    const inletPipe = new THREE.Mesh(
      new THREE.CylinderGeometry(0.3, 0.3, 2, 16),
      new THREE.MeshPhongMaterial({ color: 0x436089 })
    );
    inletPipe.rotation.z = Math.PI / 2;
    inletPipe.position.set(-4, -2, 0);

    // 出口管道
    const outletPipe = new THREE.Mesh(
      new THREE.CylinderGeometry(0.3, 0.3, 2, 16),
      new THREE.MeshPhongMaterial({ color: 0x436089 })
    );
    outletPipe.rotation.z = Math.PI / 2;
    outletPipe.position.set(4, -2, 0);

    pipes.add(inletPipe);
    pipes.add(outletPipe);

    return pipes;
  }

  // 获取储罐的网格对象
  public getMesh(): THREE.Group {
    return this.mesh;
  }

  // 设置储罐位置
  public setPosition(x: number, y: number, z: number): void {
    this.mesh.position.set(x, y, z);
  }

  // 设置储罐旋转
  public setRotation(x: number, y: number, z: number): void {
    this.mesh.rotation.set(x, y, z);
  }
}
