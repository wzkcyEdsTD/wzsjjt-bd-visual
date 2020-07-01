<template>
  <div class="section-warning">
    <div class="warning-bar">
      <div class="warning-content">
        <div class="icon" @click="showList">
          <div class="flip">
              <div class="flip-box">
                  <a href="javascript:;" class="flip-item flip-item-front ">
                    <img src="./images/light.png" alt=" ">
                  </a>
                  <a href="javascript:;" class="flip-item flip-item-back ">
                    <img src="./images/light.png" alt=" ">
                  </a>
              </div>
          </div>
        </div>
        <div class="num" @click="showList">[{{warningList.length}}]</div>
        <div class="title warning-title">
          <ul class="title-content">
            <li v-for="(item, index) in warningList" :key='"title" + index' @click="jumpMap(item)">{{item.name}}</li>
            <li v-show="warningList.length===0">暂无警告</li>
          </ul>
        </div>
      </div>
      <!-- v-if="warningList.length!==0" -->
    </div>
    <div class="warning-list" v-show="isShow">
      <div class="title">报警列表
        <i class="el-dialog__close el-icon el-icon-close" @click="isShow = false"></i>
      </div>
      <div class="input-group">
        <div class="input-item">
          <el-input v-model="searchInfo.name" @change="search" placeholder="名称"></el-input>
        </div>
        <div class="input-item">
          <el-select :popper-append-to-body='false' @change='selectChange' v-model="searchInfo.warn_type" placeholder="类别">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
        <div class="input-item">
          <!-- <el-date-picker
            @change='changeDate'
            v-model="time"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker> -->
          <el-date-picker
            v-model="time"
            type="datetimerange"
            @change="changeDate"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
        </el-date-picker>
        </div>
      </div>
      <section>
        <div class="header">
          <div class="header-item">
            序号
          </div>
          <div class="header-item">
            名称
          </div>
          <div class="header-item">
            所属
          </div>
          <div class="header-item">
            类别
          </div>
          <div class="header-item">
            报警值(m)
          </div>
          <div class="header-item">
            时间
          </div>
        </div>
      </section>
      <ul class="warning-form">
        <!-- <li class="warning-list-item" v-for="(item, index) in warningDetailList" :key='index' @click="jumpMap(item)">{{item.name}}</li> -->
        <li class="warning-list-item" v-for="(item, index) in warningDetailList" :key='index'>
          <div class="warning-item">{{index + 1}}</div>
          <div class="warning-item">{{item.name}}</div>
          <div class="warning-item">{{item.district}}</div>
          <div class="warning-item">{{item.warn_type}}</div>
          <div class="warning-item">{{item.kssw}}</div>
          <div class="warning-item">{{item.tm}}</div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { getWarningByUser, getWarnList } from 'api/warning/warning'
import { mapActions } from 'vuex'
export default {
  name: 'WarningBar',
  data() {
    return {
      isShow: false,
      warningList: [

      ],
      scrollFlag: null,
      scrollTop: 0,
      options: [{
        value: '水库报警',
        label: '水库报警'
      }, {
        value: '河道报警',
        label: '河道报警'
      }],
      time: [],
      searchInfo: {
        name: '',
        end_time: '',
        start_time: '',
        warn_type: ''
      },
      warningDetailList: []
    }
  },
  methods: {
    // 下拉框变化
    selectChange(e) {
      console.log(this.searchInfo.warn_type)
      this.search()
    },
    // 修改日期时间
    changeDate(e) {
      this.searchInfo.start_time = this.time[0] || ''
      this.searchInfo.end_time = this.time[1] || ''
      this.search()
    },
    search() {
      getWarnList(this.searchInfo.name, this.searchInfo.end_time, this.searchInfo.start_time, this.searchInfo.warn_type).then(res => {
        this.warningDetailList = res
      })
    },
    showList() {
      this.isShow = !this.isShow
    },
    scrollStartHandler() {
      if (!this.scrollFlag) {
        this.scrollFlag = setInterval(() => {
          const dom = document.getElementsByClassName('title-content')[0]
          if (this.warningList.length <= 1) return
          this.scrollTop += 1
          dom.scrollTop = this.scrollTop
          if (dom.scrollTop >= dom.scrollHeight - dom.clientHeight) {
            this.scrollTop = 0
            // this.scrollDestroyHandler()
            // this.$emit('refresh')
          }
        }, 100)
      }
    },
    scrollDestroyHandler() {
      if (this.scrollFlag) {
        clearInterval(this.scrollFlag)
        this.scrollFlag = null
      }
    },
    jumpMap(item) {
      this.SetSpecalPoint(item)
    },
    ...mapActions('warning', [
      'SetSpecalPoint'
    ])
  },
  mounted() {
    getWarningByUser().then(res => {
      this.warningList = res || []
      this.$nextTick(() => {
        document.getElementsByClassName('title-content')[0].addEventListener('mouseenter', () => {
          this.scrollDestroyHandler()
        })
        document.getElementsByClassName('title-content')[0].addEventListener('mouseleave', () => {
          this.scrollStartHandler()
        })
        this.scrollStartHandler()
      })
    })
    getWarnList(this.searchInfo.name, this.searchInfo.end_time, this.searchInfo.start_time, this.searchInfo.warn_type).then(res => {
      console.log(res)
      this.warningDetailList = res
    })
  },
  beforeDestroy() {
    this.scrollDestroyHandler()
  }
}
</script>

<style lang="less" scoped>
.warning-bar{
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  color: #fff;
  width: 7rem;
  margin: 0 auto;
  margin-left:33.8%;
  // background: #aaa;
  z-index: 900000;
}
.warning-list{
  width: 9rem;
  height: 4rem;
  position: absolute;
  top: 0.5rem;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.6);
  color: #ffffff;
  padding: 0 0.25rem 0.12rem;
  border-radius: 8px;
  z-index: 900001;
  border: 2px solid #00E0FB;
  .title{
    text-align: center;
    color: #00E4FF;
    height: 0.6rem;
    line-height: 0.2rem;
    font-size: 0.2rem;
  }
  /deep/.el-date-editor--datetimerange.el-input, .el-date-editor--datetimerange.el-input__inner{
    width: 100%;
    /deep/.el-range-separator{
      width: 7%;
    }
    /deep/.el-range-input{
      width: 38%;
    }
  }
  /deep/ .el-select{
    width: 100%;
  }
  // box-shadow: #00aaff 0px 0px 25px inset;
  margin: 0 auto;
  .input-group{
    width: 100%;
    display: flex;
    justify-content: space-between;
  }
  .input-item{
    width: 25%;
    &:nth-child(3){
      width: 40%;
    }
  }
  .warning-form{
    height: 2rem;
    overflow: auto;
  }
  section>.header{
    background: #2A3F60;
    widows: 100%;
    display: flex;
    margin-top: 0.2rem;
    .header-item{
      text-align: center;
      height: 0.3rem;
      line-height: 0.3rem;
      border-right: 1px solid #225F7D;
    }
  }
  .warning-item{
    text-align: center;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
  .header-item:nth-child(1), .warning-item:nth-child(1) {
    width: 5%;
  }
  .header-item:nth-child(2), .warning-item:nth-child(2) {
    width: 20%;
  }
  .header-item:nth-child(3), .warning-item:nth-child(3) {
    width: 15%;
  }
  .header-item:nth-child(4), .warning-item:nth-child(4) {
    width: 15%;
  }
  .header-item:nth-child(5), .warning-item:nth-child(5) {
    width: 20%;
  }
  .header-item:nth-child(6), .warning-item:nth-child(6) {
    width: 25%;
    border-right: none
  }
  li{
    width: 100%;
    line-height: 0.35rem;
    height:0.35rem;
    list-style-type: none;
  }
  &>li::before{
    // content:url(images/circle.png);
    // margin-right: 10px;
    // vertical-align: 2px;
  }
  &>div{
  //  float: left;
  //  width: 5px;
  //  height: 5px;
  //  border-radius: 50%;
  //  background-color: #db0012;
  //  margin-top: 18px;
  //  margin-right: 8px;
  }
}
.warning-content{
  display: flex;
  height: 0.5rem;
  justify-content: space-around;
  .title{
    width: 4rem;
    text-align: center;
    line-height: 0.5rem;
    font-size: 0.14rem;
    color:#ffd200;
    background-image: url(images/bar_bg.png);
    background-size: 100% 100%;
    width: 100%;
    height: 100%;
    overflow: auto;
    overflow-x: hidden;
  }
  .title-content{
    height: 0.3rem;
    margin-top: 0.1rem;
    overflow: scroll;
    position: relative;
    right: -5px;
    li{
      height: 0.3rem;
      line-height: 0.3rem;
      cursor: pointer;
    }
  }
  .icon{
    cursor: pointer;
    height: 0.5rem;
    width: 0.5rem;
    &>img{
      width:35px;
      margin-top: 10px;
      margin-right: 8px;
    }
  }
  .num{
    cursor: pointer;
    color:#ff0000;
    font-weight: 600;
    font-size:0.16rem;
    line-height: 0.2rem;
    background-color: #000000;
    height: 0.2rem;
    margin-top: 0.15rem;
    margin-left: 10px;
  }
}
.warning-list-item{
  cursor: pointer;
  display: flex;
  &:nth-child(even) {
    background-color: rgba(25, 45, 73, 0.4);
  }
}
 .flip {
   height: 100%;
  transform:translate3d(0,0,0);
}
.flip-box {
position:relative;
width:110px;
height:100%;
overflow:hidden;
}
.flip-item {
position:absolute;
left: -35px;
top: -45px;
width:100%;
height:100%;
transition:all .5s ease-in-out;
transform-style:preserve-3d;
backface-visibility:hidden;
box-sizing:border-box;
}
.flip-item img {
width:95px;
border-radius:100%;
margin:32px auto;
display:block;
}
.flip-item-front {
animation:rotate infinite 1s linear;
}
.flip-item-back {
animation:rotate2 infinite 1s linear;
}
.flip-item-back{
color:#fff;
z-index:2;
transform:rotateY(0deg);
}
 @keyframes rotate {
 0% {
     z-index:2;
     transform:rotateY(0deg);
 }
 100% {
     z-index:1;
     transform:rotateY(180deg);
 }
 }
 @keyframes rotate2 {
     0% {
         z-index:1;
         transform:rotateY(180deg);
     }
     100% {
         z-index:2;
         transform:rotateY(0deg);
     }
 }
 .el-dialog__close{
  position: absolute;
  cursor: pointer;
  right: 0.2rem;
  color: #00E0FB;
  border-radius: 50%;
  border: 1px solid #00E0FB;
  width: 0.25rem;
  height: 0.25rem;
  line-height: 0.25rem;
  top: 0.15rem;
 }
</style>
