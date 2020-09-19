<template>
  <transition
    enter-active-class="animated lightSpeedIn"
    leave-active-class="animated bounceOutDown"
  >
    <div class="legend" :class="{isShow:isShow, isSmall: isSmall}">
      <div v-show="!isSmall" class="panel-body text-center">
        <ul id="legendTip">
          <li v-for="(item, index) in legendMsg3.legendAry" :key='index'>
            <span class="new" :class="{'hidden': item.des === '等级' || item.des === '警戒线' || item.des === '风圈' || item.des === '预报台'}">
              <img class="tu" :src="item.icon">
            </span>
            <div class="new_01" :class="{'center': item.des === '等级' || item.des === '警戒线' || item.des === '风圈' || item.des === '预报台'}">{{item.des}}</div>
          </li>
        </ul>
      </div>
      <i v-show="!isSmall" class="close" @click="small" title="缩小"></i>
      <i v-show="isSmall" class="small" @click="small" title="展开"></i>
    </div>
  </transition>
</template>

<script>
/* eslint-disable */
export default {
  name: 'Legend',
  props: {
    legendMsg3: {
      type: Object,
      defaule() {
        return {
          legendAry: []
        }
      }
    }
  },
  data() {
    return {
      isShow: false,
      isSmall: false
    }
  },
  methods: {
    show() {
      this.isShow = true
      this.isSmall = false
    },
    hide() {
      this.isShow = false
      this.isSmall = true
    },
    small() {
      this.isSmall = !this.isSmall
    }
  },
  watch: {
    'legendMsg3': {
      deep: true,
      handler: function(legendMsg3) {
        if (legendMsg3.legendAry.length > 0) {
          // console.log('legendMsg3.legendAry')
          $(".new").css({
            "display": "block",
            "float": "left",
            "width": "48%",
            "height": "35px",
            "margin-top": "-2px"
          });
          $(".hidden").css({
            "display": "none"
          });
          $(".tu").css({
            "vertical-align": "middle"
          });
          $(".new_01").css({
            "float": "right",
            // "width": "50%",
            "height": "35px",
            "line-height": "35px",
            "font-size": "16px",
            "white-space": "nowrap",
            "overflow": "hidden",
            "text-overflow": "ellipsis"
          })
          this.show()
        } else {
          this.hide()
        }
      }
    }
  }
}
</script>

<style scoped lang="less">
  .legend {
    min-height: 0.4rem;
    -webkit-transition: all 0.3s linear;
    transition: all 0.3s linear;
    background: rgba(36, 120, 160, 0.5);
    position: relative;
    color: #fff;
    padding: 0.1rem 0.05rem 0.1rem 0.1rem;
    width: 1.8rem;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    border-radius: 0.08rem;
    visibility: hidden;
    margin-bottom: 0.05rem;
    margin-left: 0;
    &.isShow {
      visibility: visible;
    }
    .no-wrap();
    .close {
      position: absolute;
      right: 0.02rem;
      top: 0.02rem;
      width: 0.2rem;
      height: 0.2rem;
      display: block;
      .bg-image('../../../map/images/zoom-in');
      transform: rotate(-45deg);
      transition: all 0.1s linear;
      cursor: pointer;
      &:hover {
        transform: rotate(45deg);
      }
    }
    .small {
      position: absolute;
      right: 0.08rem;
      top: 0.06rem;
      width: 0.2rem;
      height: 0.2rem;
      display: block;
      .bg-image('../../../map/images/up');
      cursor: pointer;
    }
  }
  .legend.isSmall {
    width: 0.4rem;
    margin-left: 1.4rem;
  }
  .panel-body {
    margin-top: 0.1rem;
  }
  .legendItemHeader, .legendItemValue {
    width: 1.2rem;
    vertical-align: middle;
    text-align: center;
    margin: auto;
    font-size: 12px;
  }
  #legendDes {
    font-family: 隶书;
    font-size: 0.15rem;
    font-weight: bold;
    font-style: oblique;
    text-decoration: underline;
  }
  .new {
    display: block;
    float: left;
    width: 48%;
    height: 0.35rem;
    line-height: 0.35rem;
    font-size: 0.16rem;
    margin-top: -2px;
    &.hidden{
      display: none;
    }
  }
  .new_01 {
    float: right;
    // width: 50%;
    height: 0.35rem;
    line-height: 0.35rem;
    font-size: 0.16rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .center{
    float: left;
    width: 100%;
    height: 35px;
    line-height: 35px;
    font-size: 16px;
    white-space: nowrap;
    overflow: hidden;
    text-align: center;
    text-overflow: ellipsis;
  }
  .tu {
    vertical-align: middle;
    width: auto;
  }
  .panel-body {
    max-height: 3.75rem;
    overflow: auto;
  }
  #legendTip {
    /deep/ li {
      overflow: hidden;
    }
  }
</style>
