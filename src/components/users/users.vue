<template>
  <div>
    <!-- 面包屑区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片区域 -->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="7">
          <!-- 搜索添加区域 -->
          <el-input
            placeholder="请输入内容"
            clearable
            v-model="queryInfo.query"
            @clear="getUsersList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getUsersList"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true"
            >添加用户</el-button
          >
        </el-col>
      </el-row>

      <!-- 数据列表区域 -->
      <el-table :data="userList" stripe border>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <el-table-column label="状态" prop="mg_state">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.mg_state"
              @change="userStateChange(scope.row)"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">
            <!-- 编辑按钮 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEdiorDialog(scope.row.id)"
            ></el-button>
            <!-- 删除按钮 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeUserById(scope.row.id)"
            ></el-button>
            <!-- 分配角色按钮 -->
            <el-tooltip
              effect="dark"
              content="分配角色"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="mini"
                @click="setRoleDialog(scope.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>

    <!-- 对话框的区域 -->
    <el-dialog
      title="添加用户"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClose"
    >
      <!-- 内容部分 -->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="70px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部内容 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改用户的对话框 -->
    <el-dialog
      title="修改用户"
      :visible.sync="editorDialogVisible"
      width="50%"
      @close="editorDialogClosed"
    >
      <el-form
        :model="editorForm"
        :rules="editorFormRules"
        ref="editorFormRef"
        label-width="100px"
      >
        <el-form-item label="用户名">
          <el-input v-model="editorForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editorForm.email"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input v-model="editorForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editorDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分配角色对话框区域 -->
    <el-dialog
      title="分配角色"
      :visible.sync="setRoledialogVisible"
      width="50%"
      @close="setRoleDialogClosed"
    >
      <div>
        <p>当前的用户：{{ userInfo.username }}</p>
        <p>当前的角色：{{ userInfo.role_name }}</p>
        <p>
          分配新的角色：
          <el-select v-model="selectRole" placeholder="请选择">
          <el-option
            v-for="item in rolesList"
            :key="item.id"
            :label="item.roleName"
            :value="item.id"
          >
          </el-option>
        </el-select>
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRoledialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveRoleInfo"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "users",
  data() {
    var checkEmaile = (rule, value, cd) => {
      //定义一个验证邮箱的正则表达式
      const regEmaile = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/;
      if (regEmaile.test(value)) {
        return cd();
      }
      cd(new Error("请输入正确的邮箱"));
    };
    //自定义一个电话的较验规则
    var checkMobile = (rule, value, cd) => {
      var regMobile =
        /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;
      if (regMobile.test(value)) {
        return cd();
      }
      cd(new Error("请输入正确的电话"));
    };
    return {
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 2,
      },
      userList: [],
      total: 0,

      //控制添加对话框的显示与隐藏
      addDialogVisible: false,
      //修改用户的显示与隐藏
      editorDialogVisible: false,
      //添加表单的对话框事件
      addForm: {
        username: "",
        password: "",
        email: "",
        mobile: "",
      },
      //添加保单的较验规则对象
      addFormRules: {
        username: [
          { required: true, message: "请输入用户名称", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "长度在 3 到 10 个字符",
            trigger: "blur",
          },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 15,
            message: "长度在 6 到 15 个字符",
            trigger: "blur",
          },
        ],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          //调用较验规则checkEmaile
          { validator: checkEmaile, trigger: "blur" },
        ],
        mobile: [
          { required: true, message: "请输入电话", trigger: "blur" },
          //调用较验规则checkMobile
          { validator: checkMobile, trigger: "blur" },
        ],
      },
      //查询到的用户对象数据
      editorForm: {},
      //添加修改用户对话框的较验规则
      editorFormRules: {
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          //调用较验规则checkEmaile
          { validator: checkEmaile, trigger: "blur" },
        ],
        mobile: [
          { required: true, message: "请输入电话", trigger: "blur" },
          //调用较验规则checkMobile
          { validator: checkMobile, trigger: "blur" },
        ],
      },
      //保存分配角色对话框的显示与隐藏
      setRoledialogVisible: false,
      //需要被分配器角色的用户信息保存
      userInfo: {},
      //所有角色的数据列表
      rolesList: [],
      //被选择的用户数据
      selectRole:''
    };
  },
  created() {
    this.getUsersList();
  },
  methods: {
    //获取用户列表的数据
    async getUsersList() {
      const { data: res } = await this.$http.get("users", {
        params: this.queryInfo,
      });
      if (res.meta.status !== 200) {
        return this.$message.error("获取用户列表失败");
      }
      this.userList = res.data.users;
      this.total = res.data.total;
      // console.log(res);
    },
    //监听pagesize要改变的事件
    handleSizeChange(newSize) {
      this.queryInfo.pagenum = newSize;
      this.getUsersList();
      // console.log(newSize);
    },
    //监听页面值改变的数字，监听页码值改变的数值
    handleCurrentChange(newPage) {
      this.queryInfo.pagesize = newPage;
      this.getUsersList();
      // console.log(newPage);
    },
    //监听switch的状态事件
    async userStateChange(userInfo) {
      console.log(userInfo);
      const { data: res } = await this.$http.put(
        `users/${userInfo.id}/state/${userInfo.mg_state}`
      );
      console.log(res);
      if (res.meta.status !== 200) {
        userInfo.mg_state = !userInfo.mg_state;
        return this.$$message.error("更新用户状态失败");
      }
      this.$message.success("更新用户状态成功");
    },
    //监听添加对话框的关闭事件，当点击关闭事件以后重新重置数据
    addDialogClose() {
      this.$refs.addFormRef.resetFields();
    },
    //点击按钮，添加新用户
    addUser() {
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) return;
        //可以发起添加用户的网络请求
        const { data: res } = await this.$http.post("users", this.addForm);
        console.log(res);
        if (res.meta.status !== 201) {
          return this.$message.error("添加用户失败");
        }
        this.$message.success("添加用户成功");
        //隐藏添加用户的对话框
        this.addDialogVisible = false;
        //重新刷新用户列表
        this.getUsersList();
      });
    },
    //添加修改对话框
    async showEdiorDialog(id) {
      const { data: res } = await this.$http.get("users/" + id);
      if (res.meta.status !== 200) {
        return this.$message.error("查询的信息错误");
      }
      this.editorForm = res.data;
      this.editorDialogVisible = true;
    },
    //监听修改对话框的关闭事件,重置里面的内容
    editorDialogClosed() {
      this.$refs.editorFormRef.resetFields();
    },
    //修改用户信息并提交
    editUserInfo() {
      //首先对提交的信息作预处理
      this.$refs.editorFormRef.validate(async (valid) => {
        if (!valid) return;

        //发起修噶数据的网络请求
        const { data: res } = await this.$http.put(
          "users/" + this.editorForm.id,
          {
            email: this.editorForm.email,
            mobile: this.editorForm.mobile,
          }
        );

        if (res.meta.status !== 200) {
          this.$message.error("更新用户的信息失败");
        }

        //否则就说名更新的用户信你成功，有三步
        //关闭对话框
        this.editorDialogVisible = false;
        //刷新对话框的列表
        this.getUsersList();
        //弹出更新成功的弹框
        this.$message.success("修改对话框成功");
      });
    },
    //根据id删除相对的信息
    async removeUserById(id) {
      console.log(id);
      const confirm = await this.$confirm(
        "此操作将永久删除该用户, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((error) => error);

      //1.如果用户为确认删除，则会返回一个字符串，值为confirm
      //2.如果用户点击的时取消按钮，则会返回一个的也是一个字符串，值为cancel

      if (confirm !== "confirm") {
        return this.$message.info("已经取消删除");
      }
      // console.log('确认了删除');

      const { data: res } = await this.$http.delete("users/" + id);
      if (res.meta.status !== 200) {
        return this.$message.error("删除用户失败");
      }

      this.$message.success("成功删除用户");
      this.getUsersList();
      //已经删除的信息是正确的，不然可能会出现凑无的消息的
    },
    async setRoleDialog(role) {
      this.userInfo = role;

      //在展示对话框之前需要调用所有的数据
      const { data: res } = await this.$http.get("roles");
      if (res.meta.status !== 200) {
        return this.$message.error("被分配角色请求的数据失败");
      }
      this.rolesList = res.data;
      this.setRoledialogVisible = true;
    },
     // 点击按钮，分配角色
    async saveRoleInfo() {
      if (!this.selectRole) {
        return this.$message.error('请选择要分配的角色！')
      }

      const { data: res } = await this.$http.put(
        `users/${this.userInfo.id}/role`,
        {
          rid: this.selectRole
        }
      )

      if (res.meta.status !== 200) {
        return this.$message.error('更新角色失败！')
      }

      this.$message.success('更新角色成功！')
      this.getUsersList()
      this.setRoledialogVisible = false
    },
    // 监听分配角色对话框的关闭事件
    setRoleDialogClosed() {
      this.selectRole = ''
      this.userInfo = {}
    }
  },
};
</script>

<style>
</style>