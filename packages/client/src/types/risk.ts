export interface RiskNode {
  id: string;
  title: string;
  description?: string;
  children?: RiskNode[];
  measures?: string[];
}

export const riskData: RiskNode = {
  id: 'root',
  title: '天然气站场风险分析',
  children: [
    {
      id: 'inspection',
      title: '巡检作业',
      children: [
        {
          id: 'inspection_mechanical',
          title: '机械伤害',
          description: '设备运行时进行检查可能造成的机械伤害'
        },
        {
          id: 'inspection_gas',
          title: '天然气中毒',
          description: '巡检过程中可能遇到的天然气泄漏导致中毒'
        },
        {
          id: 'inspection_fire',
          title: '火灾、爆炸',
          description: '天然气泄漏引发的火灾爆炸风险'
        },
        {
          id: 'inspection_noise',
          title: '噪音',
          description: '设备运行产生的噪音危害'
        }
      ]
    },
    {
      id: 'venting',
      title: '放空作业',
      children: [
        {
          id: 'venting_gas_leak',
          title: '天然气泄漏',
          description: '放空过程中的气体泄漏风险'
        },
        {
          id: 'venting_fire',
          title: '火灾、爆炸',
          description: '放空过程中的火灾爆炸风险'
        },
        {
          id: 'venting_mechanical',
          title: '机械伤害',
          description: '放空设备操作过程中的机械伤害'
        },
        {
          id: 'venting_airflow',
          title: '气流伤害',
          description: '高压气体放空造成的气流伤害'
        }
      ]
    },
    {
      id: 'drainage',
      title: '排污作业',
      children: [
        {
          id: 'drainage_gas',
          title: '天然气中毒',
          description: '排污过程中的天然气中毒风险'
        },
        {
          id: 'drainage_mechanical',
          title: '机械伤害',
          description: '排污设备操作过程中的机械伤害'
        },
        {
          id: 'drainage_fire',
          title: '火灾、爆炸',
          description: '排污过程中的火灾爆炸风险'
        }
      ],
      measures: [
        '排污前确认相关排污设备已退出运行，并挂牌',
        '严格按操作票要求实施排污操作'
      ]
    },
    {
      id: 'valve_maintenance',
      title: '阀门维护检修作业',
      children: [
        {
          id: 'valve_gas_leak',
          title: '天然气泄漏',
          description: '阀门维修过程中的气体泄漏'
        },
        {
          id: 'valve_mechanical',
          title: '机械伤害',
          description: '维修过程中的机械伤害'
        },
        {
          id: 'valve_fire',
          title: '火灾、爆炸',
          description: '维修过程中的火灾爆炸风险'
        },
        {
          id: 'valve_perforation',
          title: '阀门穿孔',
          description: '维修过程中可能发生的阀门穿孔'
        },
        {
          id: 'valve_pressure',
          title: '引压管爆裂',
          description: '压力过大导致引压管爆裂'
        }
      ]
    },
    {
      id: 'instrument',
      title: '仪表更换校验作业',
      children: [
        {
          id: 'instrument_gas',
          title: '天然气泄漏',
          description: '仪表更换过程中的气体泄漏'
        },
        {
          id: 'instrument_mechanical',
          title: '机械伤害',
          description: '更换校验过程中的机械伤害'
        },
        {
          id: 'instrument_fire',
          title: '火灾、爆炸',
          description: '仪表作业过程中的火灾爆炸风险'
        }
      ]
    },
    {
      id: 'electrical',
      title: '电气设备维护检修作业',
      children: [
        {
          id: 'electrical_shock',
          title: '触电',
          description: '电气作业过程中的触电风险'
        },
        {
          id: 'electrical_fire',
          title: '火灾、爆炸',
          description: '电气故障导致的火灾爆炸风险'
        },
        {
          id: 'electrical_power',
          title: '断电',
          description: '维修过程中的断电风险'
        },
        {
          id: 'electrical_misop',
          title: '误操作',
          description: '电气设备误操作风险'
        },
        {
          id: 'electrical_lightning',
          title: '雷击',
          description: '雷电天气的雷击风险'
        }
      ]
    },
    {
      id: 'pigging',
      title: '清管作业',
      children: [
        {
          id: 'pigging_mechanical',
          title: '机械伤害',
          description: '清管器操作过程中的机械伤害'
        },
        {
          id: 'pigging_gas',
          title: '天然气中毒',
          description: '清管作业过程中的气体中毒风险'
        },
        {
          id: 'pigging_stuck',
          title: '清管器卡球',
          description: '清管器在管道中卡住的风险'
        },
        {
          id: 'pigging_fire',
          title: '火灾、爆炸',
          description: '清管作业过程中的火灾爆炸风险'
        }
      ]
    }
  ]
}; 