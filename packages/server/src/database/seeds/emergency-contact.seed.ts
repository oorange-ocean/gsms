import { EmergencyContact } from '../../types/emergency-contact';

export const emergencyContacts: Partial<EmergencyContact>[] = [
  {
    name: '张三',
    title: '应急领导小组组长',
    department: '安全生产部',
    phone: '0755-12345678',
    mobile: '13800138000',
    responsibility: '总体负责事故应急救援工作',
    order: 1
  },
  {
    name: '李四',
    title: '应急处置指挥长',
    department: '运行管理部',
    phone: '0755-12345679',
    mobile: '13800138001',
    responsibility: '现场应急救援指挥工作',
    order: 2
  },
  {
    name: '王五',
    title: '应急现场处置组长',
    department: '设备维护部',
    phone: '0755-12345680',
    mobile: '13800138002',
    responsibility: '现场救援工作实施',
    order: 3
  },
  {
    name: '赵六',
    title: '医疗救护组组长',
    department: '医务室',
    phone: '0755-12345681',
    mobile: '13800138003',
    responsibility: '伤员救治与护理',
    order: 4
  },
  {
    name: '消防支队',
    title: '消防救援',
    department: '地方消防部门',
    phone: '119',
    mobile: '-',
    responsibility: '火灾扑救、人员搜救',
    order: 5
  }
]; 