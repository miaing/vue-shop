<template>
  <div>
    <!-- 面包屑区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片区域 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddCateDialog"
            >添加分类</el-button
          >
        </el-col>
      </el-row>

      <!-- 数据表格 -->
      <tree-table
        :data="cateList"
        :columns="columns"
        index-text="#"
        :show-row-hover="false"
        show-index
        :selection-type="false"
        :expand-type="false"
        border
      >
        <!-- 是否有效区域 -->
        <template slot="isok" slot-scope="scope">
          <i
            class="el-icon-success"
            v-if="scope.row.cat_deleted === false"
            style="color: lightgreen"
          ></i>
          <i class="el-icon-error" v-else style="color: red"></i>
        </template>
        <!-- 排序区域 -->
        <template slot="order" slot-scope="scope">
          <el-tag type="primary" size="mini" v-if="scope.row.cat_level === 0"
            >一级</el-tag
          >
          <el-tag type="success" v-else-if="scope.row.cat_level === 1"
            >二级</el-tag
          >
          <el-tag type="warning" v-else>三级</el-tag>
        </template>
        <!-- 操作区域 -->
        <template slot="opt">
          <el-button size="mini" type="primary" icon="el-icon-edit"
            >编辑</el-button
          >
          <el-button size="mini" type="danger" icon="el-icon-delete"
            >删除</el-button
          >
        </template>
      </tree-table>

      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="querInfo.pagenum"
        :page-sizes="[3, 5, 10, 15]"
        :page-size="querInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>

    <!--显示添加分类的对话框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="AddCateDialogVisible"
      width="50%"
      @close="addCateDialogClosed"
    >
      <!-- 添加对象的表单验证 -->
      <el-form
        :model="addCateForm"
        :rules="addCateFormRules"
        ref="addCateFormRef"
        label-width="100px"
      >
        <el-form-item label="分类名称：" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类：">
            <!-- 级联选择器区域，option是要绑定的数据源 -->
          <el-cascader
            v-model="selectedKeys"
            expandTrigger= "hover"
            :options="parentCateList"
            :props="cascaderProps"
            @change="handleChange"
            change-on-select 
            style="width:100%"
            clearable
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="AddCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate"
        >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Cate",
  data() {
    return {
      //查询条件
      querInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5,
      },
      //保存数据列表的数据
      cateList: [],
      //列表的总条数
      total: 0,
      columns: [
        {
          label: "分类名称",
          prop: "cat_name",
        },
        {
          label: "是否有效",
          type: "template",
          template: "isok",
        },
        {
          label: "排序",
          type: "template",
          template: "order",
        },
        {
          label: "操作",
          type: "template",
          template: "opt",
        },
      ],
      //添加分类的显示与隐藏
      AddCateDialogVisible: false,
      //添加分类的表单数据对象
      addCateForm: {
        //将要添加的分类的名称
        cat_name: "",
        //添加的父级的分类名称
        cat_pid: 0,
        //添加分类层级，默认要添加的是1级分类
        cat_level: 0,
      },
      //添加分类表单的验证规则对象
      addCateFormRules: {
        cat_name: [
          { required: true, message: "请输入您的分类名称", trigger: "blur" },
        ],
      },
      //父级列表的数据
      parentCateList: [],
      //点击选项要选择的数据,此时必须是一个数组
      selectedKeys:[],
      //指定级联选择器的配置对象
      cascaderProps: {
        value: 'cat_id',
        label: 'cat_name',
        children:'children',
        // checkStrictly:true
      }
    };
  },
  created() {
    this.getCateList();
  },
  methods: {
    //从api中获取列表的数据
    async getCateList() {
      const { data: res } = await this.$http.get("categories", {
        params: this.querInfo,
      });

      if (res.meta.status !== 200) {
        return this.$message.error("获取商品分类的数据列表失败");
      }

      // console.log(res);
      //将数据赋值给到cateList
      this.cateList = res.data.result;
      //在
      this.total = res.data.total;
    },
    //监听pagesize大小的改变
    handleSizeChange(newSize) {
      this.querInfo.pagesize = newSize;
      this.getCateList();
    },
    //监听pagenum的改变
    handleCurrentChange(newPage) {
      this.querInfo.pagenum = newPage;
      this.getCateList();
    },
    //点击按钮以后显示对话框
    showAddCateDialog() {
      this.getParentCateList();
      this.AddCateDialogVisible = true;
    },
    //获取父类列表的数据
    async getParentCateList() {
      //请求数据
      const { data: res } = await this.$http.get("categories", {
        params: { type: 2 }
      });
      if (res.meta.status !== 200) {
        return this.$message.error("请求的父级数据失败");
      }

      console.log(res.data);
      this.parentCateList = res.data;
    },
    //选择项发生变化出发的这个函数
    handleChange(){
      console.log(this.selectedKeys);
      if(this.selectedKeys.lenght > 0){//表示选中了父级分类
        //父级分类的id
        this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.lenght -1]

        //为当前等级分类赋值
      this.addCateForm.cat_level = this.selectedKeys.lenght;
      return
      }else{
        this.addCateForm.cat_pid = 0;
        this.addCateForm.cat_level= 0;
      }  
    },
    //点击按钮，添加新的分类
    addCate(){
      //首先要对对话框里的表单进行预验证
      this.$refs.addCateFormRef.validate(async valid =>{
        if(!valid) return

        const{data:res}=await this.$http.post('categories',this.addCateForm);

        if(res.meta.status !==201){
          return this.$message.error('添加分类失败');
        }
        this.$message.success('添加分类的数据成功');
        this.getCateList();
        this.AddCateDialogVisible = false;
      })
    },
    //关闭对话框之后的重置操作
    addCateDialogClosed(){
      this.$refs.addCateFormRef.resetFields();
      this.selectedKeys = [];
      this.addCateForm.cat_pid = 0;
      this.addCateForm.cat_level= 0;
    }
  },
};
</script>

<style>
.el-cascader-menu{
  height: 300px;
}
</style>