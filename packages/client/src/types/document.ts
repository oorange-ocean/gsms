export enum DocumentCategory {
  REGULATION = '法规制度',
  OPERATION = '操作规程',
  EMERGENCY = '应急预案',
  MAINTENANCE = '维护手册',
  TRAINING = '培训资料'
}

export interface Document {
  _id: string;
  title: string;
  description: string;
  uploadTime: string;
  fileSize: number;
  fileUrl: string;
  previewUrl: string;
} 