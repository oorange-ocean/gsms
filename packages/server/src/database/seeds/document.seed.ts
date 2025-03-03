import { Document, DocumentCategory } from '../../types/document';

export const documentSeeds: Partial<Document>[] = [
  {
    title: 'LNG站场安全操作规程',
    category: DocumentCategory.OPERATION,
    description: '详细介绍LNG站场日常操作的安全规范和注意事项',
    fileUrl: '/documents/lng-safety-operation.pdf',
    previewUrl: '/previews/lng-safety-operation.pdf',
    uploadTime: new Date('2024-01-15'),
    fileSize: 2048576, // 2MB
    fileType: 'application/pdf'
  },
  {
    title: '天然气行业标准汇编',
    category: DocumentCategory.REGULATION,
    description: '最新版本的天然气行业相关标准文件集合',
    fileUrl: '/documents/gas-industry-standards.pdf',
    previewUrl: '/previews/gas-industry-standards.pdf',
    uploadTime: new Date('2024-02-01'),
    fileSize: 5242880, // 5MB
    fileType: 'application/pdf'
  },
  {
    title: 'LNG泄漏应急处置方案',
    category: DocumentCategory.EMERGENCY,
    description: 'LNG泄漏时的应急响应流程和处置措施',
    fileUrl: '/documents/lng-leak-emergency.pdf',
    previewUrl: '/previews/lng-leak-emergency.pdf',
    uploadTime: new Date('2024-02-15'),
    fileSize: 1048576, // 1MB
    fileType: 'application/pdf'
  },
  {
    title: 'LNG站场设备维护手册',
    category: DocumentCategory.MAINTENANCE,
    description: '站场各类设备的日常维护和保养指南',
    fileUrl: '/documents/equipment-maintenance.pdf',
    previewUrl: '/previews/equipment-maintenance.pdf',
    uploadTime: new Date('2024-02-20'),
    fileSize: 3145728, // 3MB
    fileType: 'application/pdf'
  },
  {
    title: '新员工安全培训教材',
    category: DocumentCategory.TRAINING,
    description: '针对新入职员工的安全知识培训材料',
    fileUrl: '/documents/new-employee-safety.pdf',
    previewUrl: '/previews/new-employee-safety.pdf',
    uploadTime: new Date('2024-03-01'),
    fileSize: 4194304, // 4MB
    fileType: 'application/pdf'
  },
  {
    title: 'LNG工艺流程操作手册',
    category: DocumentCategory.OPERATION,
    description: '详细说明LNG站场各工艺环节的操作流程',
    fileUrl: '/documents/lng-process-operation.pdf',
    previewUrl: '/previews/lng-process-operation.pdf',
    uploadTime: new Date('2024-03-05'),
    fileSize: 2621440, // 2.5MB
    fileType: 'application/pdf'
  },
  {
    title: '特种设备安全技术规范',
    category: DocumentCategory.REGULATION,
    description: '压力容器等特种设备的安全技术要求',
    fileUrl: '/documents/special-equipment-safety.pdf',
    previewUrl: '/previews/special-equipment-safety.pdf',
    uploadTime: new Date('2024-03-10'),
    fileSize: 3670016, // 3.5MB
    fileType: 'application/pdf'
  },
  {
    title: '火灾应急预案',
    category: DocumentCategory.EMERGENCY,
    description: '站场发生火灾时的应急处置预案',
    fileUrl: '/documents/fire-emergency.pdf',
    previewUrl: '/previews/fire-emergency.pdf',
    uploadTime: new Date('2024-03-15'),
    fileSize: 1572864, // 1.5MB
    fileType: 'application/pdf'
  },
  {
    title: '压缩机维护保养规程',
    category: DocumentCategory.MAINTENANCE,
    description: '压缩机设备的维护保养技术要求',
    fileUrl: '/documents/compressor-maintenance.pdf',
    previewUrl: '/previews/compressor-maintenance.pdf',
    uploadTime: new Date('2024-03-20'),
    fileSize: 2097152, // 2MB
    fileType: 'application/pdf'
  },
  {
    title: '工艺操作技能培训教材',
    category: DocumentCategory.TRAINING,
    description: '站场工艺操作技能提升培训材料',
    fileUrl: '/documents/process-operation-training.pdf',
    previewUrl: '/previews/process-operation-training.pdf',
    uploadTime: new Date('2024-03-25'),
    fileSize: 3145728, // 3MB
    fileType: 'application/pdf'
  }
]; 