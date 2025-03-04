import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { SceneService } from '../services/scene.service';
import { Scene } from '../types/scene';

@Controller('scenes')
export class SceneController {
  constructor(private readonly sceneService: SceneService) {
    console.log('SceneController 已初始化');
  }

  @Get()
  async findAll(): Promise<Scene[]> {
    console.log('收到获取所有场景请求');
    return this.sceneService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Scene | null> {
    console.log('收到获取单个场景请求, ID:', id);
    return this.sceneService.findOne(id);
  }

  @Post()
  async create(@Body() scene: Scene): Promise<Scene> {
    console.log('收到创建场景请求:', scene);
    return this.sceneService.create(scene);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() scene: Scene): Promise<Scene | null> {
    console.log('收到更新场景请求, ID:', id);
    return this.sceneService.update(id, scene);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<Scene | null> {
    console.log('收到删除场景请求, ID:', id);
    return this.sceneService.remove(id);
  }
} 