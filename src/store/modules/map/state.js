const state = {
  collapse1: false, // 折叠左侧
  collapse2: false, // 折叠右侧
  splitScreen: false, // 分屏是否开启
  legendShow: true, // 显示图例
  tree: [], // 左侧树数据
  // currentMapType: 'juhe', // 'fourColorMap', // 地图类型  四色图
  currentMapType: 'sandian', // 地图类型  四色图
  treeCheckedList: [], // 所有选中的树和地图点的数据
  typeIndex: 0, // 底部初始激活下标
  currentOnePoint: {}, // 地图当前图层的数据
  mapLoaded: false, // 地图底图是否加载完毕
  nameList: [],
  specalTreeName: '' // 根据名称展示指定tree节点
}
export default state