<template>
  <div>
    <!-- 面包屑区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/goods' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片区域 -->
    <el-card>
      <!--警告区域 -->
      <el-alert
        title="添加商品信息"
        type="info"
        show-icon
        center
        :closable="false"
      >
      </el-alert>
      <!-- 步骤区域 -->
      <el-steps
        :space="200"
        :active="activeIndex - 0"
        finish-status="success"
        align-center
      >
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>

      <!-- tab栏 -->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
        label-position="top"
      >
        <el-tabs
          :tab-position="'left'"
          v-model="activeIndex"
          :before-leave="rejectChange"
          @tab-click="tabClick"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                v-model="addForm.goods_cat"
                expandTrigger="hover"
                :options="cateList"
                :props="cateProps"
                @change="handleChange"
                clearable
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item
              :label="item.attr_name"
              v-for="item in manyTabList"
              :key="item.attr_id"
            >
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox
                  border
                  :label="ad"
                  v-for="(ad, i) in item.attr_vals"
                  :key="i"
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item
              :label="item.attr_name"
              v-for="item in onlyTabList"
              :key="item.attr_id"
            >
              <el-input v-model="item.attr_vals" placeholder=""></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <el-upload
              :action="upLoadURL"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
              :headers="headersObj"
              :on-success="handleSuccess"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">
                只能上传jpg/png文件，且不超过500kb
              </div>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <!-- 富编辑组件 -->
            <quill-editor v-model="addForm.goods_introduce"></quill-editor>
            <!-- 添加按钮 -->
            <el-button type="primary" class="addButton" @click="add">添加按钮</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>

    <!--预览图片的区域 -->
    <el-dialog
      title="预览图片"
      :visible.sync="previewDialogVisible"
      width="50%"
    >
      <img :src="previewURL" alt="" class="previewWidth">
    </el-dialog>
  </div>
</template>

<script>
import _ from 'lodash'
export default {
  name: "Add",
  data() {
    return {
      activeIndex: "0",
      addForm: {
        goods_name: "",
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        goods_cat: [],
        //图片的数组
        pics: [],
        //
        goods_introduce:'',
        attrs:[]
      },
      addFormRules: {
        goods_name: [
          {
            required: true,
            message: "请输入正确的商品名称",
            trigger: "blur",
          },
        ],
        goods_price: [
          {
            required: true,
            message: "请输入正确的商品价格",
            trigger: "blur",
          },
        ],
        goods_weight: [
          {
            required: true,
            message: "请输入正确的商品重量",
            trigger: "blur",
          },
        ],
        goods_number: [
          {
            required: true,
            message: "请输入正确的商品数量",
            trigger: "blur",
          },
        ],
        goods_cat: [
          {
            required: true,
            message: "请输入正确的商品数量",
            trigger: "blur",
          },
        ],
      },
      cateList: [],
      cateProps: {
        value: "cat_id",
        label: "cat_name",
        children: "children",
      },
      //动态属性列表
      manyTabList: [],
      //静态属性列表
      onlyTabList: [],
      //设置上传图片的请求头部
      headersObj: {
        //每次上传图片都需要手动的为图片设置请求头header
        Authorization: window.sessionStorage.getItem("token"),
      },
      upLoadURL: "http://127.0.0.1:8888/api/private/v1/upload",
      //预览图片的地址
      previewURL: "",
      previewDialogVisible:false,
      
    };
  },
  created() {
    this.getCateList();
  },
  methods: {
    async getCateList() {
      //获取商品分类的数据
      const { data: res } = await this.$http.get("categories");
      if (res.meta.status !== 200) {
        return this.$message.error("请求列表数据失败");
      }

      this.cateList = res.data;
      // console.log(this.cateList);
    },
    handleChange() {
      console.log(this.addForm.goods_cat);
      if (this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat = [];
      }
    },
    rejectChange(activeName, oldAcyiveName) {
      // console.log('即将进入的标签页面'+activeName);
      // console.log('即将离开的标签页面'+oldAcyiveName);

      if (oldAcyiveName === "0" && this.addForm.goods_cat.length !== 3) {
        this.$message.error("请选择一个三品分类选项");
        return false;
      }
    },
    //点击面板获取相应的数据
    async tabClick() {
      //表示访问的是动态数据面板
      if (this.activeIndex === "1") {
        //此时可以发起请求面板数据的请求
        const { data: res } = await this.$http.get(
          `categories/${this.cateId}/attributes`,
          {
            params: { sel: "many" },
          }
        );

        if (res.meta.status !== 200) {
          return this.$message.error("发起数据请求失败");
        }

        this.manyTabList = res.data;
        //此时得到的attr_vals是一个字符串，我们需要对他进行分解，将他分解成数组,做forEach循环
        this.manyTabList.forEach((item) => {
          item.attr_vals = item.attr_vals.split(",");
        });
        // console.log(this.manyTabList);
      }

      if (this.activeIndex === "2") {
        const { data: res } = await this.$http.get(
          `categories/${this.cateId}/attributes`,
          {
            params: { sel: "only" },
          }
        );

        if (res.meta.status != 200) {
          return this.$message, error("请求参数列表失败");
        }

        this.onlyTabList = res.data;
        console.log(this.onlyTabList);
      }
    },
    //点击图片时触发的事件
    handlePreview(file) {
      console.log(file);
      this.previewURL = file.response.data.url;
      this.previewDialogVisible = true
    },
    //点击删除按钮时触发的事件
    handleRemove(file) {
      console.log(file);
      //1.找到要删除的临时路径
      const fileRemove = file.response.data.tmp_path;

      //2.从pics数组中找到这个图片对应的索引值
      const i = this.addForm.pics.findIndex((x) => {
        x.pic === fileRemove;
      });

      //3.调用数组的Splice方法，吧图片的对象删除掉
      this.addForm.pics.splice(i, 1);
      console.log(this.addForm);
    },
    //图片上传成功之后的事件
    handleSuccess(response) {
      console.log(response);
      //拼接得到一个图片信息对象
      const picInfo = { pic: response.data.tmp_path };
      //将图片push到pics数组中
      this.addForm.pics.push(picInfo);
      // console.log(this.addForm);
    },
   add(){
      //提交按钮以后进行表单的预验证
      this.$refs.addFormRef.validate(async valid =>{
        if(!valid){
          return this.$message.error('请填写必要的表单项');
        }
        //执行业务的添加逻辑
        const form = _.cloneDeep(this.addForm)

        form.goods_cat = form.goods_cat.join(',')
        //处理动态属性的数据
        this.manyTabList.forEach( item =>{
          const newInfo ={
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(',')
          }
          this.addForm.attrs.push(newInfo)
        })
        //处理静态属性的数据
        this.onlyTabList.forEach(item =>{
          const newInfo = {
             attr_id:item.attr_id,
            attr_value:item.attr_vals
          }
          this.addForm.attrs.push(newInfo)
        })
        form.attrs = this.addForm.attrs;
        console.log(form);
        //发起请求按钮的请求
        const {data:res} =await this.$http.post('goods',form);

        if(res.meta.status !==201){
          return this.$message.error('发起数据请求失败')
        }
        this.$message.success('添加数据成功')
        this.$router.push('/goods')
      })
    }
  },
  computed: {
    cateId() {
      if (this.addForm.goods_cat.length === 3) {
        return this.addForm.goods_cat[2];
      }
      return null;
    },
  },
};
</script>

<style scoped>
.el-steps {
  margin: 15px 0;
}
.el-step__title {
  font-size: 13px;
}
.previewWidth{
  width: 100%;
}
.addButton{
  margin-top: 20px;
}
</style>