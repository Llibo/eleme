<template>
	<div class="ratingSelect">
		<div class="ratingType border-1px">
      <span class="block positive"
            :class="{active: selectType===2}"
            @click="select(2)">{{desc.all}}<span class="count">{{rating.length}}</span></span>
      <span class="block positive"
            :class="{active: selectType===0}"
            @click="select(0)">{{desc.positive}}<span class="count">{{positive.length}}</span></span>
      <span class="block negitive"
            :class="{active: selectType===1}"
            @click="select(1)">{{desc.negative}}<span class="count">{{negative.length}}</span></span>   
    </div>
    <div class="switch" :class="{'on': onlyContent}">
      <span class="icon-check_circle"></span>
      <span class="text" @click="toggleContent(1)">只看内容的评价</span>
    </div>
	</div>
</template>
<script>
  const POSITIVE = 0
  const NEGATIVE = 1
  const ALL = 2
  export default {
    props: {
      rating: {
        type: Array,
        default: () => []
      },
      selectType: {
        type: Number,
        default: ALL
      },
      onlyContent: {
        type: Boolean,
        default: false
      },
      desc: {
        type: Object,
        default: () => {
          return {
            all: '全部',
            positive: '满意',
            negative: '不满意'
          }
        }
      }
    },
    computed: {
      positive () {
        return this.rating.filter((item) => {
          return item.rateType === POSITIVE
        })
      },
      negative () {
        return this.rating.filter((item) => {
          return item.rateType === NEGATIVE
        })
      }
    },
    methods: {
      select (type) {
        this.$emit('ratingTypeSelected', type)
      },
      toggleContent () {
        this.$emit('toggleContent', this.onlyContent)
      }
    }
  }
</script>
<style lang="scss" scoped>
@import "~common/style/mixin";
	.ratingSelect{
    .ratingType{
      padding: 18px 0;
      margin: 0 18px;
      @include border-1px(rgba(7, 17, 27, 0.1));
      font-size: 0;
      .block{
        display: inline-block;
        padding: 8px 12px;
        margin-right: 8px;
        border-radius: 1px;
        ling-height: 16px;
        font-size: 12px;
        color: rgb(77, 85, 93);
        &.active{
          color: #fff;
        }
        .count{
          margin-left: 2px;
          font-size: 8px;
        }
        &.positive{
          background: rgba(0, 160, 220, 0.2);
          &.active{
            background: rgb(0, 160, 220);
          }
        }
        &.negitive{
          background: rgba(77, 85, 93, 0.2);
          &.active{
            background: rgb(77, 85, 93);
          }
        }
      }
    }
    .switch{
      padding: 12px 18px;
      line-height: 24px;
      border-bottom: 1px solid rgba(7, 17, 27, 0.1);
      color: rgb(147, 153, 159);
      font-size: 0;
      &.on{
        .icon-check_circle{
          color: #00c850;
        }
      }
      .icon-check_circle{
        display: inline-block;
        vertical-align: top;
        margin-right: 4px;
        font-size: 24px;
      }
      .text{
        vertical-align: top;
        font-size: 12px;
      }
    }
  }
</style>