<template>
  <div>
    <el-button type="info" @click="logout">退出</el-button>
  </div>
</template>

<script>
export default {
  name:'Home',
  methods: {
    logout(){
        //清空sessionStorage里面的token内容
        window.sessionStorage.clear();
        //然后再为其设置一个需要跳转的页面
        this.$router.push('/login');
      }
  },
}
</script>

<style lang="less" scoped>

</style>