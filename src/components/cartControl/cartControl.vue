<template>
	<div class="cartControl">
		<transition name="move">
			<span class="icon-remove_circle_outline decrease" v-show="food.count" @click.stop="decreaseCart"></span>
		</transition>
		<div class="count" v-show="food.count">{{food.count}}</div>
		<div class="add icon-add_circle" @click.stop="addCart"></div>
	</div>
</template>
<script>
	import Vue from 'vue'

	export default {
  props: {
    food: {
      type: Object
    }
  },
  created () {
  },
  methods: {
    addCart (event) {
      if (!this.food.count) {
        // 添加一个返回的数据中没有的属性，vue不会观测他的变化进行实时更新，要set进去才会进行观测
        Vue.set(this.food, 'count', 1)
      } else {
        this.food.count ++
      }
      this.$emit('add', event.target)
      return this.food
    },
    decreaseCart () {
      if (this.food.count) {
        this.food.count --
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
  }
	}
</script>
<style lang="scss" scoped>
	.cartControl{
		font-size: 0;
		.decrease{
			display: inline-block;
			padding: 6px;
			display: inline-block;
			font-size: 24px;
			line-height: 24px;
			color: rgb(0, 160, 220);
			transform: rotate(0);
		}
		.count{
			display: inline-block;
			vertical-align: top;
			width: 12px;
			padding-top: 6px;
			line-height: 24px;
			text-align: center;
			font-size: 10px;
			color: rgb(147, 153, 159)
		}
		.add{
			display: inline-block;
			padding: 6px;
			font-size: 24px;
			line-height: 24px;
			color: rgb(0, 160, 220)
		}
   .move-enter-active, .move-leave-active {
			transition: all 0.4s linear;
		}
		.move-enter, .move-leave-to{
			// 开启硬件加速，让动画变得更流畅
			transform: translate3D(24px, 0, 0) rotate(-180deg);
			opacity: 0;
		}	
	}
</style>