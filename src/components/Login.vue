<template>
  <div class="login-container">
    <div class="login_box">
      <!--头像区域-->
      <div class="avatar_box">
        <img src="../assets/logo.png" alt="" />
      </div>

      <!--表单登录区域-->
      <el-form label-width="0px" class="logo-form" :rules="loginFormRules" 
      :model="loginForm" ref="loginFormRef">
        <!--  账户  -->
        <el-form-item  prop="username">
          <el-input prefix-icon="iconfont icon-user" 
          v-model="loginForm.username"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input prefix-icon="iconfont icon-3702mima" 
          v-model="loginForm.password" type="password"></el-input>
        </el-form-item>
        <!-- 登录 -->
        <el-form-item label="" class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
 data() {
   return {
     loginForm:{
       username:'admin',
       password:'123456'
     },
     loginFormRules:{
       username: [
        { required: true, message: '请输入正确的名称', trigger: 'blur' },
        { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
       ],
       password: [
        { required: true, message: '请输入正确的密码', trigger: 'blur' },
        { min: 3, max: 12, message: '长度在 3 到 12 个字符', trigger: 'blur' }
       ]
     }
   }
 },
 methods: {
   resetLoginForm(){
     //点击按钮以后，重置里面的内容，使用resetField这个属性重置获得的表单实例对象
    //  console.log(this);
      this.$refs.loginFormRef.resetFields();
   },
   login(){
     //点击按钮以后验证登录表单是否正确
     this.$refs.loginFormRef.validate(async valid => {
      //  console.log(valid);
       if(!valid) return;
       //login 为数据接口，loginForm为拿到的表单对象的数据
       const {data:res} = await this.$http.post("login",this.loginForm);
        // console.log(res);
       if(res.meta.status !== 200) return this.$message.error('登录错误');
       this.$message.success('登录成功')
       /*
        1.第一步：登录成功之后的token的保存，需要保存到sessionStorage中
          1.项目中除了登录之外的其他接口，必须要在登录之后才可以访问
          2.token只应在当前登录网站时才生效，所以当将他token保存在settionStorage中

        2.第二步：可以通过编程式跳转到后台后台页面，路由地址是/home
       
       
       */ 
      window.sessionStorage.setItem("token", res.data.token);
      this.$router.push('/home');

     })
   }
 },
};
</script>

<style lang="less" scoped>
.login-container {
  height: 100%;
  background-color: #2b4b6b;
}

.login_box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

.avatar_box {
  width: 130px;
  height: 130px;
  padding: 10px;
  border-radius: 50%;
  box-shadow: 0 0 10px #ddd;
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #fff;
  img {
    width: 100%;
    border-radius: 50%;
    background-color: #eee;
  }
}
.logo-form{
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}
.btns{
  display: flex;
  justify-content: flex-end;
}
</style>