const TOKEN_TIANDITU = '394404c8b901574fdc4cdf8c18a98448'
let measureurl = ''
let YX_STYLE = ''
let YXZJ_STYLE = ''
let BIGDATA_STYLE = ''
let STANDARD_STYLE = ''
let GZ_SCENE = ''
let dataServiceUrl = ''
let GLOBE_MAP = ''
let CHINA_MAP = ''
let METEOROLOGICAL_GRID_1HOUR = ''
let METEOROLOGICAL_GRID_3HOUR = ''
let METEOROLOGICAL_GRID_6HOUR = ''
let yongjiaBoundary = ''
let districtBoundary = []
let streetBoundary = []
let dizhizaihaijianceAry = []
let xzqhxs = ''
let xzqhxzjd = ''

const WWW_MAP = document.location.protocol + '//' + window.location.host
if (WWW_MAP.indexOf('http://pshyz.f3322.net:9000') >= 0 || WWW_MAP.indexOf('http://localhost') === 0) {
  measureurl = 'http://pshyz.f3322.net:8099/iserver/services/map-world/rest/maps/World'
  GZ_SCENE = 'http://pshyz.f3322.net:8099/iserver/services/3D-RES_PY_LC_Z1-SW_BM-2/rest/realspace'
  dataServiceUrl = 'http://pshyz.f3322.net:8099/iserver/services/data-wenzhouyingji/rest/data'
  YX_STYLE = 'http://10.36.245.203:8090/iserver/services/map-agscachev2-YJYX2019CGCS2000/rest/maps/YJ_YX_2019_CGCS2000'
  YXZJ_STYLE = 'http://10.36.245.203:8090/iserver/services/map-agscachev2-YJYXZJ2019CGCS2000/rest/maps/YJ_YXZJ_2019_CGCS2000'
  BIGDATA_STYLE = 'http://10.36.245.203:8090/iserver/services/map-agscachev2-YJDSJCGCS2000/rest/maps/YJ_DSJ_CGCS2000'
  STANDARD_STYLE = 'http://pshyz.f3322.net:8099/iserver/services/map-agscache-ZWPTSGWZCGCS2000/rest/maps/ZWPT_SG_WZ_CGCS2000'
  GLOBE_MAP = 'http://10.36.245.203:8090/iserver/services/map-agscachev2-YJDSJCGCS2000/rest/maps/YJ_DSJ_CGCS2000'
  //CHINA_MAP = 'http://10.36.245.203:8090/iserver/services/map-agscachev2-DSJZG/rest/maps/DSJ_ZG'
  //CHINA_MAP ='http://172.20.83.223:8091/iserver/services/map-agscachev2-YJDSJCGCS2000/rest/maps/YJ_DSJ_CGCS2000'
  CHINA_MAP ='http://10.36.245.203:8090/iserver/services/map-agscachev2-YJDSJCGCS2000/rest/maps/YJ_DSJ_CGCS2000'
  METEOROLOGICAL_GRID_1HOUR = 'http://10.36.234.83:8090/iserver/services/map-Weather_Pr/rest/maps/Pr01%4010.36.234.85_Weather_RainFall'
  METEOROLOGICAL_GRID_3HOUR = 'http://10.36.234.83:8090/iserver/services/map-Weather_Pr/rest/maps/Pr03%4010.36.234.85_Weather_RainFall'
  METEOROLOGICAL_GRID_6HOUR = 'http://10.36.234.83:8090/iserver/services/map-Weather_Pr/rest/maps/Pr06%4010.36.234.85_Weather_RainFall'
  yongjiaBoundary = 'http://10.36.234.83:8090/iserver/services/map-XZQH/rest/maps/yjx_GL'
  districtBoundary = [
    {
      name: '永嘉县',
      tiles: 'http://10.36.234.83:8090/iserver/services/map-XZQH/rest/maps/yjx_GL'
    },
    {
      name: '泰顺县',
      tiles: 'http://10.36.234.83:8090/iserver/services/map-XZQH/rest/maps/tsx_GL'
    },
    {
      name: '苍南县',
      tiles: 'http://10.36.234.83:8090/iserver/services/map-XZQH/rest/maps/cnx_GL'
    },
    {
      name: '文成县',
      tiles: 'http://10.36.234.83:8090/iserver/services/map-XZQH/rest/maps/wcx_GL'
    },
    {
      name: '平阳县',
      tiles: 'http://10.36.234.83:8090/iserver/services/map-XZQH/rest/maps/pyx_GL'
    },
    {
      name: '瑞安市',
      tiles: 'http://10.36.234.83:8090/iserver/services/map-XZQH/rest/maps/ras_GL'
    },
    {
      name: '瓯海区',
      tiles: 'http://10.36.234.83:8090/iserver/services/map-XZQH/rest/maps/ohq_GL'
    },
    {
      name: '经开区',
      tiles: 'http://10.36.234.83:8090/iserver/services/map-XZQH/rest/maps/jkq_GL'
    },
    {
      name: '洞头区',
      tiles: 'http://10.36.234.83:8090/iserver/services/map-XZQH/rest/maps/dtq_GL'
    },
    {
      name: '鹿城区',
      tiles: 'http://10.36.234.83:8090/iserver/services/map-XZQH/rest/maps/lcq_GL'
    },
    {
      name: '乐清市',
      tiles: 'http://10.36.234.83:8090/iserver/services/map-XZQH/rest/maps/yqs_GL'
    },
    {
      name: '龙港市',
      tiles: 'http://10.36.234.83:8090/iserver/services/map-XZQH/rest/maps/lgs_GL'
    },
    {
      name: '龙湾区',
      tiles: 'http://10.36.234.83:8090/iserver/services/map-XZQH/rest/maps/lwq_GL'
    },
    {
      name: '瓯江口',
      tiles: 'http://10.36.234.83:8090/iserver/services/map-XZQH/rest/maps/ojk_GL'
    },
    {
      name: '温州市',
      tiles: 'http://10.36.234.83:8090/iserver/services/map-XZQH/rest/maps/XZQUXS'
    }
  ]
  streetBoundary = [
    {
      name: '永嘉县',
      tiles: 'http://10.36.234.83:8090/iserver/services/map-XZQH/rest/maps/yjx_xzjd'
    },
    {
      name: '泰顺县',
      tiles: 'http://10.36.234.83:8090/iserver/services/map-XZQH/rest/maps/tsx_xzjd'
    },
    {
      name: '苍南县',
      tiles: 'http://10.36.234.83:8090/iserver/services/map-XZQH/rest/maps/cnx_xzjd'
    },
    {
      name: '文成县',
      tiles: 'http://10.36.234.83:8090/iserver/services/map-XZQH/rest/maps/wcx_xzjd'
    },
    {
      name: '平阳县',
      tiles: 'http://10.36.234.83:8090/iserver/services/map-XZQH/rest/maps/pyx_xzjd'
    },
    {
      name: '瑞安市',
      tiles: 'http://10.36.234.83:8090/iserver/services/map-XZQH/rest/maps/ras_xzjd'
    },
    {
      name: '瓯海区',
      tiles: 'http://10.36.234.83:8090/iserver/services/map-XZQH/rest/maps/ohq_xzjd'
    },
    {
      name: '经开区',
      tiles: 'http://10.36.234.83:8090/iserver/services/map-XZQH/rest/maps/jkq_xzjd'
    },
    {
      name: '洞头区',
      tiles: 'http://10.36.234.83:8090/iserver/services/map-XZQH/rest/maps/dtq_xzjd'
    },
    {
      name: '鹿城区',
      tiles: 'http://10.36.234.83:8090/iserver/services/map-XZQH/rest/maps/lcq_xzjd'
    },
    {
      name: '乐清市',
      tiles: 'http://10.36.234.83:8090/iserver/services/map-XZQH/rest/maps/yqs_xzjd'
    },
    {
      name: '龙港市',
      tiles: 'http://10.36.234.83:8090/iserver/services/map-XZQH/rest/maps/lgs_xzjd'
    },
    {
      name: '龙湾区',
      tiles: 'http://10.36.234.83:8090/iserver/services/map-XZQH/rest/maps/lwq_xzjd'
    },
    {
      name: '瓯江口',
      tiles: 'http://10.36.234.83:8090/iserver/services/map-XZQH/rest/maps/ojk_xzjd'
    },
    {
      name: '温州市',
      tiles: 'http://10.36.234.83:8090/iserver/services/map-XZQH/rest/maps/XZQHXZJD'
    }
  ]
  dizhizaihaijianceAry = [
    {
      name: 'GPS设备',
      alias: 'gpsDevice',
      icon: './static/gitimage/jianceshebei/GPS.png'
    },
    {
      name: '雨量设备',
      alias: 'yuliangDevice',
      icon: './static/gitimage/jianceshebei/yuliang.png'
    },
    {
      name: '位移设备',
      alias: 'weiyiDevice',
      icon: './static/gitimage/jianceshebei/dibiaoweiyi.png'
    },
    {
      name: '倾角设备',
      alias: 'qingjiaoDevice',
      icon: './static/gitimage/jianceshebei/shuangzhouqingxie.png'
    },
    {
      name: '水位',
      alias: 'shuiwei',
      icon: './static/gitimage/jianceshebei/shuiwei.png'
    },
    {
      name: '深部位移',
      alias: 'shenbuweiyi',
      icon: './static/gitimage/jianceshebei/shenbuweiyi.png'
    },
    {
      name: '土壤水分传感器',
      alias: 'turangshuifenDevice',
      icon: './static/gitimage/jianceshebei/turangshuifenchuanganqi.png'
    }
  ]
  xzqhxs = 'http://pshyz.f3322.net:8099/iserver/services/map-XZQH/rest/maps/XZQUXS'
  xzqhxzjd = 'http://pshyz.f3322.net:8099/iserver/services/map-XZQH/rest/maps/XZQHXZJD'
} else {
  measureurl = 'http://10.36.234.83:8090/iserver/services/map-world/rest/maps/World'
  GZ_SCENE = 'http://172.20.83.218:8090/iserver/services/3D-RES_PY_LC_Z1-SW_BM/rest/realspace'
  dataServiceUrl = 'http://172.20.83.218:8090/iserver/services/data-wenzhouyingji/rest/data'
  YX_STYLE = 'http://10.36.245.203:8090/iserver/services/map-agscachev2-YJYX2019CGCS2000/rest/maps/YJ_YX_2019_CGCS2000'
  YXZJ_STYLE = 'http://10.36.245.203:8090/iserver/services/map-agscachev2-YJYXZJ2019CGCS2000/rest/maps/YJ_YXZJ_2019_CGCS2000'
  BIGDATA_STYLE = 'http://10.36.245.203:8090/iserver/services/map-agscachev2-YJDSJCGCS2000/rest/maps/YJ_DSJ_CGCS2000'
  STANDARD_STYLE = 'http://10.36.245.203:8090/iserver/services/map-agscachev2-YJSGBZB2019CGCS2000/rest/maps/YJ_SG_BZB_2019_CGCS2000'
  GLOBE_MAP = 'http://10.36.245.203:8090/iserver/services/map-agscachev2-YJDSJCGCS2000/rest/maps/YJ_DSJ_CGCS2000'
  //CHINA_MAP = 'http://10.36.245.203:8090/iserver/services/map-agscachev2-DSJZG/rest/maps/DSJ_ZG'
  CHINA_MAP = 'http://172.20.83.223:8091/iserver/services/map-agscachev2-YJDSJCGCS2000/rest/maps/YJ_DSJ_CGCS2000'
  METEOROLOGICAL_GRID_1HOUR = 'http://10.36.234.83:8090/iserver/services/map-Weather_Pr/rest/maps/Pr01%4010.36.234.85_Weather_RainFall'
  METEOROLOGICAL_GRID_3HOUR = 'http://10.36.234.83:8090/iserver/services/map-Weather_Pr/rest/maps/Pr03%4010.36.234.85_Weather_RainFall'
  METEOROLOGICAL_GRID_6HOUR = 'http://10.36.234.83:8090/iserver/services/map-Weather_Pr/rest/maps/Pr06%4010.36.234.85_Weather_RainFall'
  yongjiaBoundary = 'http://10.36.234.83:8090/iserver/services/map-XZQH/rest/maps/yjx_GL'
  districtBoundary = [
    {
      name: '永嘉县',
      tiles: 'http://10.36.234.83:8090/iserver/services/map-XZQH/rest/maps/yjx_GL'
    },
    {
      name: '泰顺县',
      tiles: 'http://10.36.234.83:8090/iserver/services/map-XZQH/rest/maps/tsx_GL'
    },
    {
      name: '苍南县',
      tiles: 'http://10.36.234.83:8090/iserver/services/map-XZQH/rest/maps/cnx_GL'
    },
    {
      name: '文成县',
      tiles: 'http://10.36.234.83:8090/iserver/services/map-XZQH/rest/maps/wcx_GL'
    },
    {
      name: '平阳县',
      tiles: 'http://10.36.234.83:8090/iserver/services/map-XZQH/rest/maps/pyx_GL'
    },
    {
      name: '瑞安市',
      tiles: 'http://10.36.234.83:8090/iserver/services/map-XZQH/rest/maps/ras_GL'
    },
    {
      name: '瓯海区',
      tiles: 'http://10.36.234.83:8090/iserver/services/map-XZQH/rest/maps/ohq_GL'
    },
    {
      name: '经开区',
      tiles: 'http://10.36.234.83:8090/iserver/services/map-XZQH/rest/maps/jkq_GL'
    },
    {
      name: '洞头区',
      tiles: 'http://10.36.234.83:8090/iserver/services/map-XZQH/rest/maps/dtq_GL'
    },
    {
      name: '鹿城区',
      tiles: 'http://10.36.234.83:8090/iserver/services/map-XZQH/rest/maps/lcq_GL'
    },
    {
      name: '乐清市',
      tiles: 'http://10.36.234.83:8090/iserver/services/map-XZQH/rest/maps/yqs_GL'
    },
    {
      name: '龙港市',
      tiles: 'http://10.36.234.83:8090/iserver/services/map-XZQH/rest/maps/lgs_GL'
    },
    {
      name: '龙湾区',
      tiles: 'http://10.36.234.83:8090/iserver/services/map-XZQH/rest/maps/lwq_GL'
    },
    {
      name: '瓯江口',
      tiles: 'http://10.36.234.83:8090/iserver/services/map-XZQH/rest/maps/ojk_GL'
    },
    {
      name: '温州市',
      tiles: 'http://10.36.234.83:8090/iserver/services/map-XZQH/rest/maps/XZQUXS'
    }
  ]
  streetBoundary = [
    {
      name: '永嘉县',
      tiles: 'http://10.36.234.83:8090/iserver/services/map-XZQH/rest/maps/yjx_xzjd'
    },
    {
      name: '泰顺县',
      tiles: 'http://10.36.234.83:8090/iserver/services/map-XZQH/rest/maps/tsx_xzjd'
    },
    {
      name: '苍南县',
      tiles: 'http://10.36.234.83:8090/iserver/services/map-XZQH/rest/maps/cnx_xzjd'
    },
    {
      name: '文成县',
      tiles: 'http://10.36.234.83:8090/iserver/services/map-XZQH/rest/maps/wcx_xzjd'
    },
    {
      name: '平阳县',
      tiles: 'http://10.36.234.83:8090/iserver/services/map-XZQH/rest/maps/pyx_xzjd'
    },
    {
      name: '瑞安市',
      tiles: 'http://10.36.234.83:8090/iserver/services/map-XZQH/rest/maps/ras_xzjd'
    },
    {
      name: '瓯海区',
      tiles: 'http://10.36.234.83:8090/iserver/services/map-XZQH/rest/maps/ohq_xzjd'
    },
    {
      name: '经开区',
      tiles: 'http://10.36.234.83:8090/iserver/services/map-XZQH/rest/maps/jkq_xzjd'
    },
    {
      name: '洞头区',
      tiles: 'http://10.36.234.83:8090/iserver/services/map-XZQH/rest/maps/dtq_xzjd'
    },
    {
      name: '鹿城区',
      tiles: 'http://10.36.234.83:8090/iserver/services/map-XZQH/rest/maps/lcq_xzjd'
    },
    {
      name: '乐清市',
      tiles: 'http://10.36.234.83:8090/iserver/services/map-XZQH/rest/maps/yqs_xzjd'
    },
    {
      name: '龙港市',
      tiles: 'http://10.36.234.83:8090/iserver/services/map-XZQH/rest/maps/lgs_xzjd'
    },
    {
      name: '龙湾区',
      tiles: 'http://10.36.234.83:8090/iserver/services/map-XZQH/rest/maps/lwq_xzjd'
    },
    {
      name: '瓯江口',
      tiles: 'http://10.36.234.83:8090/iserver/services/map-XZQH/rest/maps/ojk_xzjd'
    },
    {
      name: '温州市',
      tiles: 'http://10.36.234.83:8090/iserver/services/map-XZQH/rest/maps/XZQHXZJD'
    }
  ]
  dizhizaihaijianceAry = [
    {
      name: 'GPS设备',
      alias: 'gpsDevice',
      icon: './static/gitimage/jianceshebei/GPS.png'
    },
    {
      name: '雨量设备',
      alias: 'yuliangDevice',
      icon: './static/gitimage/jianceshebei/yuliang.png'
    },
    {
      name: '位移设备',
      alias: 'weiyiDevice',
      icon: './static/gitimage/jianceshebei/dibiaoweiyi.png'
    },
    {
      name: '倾角设备',
      alias: 'qingjiaoDevice',
      icon: './static/gitimage/jianceshebei/shuangzhouqingxie.png'
    },
    {
      name: '水位',
      alias: 'shuiwei',
      icon: './static/gitimage/jianceshebei/shuiwei.png'
    },
    {
      name: '深部位移',
      alias: 'shenbuweiyi',
      icon: './static/gitimage/jianceshebei/shenbuweiyi.png'
    },
    {
      name: '土壤水分传感器',
      alias: 'turangshuifenDevice',
      icon: './static/gitimage/jianceshebei/turangshuifenchuanganqi.png'
    }
  ]
  xzqhxs = 'http://10.36.234.83:8090/iserver/services/map-XZQH/rest/maps/XZQUXS'
  xzqhxzjd = 'http://10.36.234.83:8090/iserver/services/map-XZQH/rest/maps/XZQHXZJD'
}

export default {
  measureurl,
  TOKEN_TIANDITU,
  YX_STYLE,
  YXZJ_STYLE,
  BIGDATA_STYLE,
  STANDARD_STYLE,
  GZ_SCENE,
  dataServiceUrl,
  GLOBE_MAP,
  CHINA_MAP,
  METEOROLOGICAL_GRID_1HOUR,
  METEOROLOGICAL_GRID_3HOUR,
  METEOROLOGICAL_GRID_6HOUR,
  yongjiaBoundary,
  districtBoundary,
  streetBoundary,
  dizhizaihaijianceAry,
  xzqhxs,
  xzqhxzjd
}
