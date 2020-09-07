/*
 * @Author: eds
 * @Date: 2020-07-29 16:10:06
 * @LastEditTime: 2020-08-05 14:09:59
 * @LastEditors: eds
 * @Description:
 * @FilePath: \wzsjjt-bd-visual\src\config\server\cesiumTreeOption.js
 */
const TOP_LEVEL_OPTION = [
  {
    label: "白模",
    url:
      //"http://172.20.83.223:8098/iserver/services/3D-CM_LC/rest/realspace/datas/RES_LC_EraseMAX_Z_Model@baimo/config"
      "https://ditu.wzcitybrain.com/iserver/services/3D-mongodb/rest/realspace/datas/RES_LC_Model@baimo/config"
  },
  {
    label: "2012精模",
    url:
      "http://172.20.83.223:8098/iserver/services/3D-MAX_LuCheng/rest/realspace/datas/%E5%B8%82%E5%8C%BA_2012/config",
    dataurl:
      "http://172.20.83.223:8098/iserver/services/data-ChengShiJingMo/rest/data",
    dataBind: {
      dataSourceName: "精模_市区",
      dataSetName: "max_2012"
    },
    camera: {
      x: -2877074.5261789295,
      y: 4842678.649871697,
      z: 2993284.6421134197
    },
    cameraDone: true
  },
  {
    label: "2017精模",
    url:
      "http://172.20.83.223:8098/iserver/services/3D-MAX_LuCheng/rest/realspace/datas/%E5%B8%82%E5%8C%BA_2017/config",
    dataurl:
      "http://172.20.83.223:8098/iserver/services/data-ChengShiJingMo/rest/data",
    dataBind: {
      dataSourceName: "精模_市区",
      dataSetName: "max_2017"
    },
    camera: {
      x: -2877074.5261789295,
      y: 4842678.649871697,
      z: 2993284.6421134197
    },
    cameraDone: true
  },
  /*   {
      label: "山区村落自然灾害易发区",
      url:
        "http://10.36.234.83:8090/iserver/services/map-FXFX_DATA/rest/maps/FXFX_YJ_ComprehensiveScore",
      vectorTile: true
    } */
];
//这里用于添加BIM的图层勾选
//componentKey 是用于来绑定btn按钮的值
const BIM_GRAPHIS_OPTION = [
  {
    label: "安置房BIM分析",
    busEvent: "cesium-3d-event",
    componentKey: "3d2"
  },
  {
    label: "机场BIM场景",
    busEvent: "cesium-3d-event",
    componentKey: "3d3"
  },
  {
    label: "S1线轨道BIM场景",
    busEvent: "cesium-3d-event",
    componentKey: "3d5",
  }
];
//永嘉
const LEAN_GRAPHIS_OPTION_YJ_HT = [
  {
    label: "埭下村",
    url:"",
    camera: {
      x: -2875396.824866244,
      y: 4843322.049050793,
      z: 2993500.7331779394
    },
    cameraDone: true
  }
];
const LEAN_GRAPHIS_OPTION_YJ_JX = [
  {
    label: "黄山村",
    url:"http://172.20.83.223:8098/iserver/services/3D-QX_LC_2016_2/rest/realspace/datas/QX_LC_HuangShanCun",
    camera: {
      x: -2875396.824866244,
      y: 4843322.049050793,
      z: 2993500.7331779394
    },
    cameraDone: true
  }
];
const LEAN_GRAPHIS_OPTION_YJ_DC = [
  {
    label: "林村",
    url:"http://172.20.83.223:8098/iserver/services/3D-QX_LC_2016_2/rest/realspace/datas/QX_LC_LinCun",
    camera: {
      x: -2875396.824866244,
      y: 4843322.049050793,
      z: 2993500.7331779394
    },
    cameraDone: true
  }
];
const LEAN_GRAPHIS_OPTION_YJ_FL = [
  {
    label: "外垟村",
    url:"http://172.20.83.223:8098/iserver/services/3D-QX_LC_2016_2/rest/realspace/datas/QX_LC_WaiYangCun",
    camera: {
      x: -2875396.824866244,
      y: 4843322.049050793,
      z: 2993500.7331779394
    },
    cameraDone: true
  }
];
const LEAN_GRAPHIS_OPTION_YJ_YT = [
  {
    label: "西塘村",
    url:"http://172.20.83.223:8098/iserver/services/3D-QX_LC_2016_2/rest/realspace/datas/QX_LC_XiTangCun",
    camera: {
      x: -2875396.824866244,
      y: 4843322.049050793,
      z: 2993500.7331779394
    },
    cameraDone: true
  }
];
//文成
const LEAN_GRAPHIS_OPTION_WC_NT = [
  {
    label: "西塘村",
    url:"http://172.20.83.223:8098/iserver/services/3D-QX_LC_2016_2/rest/realspace/datas/QX_LC_XiTangCun",
    camera: {
      x: -2875396.824866244,
      y: 4843322.049050793,
      z: 2993500.7331779394
    },
    cameraDone: true
  }
];
const LEAN_GRAPHIS_OPTION_WC_TL = [
  {
    label: "西塘村",
    url:"http://172.20.83.223:8098/iserver/services/3D-QX_LC_2016_2/rest/realspace/datas/QX_LC_XiTangCun",
    camera: {
      x: -2875396.824866244,
      y: 4843322.049050793,
      z: 2993500.7331779394
    },
    cameraDone: true
  }
];
//瑞安 
const LEAN_GRAPHIS_OPTION_RA_FY = [];
const LEAN_GRAPHIS_OPTION_RA_GL = [];
const LEAN_GRAPHIS_OPTION_RA_XJ = [];
const LEAN_GRAPHIS_OPTION_RA_TX = [];
const LEAN_GRAPHIS_OPTION_RA_MY = [];
const LEAN_GRAPHIS_OPTION_RA_TS = [];
//平阳
const LEAN_GRAPHIS_OPTION_PY_NC = [];
const LEAN_GRAPHIS_OPTION_PY_SM = [];
const LEAN_GRAPHIS_OPTION_PY_AJ = [];
//瓯海
const LEAN_GRAPHIS_OPTION_OH_SY = [];
const LEAN_GRAPHIS_OPTION_OH_LQ = [];
const LEAN_GRAPHIS_OPTION_OH_NB = [];
const LEAN_GRAPHIS_OPTION_OH_ZY = [];
const LEAN_GRAPHIS_OPTION_OH_TT = [];
const LEAN_GRAPHIS_OPTION_OH_PQ = [];
const LEAN_GRAPHIS_OPTION_OH_GX = [];
//龙湾
const LEAN_GRAPHIS_OPTION_LW_YX = [];
const LEAN_GRAPHIS_OPTION_LW_PZ = [];
const LEAN_GRAPHIS_OPTION_LW_ZY = [];
//乐清
const LEAN_GRAPHIS_OPTION_YQ_HQ = [];
const LEAN_GRAPHIS_OPTION_YQ_LS = [];
const LEAN_GRAPHIS_OPTION_YQ_BB = [];
const LEAN_GRAPHIS_OPTION_YQ_FR = [];
//洞头
const LEAN_GRAPHIS_OPTION_DT_DP = [];
//苍南
const LEAN_GRAPHIS_OPTION_CN_LX = [];
const LEAN_GRAPHIS_OPTION_CN_QK = [];
const LEAN_GRAPHIS_OPTION_CN_LP = [];
const LEAN_GRAPHIS_OPTION_YJ = [
  {
    id: "黄田街道",
    label: "黄田街道",
    children: LEAN_GRAPHIS_OPTION_YJ_HT.map(v => {
      return { ...v, id: v.label };
    })
  },
  {
    id: "金溪镇",
    label: "金溪镇",
    children: LEAN_GRAPHIS_OPTION_YJ_JX.map(v => {
      return { ...v, id: v.label };
    })
  },
  {
    id: "东城街道",
    label: "东城街道",
    children: LEAN_GRAPHIS_OPTION_YJ_DC.map(v => {
      return { ...v, id: v.label };
    })
  },
  {
    id: "枫林镇",
    label: "枫林镇",
    children: LEAN_GRAPHIS_OPTION_YJ_FL.map(v => {
      return { ...v, id: v.label };
    })
  },
  {
    id: "岩坦镇",
    label: "岩坦镇",
    children: LEAN_GRAPHIS_OPTION_YJ_YT.map(v => {
      return { ...v, id: v.label };
    })
  },
];
const LEAN_GRAPHIS_OPTION_WC = [
  {
    id: "南田镇",
    label: "南田镇",
    children: LEAN_GRAPHIS_OPTION_WC_NT.map(v => {
      return { ...v, id: v.label };
    })
  },
  {
    id: "铜铃山镇",
    label: "铜铃山镇",
    children: LEAN_GRAPHIS_OPTION_WC_TL.map(v => {
      return { ...v, id: v.label };
    })
  },
];
const LEAN_GRAPHIS_OPTION_RA = [
  {
    id: "飞云街道",
    label: "飞云街道",
    children: LEAN_GRAPHIS_OPTION_RA_FY.map(v => {
      return { ...v, id: v.label };
    })
  },
  {
    id: "高楼镇",
    label: "高楼镇",
    children: LEAN_GRAPHIS_OPTION_RA_GL.map(v => {
      return { ...v, id: v.label };
    })
  },
  {
    id: "仙降街道",
    label: "仙降街道",
    children: LEAN_GRAPHIS_OPTION_RA_XJ.map(v => {
      return { ...v, id: v.label };
    })
  },
  {
    id: "塘下镇",
    label: "塘下镇",
    children: LEAN_GRAPHIS_OPTION_RA_TX.map(v => {
      return { ...v, id: v.label };
    })
  },
  {
    id: "马屿镇",
    label: "马屿镇",
    children: LEAN_GRAPHIS_OPTION_RA_MY.map(v => {
      return { ...v, id: v.label };
    })
  },
  {
    id: "陶山镇",
    label: "陶山镇",
    children: LEAN_GRAPHIS_OPTION_RA_TS.map(v => {
      return { ...v, id: v.label };
    })
  },
];
const LEAN_GRAPHIS_OPTION_PY = [
  {
    id: "闹村乡",
    label: "闹村乡",
    children: LEAN_GRAPHIS_OPTION_PY_NC.map(v => {
      return { ...v, id: v.label };
    })
  },
  {
    id: "山门镇",
    label: "山门镇",
    children: LEAN_GRAPHIS_OPTION_PY_SM.map(v => {
      return { ...v, id: v.label };
    })
  },
  {
    id: "鳌江镇",
    label: "鳌江镇",
    children: LEAN_GRAPHIS_OPTION_PY_AJ.map(v => {
      return { ...v, id: v.label };
    })
  },
];
const LEAN_GRAPHIS_OPTION_OH = [
  {
    id: "三垟街道",
    label: "三垟街道",
    children: LEAN_GRAPHIS_OPTION_OH_SY.map(v => {
      return { ...v, id: v.label };
    })
  },
  {
    id: "娄桥街道",
    label: "娄桥街道",
    children: LEAN_GRAPHIS_OPTION_OH_LQ.map(v => {
      return { ...v, id: v.label };
    })
  },
  {
    id: "南白象街道",
    label: "南白象街道",
    children: LEAN_GRAPHIS_OPTION_OH_NB.map(v => {
      return { ...v, id: v.label };
    })
  },
  {
    id: "泽雅镇",
    label: "泽雅镇",
    children: LEAN_GRAPHIS_OPTION_OH_ZY.map(v => {
      return { ...v, id: v.label };
    })
  },
  {
    id: "梧田街道",
    label: "梧田街道",
    children: LEAN_GRAPHIS_OPTION_OH_TT.map(v => {
      return { ...v, id: v.label };
    })
  },
  {
    id: "潘桥街道",
    label: "潘桥街道",
    children: LEAN_GRAPHIS_OPTION_OH_PQ.map(v => {
      return { ...v, id: v.label };
    })
  },
  {
    id: "郭溪街道",
    label: "郭溪街道",
    children: LEAN_GRAPHIS_OPTION_OH_GX.map(v => {
      return { ...v, id: v.label };
    })
  },
];
const LEAN_GRAPHIS_OPTION_LW = [
  {
    id: "瑶溪街道",
    label: "瑶溪街道",
    children: LEAN_GRAPHIS_OPTION_LW_YX.map(v => {
      return { ...v, id: v.label };
    })
  },
  {
    id: "蒲州街道",
    label: "蒲州街道",
    children: LEAN_GRAPHIS_OPTION_LW_PZ.map(v => {
      return { ...v, id: v.label };
    })
  },
  {
    id: "状元街道",
    label: "状元街道",
    children: LEAN_GRAPHIS_OPTION_LW_ZY.map(v => {
      return { ...v, id: v.label };
    })
  },
];
const LEAN_GRAPHIS_OPTION_YQ = [
  {
    id: "虹桥镇",
    label: "虹桥镇",
    children: LEAN_GRAPHIS_OPTION_YQ_HQ.map(v => {
      return { ...v, id: v.label };
    })
  },
  {
    id: "柳市镇",
    label: "柳市镇",
    children: LEAN_GRAPHIS_OPTION_YQ_LS.map(v => {
      return { ...v, id: v.label };
    })
  },
  {
    id: "北白象镇",
    label: "北白象镇",
    children: LEAN_GRAPHIS_OPTION_YQ_BB.map(v => {
      return { ...v, id: v.label };
    })
  },
  {
    id: "芙蓉镇",
    label: "芙蓉镇",
    children: LEAN_GRAPHIS_OPTION_YQ_FR.map(v => {
      return { ...v, id: v.label };
    })
  },
];
const LEAN_GRAPHIS_OPTION_DT = [
  {
    id: "东屏街道",
    label: "东屏街道",
    children: LEAN_GRAPHIS_OPTION_DT_DP.map(v => {
      return { ...v, id: v.label };
    })
  },
];
const LEAN_GRAPHIS_OPTION_CN = [
  {
    id: "灵溪镇",
    label: "灵溪镇",
    children: LEAN_GRAPHIS_OPTION_CN_LX.map(v => {
      return { ...v, id: v.label };
    })
  },
  {
    id: "钱库镇",
    label: "钱库镇",
    children: LEAN_GRAPHIS_OPTION_CN_QK.map(v => {
      return { ...v, id: v.label };
    })
  },
  {
    id: "沿浦镇",
    label: "沿浦镇",
    children: LEAN_GRAPHIS_OPTION_CN_LP.map(v => {
      return { ...v, id: v.label };
    })
  },
];

const LEAN_GRAPHIS_OPTION = [
  {
    id: "永嘉县",
    label: "永嘉县",
    children: LEAN_GRAPHIS_OPTION_YJ.map(v => {
      return { ...v, id: v.label };
    })
  },
  {
    id: "文成县",
    label: "文成县",
    children: LEAN_GRAPHIS_OPTION_WC.map(v => {
      return { ...v, id: v.label };
    })
  },
  {
    id: "瑞安市",
    label: "瑞安市",
    children: LEAN_GRAPHIS_OPTION_RA.map(v => {
      return { ...v, id: v.label };
    })
  },
  {
    id: "平阳县",
    label: "平阳县",
    children: LEAN_GRAPHIS_OPTION_PY.map(v => {
      return { ...v, id: v.label };
    })
  },
  {
    id: "瓯海区",
    label: "瓯海区",
    children: LEAN_GRAPHIS_OPTION_OH.map(v => {
      return { ...v, id: v.label };
    })
  },
  {
    id: "龙湾区",
    label: "龙湾区",
    children: LEAN_GRAPHIS_OPTION_LW.map(v => {
      return { ...v, id: v.label };
    })
  },
  {
    id: "乐清市",
    label: "乐清市",
    children: LEAN_GRAPHIS_OPTION_YQ.map(v => {
      return { ...v, id: v.label };
    })
  },
  {
    id: "洞头区",
    label: "洞头区",
    children: LEAN_GRAPHIS_OPTION_DT.map(v => {
      return { ...v, id: v.label };
    })
  },
  {
    id: "苍南县",
    label: "苍南县",
    children: LEAN_GRAPHIS_OPTION_CN.map(v => {
      return { ...v, id: v.label };
    })
  },
  {
    label: "横渎村",
    url:
      "http://172.20.83.223:8098/iserver/services/3D-QX_LC_2016/rest/realspace/datas/QX_LC_HengDuCun_2016/config",
    camera: {
      x: -2875396.824866244,
      y: 4843322.049050793,
      z: 2993500.7331779394
    },
    cameraDone: true
  },
  {
    label: "龙方村",
    url:
      "http://172.20.83.223:8098/iserver/services/3D-QX_LC_2016/rest/realspace/datas/QX_LC_DongFengCun_2016/config",
    camera: {
      x: -2871268.2924297373,
      y: 4848061.367879729,
      z: 2990359.8037505765
    },
    cameraDone: true
  },
  {
    label: "双桥村",
    url:
      "http://172.20.83.223:8098/iserver/services/3D-QX_LC_2016/rest/realspace/datas/QX_LC_ShuangQiaoCun_2016/config",
    camera: {
      x: -2869584.1739701116,
      y: 4846417.852837862,
      z: 2994454.2980063935
    },
    cameraDone: true
  },
  {
    label: "牛桥底村",
    url:
      "http://172.20.83.223:8098/iserver/services/3D-QX_LC_2016/rest/realspace/datas/QX_LC_NiuQiaoDi_2016/config",
    camera: {
      x: -2872544.4231165173,
      y: 4846110.714556757,
      z: 2991545.058873369
    },
    cameraDone: true
  },
  {
    label: "黎二村",
    url:
      "http://172.20.83.223:8098/iserver/services/3D-QX_LC_2016/rest/realspace/datas/QX_LC_LiErCun_2016/config",
    camera: {
      x: -2874373.9409043617,
      y: 4842755.802654327,
      z: 2995543.9623425514
    },
    cameraDone: true
  },
  {
    label: "山下村",
    url:
      "http://172.20.83.223:8098/iserver/services/3D-QX_LC_2016/rest/realspace/datas/QX_LC_ShanXiaCun_2016/config",
    camera: {
      x: -2875802.2412011586,
      y: 4842351.036691747,
      z: 2994482.8810546356
    },
    cameraDone: true
  },
  {
    label: "中央涂村",
    url:
      "http://172.20.83.223:8098/iserver/services/3D-QX_LC_2016/rest/realspace/datas/QX_LC_ZhongYangTu_2016_1/config",
    camera: {
      x: -2868148.921505489,
      y: 4845701.558019418,
      z: 2996299.072267176
    },
    cameraDone: true
  },
  {
    label: "中央涂村2",
    url:
      "http://172.20.83.223:8098/iserver/services/3D-QX_LC_2016/rest/realspace/datas/QX_LC_ZhongYangTu_2016_2/config",
    camera: {
      x: -2868406.778311407,
      y: 4845735.803338195,
      z: 2996063.3154144934
    },
    cameraDone: true
  },
  {
    label: "蒲州村",
    url:
      "http://172.20.83.223:8098/iserver/services/3D-QX_LC_2016/rest/realspace/datas/QX_LC_PuZhouCun_2016/config",
    camera: {
      x: -2878334.593677301,
      y: 4841573.940842317,
      z: 2993703.022134084
    },
    cameraDone: true
  },
  {
    label: "江前村",
    url:
      "http://172.20.83.223:8098/iserver/services/3D-QX_LC_2016/rest/realspace/datas/QX_LC_JiangQainCun_2016/config"
  },
  {
    label: "蒋家桥村拆迁遗留",
    url:
      "http://172.20.83.223:8098/iserver/services/3D-QX_LC_2016/rest/realspace/datas/QX_LC_JiangJiaQiao_2016/config",
    camera: {
      x: -2873982.181581846,
      y: 4843195.448322195,
      z: 2994654.422960708
    },
    cameraDone: true
  },
  {
    label: "池底村",
    url:
      "http://172.20.83.223:8098/iserver/services/3D-QX_LC_2016/rest/realspace/datas/QX_LC_ChiDiCun_2016/config",
    camera: {
      x: -2877180.2891030647,
      y: 4845180.748142598,
      z: 2988424.125020722
    },
    cameraDone: true
  },
  {
    label: "东风村",
    url:
      "http://172.20.83.223:8098/iserver/services/3D-QX_LC_2016/rest/realspace/datas/QX_LC_DongFengCun_2016/config",
    camera: {
      x: -2870750.288029349,
      y: 4847999.546336255,
      z: 2990484.7058189246
    },
    cameraDone: true
  },
  {
    label: "吕家降村",
    url:
      "http://172.20.83.223:8098/iserver/services/3D-QX_LC_2016/rest/realspace/datas/QX_LC_LvJiaJiang_2016/config",
    camera: {
      x: -2868014.459160964,
      y: 4849187.252250286,
      z: 2990898.067874922
    },
    cameraDone: true
  },
  {
    label: "沙河丹东村",
    url:
      "http://172.20.83.223:8098/iserver/services/3D-QX_LC_2016/rest/realspace/datas/QX_LC_ShaHeDanDongCun_2016/config",
    camera: {
      x: -2877352.20531456,
      y: 4843909.64217383,
      z: 2990353.3137743706
    },
    cameraDone: true
  },
  /* {
    label: "永嘉鹤盛镇",
    url:
      "http://10.36.234.83:8098/iserver/services/3D-SW_YJ_QX/rest/realspace/datas/QINGXIE_YJ_HESHENGZ/config",
    dataurl: "http://10.36.234.83:8098/iserver/services/data-SW_Data/rest/data",
    camera: [120.8387279805759, 28.371971130691417, 291.08784810315643]
  },
  {
    label: "永嘉大若岩镇",
    url:
      "http://10.36.234.83:8098/iserver/services/3D-SW_YJ_QX/rest/realspace/datas/QINGXIE_YJ_DARUOYANZ/config",
    dataurl: "http://10.36.234.83:8098/iserver/services/data-SW_Data/rest/data",
    camera: [120.62184613528393, 28.274737966665757, 244.76462327032053]
  },
  {
    label: "永嘉枫林镇",
    url:
      "http://10.36.234.83:8098/iserver/services/3D-SW_YJ_QX/rest/realspace/datas/QINGXIE_YJ_FENGLINZ/config",
    dataurl: "http://10.36.234.83:8098/iserver/services/data-SW_Data/rest/data",
    camera: [120.75575851539088, 28.33507791787183, 288.32367182732537]
  },
  {
    label: "永嘉界坑乡",
    url:
      "http://10.36.234.83:8098/iserver/services/3D-SW_YJ_QX/rest/realspace/datas/QINGXIE_YJ_JIEKENGX/config",
    dataurl: "http://10.36.234.83:8098/iserver/services/data-SW_Data/rest/data",
    camera: [120.40930812949061, 28.44132591044351, 708.0313029476863]
  },
  {
    label: "永嘉桥下镇1",
    url:
      "http://10.36.234.83:8098/iserver/services/3D-SW_YJ_QX/rest/realspace/datas/QINGXIE_YJ_QIAOXIAZ1/config",
    dataurl: "http://10.36.234.83:8098/iserver/services/data-SW_Data/rest/data",
    camera: [120.55651911551178, 28.16172350146348, 242.4084108219556]
  },
  {
    label: "永嘉桥下镇2",
    url:
      "http://10.36.234.83:8098/iserver/services/3D-SW_YJ_QX/rest/realspace/datas/QINGXIE_YJ_QIAOXIAZ2/config",
    dataurl: "http://10.36.234.83:8098/iserver/services/data-SW_Data/rest/data",
    camera: [120.56133273898112, 28.14169291592059, 242.14159886635622]
  },
  {
    label: "永嘉溪下乡",
    url:
      "http://10.36.234.83:8098/iserver/services/3D-SW_YJ_QX/rest/realspace/datas/QINGXIE_YJ_XIXIAX/config",
    dataurl: "http://10.36.234.83:8098/iserver/services/data-SW_Data/rest/data",
    camera: [120.48664280212724, 28.49672230235694, 577.4576632360657]
  },
  {
    label: "永嘉沙头镇",
    url:
      "http://10.36.234.83:8098/iserver/services/3D-SW_YJ_QX/rest/realspace/datas/QINGXIE_YJ_SHATOUZ/config",
    dataurl: "http://10.36.234.83:8098/iserver/services/data-SW_Data/rest/data",
    camera: [120.76422242166228, 28.18909322620766, 459.15589999858855]
  },
  {
    label: "永嘉巽宅镇",
    url:
      "http://10.36.234.83:8098/iserver/services/3D-SW_YJ_QX/rest/realspace/datas/QINGXIE_YJ_XUNZHAIZ/config",
    dataurl: "http://10.36.234.83:8098/iserver/services/data-SW_Data/rest/data",
    camera: [120.49072736166544, 28.337897347538647, 439.53423]
  },
  {
    label: "永嘉岩头镇",
    url:
      "http://10.36.234.83:8098/iserver/services/3D-SW_YJ_QX/rest/realspace/datas/QINGXIE_YJ_YANTOUZ/config",
    dataurl: "http://10.36.234.83:8098/iserver/services/data-SW_Data/rest/data",
    camera: [120.76438461789809, 28.351542555895815, 606.98235]
  },
  {
    label: "永嘉岩坦镇",
    url:
      "http://10.36.234.83:8098/iserver/services/3D-SW_YJ_QX/rest/realspace/datas/QINGXIE_YJ_YANTANZ/config",
    dataurl: "http://10.36.234.83:8098/iserver/services/data-SW_Data/rest/data",
    camera: [120.72538630132725, 28.43329372991379, 370.16315545780446]
  },
  {
    label: "永嘉水云溪",
    url:
      "http://10.36.234.83:8098/iserver/services/3D-SW_YJ_QX/rest/realspace/datas/QINGXIE_YJ_SHUIYUNX/config",
    dataurl: "http://10.36.234.83:8098/iserver/services/data-SW_Data/rest/data",
    camera: [120.63877494046184, 28.27743052748186, 552.1622241592182]
  },
  {
    label: "永嘉碧莲镇",
    url:
      "http://10.36.234.83:8098/iserver/services/3D-SW_YJ_QX/rest/realspace/datas/QINGXIE_YJ_BILIANZ/config",
    dataurl: "http://10.36.234.83:8098/iserver/services/data-SW_Data/rest/data",
    camera: [120.56959564155919, 28.301079769394445, 459.15589999568067]
  },
  {
    label: "永嘉桥头镇",
    url:
      "http://10.36.234.83:8098/iserver/services/3D-SW_YJ_QX/rest/realspace/datas/QINGXIE_YJ_QIAOTOUZ/config",
    dataurl: "http://10.36.234.83:8098/iserver/services/data-SW_Data/rest/data",
    camera: [120.7601745, 28.19577031, 459.1559]
  } */
];
export const CESIUM_TREE_OPTION = [
  ...TOP_LEVEL_OPTION.map(v => {
    return { ...v, id: v.label };
  }),
  {
    id: "BIM",
    label: "BIM",
    disabled: true,
    children: BIM_GRAPHIS_OPTION.map(v => {
      return { ...v, id: v.label };
    })
  },
  {
    id: "倾斜摄影",
    label: "倾斜摄影",
    children: LEAN_GRAPHIS_OPTION.map(v => {
      return { ...v, id: v.label };
    })
  }
];
