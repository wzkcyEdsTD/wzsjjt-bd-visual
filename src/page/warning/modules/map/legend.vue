<template>
  <transition
    enter-active-class="animated lightSpeedIn"
    leave-active-class="animated bounceOutDown"
  >
    <div class="legend" v-show="isShow" :class="{collapse:collapse2, isSmall: isSmall}">
      <div v-show="!isSmall" class="panel-body text-center">
        <ul id="legendTip">
          <li v-for="(item, index) in legendMsg.legendAry" :key='index'>
            <span class="new">
              <img class="tu" :src="item.icon">
            </span>
            <div class="new_01">{{item.des}}</div>
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
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'Legend',
  props: {
    legendMsg: {
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
  computed: {
    ...mapGetters('map', [
      'collapse2',
      'treeCheckedList'
    ])
  },
  methods: {
    show() {
      this.isShow = true
      this.isSmall = false
      this.SetLegendShow(this.isShow)
    },
    hide() {
      this.isShow = false
      this.SetLegendShow(this.isShow)
    },
    small() {
      this.isSmall = !this.isSmall
    },
    ...mapActions('map', [
      'SetLegendShow'
    ]),
  },
  watch: {
    'legendMsg': {
      deep: true,
      handler: function(legendMsg) {
        if (legendMsg.legendAry.length > 0) {
          $(".new").css({
            "display": "block",
            "float": "left",
            "width": "24%",
            "height": "35px",
            "margin-top": "-2px"
          });
          $(".tu").css({
            "vertical-align": "middle",
            "width": "30px"
          });
          $(".new_01").css({
            "float": "left",
            "width": "76%",
            "height": "35px",
            "line-height": "35px",
            "font-size": "16px",
            "white-space": "nowrap",
            "overflow": "hidden",
            "text-overflow": "ellipsis"
          });
          this.show();
        } else {
          this.hide();
        }
      }
    }
  }
}
/* eslint-disable */
</script>

<style scoped lang="less">
  .legend {
    min-height: 0.4rem;
    transition: all 0.3s linear;
    background: rgba(36, 120, 160, 0.5);
    position: absolute;
    color: #fff;
    padding: 0.1rem 0.05rem 0.1rem 0.1rem;
    width: 2.2rem;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    border-radius: 0.08rem;
    margin-left: 0;
    right: 0;
    bottom: 0;
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
    // text-align:
    // margin-left:auto;
    // margin-right:auto;
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
    width: 24%;
    height: 0.35rem;
    line-height: 0.35rem;
    font-size: 0.16rem;
    margin-top: -2px;
  }
  .new_01 {
    float: left;
    width: 76%;
    height: 0.35rem;
    line-height: 0.35rem;
    font-size: 0.16rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .tu {
    vertical-align: middle;
    width: 0.3rem;
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
