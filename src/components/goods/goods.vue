<template>
	<div class="goods">
		<div class="menu-wrapper" ref="menuWrapper">
			<ul>
				<li v-for="(item, index) in goods" class="menu-item" :class="{current: currentIndex === index}" @click="selectMenu(index)">
					<span class="text border-1px">
					<span v-show="item.type > 0" class="icon" :class=classMap[item.type]></span>{{item.name}}
					</span>
				</li>
			</ul>
		</div>
		<div class="foods-wrapper" ref="foodWrapper">
			<ul>
				<li v-for="item in goods" class="food-list food-list-hook">
					<h1 class="title">{{item.name}}</h1>
					<ul>
						<li v-for="food in item.foods" 
						    class="food-item border-1px"  
						    @click="selectFoodSigle(food)">
							<div class="icon">
								<img width="57" height="57" :src="food.icon">
							</div>
							<div class="content">
								<h2 class="name">{{food.name}}</h2>
								<p class="desc">{{food.description}}</p>
								<div class="extra">
									<span class="count">月售:{{food.sellCount}}份</span><span>好评率:{{food.rating}}%</span>
								</div>
								<div class="price">
									<span class="now">￥{{food.price}}</span><span v-show="food.oldPrice" class="old">￥{{food.oldPrice}}</span>
								</div>
								<div class="cartControlWapper">
									<cartControl :food="food" @add="cartAdd"></cartControl>
								</div>
							</div>
						</li>
					</ul>
				</li>
			</ul>
		</div>
		<shopCart ref="shopCart" :selectFood="selectFood" :deliveryPrice="seller.deliveryPrice" :minPrice="seller.minPrice"></shopCart>
		<food :food="selectedFood" ref="food"></food>
	</div>
</template>
<script>
	import BScroll from 'better-scroll'
	import shopCart from 'components/shopCart/shopCart'
	import cartControl from 'components/cartControl/cartControl'
	import food from 'components/food/food'

	const ERR_OK = 0

	export default {
	  props: {
    seller: {
	      type: Object
	    }
	  },
	  data () {
	    return {
	      goods: [],
	      listHeight: [],
	      scrollY: 0,
	      selectedFood: {}
	    }
	  },
	  computed: {
	    currentIndex () {
      for (var i = 0; i < this.listHeight.length; i++) {
        let height1 = this.listHeight[i]
        let height2 = this.listHeight[i + 1]
        if (!height2 || (this.scrollY >= height1 && this.scrollY < height2)) {
          return i
        }
      }
      return 0
	    },
	    selectFood () {
	      let foods = []
	      this.goods.forEach((good) => {
	        good.foods.forEach((food) => {
          if (food.count) {
            foods.push(food)
          }
	        })
	      })
	      return foods
	    }
	  },
	  created () {
	    this.axios.get('/api/goods').then((res) => {
	      res = res.data
	      // console.log(res)
	      if (res.errno === ERR_OK) {
	        this.goods = res.data
	        // this._initScorll()
	        // 在dom更新后初始化滚动，以防出现拉不动的情况
	        this.$nextTick(() => {
	          this._initScorll()
	          this._calculateHeight()
	        })
	      }
	    })
	    this.classMap = ['decrease', 'discount', 'guarantee', 'invoice', 'special']
	  },
	  methods: {
    selectMenu (index) {
      let foodList = this.$refs.foodWrapper.getElementsByClassName('food-list-hook')
      let el = foodList[index]
      this.foodScroll.scrollToElement(el, 300)
    },
    selectFoodSigle (food) {
      this.selectedFood = food
      this.$refs.food.show()
    },
    cartAdd (target) {
      // 体验优化，异步执行下落动画
      this.$nextTick(() => {
        this.$refs.shopCart.drop(target)
      })
    },
    _initScorll () {
	      this.menuScroll = new BScroll(this.$refs.menuWrapper, {
	        click: true
	      })
	      this.foodScroll = new BScroll(this.$refs.foodWrapper, {
	        // 实时告诉滚动位置
	        probeType: 3,
	        click: true
	      })
	      this.foodScroll.on('scroll', (pos) => {
	        // pos.y为一个负的小数，所以要先取整在取绝对值
        this.scrollY = Math.abs(Math.round(pos.y))
	      })
	    },
    _calculateHeight () {
      let foodList = this.$refs.foodWrapper.getElementsByClassName('food-list-hook')
      let height = 0
      this.listHeight.push(height)
      for (var i = 0; i < foodList.length; i++) {
        let item = foodList[i]
        height += item.clientHeight
        this.listHeight.push(height)
      }
    }
	  },
	  components: {
	    shopCart,
	    cartControl,
	    food
	  }
	}
</script>
<style lang="scss" scoped>
@import "~common/style/mixin";

	.goods{
		// 决定视口的高度
		display: flex;
		position: absolute;
		top: 174px;
		bottom: 46px;
		width: 100%;
		overflow: hidden;
		.menu-wrapper{
			// 等分 内容缩放情况 占位和空间,左侧定宽，右侧自适应
			flex: 0 0 80px;
			// 不写宽度在安卓浏览器里会有问题
			width: 80px;
			background: #f3f5f7;
			.menu-item{
				display: table;
				height: 54px;
				width: 56px;
				padding: 0 12px;
				line-height: 14px;
				&.current{
					position: relative;
					z-index: 10;
					margin-top: -1px;
					background: #fff;
					font-weight: 700;
					.text{
						@include border-none();
					}
				}
				.icon{
					display: inline-block;
					vertical-align: top;
					width: 12px;
					height: 12px;
					margin-right: 4px;
					background-size: 12px;
					background-repeat: no-repeat;
					&.decrease{
						@include bg-image('decrease_3')
					}
					&.discount{
						@include bg-image('discount_3')
					}
					&.guarantee{
						@include bg-image('guarantee_3')
					}
					&.invoice{
						@include bg-image('invoice_3')
					}
					&.special{
						@include bg-image('special_3')
					}
				}
				.text{
					display: table-cell;
					width: 56px;
					// 在table布局中设置垂直居中
					vertical-align: middle;
					@include border-1px(rgba(7, 17, 27, 0.1));
					font-size: 12px;

				}
			}
		}
		.foods-wrapper{
			flex: 1;
			.title{
				padding-left: 14px;
				height: 26px;
				line-height: 26px;
				border-left: 2px solid #dedde1;
				font-size: 12px;
				color: rgb(147,153,159);
				background: #f3f5f7;
			}
			.food-item{
				display: flex;
				margin: 18px;
				padding-bottom: 18px;
				@include border-1px(rgba(7, 17, 27, 0.1));

				&:last-child{
					@include border-none;
					margin-bottom: 0;
				}
				.icon{
					flex: 0 0 57px;
					margin-right: 10px;
				}
				.content{
					flex: 1;
					.name{
						margin: 2px 0 8px 0;
						height: 14px;
						line-height: 14px;
						font-size: 14px;
						color: rgb(7, 17, 27);
					}
					.desc, .extra{
						line-height:10px;
						font-size: 10px;
						margin-bottom: 8px;
						color: rgb(147, 157, 159);
					}
					.desc{
						line-height:12px;
					}
					.extra{
						.count{
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
						right: 0;
						bottom: 12px;
					}
				}
			}
		}
	}
</style>