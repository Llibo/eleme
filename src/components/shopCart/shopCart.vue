<template>
	<div>
		<div class="shopCart">
			<div class="content" @click="toggleList">
				<div class="content-left">
					<div class="logo-wrapper">
						<div class="logo" :class="{highLight: totalCount > '0'}">
							<i class="icon-shopping_cart" :class="{highLight: totalCount > 0}"></i>
						</div>
						<div class="num" v-show="totalCount">{{totalCount}}</div>
					</div>
					<div class="price" :class="{highLight: totalPrice > 0}">￥{{totalPrice}}元</div>
					<div class="desc">另需配送费￥{{deliveryPrice}}元</div>
				</div>
				<div class="content-right" @click.stop="pay">
					<div class="pay" :class="payClass">{{payDesc}}</div>
				</div>
			</div>
			<div class="ballContainer">
				<transition name="drop"
				            v-for="(ball, index) in balls"
                    :key="index"
				            @before-enter="beforeEnter"
				            @enter="enter"
				            @after-enter="afterEnter">
			    <div v-show="ball.show" class="ball">
			      <div class="inner inner-hook" ></div>
			    </div>
				</transition>
			</div>
			<transition name="fold">
				<div class="shopCartList" v-show ="listShow" >
					<div class="listHeader">
						<h1 class="title">购物车</h1>
						<span class="empty" @click="empty">清空</span>
					</div>
					<div class="listContent" ref="listContent">
						<ul>
							<li class="food border-1px" v-for="food in selectFood">
								<span class="name">{{food.name}}</span>
								<div class="price">
									<span>￥{{food.price * food.count}}</span>
								</div>
								<div class="cartControlWapper">
									<cartControl :food="food"  @add="drop"></cartControl>
								</div>
							</li>
						</ul>
					</div>
				</div>
			</transition>
		</div>
		<transition name="fade">
			<div class="listMask" v-show="listShow" @click="hideList"></div>
	  </transition>
	</div>
</template>
<script>
	import cartControl from 'components/cartControl/cartControl'
	import BScroll from 'better-scroll'

	export default {
	  props: {
	    selectFood: {
	      type: Array,
	      default () {
	        return []
	      }
	    },
	    deliveryPrice: {
	      type: Number
	    },
	    minPrice: {
	      type: Number
	    }
	  },
  data () {
    return {
      balls: [{
        show: false
      }, {
        show: false
      }, {
        show: false
      }, {
        show: false
      }, {
        show: false
      }],
      dropBall: [],
      fold: true
    }
  },
	  computed: {
    totalPrice () {
      let total = 0
      this.selectFood.forEach((food) => {
        total += food.price * food.count
      })
      return total
    },
    totalCount () {
      let count = 0
      this.selectFood.forEach((food) => {
        count += food.count
      })
      return count
    },
    payDesc () {
      if (this.totalPrice === 0) {
        return `￥${this.minPrice}起送`
      } else if (this.totalPrice < this.minPrice) {
        let diff = this.minPrice - this.totalPrice
        return `还差￥${diff}起送`
      } else {
        return '去结算'
      }
    },
    payClass () {
      if (this.totalPrice < this.minPrice) {
        return 'not-enough'
      } else {
        return 'enough'
      }
    },
    listShow () {
      if (!this.totalCount) {
        this.fold = true
        return false
      }
      let show = !this.fold
      // 列表初始化的时候初始化滚轴
      if (show) {
        this.$nextTick(() => {
          if (!this.scroll) {
            this.scroll = new BScroll(this.$refs.listContent, {
	              click: true
            })
          } else {
            // 重新计算高度
            this.scroll.refresh()
          }
        })
      }
      return show
    }
	  },
	  methods: {
	    toggleList () {
      if (this.totalCount) {
        this.fold = !this.fold
      }
      return
	    },
	    hideList () {
	      this.fold = true
	    },
	    empty () {
	      this.selectFood.forEach((food) => {
        food.count = 0
	      })
	    },
	    pay () {
	      if (this.totalPrice < this.minPrice) {
	        return
	      }
	    },
	    drop (el) {
      for (let i = 0; i < this.balls.length; i++) {
        let ball = this.balls[i]
        if (!ball.show) {
          ball.show = true
          ball.el = el
          this.dropBall.push(ball)
          return
        }
      }
	    },
	    beforeEnter (el) {
	      let count = this.balls.length
	      while (count--) {
        let ball = this.balls[count]
        if (ball.show) {
          // 获取该小球相对于视口的位置，left和top就是偏移量
          let rect = ball.el.getBoundingClientRect()
          // 小球起止点的x、y距离
          let x = rect.left - 32
          let y = -(window.innerHeight - rect.top - 22)

          el.style.display = ''
          el.style.webkitTransform = `translate3D(0, ${y}px, 0)`
          el.style.transform = `translate3D(0, ${y}px, 0)`

          let inner = el.getElementsByClassName('inner-hook')[0]
          inner.style.webkitTransform = `translate3D(${x}px, 0, 0)`
          inner.style.transform = `translate3D(${x}px, 0, 0)`
        }
	      }
	    },
	    enter (el) {
	      // 首先要触发浏览器的重绘,重回后下面的发发才有用,跳过eslint语法
	     /* eslint-disable no-unused-vars */
      let rf = el.offestHeight
      this.$nextTick(() => {
        el.style.webkitTransform = `translate3D(0, 0, 0)`
        el.style.transform = `translate3D(0, 0, 0)`
        let inner = el.getElementsByClassName('inner-hook')[0]
        inner.style.webkitTransform = `translate3D(0, 0, 0)`
        inner.style.transform = `translate3D(0, 0, 0)`
      })
	    },
	    afterEnter (el) {
	      let ball = this.dropBall.shift()
	      if (ball) {
        ball.show = false
        el.style.display = 'none'
	      }
	    }
	  },
	  components: {
	    cartControl
	  }
	}
</script>
<style lang="scss" scoped>
@import "~common/style/mixin";
	.shopCart{
		position: fixed;
		left: 0;
		bottom: 0;
		z-index: 50;
		width: 100%;
		height: 48px;
		background: #000;
		.content{
			display: flex;
			background: #141d27;
			.content-left{
        flex: 1;
        font-size: 0;
        .logo-wrapper{
					display: inline-block;
					vertical-align: top;
					position: relative;
					top: -10px;
					margin: 0 12px;
					padding: 6px;
					// 盒模型包括padding和border不用在去进行计算
					width: 56px;
					height: 56px;
					box-sizing: border-box;
					border-radius: 50%;
					background: #141d27;
					.logo{
						width: 100%;
						height: 100%;
						text-align: center;
						border-radius: 50%;
						background: #2b343c;
						&.highLight{
							background: rgb(0, 160, 220)
						}
						.icon-shopping_cart{
							line-height: 44px;
							font-size: 24px;
							color: #80858a;
							&.highLight{
								color: #fff;
							}
						}
					}
					.num{
						position: absolute;
						top: 0;
						right: 0;
						width: 24px;
						height: 16px;
						line-height: 16px;
						text-align: center;
						border-radius: 16px;
						font-size: 9px;
						font-weight: 700;
						color: #fff;
						background: rgb(240, 20, 20);
						box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.4);
					}
        }
        .price{
					display: inline-block;
					vertical-align: top;
					margin-top: 12px;
					line-height: 24px;
					padding-right: 12px;
					box-sizing: border-box;
					border-right: 1px solid rgba(255, 255, 255, 0.1);
					font-size: 16px;
					font-weight: 700;
					color: rgba(255, 255, 255, 0.4);
					&.highLight{
						color: #fff;
					}
        }
        .desc{
					display: inline-block;
					vertical-align: top;
					margin: 12px 0 0 12px;
					line-height: 24px;
					font-size: 10px;
					color: rgba(255, 255, 255, 0.4);
        }
			}
			.content-right{
				flex: 0 0 105px;
				width: 105px;
				.pay{
					line-height: 48px;
					text-align: center;
					font-size: 12px;
					color: rgba(255, 255, 255, 0.4);
					font-weight: 700;
					background: #2b333b;
					&.not-enough {
						background: #2b333b;
					}
					&.enough{
						background: #00b43c;
						color: #fff;
					}
				}
			}
		}
		.ballContainer{
			.ball{
				position: fixed;
				left: 32px;
				bottom: 22px;
				z-index: 200;
				transition: all 0.4s cubic-bezier(0.49, -0.6, 0.83, 0.67);
			}
			.inner{
				width: 16px;
				height: 16px;
				border-radius: 50%;
				background: rgb(0, 160, 220);
				transition: all 0.4s linear;
			}			
		}
		.shopCartList {
			position: absolute;
			top: 0;
			left: 0;
			z-index: -1;
			width: 100%;
		  transform: translate3D(0, -100%, 0);
	    &.fold-enter-active, &.fold-leave-active {
				transition: all 0.5s;
			}
			&.fold-enter, &.fold-leave-to{
				transform: translate3D(0, 0, 0);
			}
			.listHeader{
				height: 40px;
				line-height: 40px;
				padding: 0 18px;
				background: #f3f5f7;
				boeder-bottom: 1px solid rgba(7, 17, 27, 0.1);
				.title{
					float: left;
					font-size: 14px;
					color: rgb(7, 17, 27);
				}
				.empty{
					float: right;
					font-size: 12px;
					color: rgb(0, 160, 220)
				}
			}
			.listContent{
				padding: 0 18px;
				max-height: 217px;
				overflow: hidden;
				background: #fff;
				.food{
					position: relative;
					padding: 12px 0;
					box-sizing: border-box;
					@include border-1px(rgba(7, 17, 27, 0.1));
					.name{
						line-height: 24px;
						font-size: 14px;
						color: rgb(7, 17, 27);
					}
					.price{
						position: absolute;
						right: 90px;
						bottom: 12px;
						line-height: 24px;
						font-weight: 700;
						color: rgb(240, 20, 20);
					}
					.cartControlWapper{
						position: absolute;
						right: 0;
						bottom: 6px;

					}
				}
			}
		}
	}
	.listMask{
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: 40px;
		background: rgba(7, 17, 27, 0.6);
		backdrop-filter: blur(10px);
		&.fade-enter-active, &.fade-leave-active {
			transition: all 0.5s;
		}
		&.fade-enter, &.fade-leave-to{
			opacity: 0;
			background: rgba(7, 17, 27, 0);
		}		
	}
</style> 