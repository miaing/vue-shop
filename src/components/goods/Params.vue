<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片导航区域 -->
    <el-card>
      <el-alert
        title="注意只允许为三级分类设置相关的参数"
        type="warning"
        show-icon
      >
      </el-alert>

      <!-- 选择商品分类的级联选择框 -->
      <div class="cas-constianer">
        选择商品分类
        <el-cascader
          v-model="cateKeys"
          expandTrigger="hover"
          :options="cateList"
          :props="cateListParams"
          @change="handleChange"
        ></el-cascader>
      </div>

      <!-- 标签页 -->
      <el-tabs v-model="activeName" @tab-click="handleTabsClick">
        <el-tab-pane label="用户管理" name="many">
          <!-- 添加参数按钮 -->
          <el-button
            type="primary"
            size="mini"
            :disabled="isBtnDisabled"
            @click="adddialogVisible = true"
            >添加参数</el-button
          >
          <!-- 添加属性的表格区域 -->
          <el-table :data="manyTableDate" border stripe>
            <!-- 展开行 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag
                  type=""
                  v-for="(item, index) in scope.row.attr_vals"
                  :key="index"
                  closable
                  @close="handleClose(index,scope.row)"
                  >{{ item }}</el-tag
                >
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <el-table-column label="#" type="index"></el-table-column>
            <el-table-column
              label="参数名称"
              prop="attr_name"
            ></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  icon="el-icon-edit"
                  @click="showEditDialog(scope.row.attr_id)"
                  >编辑</el-button
                >
                <el-button
                  size="mini"
                  type="danger"
                  icon="el-icon-delete"
                  @click="removeParams(scope.row.attr_id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="配置管理" name="only">
          <!-- 添加属性按钮 -->
          <el-button
            type="primary"
            size="mini"
            :disabled="isBtnDisabled"
            @click="adddialogVisible = true"
            >添加属性</el-button
          >
          <!-- 添加属性的表格区域 -->
          <el-table :data="onlyTableDate" border stripe>
            <!-- 展开行 -->
             <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag
                  type=""
                  v-for="(item, index) in scope.row.attr_vals"
                  :key="index"
                  closable
                  @close="handleClose(index,scope.row)"
                  >{{ item }}</el-tag
                >
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <el-table-column label="#" type="index"></el-table-column>
            <el-table-column
              label="参数名称"
              prop="attr_name"
            ></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  icon="el-icon-edit"
                  @click="showEditDialog(scope.row.attr_id)"
                  >编辑</el-button
                >
                <el-button
                  size="mini"
                  type="danger"
                  icon="el-icon-delete"
                  @click="removeParams(scope.row.attr_id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 添加按钮的对话框 -->
    <el-dialog
      :title="'添加' + addTitle"
      :visible.sync="adddialogVisible"
      width="50%"
      @close="addDislogClosed"
    >
      <!-- 添加表单信息 -->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
      >
        <el-form-item :label="addTitle" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="adddialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 添加修改按钮的对话框 -->
    <el-dialog
      :title="'添加' + addTitle"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDislogClosed"
    >
      <!-- 添加表单信息 -->
      <el-form
        :model="editForm"
        :rules="editFormRules"
        ref="editFormRef"
        label-width="100px"
        @close="editDiolodClosed"
      >
        <el-form-item :label="addTitle" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParams">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      //商品分类列表
      cateList: [],
      cateKeys: [],
      cateListParams: {
        value: "cat_id",
        label: "cat_name",
        children: "children",
      },
      activeName: "many",
      //这是添加属性的数据
      manyTableDate: [],
      //这是静态属性的数据
      onlyTableDate: [],
      //定义添加对话框的显示预隐藏
      adddialogVisible: false,
      //添加表单的数据对象
      addForm: {
        attr_name: "",
      },
      //添加表单的较验规则
      addFormRules: {
        attr_name: [
          { required: true, message: "请输入您的名称", trigger: "blur" },
        ],
      },
      //添加修改按钮对话框的显示预隐藏
      editDialogVisible: false,
      //添加修改按钮的表单数据对象
      editForm: {
        attr_name: "",
      },
      //添加修改表单的验证对象
      editFormRules: {
        attr_name: [
          { required: true, message: "请输入您的名称", trigger: "blur" },
        ],
      },
      /*
      //表单的显示预隐藏
      inputVisible:false,
      //文本框输入的内容
      inputValue:'',
      *
      *此时的不需要这两个公用的inputVisible和inputValue

      */
    };
  },
  created() {
    this.getCateList();
  },
  methods: {
    async getCateList() {
      const { data: res } = await this.$http.get("categories");

      if (res.meta.status !== 200) {
        return this.$message.error("请求数据失败");
      }

      this.cateList = res.data;
      // console.log(this.cateList);
    },
    handleChange() {
      this.getParamsDate();
    },
    handleTabsClick() {
      console.log(this.activeName);
      this.getParamsDate();
    },
    async getParamsDate() {
      //证明选择的不是三级分类
      if (this.cateKeys.length !== 3) {
        this.cateKeys = [];
        this.manyTableDate = [];
        this.onlyTableDate = []
        return;
      }
      //证明选择的是三级分类
      // console.log(this.cateKeys);
      //获取当前三级选项的数据
      const { data: res } = await this.$http.get(
        `categories/${this.cateId}/attributes`,
        { params: { sel: this.activeName } }
      );

      if (res.meta.status !== 200) {
        return this.$message.error("获取当前三级数据失败");
      }

      //此时得到的数据中的attr_vals十一个字符串，这时我们需要将它解构成数组
      res.data.forEach((item) => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(",") : [];

        //此时所循环的数组公用的是同一个布尔值和输入值，我们需要维它们单独设置一个布尔值和输入的值
        //输入框的显示预隐藏
        item.inputVisible = false;
        //文本框只能够输入的内容
        item.inputValue = '';
      });
      console.log(res.data);

      //将获得的数据做一个判断，判断哪一个是many的数据，哪一个是only的数据
      if (this.activeName === "many") {
        this.manyTableDate = res.data;
      } else {
        this.onlyTableDate = res.data;
      }
    },
    //关闭对话框之后重置表单
    addDislogClosed() {
      this.$refs.addFormRef.resetFields();
    },
    //添加表单的预验证
    addParams() {
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) return;

        //如果没有return表示与验证成功
        const { data: res } = await this.$http.post(
          `categories/${this.cateId}/attributes`,
          {
            attr_sel: this.activeName,
            attr_name: this.addForm.attr_name,
          }
        );

        if (res.meta.status !== 201) {
          return this.$message.error("请求的数据列表失败");
        }

        this.$message.success("请求的数据列表成功");
        this.getParamsDate();
        this.adddialogVisible = false;
      });
    },
    //点击按钮显示对话框
    async showEditDialog(attr_id) {
      //查询当前参数的信息
      const { data: res } = await this.$http.get(
        `categories/${this.cateId}/attributes/${attr_id}`,
        {
          params: { attr_sel: this.activeName },
        }
      );

      if (res.meta.status !== 200) {
        return this.$message.error("请求数据失败");
      }

      this.editForm = res.data;
      this.editDialogVisible = true;
    },
    //监听修改按钮对话框的关闭事件
    editDislogClosed() {
      this.$refs.editFormRef.resetFields();
    },
    //点击按钮以后，对编辑按钮的对话看进行表单的预验证
    editParams() {
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) return;

        //如果没有return表示与验证成功
        const { data: res } = await this.$http.put(
          `categories/${this.cateId}/attributes/${this.editForm.attr_id}`,
          {
            attr_sel: this.activeName,
            attr_name: this.editForm.attr_name,
          }
        );

        if (res.meta.status !== 200) {
          return this.$message.error("请求的数据列表失败");
        }

        this.$message.success("请求的数据列表成功");
        this.getParamsDate();
        this.editDialogVisible = false;
      });
    },
    //关闭修改按钮以后，对对话框进行预验证
    editDiolodClosed() {
      this.$http.post(`categories/${this.cateId}/attributes/`);
    },
    //点击按钮以后，删除对应的参数
    async removeParams(attr_id) {
      const confirmResult = await this.$confirm(
        "此操作将永久删除该文件, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((error) => error);

      //用户取消了这次删除
      if (confirmResult !== "confirm") {
        this.$message.info("已取消了删除");
      }
      //删除业务的逻辑
      const { data: res } = await this.$http.delete(
        `categories/${this.cateId}/attributes/${attr_id}`
      );
      if (res.meta.status !== 200) {
        return this.$message.error("删除参数失败");
      }
      this.$message.success("删除信息成功");
      this.getParamsDate();
    },
    //文本框数去焦点或者摁下了enter都会触发这个事件
    async handleInputConfirm(row){
      if(row.inputValue.trim().length ===0){
        row.inputValue = ''
        row.inputVisible = false
        return
      }
      
      //如果没有返回，则表示输入的内容，这是需要进一步做数据的处理
      row.attr_vals.push(row.inputValue.trim())
      row.inputValue = ''
      row.inputVisible = false

      //此时输入的值不会永久的保存到数据库当中，页面一刷新就会没有
      this.saveDate(row);
    },
    //保存数据
    async saveDate(row){
       //此时我们需要发起请求，保存这次操作
       const{data:res}= await this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`,{
        attr_name:row.attr_name,
        attr_sel:row.attr_sel,
        attr_vals:row.attr_vals.join(',')
      })

      if(res.meta.status !==200){
        return this.$message.error('修改参数项失败')
      }

      this.$message.success('修改数据成功');
    },
    //点击按钮，展示文本框的
    showInput(row){
      row.inputVisible = true;
      //$nextTick方法的带你用，就是当页面中的元素被重新渲染以后，才会指定回调函数中的代码
      this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();// 表示自动获取焦点
        });
    },
    //点击按钮以后，删除对应的tag
    handleClose(index,row){
      row.attr_vals.splice(index,1);
      this.saveDate(row);
    }
  },
  computed: {
    isBtnDisabled() {
      if (this.cateKeys.length !== 3) {
        return true;
      }
      return false;
    },
    //当前选中的三级分类的id
    cateId() {
      //当长度为3是，表示选中了三级分类，这是需要获取最后一项的数据
      if (this.cateKeys.length === 3) {
        return this.cateKeys[2];
      }
      return null;
    },
    addTitle() {
      if (this.activeName === "many") {
        return "动态属性";
      } else {
        return "静态属性";
      }
    },
  },
};
</script>

<style lang="less" scoped>
.el-cascader-menu {
  height: 300px;
}

.cas-constianer {
  margin-top: 15px;
}
.el-tag {
  margin: 10px;
}
.input-new-tag{
  width: 130px;
}
</style>