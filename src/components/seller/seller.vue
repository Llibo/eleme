<template>
	<div class="seller"ref="seller" >
		<div class="sellerContent">
      <div class="overView">
        <h1 class="tile">{{seller.name}}</h1>
        <div class="desc border-1px">
           <star :size="36" :score="seller.score"></star>
           <span class="text">({{seller.ratingCount}})</span>
           <span class="text">月售{{seller.sellCount}}单</span>
        </div>
        <ul class="remark">
          <li class="block">
            <h2>起送价</h2>
            <div class="content">
              <span class="stress">{{seller.minPrice}}</span>元
            </div>
          </li>
          <li class="block">
            <h2>商家配送</h2>
            <div class="content">
              <span class="stress">{{seller.deliveryPrice}}</span>元
            </div>
          </li>
          <li class="block">
            <h2>平均配送时间</h2>
            <div class="content">
              <span class="stress">{{seller.deliveryTime}}</span>分钟
            </div>
          </li>
        </ul>
        <div class="favorite" @click="collect">
          <span class="icon-favorite" :class="{'active':favorite}"></span>
          <span class="text">{{favoriteText}}</span>
        </div>
      </div> 
      <split></split>
      <div class="bulltin">
        <h1 class="title">公告与活动</h1>
        <div class="contentWrapper border-1px">
          <p class="content">{{seller.bulletin}}</p>
          <ul v-if="seller.supports" class="supports">
            <li class="supports-item  border-1px" v-for = "(item, index) in seller.supports">
              <span class="icon" :class=classMap[seller.supports[index].type]></span>
              <span class="text" >{{seller.supports[index].description}}</span>
            </li>
          </ul>
        </div>
      </div>
      <split></split>
      <div class="pics">
        <h1 class="title">商家实景</h1>
        <div class="picWrapper" ref="picScroll">
          <ul class="picList" ref="picList">
            <li class="picItem" v-for="pic in seller.pics" ref="picItem">
              <img :src="pic" width="120" height="90">
            </li>
          </ul>
        </div>
      </div>
      <split></split>
      <div class="info">
        <div class="title border-1px">商家信息</div>
        <ul>
          <li class="info-item" v-for="info in seller.infos">{{info}}</li>
        </ul>
      </div>
    </div>
	</div>
</template>
<script>
  import BScroll from 'better-scroll'
  import {saveToLocal, loadFromLocal} from 'common/js/store'
  import Star from 'components/star/star'
  import split from 'components/split/split'

  export default {
    props: {
      seller: {
        type: Object
      }
    },
    data () {
      return {
        favorite: (() => {
          return loadFromLocal(this.seller.id, 'favorite', false)
        })()
      }
    },
    computed: {
      favoriteText () {
        this.favorite ? '已收藏' : '收藏'
        saveToLocal(this.seller.id, 'favorite', this.favorite)
      }
    },
    created () {
      this.classMap = ['decrease', 'discount', 'guarantee', 'invoice', 'special']
    },
    mounted () {
      this.$nextTick(() => {
        this._setSlideWidth()
        this._initScorll()
        this._initSlide()
      })
    },
    methods: {
      collect () {
        this.favorite = !this.favorite
      },
      _initScorll () {
        if(!this.sellerScroll) {
          this.sellerScroll = new BScroll(this.$refs.seller, {
            click: true
          })
        } else {
          this.sellerScroll.refresh()
        }
      },
      _initSlide () {
        if(!this.picScroll) {
          this.picScroll = new BScroll(this.$refs.picScroll, {
            scrollX: true,
            // 水平滚动时忽略垂直方向上的滚动
            eventPassthrough: 'vertical',
            click: true
          })
        } else {
          this.picScroll.refresh()
        }
      },
      _setSlideWidth () {
        if (this.seller.pics) {
          let width = 0
          let margin = 6
          let pics = this.$refs.picItem
          for (var i = 0; i < this.seller.pics.length; i++) {
            width += pics[i].clientWidth + margin
          }
          this.$refs.picList.style.width = width - 6 + 'px'
        }
        return
      }
    },
    watch: {
      seller () {
        this.$nextTick(() => {
          this._setSlideWidth()
        })
      }
    },
    components: {
      Star,
      split
    }
  }
</script>
<style lang="scss" scoped>
@import "~common/style/mixin";
	.seller{
    position: absolute;
    top: 174px;
    left:0;
    bottom: 0;
    width: 100%;
    overflow: hidden;
    .overView{
      position: relative;
      padding: 18px;
      .tile{
        margin-bottom: 8px;
        line-height: 14px;
        font-size: 14px;
        color: rgb(7, 17, 27);
      }
      .desc{
        padding-bottom:18px;
        line-height: 18px;
        font-size: 0;
        @include border-1px(rgba(7, 17, 27, 0.1));
        .star{
          display: inline-block;
          margin-right: 8px;
          vertical-align: top; 
        }
        .text{
          margin-right: 12px;
          display: inline-block;
          vertical-align: top;
          line-height: 18px;
          font-size: 10px;
          color: rgb(77, 85, 93);
        }
      }
      .remark{
        display: flex;
        padding-top: 18px;
        .block{
          flex: 1;
          text-align: center;
          border-right: 1px solid rgba(7, 17, 27, 0.1);
          &:last-child{
            border: none;
          }
          h2{
            margin-bottom: 4px;
            line-height: 10px;
            font-size: 10px;
            color: rgb(147, 153, 159)
          }
          .content{
            line-height: 24px;
            font-size: 10px;
            color: rgb(7, 17, 27);
            .stress{
              font-size: 24px;
            }
          }
        }
      }
      .favorite{
        position: absolute;
        width: 50px;
        top: 18px;
        right: 11px;
        text-align: center;
        .icon-favorite{
          display: block;
          margin-bottom: 4px;
          line-height: 24px;
          font-size: 24px;
          color: #d4d6d9;
          &.active{
            color: rgb(240, 20, 20);
          }
        }
        .text{
          line-height: 10px;
          font-size: 10px;
          color: rgb(77, 85, 93);
        }
      }
    }
    .bulltin{
      padding: 18px 18px 0 18px;
      .title{
        margin-bottom: 8px;
        line-height: 14px;
        font-size: 14px;
        color: rgb(7, 17, 27);
      }
      .contentWrapper{
        padding: 0 12px;
        @include border-1px(rgba(7, 17, 27, 0.1));
        .content{
          line-height: 24px;
          font-size: 12px;
          color: rgb(240, 20, 20);
        }
        .supports{
          .supports-item{
            padding: 16px 12px;
            font-size: 0;
            @include border-1px(rgba(7, 17, 27, 0.1));
            &:last-child{
              border: none;
            }
            .icon{
              display: inline-block;
              vertical-align: top;
              width: 16px;
              height: 16px;
              margin-right: 6px;
              background-size: 16px;
              background-repeat: no-repeat;
              &.decrease{
                @include bg-image('decrease_4')
              }
              &.discount{
                @include bg-image('discount_4')
              }
              &.guarantee{
                @include bg-image('guarantee_4')
              }
              &.invoice{
                @include bg-image('invoice_4')
              }
              &.special{
                @include bg-image('special_4')
              }
            }
            .text{
              line-height: 16px;
              font-size: 12px;
            }
          }
        }        
      }
    }
    .pics{
      padding: 18px;
      .title{
        margin-bottom: 12px;
        line-height: 14px;
        font-size: 14px;
        color: rgb(7, 17, 27);
      }
      .picWrapper{
        width: 100%;
        overflow: hidden;
        white-space: nowrap;
        .picList{
          font-size: 0;
          .picItem{
            display: inline-block;
            margin-right: 6px;
            &:last-child{
              margin-right: 0;
            }
          }
        }
      }
    }
    .info{
      padding: 18px 18px 0 18px;
      color: rgb(7, 17, 27);
      .title{
        margin-bottom: 12px;
        line-height: 14px;
        @include border-1px(rgba(7, 17, 27, 0.1));
        font-size: 14px;
      }
      .info-item{
        padding: 16px 12px;
        line-height: 14px;
        font-size: 12px;
        @include border-1px(rgba(7, 17, 27, 0.1));
        &:last-child{
          border: none;
        }
      }
    }
}
</style>