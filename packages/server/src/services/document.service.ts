import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Document, DocumentCategory } from '../types/document';

@Injectable()
export class DocumentService {
  constructor(
    @InjectModel(Document.name) private documentModel: Model<Document>,
  ) {}

  async findAll(category?: DocumentCategory): Promise<Document[]> {
    const query = category ? { category } : {};
    return this.documentModel.find(query).sort({ uploadTime: -1 }).exec();
  }

  async findOne(id: string): Promise<Document | null> {
    return this.documentModel.findById(id).exec();
  }
} 