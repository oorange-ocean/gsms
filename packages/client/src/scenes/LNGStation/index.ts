import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { Tank } from './models/Tank';
import { Pipeline } from './models/Pipeline';

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
    // 创建两个储罐
    const tank1 = new Tank();
    tank1.setPosition(-2, 7, 5);
    this.scene.add(tank1.getMesh());

    const tank2 = new Tank();
    tank2.setPosition(8, 7, -5);
    this.scene.add(tank2.getMesh());

    // 创建管道系统
    const pipeline = new Pipeline();
    
    // 连接两个储罐的主管道
    const mainPipe = pipeline.createStraightPipe(16);
    mainPipe.rotation.z = Math.PI / 2;
    mainPipe.position.set(0, 2, -5);  // 调整高度以匹配储罐接口
    this.scene.add(mainPipe);

    // 添加垂直管道和阀门
    const verticalPipe1 = pipeline.createStraightPipe(4);
    verticalPipe1.position.set(-8, 2, -5);
    this.scene.add(verticalPipe1);

    const valve1 = pipeline.createValve();
    valve1.position.set(-8, 4, -5);
    this.scene.add(valve1);

    const verticalPipe2 = pipeline.createStraightPipe(4);
    verticalPipe2.position.set(8, 2, -5);
    this.scene.add(verticalPipe2);

    const valve2 = pipeline.createValve();
    valve2.position.set(8, 4, -5);
    this.scene.add(valve2);

    // 添加前方输送管道
    const frontPipe = pipeline.createStraightPipe(10);
    frontPipe.rotation.x = Math.PI / 2;
    frontPipe.position.set(0, 2, 0);
    this.scene.add(frontPipe);

    // 添加弯头连接
    const elbow1 = pipeline.createElbow();
    elbow1.position.set(0, 2, -5);
    this.scene.add(elbow1);

    // 调整相机位置以更好地查看场景
    this.camera.position.set(25, 20, 25);
    this.camera.lookAt(0, 0, 0);
  }

  private createGround(): THREE.Mesh {
    const groundGeometry = new THREE.PlaneGeometry(50, 50);
    const groundMaterial = new THREE.MeshStandardMaterial({
      color: 0x999999,
      roughness: 0.8,
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    ground.position.y = 0; // 确保地面在 y=0 平面上
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