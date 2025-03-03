import { Controller, Get, Param, Query } from '@nestjs/common';
import { DocumentService } from '../services/document.service';
import { Document, DocumentCategory } from '../types/document';

@Controller('documents')
export class DocumentController {
  constructor(private readonly documentService: DocumentService) {
    console.log('DocumentController 已初始化');
  }

  @Get()
  async findAll(@Query('category') category?: DocumentCategory): Promise<Document[]> {
    console.log('收到获取文档列表请求, 类别:', category);
    const documents = await this.documentService.findAll(category);
    console.log('返回文档数量:', documents.length);
    return documents;
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Document | null> {
    console.log('收到获取单个文档请求, ID:', id);
    const document = await this.documentService.findOne(id);
    if (!document) {
      console.log('未找到文档');
    }
    return document;
  }
} 