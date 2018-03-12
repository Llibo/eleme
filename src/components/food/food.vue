<template>
	<transition name="slide">
		<div class="food" v-show="showFlag" ref="food">
			<div class="foodContent">
				<div class="imageHeader">
					<img :src="food.image">
					<div class="back" @click="hide">
						<i class="icon-arrow_left"></i>
					</div>
				</div>
				<div class="content">
					<h1 class="title">{{food.name}}</h1>
					<div class="detail">
						<span class="sellCount">月售{{food.sellCount}}</span>
						<span class="rating">好评率{{food.rating}}%</span>
					</div>
					<div class="price">
						<span class="now">￥{{food.price}}</span><span v-show="food.oldPrice" class="old">￥{{food.oldPrice}}</span>
					</div>
					<div class="cartControlWapper">
						<cartControl :food="food"></cartControl>
					</div>
					<transition name="fade">
						<div class="buy" v-show="!food.count || food.count === 0" @click.stop="addFirst">加入购物车</div>
					</transition>
				</div>
        <split></split>
        <div class="info" v-show="food.info">
          <h1 class="title">商品信息</h1>
          <p class="text">{{food.info}}</p>
        </div>
        <split></split>
        <div class="rating">
          <h1 class="title">商品评价</h1>
          <ratingSelect :selectType="selectType" 
                        :onlyContent="onlyContent" 
                        :desc="desc"
                        :rating="food.ratings"
                        @ratingTypeSelected="selectRating"
                        @toggleContent="toggleContent"></ratingSelect>
          <div class="ratingWrapper">
            <ul v-show="food.ratings && food.ratings.length">
              <li v-show="needShow(rating.rateType, rating.text)" 
                  v-for="rating in food.ratings" 
                  class="ratingItem border-1px">
                <div class="user">
                  <span class="name">{{rating.username}}</span>
                  <img :src="rating.avatar" class="avatar" width="12" height="12">
                </div>
                <div class="time">{{rating.rateTime | formatDate}}</div>
                <p class="text">
                  <span :class="{'icon-thumb_up':rating.rateType === 0, 'icon-thumb_dowm':rating.rateType === 1}"></span>
                  {{rating.text}}
                </p>
              </li>
            </ul>
            <div class="noRating" v-show="!food.ratings || !food.ratings.length">暂无评价</div>
          </div>
        </div>
			</div>
		</div>
	</transition>
</template>
<script>
import Vue from 'vue'
import BScroll from 'better-scroll'
import cartControl from 'components/cartControl/cartControl'
import split from 'components/split/split'
import ratingSelect from 'components/ratingSelect/ratingSelect'
import {commonFilter} from 'common/js/mixin'

  // const POSITIVE = 0
  // const NEGATIVE = 1
const ALL = 2
export default {
  mixins: [commonFilter],
  props: {
    food: {
      type: Object
    }
  },
  data () {
    return {
      showFlag: false,
      selectType: ALL,
      onlyContent: true,
      desc: {
        all: '全部',
        positive: '推荐',
        negative: '吐槽'
      }
    }
  },
  methods: {
    show () {
      this.showFlag = true
      this.selectType = ALL
      this.onlyContent = true
      this.$nextTick(() => {
        if (!this.scroll) {
          this.scroll = new BScroll(this.$refs.food, {
            click: true
          })
        } else {
          this.scroll.refresh()
        }
      })
    },
    hide () {
      this.showFlag = false
    },
    addFirst (event) {
      this.$emit('add', event.target)
      Vue.set(this.food, 'count', 1)
    },
    selectRating (type) {
      this.selectType = type
      this.$nextTick(() => {
        this.scroll.refresh()
      })
    },
    toggleContent () {
      this.onlyContent = !this.onlyContent
      this.$nextTick(() => {
        this.scroll.refresh()
      })
    },
    needShow (type, text) {
      if (this.onlyContent && !text) {
        return false
      }
      if (this.selectType === ALL) {
        return true
      } else {
        return this.selectType === type
      }
    }
  },
  components: {
    cartControl,
    split,
    ratingSelect
  }
}
</script> 
<style lang="scss" scoped>
@import "~common/style/mixin";
	.food{
		position: fixed;
		left: 0;
		top: 0;
		bottom: 48px;
    padding-bottom: 48px;
		z-index: 30;
		width: 100%;
		background: #fff;
    &.slide-enter-active, &.slide-leave-active {
			transition: all 0.5s;
		}
		&.slide-enter, &.slide-leave-to{
			transform: translate3D(100%, 0, 0);
		}
		.imageHeader{
			position: relative;
			width: 100%;
			height: 0;
			// w3c标准，padding设置100%时是根据width计算的，这样设置没有图片时可以看成一个宽高相等的盒子
			padding-top: 100%;
			img {
				position: absolute;
				top: 0;
				left: 0;
				width: 100%;
				height: 100%;
			}
			.back{
				position: absolute;
				top: 10px;
				left: 0;
				.icon-arrow_left{
					display: block;
					// 扩大按钮的点击区域
					padding: 10px;
					font-size: 20px;
					color: #fff;
				}
			}
		}
		.content{
			position: relative;
			padding: 18px;
			.title{
				line-height: 14px;
				margin-bottom: 8px;
				font-size:  14px;
				font-weight: 700;
				color: rgb(7, 17, 27);
			}
			.detail{
				margin-bottom: 18px;
				line-height: 10px;
				height: 10px;
				font-size: 0;
				.sellCount, .rating{
					font-size: 10px;
					color: rgb(147, 153, 159);
				}
				.sellCount{
          margin-right: 12px; 
				}
			}
			.price{
				font-weight: 700;
				ling-height: 24px;
				.now{
					margin-right: 8px;
					font-size: 14px;
					color: rgb(240 , 20, 20);
				}
				.old{
					text-decoration: line-through;
					font-size: 10px;
					color: rgb(147, 157, 159);
				}
			}
			.cartControlWapper{
				position: absolute;
				right: 12px;
				bottom: 12px;
			}
			.buy{
				position: absolute;
				right: 18px;
				bottom: 18px;
				z-index: 10;
				height: 24px;
				line-height: 24px;
				padding: 0 12px;
				box-sizing: border-box;
				border-radius: 12px;
				font-size: 10px;
				color: #fff;
				background: rgb(0, 160, 220);
		    &.fade-enter-active, &.fade-leave-active {
					transition: all 0.5s;
				}
				&.fade-enter, &.fade-leave-to{
					opacity: 0;
				}
			}
		}
		.info{
			padding: 18px;
			.title{
				line-height: 14px;
				margin-bottom: 6px;
        font-size: 14px;
        color: rgb(7, 17, 27);
			}
			.text{
				padding: 0 8px;
				line-height: 16px;
				font-size: 12px;
				color: rgb(77, 85, 93);
			}
		}
    .rating{
      padding-top: 18px;
      .title{
        line-height: 14px;
        margin-left: 18px;
        font-size: 14px;
        color: rgb(7, 17, 27);
      }
      .ratingWrapper{
        padding: 0 18px;
        .ratingItem{
          position: relative;
          padding: 16px 0;
          @include border-1px(rgba(7, 17, 27, 0.1));
          .user{
            position: absolute;
            right: 0;
            top: 16px;
            line-height: 12px;
            font-size: 0;
            .name{
              display: inline-block;
              margin-right: 6px;
              vertical-aligin: top;
              font-size: 10px;
              color: rgb(147, 153, 159);
            }
            .avatar{
              border-radius: 50%;
            }
          }
          .time{
            margin-bottom: 6px;
            line-height: 12px;
            font-size: 10px;
            color: rgb(147, 153, 159);
          }
          .text{
            line-height: 16px;
            font-size: 12px;
            color: rgb(7, 17, 27);
            .icon-thumb_up, .icon-thumb_dowm{
              margin-right: 4px;
              line-height: 24px;
              font-size: 12px;
            }
            .icon-thumb_up{
              color: rgb(0, 160, 220);
            }
            .icon-thumb_dowm{
              color: rgb(147, 153, 159);
            }
          }
        }
        .noRating{
          padding: 16px 0;
          font-size: 10px;
          color: rgb(147, 153, 159);
        }
      }
    }
	}
</style>