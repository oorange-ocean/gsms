export interface RiskNode {
  id: string;
  title: string;
  description: string;
  children?: RiskNode[];
  measures?: string[];
}

export const riskData: RiskNode = {
  id: 'root',
  title: '天然气站场风险分析',
  description: '天然气站场主要作业风险分析',
  children: [
    {
      id: 'poisoning',
      title: '中毒、窒息伤害',
      description: '因设备密闭性不强或存在缺陷导致天然气泄漏，可能造成人员中毒或窒息',
      measures: [
        '定期检查设备密封性',
        '配备便携式气体检测仪',
        '确保通风设施正常运行',
        '佩戴合适的防护设备',
        '制定应急预案并定期演练'
      ]
    },
    {
      id: 'electric',
      title: '触电伤害',
      description: '设备或线路破损漏电，以及违规操作可能导致触电事故',
      measures: [
        '定期检查电气设备和线路',
        '严格执行电气安全操作规程',
        '使用合格的绝缘工具',
        '保持电气设备接地良好',
        '雨天或潮湿环境下谨慎操作'
      ]
    },
    {
      id: 'noise',
      title: '噪声伤害',
      description: '设备运转产生的噪声可能导致听觉损伤和情绪影响',
      measures: [
        '佩戴防噪声耳罩或耳塞',
        '定期进行噪声检测',
        '采取减振降噪措施',
        '控制接触噪声时间',
        '定期进行听力检查'
      ]
    },
    {
      id: 'mechanical',
      title: '机械伤害',
      description: '违规操作或设备缺陷可能导致物体打击、焊缝开裂等机械伤害',
      measures: [
        '严格遵守设备操作规程',
        '定期检查设备状态',
        '及时维修或更换故障设备',
        '佩戴必要的防护用品',
        '加强作业人员培训'
      ]
    }
  ]
}; 