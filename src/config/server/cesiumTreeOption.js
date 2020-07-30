/*
 * @Author: eds
 * @Date: 2020-07-29 16:10:06
 * @LastEditTime: 2020-07-30 11:04:03
 * @LastEditors: eds
 * @Description:
 * @FilePath: \wzsjjt-bd-visual\src\config\server\cesiumTreeOption.js
 */
const TOP_LEVEL_OPTION = [
  {
    label: "白模",
    url:
      "http://10.36.234.83:8098/iserver/services/3D-SW_YJ/rest/realspace/datas/RES_YJ_Z_EraseMax_Model@Baimo/config"
  },
  {
    label: "2012精模",
    url:
      "http://172.20.83.223:8098/iserver/services/3D-MAX_LuCheng/rest/realspace/datas/%E5%B8%82%E5%8C%BA_2012/config",
    dataurl:
      "http://172.20.83.223:8098/iserver/services/data-SW_Data/rest/data",
    dataBind: {
      dataSourceName: "172.20.83.196_swdata",
      dataSetName: "max_2012"
    },
    camera: {
      x: -2876276.933400896,
      y: 4843131.36288743,
      z: 2993318.7080605105
    },
    cameraDone: true
  },
  {
    label: "2017精模",
    url:
      "http://172.20.83.223:8098/iserver/services/3D-MAX_LuCheng/rest/realspace/datas/%E5%B8%82%E5%8C%BA_2017/config",
    dataurl:
      "http://172.20.83.223:8098/iserver/services/data-SW_Data/rest/data",
    dataBind: {
      dataSourceName: "172.20.83.196_swdata",
      dataSetName: "max_2017"
    },
    camera: {
      x: -2876276.933400896,
      y: 4843131.36288743,
      z: 2993318.7080605105
    },
    cameraDone: true
  },
  {
    label: "山区村落自然灾害易发区",
    url:
      "http://10.36.234.83:8090/iserver/services/map-FXFX_DATA/rest/maps/FXFX_YJ_ComprehensiveScore",
    vectorTile: true
  }
];
const LEAN_GRAPHIS_OPTION = [
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
  {
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
  }
];

export const CESIUM_TREE_OPTION = [
  ...TOP_LEVEL_OPTION.map(v => {
    return { ...v, id: v.label };
  }),
  {
    id: "倾斜摄影",
    label: "倾斜摄影",
    children: LEAN_GRAPHIS_OPTION.map(v => {
      return { ...v, id: v.label };
    })
  }
];
