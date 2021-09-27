<template>
  <div>
    <!-- 面包屑区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限角色</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片区域 -->
    <el-card>
      <!-- 添加角色按钮区域 -->
      <el-row>
        <el-col>
          <el-button type="primary">添加角色</el-button>
        </el-col>
      </el-row>

      <!-- 添加角色的列表区域 -->
      <el-table :data="rolesList" border stripe>
        <!-- 扩展区域 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              v-for="(item1, i1) in scope.row.children"
              :key="item1.id"
              :class="['btborder', i1 === 0 ? 'tbtop' : '', 'vcenter']"
            >
              <!-- 一级权限菜单区域 -->
              <el-col :span="5">
                <el-tag
                  type=""
                  closable
                  @close="removeRightById(scope.row, item1.id)"
                  >{{ item1.authName }}</el-tag
                >
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 二级和三级权限菜单区域 -->
              <el-col :span="19">
                <!-- 通过for循环渲染二级权限 -->
                <el-row
                  v-for="(item2, i2) in item1.children"
                  :key="item2.id"
                  :class="[i2 === 0 ? '' : 'tbtop', 'vcenter']"
                >
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="removeRightById(scope.row, item2.id)"
                      >{{ item2.authName }}</el-tag
                    >
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 渲染三级权限 -->
                  <el-col :span="18">
                    <el-tag
                      v-for="item3 in item2.children"
                      :key="item3.id"
                      type="warning"
                      closable
                      @close="removeRightById(scope.row, item3.id)"
                      >{{ item3.authName }}</el-tag
                    >
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!-- 序列区域 -->
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色表述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" prop="children">
          <template width="300px" slot-scope="scope">
            <el-button size="mini" type="primary" icon="el-icon-edit"
              >编辑</el-button
            >
            <el-button size="mini" type="danger" icon="el-icon-delete"
              >删除</el-button
            >
            <el-button size="mini" type="warning" icon="el-icon-setting" 
            @click="showRightDialog(scope.row)"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 分配权限对话框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="setRightDialogVisible"
      width="50%"
      @close="setRightDialogClose"
    > 
      <!-- 树形控件 -->
      <el-tree ref="treeRef" :data="rightTree" :props="treeProps"  show-checkbox node-key="id" 
      default-expand-all :default-checked-keys="defKeys"></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRight">确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Roles",
  data() {
    return {
      //所有角色列表数据
      rolesList: [],
      //控制分配数据的显示与隐藏
      setRightDialogVisible:false,
      //保存权限树的数据
      rightTree:[],
      treeProps:{
        label:'authName',
        children:'children'
      },
      //默认勾选的节点
      defKeys:[],
      //当前即将分配权限的id
      roleId:''
    };
  },
  created() {
    this.getRolesList();
  },
  methods: {
    //获取所有角色列表
    async getRolesList() {
      const { data: res } = await this.$http.get("roles");
      if (res.meta.status !== 200) {
        return this.$message.error("获取角色列表数据失败");
      }
      //将所有的数据保存到rolesList中
      this.rolesList = res.data;
      // console.log(this.rolesList);
    },
    //通过id删除权限
    async removeRightById(role, rightId) {
      //弹窗提示用户是否要删除
      const confirmResult = await this.$confirm(
        "此操作将永久删除该用户, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((error) => error);

      if (confirmResult !== "confirm") {
        return this.$message.info("取消了弹窗消息");
      }

      // console.log('删除成功');
      //获取要删除的id
      const { data: res } = await this.$http.delete(
        `roles/${role.id}/rights/${rightId}`
      );
      if (res.meta.status !== 200) {
        return this.$message.error("删除权限失败");
      }

      //为了不让列表合上，可以将最新的值重新赋予给children
      role.children = res.data;
    },
    //展示分配权限的对话框并发送数据请求
     async showRightDialog(role){
       this.roleId = role.id;
      //请求分配权限的数据
      const {data:res}= await this.$http.get('rights/tree');
      if(res.meta.status !==200){
        return this.$message.error('请求权限数据失败')
      }
      //将请求到的数据复制给data
      this.rightTree = res.data;
      console.log(this.rightTree);

      //地柜获取三级节点的id
      this.getLeafKeys(role,this.defKeys);
      this.setRightDialogVisible = true;
    },
    //通过递归的形式， 获取角色项所有的三级权限的id，并将其保存到defKeys中
    getLeafKeys(node,arr){
      //如果当前节点不包含children则表示不是三级节点，此时向arr中添加一个id
      if(!node.children){
        return arr.push(node.id)
      }

      //通过递归循环老获取节点
      node.children.forEach(item => 
        this.getLeafKeys(item,arr)
      );
    },
    //监听分配权限对话框关闭事件
    setRightDialogClose(){
      this.defKeys = [];
    },
    async allotRight(){
      const RightKey = [
        ...this.$refs.treeRef.getHalfCheckedKeys(),
        ...this.$refs.treeRef.getCheckedKeys(),
      ]
      // console.log(RightKey);
      const idStr = RightKey.join(',')
      const {data:res} =  await this.$http.post(`roles/${this.roleId}/rights`,{rids:idStr});
      if(res.meta.status !==200){
        return this.$message.error('分配权限数据失败')
      }

      this.$message.success('成功分配权限数据');
      this.getRolesList();
      this.setRightDialogVisible = false;
    }
  },
};
</script>

<style scope>
.el-row {
  margin: 7px;
  padding: 5px 0;
}
.tbtop {
  border-top: 1px solid rgb(231, 227, 227);
}
.btborder {
  border-bottom: 1px solid rgb(231, 227, 227);
}
.el-tag {
  margin: 5px;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>