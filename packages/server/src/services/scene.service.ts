import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Scene } from '../types/scene';

@Injectable()
export class SceneService {
  constructor(
    @InjectModel(Scene.name) private sceneModel: Model<Scene>
  ) {
    console.log('SceneService 已初始化');
  }

  async findAll(): Promise<Scene[]> {
    console.log('查询所有场景数据');
    return this.sceneModel.find().exec();
  }

  async findOne(id: string): Promise<Scene | null> {
    console.log('查询单个场景, ID:', id);
    return this.sceneModel.findById(id).exec();
  }

  async create(scene: Scene): Promise<Scene> {
    console.log('创建新场景:', scene);
    const newScene = new this.sceneModel(scene);
    return newScene.save();
  }

  async update(id: string, scene: Scene): Promise<Scene | null> {
    console.log('更新场景, ID:', id);
    return this.sceneModel.findByIdAndUpdate(id, scene, { new: true }).exec();
  }

  async remove(id: string): Promise<Scene | null> {
    console.log('删除场景, ID:', id);
    return this.sceneModel.findByIdAndDelete(id).exec();
  }
} 