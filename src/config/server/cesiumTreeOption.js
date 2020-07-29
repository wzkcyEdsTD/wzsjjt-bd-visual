/*
 * @Author: eds
 * @Date: 2020-07-29 16:10:06
 * @LastEditTime: 2020-07-29 17:26:46
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
    }
  },
  {
    label: "2017精模",
    url:
      "http://172.20.83.223:8098/iserver/services/3D-MAX_LuCheng/rest/realspace/datas/%E5%B8%82%E5%8C%BA_2017/config",
    dataurl: "http://172.20.83.223:8098/iserver/services/data-SW_Data/rest",
    dataBind: {
      dataSourceName: "172.20.83.196_swdata",
      dataSetName: "max_2017"
    }
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
    label: "永嘉鹤盛镇",
    url:
      "http://10.36.234.83:8098/iserver/services/3D-SW_YJ_QX/rest/realspace/datas/QINGXIE_YJ_HESHENGZ/config",
    dataurl: "http://10.36.234.83:8098/iserver/services/data-SW_Data/rest",
    dataBind: {
      dataSourceName: "10.36.234.85_fxft",
      dataSetName: "FWM_DanTiHua_YJ"
    },
    camera: [120.8387279805759, 28.371971130691417, 291.08784810315643]
  },
  {
    label: "永嘉大若岩镇",
    url:
      "http://10.36.234.83:8098/iserver/services/3D-SW_YJ_QX/rest/realspace/datas/QINGXIE_YJ_DARUOYANZ/config",
    dataurl: "http://10.36.234.83:8098/iserver/services/data-SW_Data/rest",
    dataBind: {
      dataSourceName: "10.36.234.85_fxft",
      dataSetName: "FWM_DanTiHua_YJ"
    },
    camera: [120.62184613528393, 28.274737966665757, 244.76462327032053]
  },
  {
    label: "永嘉枫林镇",
    url:
      "http://10.36.234.83:8098/iserver/services/3D-SW_YJ_QX/rest/realspace/datas/QINGXIE_YJ_FENGLINZ/config",
    dataurl: "http://10.36.234.83:8098/iserver/services/data-SW_Data/rest",
    dataBind: {
      dataSourceName: "10.36.234.85_fxft",
      dataSetName: "FWM_DanTiHua_YJ"
    },
    camera: [120.75575851539088, 28.33507791787183, 288.32367182732537]
  },
  {
    label: "永嘉界坑乡",
    url:
      "http://10.36.234.83:8098/iserver/services/3D-SW_YJ_QX/rest/realspace/datas/QINGXIE_YJ_JIEKENGX/config",
    dataurl: "http://10.36.234.83:8098/iserver/services/data-SW_Data/rest",
    dataBind: {
      dataSourceName: "10.36.234.85_fxft",
      dataSetName: "FWM_DanTiHua_YJ"
    },
    camera: [120.40930812949061, 28.44132591044351, 708.0313029476863]
  },
  {
    label: "永嘉桥下镇1",
    url:
      "http://10.36.234.83:8098/iserver/services/3D-SW_YJ_QX/rest/realspace/datas/QINGXIE_YJ_QIAOXIAZ1/config",
    dataurl: "http://10.36.234.83:8098/iserver/services/data-SW_Data/rest",
    dataBind: {
      dataSourceName: "10.36.234.85_fxft",
      dataSetName: "FWM_DanTiHua_YJ"
    },
    camera: [120.55651911551178, 28.16172350146348, 242.4084108219556]
  },
  {
    label: "永嘉桥下镇2",
    url:
      "http://10.36.234.83:8098/iserver/services/3D-SW_YJ_QX/rest/realspace/datas/QINGXIE_YJ_QIAOXIAZ2/config",
    dataurl: "http://10.36.234.83:8098/iserver/services/data-SW_Data/rest",
    dataBind: {
      dataSourceName: "10.36.234.85_fxft",
      dataSetName: "FWM_DanTiHua_YJ"
    },
    camera: [120.56133273898112, 28.14169291592059, 242.14159886635622]
  },
  {
    label: "永嘉溪下乡",
    url:
      "http://10.36.234.83:8098/iserver/services/3D-SW_YJ_QX/rest/realspace/datas/QINGXIE_YJ_XIXIAX/config",
    dataurl: "http://10.36.234.83:8098/iserver/services/data-SW_Data/rest",
    dataBind: {
      dataSourceName: "10.36.234.85_fxft",
      dataSetName: "FWM_DanTiHua_YJ"
    },
    camera: [120.48664280212724, 28.49672230235694, 577.4576632360657]
  },
  {
    label: "永嘉沙头镇",
    url:
      "http://10.36.234.83:8098/iserver/services/3D-SW_YJ_QX/rest/realspace/datas/QINGXIE_YJ_SHATOUZ/config",
    dataurl: "http://10.36.234.83:8098/iserver/services/data-SW_Data/rest",
    dataBind: {
      dataSourceName: "10.36.234.85_fxft",
      dataSetName: "FWM_DanTiHua_YJ"
    },
    camera: [120.76422242166228, 28.18909322620766, 459.15589999858855]
  },
  {
    label: "永嘉巽宅镇",
    url:
      "http://10.36.234.83:8098/iserver/services/3D-SW_YJ_QX/rest/realspace/datas/QINGXIE_YJ_XUNZHAIZ/config",
    dataurl: "http://10.36.234.83:8098/iserver/services/data-SW_Data/rest",
    dataBind: {
      dataSourceName: "10.36.234.85_fxft",
      dataSetName: "FWM_DanTiHua_YJ"
    },
    camera: [120.49072736166544, 28.337897347538647, 439.53423]
  },
  {
    label: "永嘉岩头镇",
    url:
      "http://10.36.234.83:8098/iserver/services/3D-SW_YJ_QX/rest/realspace/datas/QINGXIE_YJ_YANTOUZ/config",
    dataurl: "http://10.36.234.83:8098/iserver/services/data-SW_Data/rest",
    dataBind: {
      dataSourceName: "10.36.234.85_fxft",
      dataSetName: "FWM_DanTiHua_YJ"
    },
    camera: [120.76438461789809, 28.351542555895815, 606.98235]
  },
  {
    label: "永嘉岩坦镇",
    url:
      "http://10.36.234.83:8098/iserver/services/3D-SW_YJ_QX/rest/realspace/datas/QINGXIE_YJ_YANTANZ/config",
    dataurl: "http://10.36.234.83:8098/iserver/services/data-SW_Data/rest",
    dataBind: {
      dataSourceName: "10.36.234.85_fxft",
      dataSetName: "FWM_DanTiHua_YJ"
    },
    camera: [120.72538630132725, 28.43329372991379, 370.16315545780446]
  },
  {
    label: "永嘉水云溪",
    url:
      "http://10.36.234.83:8098/iserver/services/3D-SW_YJ_QX/rest/realspace/datas/QINGXIE_YJ_SHUIYUNX/config",
    dataurl: "http://10.36.234.83:8098/iserver/services/data-SW_Data/rest",
    dataBind: {
      dataSourceName: "10.36.234.85_fxft",
      dataSetName: "FWM_DanTiHua_YJ"
    },
    camera: [120.63877494046184, 28.27743052748186, 552.1622241592182]
  },
  {
    label: "永嘉碧莲镇",
    url:
      "http://10.36.234.83:8098/iserver/services/3D-SW_YJ_QX/rest/realspace/datas/QINGXIE_YJ_BILIANZ/config",
    dataurl: "http://10.36.234.83:8098/iserver/services/data-SW_Data/rest",
    dataBind: {
      dataSourceName: "10.36.234.85_fxft",
      dataSetName: "FWM_DanTiHua_YJ"
    },
    camera: [120.56959564155919, 28.301079769394445, 459.15589999568067]
  },
  {
    label: "永嘉桥头镇",
    url:
      "http://10.36.234.83:8098/iserver/services/3D-SW_YJ_QX/rest/realspace/datas/QINGXIE_YJ_QIAOTOUZ/config",
    dataurl: "http://10.36.234.83:8098/iserver/services/data-SW_Data/rest",
    dataBind: {
      dataSourceName: "10.36.234.85_fxft",
      dataSetName: "FWM_DanTiHua_YJ"
    },
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
