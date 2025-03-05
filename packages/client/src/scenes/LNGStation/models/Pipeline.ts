import * as THREE from 'three';

export class Pipeline {
  private mesh: THREE.Group;

  constructor() {
    this.mesh = new THREE.Group();
  }

  // 创建一段直管道
  public createStraightPipe(length: number, diameter: number = 0.3): THREE.Mesh {
    const geometry = new THREE.CylinderGeometry(diameter, diameter, length, 16);
    const material = new THREE.MeshPhongMaterial({ 
      color: 0x436089,
      shininess: 30
    });
    const pipe = new THREE.Mesh(geometry, material);
    pipe.castShadow = true;
    pipe.receiveShadow = true;
    return pipe;
  }

  // 创建弯头
  public createElbow(radius: number = 1, diameter: number = 0.3): THREE.Mesh {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(radius, 0, 0),
      new THREE.Vector3(radius, radius, 0),
    ]);

    const geometry = new THREE.TubeGeometry(curve, 16, diameter, 8, false);
    const material = new THREE.MeshPhongMaterial({ 
      color: 0x436089,
      shininess: 30
    });
    const elbow = new THREE.Mesh(geometry, material);
    elbow.castShadow = true;
    elbow.receiveShadow = true;
    return elbow;
  }

  // 创建阀门
  public createValve(diameter: number = 0.3): THREE.Group {
    const valve = new THREE.Group();

    // 阀门主体
    const bodyGeometry = new THREE.BoxGeometry(diameter * 3, diameter * 2, diameter * 2);
    const bodyMaterial = new THREE.MeshPhongMaterial({ 
      color: 0x2a3f5f,
      shininess: 50
    });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    
    // 阀门手轮
    const wheelGeometry = new THREE.TorusGeometry(diameter * 1.5, diameter * 0.2, 16, 32);
    const wheelMaterial = new THREE.MeshPhongMaterial({ 
      color: 0xcc0000,
      shininess: 50
    });
    const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
    wheel.rotation.y = Math.PI / 2;
    wheel.position.y = diameter * 2;

    valve.add(body);
    valve.add(wheel);
    valve.castShadow = true;
    valve.receiveShadow = true;

    return valve;
  }

  // 创建一个完整的管道系统
  public createPipeSystem(): THREE.Group {
    const system = new THREE.Group();

    // 主管道
    const mainPipe = this.createStraightPipe(10);
    mainPipe.rotation.z = Math.PI / 2;
    system.add(mainPipe);

    // 添加阀门
    const valve = this.createValve();
    valve.position.set(3, 0, 0);
    system.add(valve);

    // 添加弯头
    const elbow = this.createElbow();
    elbow.position.set(-3, 0, 0);
    system.add(elbow);

    return system;
  }

  // 创建过滤器
  public createFilter(): THREE.Group {
    const filter = new THREE.Group();
    
    // 过滤器主体
    const bodyGeometry = new THREE.CylinderGeometry(1, 1, 4, 16);
    const bodyMaterial = new THREE.MeshPhongMaterial({ 
        color: 0x436089,
        shininess: 30 
    });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    
    // 添加连接法兰
    const flangeGeometry = new THREE.CylinderGeometry(1.2, 1.2, 0.3, 16);
    const flange1 = new THREE.Mesh(flangeGeometry, bodyMaterial);
    flange1.position.y = 2;
    const flange2 = new THREE.Mesh(flangeGeometry, bodyMaterial);
    flange2.position.y = -2;
    
    filter.add(body);
    filter.add(flange1);
    filter.add(flange2);
    
    return filter;
  }

  // 创建计量装置
  public createMeter(): THREE.Group {
    const meter = new THREE.Group();
    
    // 计量装置主体
    const bodyGeometry = new THREE.BoxGeometry(2, 1.5, 1);
    const bodyMaterial = new THREE.MeshPhongMaterial({ 
        color: 0x2a3f5f,
        shininess: 50 
    });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    
    // 添加显示屏
    const screenGeometry = new THREE.PlaneGeometry(1, 0.5);
    const screenMaterial = new THREE.MeshPhongMaterial({ 
        color: 0x000000,
        emissive: 0x222222 
    });
    const screen = new THREE.Mesh(screenGeometry, screenMaterial);
    screen.position.z = 0.51;
    
    meter.add(body);
    meter.add(screen);
    
    return meter;
  }

  // 创建调压装置
  public createRegulator(): THREE.Group {
    const regulator = new THREE.Group();
    
    // 调压器主体
    const bodyGeometry = new THREE.CylinderGeometry(0.8, 0.8, 2, 16);
    const bodyMaterial = new THREE.MeshPhongMaterial({ 
        color: 0x436089,
        shininess: 30 
    });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    
    // 添加压力表
    const gaugeGeometry = new THREE.CircleGeometry(0.3, 32);
    const gaugeMaterial = new THREE.MeshPhongMaterial({ 
        color: 0xffffff,
        shininess: 50 
    });
    const gauge = new THREE.Mesh(gaugeGeometry, gaugeMaterial);
    gauge.position.set(0.8, 0, 0);
    gauge.rotation.y = Math.PI / 2;
    
    regulator.add(body);
    regulator.add(gauge);
    
    return regulator;
  }

  public getMesh(): THREE.Group {
    return this.mesh;
  }

  public setPosition(x: number, y: number, z: number): void {
    this.mesh.position.set(x, y, z);
  }

  public setRotation(x: number, y: number, z: number): void {
    this.mesh.rotation.set(x, y, z);
  }
}
