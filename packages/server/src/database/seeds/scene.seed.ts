import { Scene } from '../../types/scene';

export const sceneSeeds: Partial<Scene>[] = [
  {
    name: '接收站全景',
    description: '惠州LNG接收站全景视图,占地面积约50公顷,年处理能力600万吨。',
    location: {
      lng: -74.0066,
      lat: 40.7135,
      zoom: 16,
      pitch: 60,
      bearing: -17.6
    },
    imageUrl: '/images/scenes/overview.jpg',
    audioUrl: '/audio/scenes/overview.mp3',
    videoUrl: '/video/scenes/overview.mp4',
    tags: ['全景', '鸟瞰']
  },
  {
    name: '码头区',
    description: '码头区配备2个泊位,可停靠5-26.7万方LNG船舶。',
    location: {
      lng: -74.0086,
      lat: 40.7155,
      zoom: 17,
      pitch: 45,
      bearing: 0
    },
    imageUrl: '/images/scenes/dock.jpg',
    audioUrl: '/audio/scenes/dock.mp3',
    tags: ['码头', '泊位']
  },
  {
    name: '储罐区',
    description: '储罐区设有4座16万方全容式LNG储罐,总库容64万方。',
    location: {
      lng: -74.0046,
      lat: 40.7115,
      zoom: 17,
      pitch: 45,
      bearing: 30
    },
    imageUrl: '/images/scenes/tank.jpg',
    videoUrl: '/video/scenes/tank.mp4',
    tags: ['储罐', '储存']
  }
]; 