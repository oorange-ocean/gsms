import { Device, ProcessArea, PressureClass } from '../../types/device';

export const deviceSeeds: Partial<Device>[] = [
  {
    quickLink: 'http://monitor.example.com/device/HV206101',
    deviceCode: 'HV206101',
    processArea: ProcessArea.INLET,
    name: '杭甬杭湖站区主干线气液联动阀',
    pressureClass: PressureClass.CLASS400,
    specification: '800'
  },
  {
    quickLink: 'http://monitor.example.com/device/HV301101',
    deviceCode: 'HV301101',
    processArea: ProcessArea.INLET,
    name: '杭嘉线进站区主干线气液联动阀',
    pressureClass: PressureClass.CLASS400,
    specification: '800'
  },
  {
    quickLink: 'http://monitor.example.com/device/BV301102',
    deviceCode: 'BV301102',
    processArea: ProcessArea.INLET,
    name: '杭嘉线收球笼进口管线电动球阀',
    pressureClass: PressureClass.CLASS400,
    specification: '800'
  },
  {
    quickLink: 'http://monitor.example.com/device/BV301103',
    deviceCode: 'BV301103',
    processArea: ProcessArea.INLET,
    name: '杭嘉线进站管线电动球阀',
    pressureClass: PressureClass.CLASS400,
    specification: '600*500'
  },
  {
    quickLink: 'http://monitor.example.com/device/BV301104',
    deviceCode: 'BV301104',
    processArea: ProcessArea.INLET,
    name: '杭嘉线来气进转输东区管线电动球阀',
    pressureClass: PressureClass.CLASS400,
    specification: '600*500'
  },
  {
    quickLink: 'http://monitor.example.com/device/BV301105',
    deviceCode: 'BV301105',
    processArea: ProcessArea.INLET,
    name: '汇管H301501转输出站去杭嘉线电动球阀',
    pressureClass: PressureClass.CLASS400,
    specification: '400*350'
  },
  {
    quickLink: 'http://monitor.example.com/device/BV301106',
    deviceCode: 'BV301106',
    processArea: ProcessArea.INLET,
    name: '杭嘉线进站管线电动球阀旁通1#手动球阀',
    pressureClass: PressureClass.CLASS400,
    specification: '50*40'
  },
  {
    quickLink: 'http://monitor.example.com/device/BV301108',
    deviceCode: 'BV301108',
    processArea: ProcessArea.INLET,
    name: '杭嘉线进站管线电动球阀旁通2#手动球阀',
    pressureClass: PressureClass.CLASS400,
    specification: '50*40'
  },
  {
    quickLink: 'http://monitor.example.com/device/BV301109',
    deviceCode: 'BV301109',
    processArea: ProcessArea.INLET,
    name: '杭嘉线收球笼出口管线手动球阀',
    pressureClass: PressureClass.CLASS400,
    specification: '250*200'
  },
  {
    quickLink: 'http://monitor.example.com/device/BV301110',
    deviceCode: 'BV301110',
    processArea: ProcessArea.INLET,
    name: '杭嘉线来气进转输东区电动球阀旁通1#手动球阀',
    pressureClass: PressureClass.CLASS400,
    specification: '50*40'
  },
  {
    quickLink: 'http://monitor.example.com/device/BV301112',
    deviceCode: 'BV301112',
    processArea: ProcessArea.INLET,
    name: '杭嘉线来气进转输东区电动球阀旁通2#手动球阀',
    pressureClass: PressureClass.CLASS400,
    specification: '50*40'
  },
  {
    quickLink: 'http://monitor.example.com/device/BV301113',
    deviceCode: 'BV301113',
    processArea: ProcessArea.INLET,
    name: '杭嘉线来气越站去杭丽线管线电动球阀',
    pressureClass: PressureClass.CLASS400,
    specification: '300*250'
  },
  {
    quickLink: 'http://monitor.example.com/device/BV301114',
    deviceCode: 'BV301114',
    processArea: ProcessArea.INLET,
    name: '杭嘉线收球笼注水口手动球阀',
    pressureClass: PressureClass.CLASS400,
    specification: '50*40'
  },
  {
    quickLink: 'http://monitor.example.com/device/BV301115',
    deviceCode: 'BV301115',
    processArea: ProcessArea.INLET,
    name: '杭甬线来气进转输西区汇管H301202前电动球阀',
    pressureClass: PressureClass.CLASS400,
    specification: '300*250'
  },
  {
    quickLink: 'http://monitor.example.com/device/BV301116',
    deviceCode: 'BV301116',
    processArea: ProcessArea.INLET,
    name: '杭湖线来气进转输西区汇管H301202前电动球阀',
    pressureClass: PressureClass.CLASS400,
    specification: '350*300'
  },
  {
    quickLink: 'http://monitor.example.com/device/BV401101',
    deviceCode: 'BV401101',
    processArea: ProcessArea.FILTRATION,
    name: 'LNG过滤器进口管线电动球阀',
    pressureClass: PressureClass.CLASS300,
    specification: '400*350'
  },
  {
    quickLink: 'http://monitor.example.com/device/BV401102',
    deviceCode: 'BV401102',
    processArea: ProcessArea.FILTRATION,
    name: 'LNG过滤器出口管线电动球阀',
    pressureClass: PressureClass.CLASS300,
    specification: '400*350'
  },
  {
    quickLink: 'http://monitor.example.com/device/BV401103',
    deviceCode: 'BV401103',
    processArea: ProcessArea.FILTRATION,
    name: 'LNG过滤器旁通管线手动球阀',
    pressureClass: PressureClass.CLASS300,
    specification: '150*125'
  },
  {
    quickLink: 'http://monitor.example.com/device/BV501101',
    deviceCode: 'BV501101',
    processArea: ProcessArea.METERING,
    name: 'LNG计量装置A进口管线电动球阀',
    pressureClass: PressureClass.CLASS300,
    specification: '300*250'
  },
  {
    quickLink: 'http://monitor.example.com/device/BV501102',
    deviceCode: 'BV501102',
    processArea: ProcessArea.METERING,
    name: 'LNG计量装置A出口管线电动球阀',
    pressureClass: PressureClass.CLASS300,
    specification: '300*250'
  },
  {
    quickLink: 'http://monitor.example.com/device/BV501103',
    deviceCode: 'BV501103',
    processArea: ProcessArea.METERING,
    name: 'LNG计量装置B进口管线电动球阀',
    pressureClass: PressureClass.CLASS300,
    specification: '300*250'
  },
  {
    quickLink: 'http://monitor.example.com/device/BV601101',
    deviceCode: 'BV601101',
    processArea: ProcessArea.HEATING,
    name: 'LNG水浴式汽化器A进口管线电动球阀',
    pressureClass: PressureClass.CLASS300,
    specification: '250*200'
  },
  {
    quickLink: 'http://monitor.example.com/device/BV601102',
    deviceCode: 'BV601102',
    processArea: ProcessArea.HEATING,
    name: 'LNG水浴式汽化器A出口管线电动球阀',
    pressureClass: PressureClass.CLASS300,
    specification: '250*200'
  },
  {
    quickLink: 'http://monitor.example.com/device/BV601103',
    deviceCode: 'BV601103',
    processArea: ProcessArea.HEATING,
    name: 'LNG水浴式汽化器B进口管线电动球阀',
    pressureClass: PressureClass.CLASS300,
    specification: '250*200'
  },
  {
    quickLink: 'http://monitor.example.com/device/PCV701101',
    deviceCode: 'PCV701101',
    processArea: ProcessArea.PRESSURE_REGULATION,
    name: 'LNG调压装置A进口调压阀',
    pressureClass: PressureClass.CLASS300,
    specification: '200*150'
  },
  {
    quickLink: 'http://monitor.example.com/device/PCV701102',
    deviceCode: 'PCV701102',
    processArea: ProcessArea.PRESSURE_REGULATION,
    name: 'LNG调压装置A出口调压阀',
    pressureClass: PressureClass.CLASS150,
    specification: '200*150'
  },
  {
    quickLink: 'http://monitor.example.com/device/BV701103',
    deviceCode: 'BV701103',
    processArea: ProcessArea.PRESSURE_REGULATION,
    name: 'LNG调压装置旁通管线手动球阀',
    pressureClass: PressureClass.CLASS300,
    specification: '100*80'
  },
  {
    quickLink: 'http://monitor.example.com/device/BV801101',
    deviceCode: 'BV801101',
    processArea: ProcessArea.OUTLET,
    name: 'LNG出站管线电动球阀',
    pressureClass: PressureClass.CLASS150,
    specification: '400*350'
  },
  {
    quickLink: 'http://monitor.example.com/device/BV801102',
    deviceCode: 'BV801102',
    processArea: ProcessArea.OUTLET,
    name: 'LNG出站管线紧急切断阀',
    pressureClass: PressureClass.CLASS150,
    specification: '400*350'
  },
  {
    quickLink: 'http://monitor.example.com/device/BV801103',
    deviceCode: 'BV801103',
    processArea: ProcessArea.OUTLET,
    name: 'LNG出站计量后放空管线手动球阀',
    pressureClass: PressureClass.CLASS150,
    specification: '50*40'
  }
]; 