<template>
  <div id="app">
    <v-header :seller='seller'></v-header>
    <div class="tab border-1px">
      <div class="tab-item"><router-link class='route-item' to='/goods'>商品</router-link></div>
      <div class="tab-item"><router-link class='route-item' to='/ratings'>评论</router-link></div>
      <div class="tab-item"><router-link class='route-item' to='/seller'>商家</router-link></div>
    </div>
    <keep-alive>
      <router-view :seller="seller"></router-view>  
    </keep-alive>
  </div>
</template>

<script>
import header from 'components/header/header'
import {urlParse} from 'common/js/util'

const ERR_OK = 0

export default {
  // name: 'app',
  data () {
    return {
      seller: {
        id: (() => {
          let queryParam = urlParse()
          return queryParam.id
        })()
      }
    }
  },
  created () {
    this.axios.get('/api/seller?id=' + this.seller.id).then((res) => {
      res = res.data
      // console.log(res)
      if (res.errno === ERR_OK) {
        // 扩展seller属性，防止id被干掉
        this.seller = Object.assign({}, this.seller, res.data)
      }
    })
  },
  components: {
    'v-header': header
  }
}
</script>

<style lang="scss" scoped>
@import "~common/style/mixin";

#app {
  .tab{
    display: flex;
    width: 100%;
    height: 40px;
    line-height: 40px;
    // border-bottom: 1px solid rgba(7, 17, 27, 0.1);
     @include border-1px(rgba(7, 17, 27, 0.1));
    .tab-item{
      flex: 1;
      text-align: center;
      .route-item{
        display: block;//优化部分：设置为block后空白区域也可以进行点击，否则只能点击字体进行跳转
        font-size: 14px;
        color: rgb(77, 85, 93);
        &.active{
         color: rgb(240, 20, 20); 
        }
      }      
    }
  }
}
</style>

