import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { Tank } from './models/Tank';
import { Pipeline } from './models/Pipeline';
import { Building } from './models/Building';
import { FireFighting } from './models/FireFighting';
import { Road } from './models/Road';

export class LNGStation {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private controls: OrbitControls;

  constructor(container: HTMLElement) {
    // 初始化场景
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xf0f0f0);

    // 初始化相机
    this.camera = new THREE.PerspectiveCamera(
      75,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    this.camera.position.set(10, 10, 10);
    this.camera.lookAt(0, 0, 0);

    // 初始化渲染器
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    this.renderer.shadowMap.enabled = true;
    container.appendChild(this.renderer.domElement);

    // 初始化控制器
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;

    // 初始化场景
    this.initScene();
    
    // 开始动画循环
    this.animate();
  }

  private initScene(): void {
    // 添加地面
    const ground = this.createGround();
    this.scene.add(ground);

    // 添加光源
    this.addLights();

    // 添加辅助工具
    this.addHelpers();

    // 创建完整场景
    this.createStation();
  }

  private createStation(): void {
    // 创建储罐区
    this.createTankArea();
    
    // 创建工艺区
    this.createProcessArea();
    
    // 创建辅助设施
    this.createAuxiliaryFacilities();
    
    // 添加道路系统
    this.createRoadSystem();
    
    // 调整相机位置以更好地查看场景
    this.camera.position.set(50, 40, 50);
    this.camera.lookAt(0, 0, 0);
  }

  private createTankArea(): void {
    // 创建多个储罐，形成储罐区
    const tankPositions = [
        { x: -15, z: 15 },
        { x: 0, z: 15 },
        { x: 15, z: 15 },
        { x: -15, z: 0 },
        { x: 0, z: 0 },
        { x: 15, z: 0 }
    ];

    tankPositions.forEach(pos => {
        const tank = new Tank();
        tank.setPosition(pos.x, 7, pos.z);
        this.scene.add(tank.getMesh());
    });

    // 创建储罐区的管网系统
    const pipeline = new Pipeline();
    
    // 主管道网络
    this.createTankAreaPipelines(pipeline);
  }

  private createTankAreaPipelines(pipeline: Pipeline): void {
    // 创建储罐区主管网
    const mainPipelinePositions = [
        { start: { x: -15, y: 2, z: 15 }, length: 30, rotation: { x: 0, y: 0, z: 0 } },
        { start: { x: -15, y: 2, z: 0 }, length: 30, rotation: { x: 0, y: 0, z: 0 } },
        { start: { x: -15, y: 2, z: 15 }, length: 15, rotation: { x: 0, y: 0, z: Math.PI / 2 } },
        { start: { x: 15, y: 2, z: 15 }, length: 15, rotation: { x: 0, y: 0, z: Math.PI / 2 } }
    ];

    mainPipelinePositions.forEach(config => {
        const pipe = pipeline.createStraightPipe(config.length);
        pipe.position.set(config.start.x, config.start.y, config.start.z);
        pipe.rotation.set(config.rotation.x, config.rotation.y, config.rotation.z);
        this.scene.add(pipe);
    });

    // 添加阀门
    const valvePositions = [
        { x: -15, y: 2, z: 15 },
        { x: 0, y: 2, z: 15 },
        { x: 15, y: 2, z: 15 },
        { x: -15, y: 2, z: 0 },
        { x: 0, y: 2, z: 0 },
        { x: 15, y: 2, z: 0 }
    ];

    valvePositions.forEach(pos => {
        const valve = pipeline.createValve();
        valve.position.set(pos.x, pos.y, pos.z);
        this.scene.add(valve);
    });
  }

  private createProcessArea(): void {
    const pipeline = new Pipeline();
    
    // 创建过滤器区域
    this.createFilterArea(pipeline);
    
    // 创建计量区域
    this.createMeteringArea(pipeline);
    
    // 创建调压区域
    this.createPressureRegulationArea(pipeline);
  }

  private createFilterArea(pipeline: Pipeline): void {
    // 过滤器模型位置
    const filterPositions = [
        { x: -20, y: 2, z: -15 },
        { x: -15, y: 2, z: -15 }
    ];

    filterPositions.forEach(pos => {
        const filter = pipeline.createFilter();
        filter.position.set(pos.x, pos.y, pos.z);
        this.scene.add(filter);
    });

    // 连接管道
    const pipe = pipeline.createStraightPipe(6);
    pipe.position.set(-17.5, 2, -15);
    this.scene.add(pipe);
  }

  private createMeteringArea(pipeline: Pipeline): void {
    // 计量装置位置
    const meterPositions = [
        { x: 0, y: 2, z: -15 },
        { x: 5, y: 2, z: -15 }
    ];

    meterPositions.forEach(pos => {
        const meter = pipeline.createMeter();
        meter.position.set(pos.x, pos.y, pos.z);
        this.scene.add(meter);
    });
  }

  private createPressureRegulationArea(pipeline: Pipeline): void {
    // 调压装置位置
    const regulatorPositions = [
        { x: 15, y: 2, z: -15 },
        { x: 20, y: 2, z: -15 }
    ];

    regulatorPositions.forEach(pos => {
        const regulator = pipeline.createRegulator();
        regulator.position.set(pos.x, pos.y, pos.z);
        this.scene.add(regulator);
    });
  }

  private createAuxiliaryFacilities(): void {
    // 添加控制室
    const building = new Building();
    const controlRoom = building.createControlRoom();
    controlRoom.position.set(-25, 0, -25);
    this.scene.add(controlRoom);

    // 添加消防设施
    const fireFighting = new FireFighting();
    const hydrant = fireFighting.createHydrant();
    hydrant.position.set(-20, 0, -20);
    this.scene.add(hydrant);
  }

  private createRoadSystem(): void {
    const road = new Road();
    
    // 主干道
    const mainRoad = road.createRoadSection(60);
    mainRoad.position.set(0, 0, -10);
    this.scene.add(mainRoad);
    
    // 支路
    const sideRoad1 = road.createRoadSection(30);
    sideRoad1.rotation.y = Math.PI / 2;
    sideRoad1.position.set(-15, 0, 5);
    this.scene.add(sideRoad1);
    
    const sideRoad2 = road.createRoadSection(30);
    sideRoad2.rotation.y = Math.PI / 2;
    sideRoad2.position.set(15, 0, 5);
    this.scene.add(sideRoad2);
    
    // 转弯
    const corner1 = road.createCorner();
    corner1.position.set(-15, 0, -10);
    this.scene.add(corner1);
    
    const corner2 = road.createCorner();
    corner2.rotation.y = -Math.PI / 2;
    corner2.position.set(15, 0, -10);
    this.scene.add(corner2);
  }

  private createGround(): THREE.Group {
    const ground = new THREE.Group();

    // 创建主地面
    const textureLoader = new THREE.TextureLoader();
    
    // 加载地面纹理
    const baseTexture = textureLoader.load('/textures/ground/concrete_diffuse.jpg');
    const normalTexture = textureLoader.load('/textures/ground/concrete_normal.jpg');
    const roughnessTexture = textureLoader.load('/textures/ground/concrete_roughness.jpg');
    
    // 设置纹理重复
    [baseTexture, normalTexture, roughnessTexture].forEach(texture => {
      texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(10, 10);
    });

    const groundGeometry = new THREE.PlaneGeometry(100, 100);
    const groundMaterial = new THREE.MeshStandardMaterial({
      map: baseTexture,
      normalMap: normalTexture,
      roughnessMap: roughnessTexture,
      roughness: 0.8,
      metalness: 0.2,
    });

    const mainGround = new THREE.Mesh(groundGeometry, groundMaterial);
    mainGround.rotation.x = -Math.PI / 2;
    mainGround.receiveShadow = true;

    // 创建草地边缘
    const grassTexture = textureLoader.load('/textures/ground/grass_diffuse.jpg');
    grassTexture.wrapS = grassTexture.wrapT = THREE.RepeatWrapping;
    grassTexture.repeat.set(20, 20);

    const grassGeometry = new THREE.PlaneGeometry(150, 150);
    const grassMaterial = new THREE.MeshStandardMaterial({
      map: grassTexture,
      roughness: 0.8,
    });

    const grass = new THREE.Mesh(grassGeometry, grassMaterial);
    grass.rotation.x = -Math.PI / 2;
    grass.position.y = -0.01; // 略低于主地面
    grass.receiveShadow = true;

    // 添加一些不规则性
    const noiseGeometry = new THREE.PlaneGeometry(100, 100, 50, 50);
    const vertices = noiseGeometry.attributes.position.array;
    for (let i = 0; i < vertices.length; i += 3) {
      if (i !== 1) { // 保持y坐标不变
        vertices[i] += (Math.random() - 0.5) * 0.3;
      }
    }
    noiseGeometry.attributes.position.needsUpdate = true;
    noiseGeometry.computeVertexNormals();

    const noiseMesh = new THREE.Mesh(
      noiseGeometry,
      new THREE.MeshStandardMaterial({
        roughness: 1,
        transparent: true,
        opacity: 0.5,
      })
    );
    noiseMesh.rotation.x = -Math.PI / 2;
    noiseMesh.position.y = 0.01;

    ground.add(grass);
    ground.add(mainGround);
    ground.add(noiseMesh);

    return ground;
  }

  private addLights(): void {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    this.scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 5, 5);
    directionalLight.castShadow = true;
    this.scene.add(directionalLight);
  }

  private addHelpers(): void {
    const gridHelper = new THREE.GridHelper(50, 50);
    gridHelper.position.y = 0.01; // 将网格稍微抬高一点，以避免z-fighting
    this.scene.add(gridHelper);

    const axesHelper = new THREE.AxesHelper(5);
    this.scene.add(axesHelper);
  }

  private animate = (): void => {
    requestAnimationFrame(this.animate);
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  };

  public resize(width: number, height: number): void {
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  public dispose(): void {
    this.renderer.dispose();
  }
} 