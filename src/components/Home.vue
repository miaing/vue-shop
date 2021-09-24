e<template>
  <el-container class="home-container">
    <el-header class="el-header">
      <div>
        <img src="../assets/heima.png" alt="" />
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logout" class="out">退出</el-button>
    </el-header>
    <el-container>
      <!--  侧边栏-->
      <el-aside :width="isCollapse ? '64px' : '200px'" class="el-aside">
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <!-- 侧边栏的菜单区域 -->
        <el-menu
          class="el-menu"
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409EFF" 
          :unique-opened="true"
          :collapse="isCollapse"
          :collapse-transition="false"
          :router="true"
          :default-active="activePath"
        >
          <!-- 一级菜单 -->
          <el-submenu
            :index="item.id + ''"
            v-for="item in menuList" 
            :key="item.id"
          >
            <template slot="title" class="el-submenu">
              <i :class="iconfonts[item.id]"></i>
              <span>{{ item.authName }}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item
              :index="'/'+ subItem.path"
              v-for="subItem in item.children"
              :key="subItem.id"
              @click="saveNavState('/'+ subItem.path)"
            >
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{ subItem.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 主体部分 -->
      <el-main class="el-main">
        <router-view/>
      </el-main>
    </el-container>
  </el-container>
</template>

bian<script>
export default {
  name: "Home",
  data() {
    return {
      //左侧菜单数据
      menuList: [],
      //一级菜单的字体图标数据
      iconfonts: {
        125: "iconfont icon-user",
        103: "iconfont icon-tijikongjian",
        101: "iconfont icon-shangpin",
        102: "iconfont icon-danju",
        145: "iconfont icon-baobiao",
      },
      //菜单是否水平折叠起来
      isCollapse:false,
      //保存被激活的链接地址
      activePath:''
    };
  },
  created() {
    this.getMenuList();
    this.activePath = window.sessionStorage.getItem('activePath');
  },
  methods: {
    logout() {
      //清空sessionStorage里面的token内容
      window.sessionStorage.clear();
      //然后再为其设置一个需要跳转的页面
      this.$router.push("/login");
    },
    //获取左侧菜单的数据
    async getMenuList() {
      const { data: res } = await this.$http.get("menus");
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      this.menuList = res.data;
      // console.log(res);
    },
    //点击菜单以后，折叠左边的菜单栏
    toggleCollapse(){
      this.isCollapse =! this.isCollapse;
    },
    //保存链接的激活状态
    saveNavState(activePath){
      window.sessionStorage.setItem('activePath',activePath);
      //当点击了一次之后，再点击时想要重新高亮时选哟重新赋值
      this.activePath = activePath;
    }
  },
};
</script>

<style lang="less" scoped>
.home-container {
  height: 100%;
}
.el-header {
  display: flex;
  justify-content: space-between;
  background-color: #373d41;
  align-items: center;
  padding-left: 0;
  font-size: 20px;
  > div {
    color: #fff;
    display: flex;
    align-items: center;
    span {
      padding-left: 15px;
    }
  }
}
.el-aside {
  background-color: #333744;
  .el-menu{
    border-right: none;
  }
}
.el-main {
  background-color: #eaedf1;
}
.el-submenu i {
  margin-right: 10px;
}
.toggle-button{
  background: #4a5064;
  font-size: 10px;
  color: #fff;
  line-height: 24px;
  text-align: center;
  cursor: pointer;
  letter-spacing: 0.2em;
}
</style>