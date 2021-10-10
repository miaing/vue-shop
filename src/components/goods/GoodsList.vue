<template>
  <div>
    <!-- 面包屑区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片区域 -->
    <el-card>
      <!-- 头部输入框的渲染 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getGoodsList">
            <el-button slot="append" icon="el-icon-search" @click="getGoodsList" ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="goAddPage">添加按钮</el-button>
        </el-col>
      </el-row>

      <!-- 表单区域 -->
      <el-table :data="goodsList" border stripe>
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column
          label="商品名称"
          prop="goods_name"
          width=""
        ></el-table-column>
        <el-table-column
          label="商品价格"
          prop="goods_price"
          width="95px"
        ></el-table-column>
        <el-table-column
          label="商品重量"
          prop="goods_weight"
          width="70px"
        ></el-table-column>
        <el-table-column label="创建时间" prop="add_time" width="140px">
          <template slot-scope="scope">
            {{ scope.row.add_time | dataFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="130px">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeById(scope.row.goods_id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 商品列表的分页功能 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total" background 
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "GoodsList",
  data() {
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10,
      },
      //保存数据列表
      goodsList: [],
      //保存数据的总条数
      total: 0,
    };
  },
  created() {
    this.getGoodsList();
  },
  methods: {
    //根据分页获取当前数据列表
    async getGoodsList() {
      const { data: res } = await this.$http.get("goods", {
        params: this.queryInfo,
      });
      if (res.meta.status !== 200) {
        return this.$message.console.error("请求数据类标失败");
      }
      // console.log(res.data);
      this.goodsList = res.data.goods;
      this.total = res.data.total;
    },
    handleSizeChange(newSize){
      this.queryInfo.pagesize = newSize;
      this.getGoodsList();
    },
    handleCurrentChange(newNum){
      this.queryInfo.pagenum = newNum;
      this.getGoodsList();
    },
    //点击按钮以后，删除相应的id数据
    async removeById(id){
      const newConfirm =await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(error => error)

        if(newConfirm !=='confirm'){ //confirm外的双引号移动不要忘记！！！
          return this.$message.info('已取消删除')
        }

        //否则就是要删除这个id
        const{data:res}=await this.$http.delete(`goods/${id}`);

        if(res.meta.status !==200){
          return this.$message.error('删除数据失败');
        }

        this.$message.success('删除数据成功');
        this.getGoodsList();
    },
    //点击添加组件之后挑战到相应的组件页面
    goAddPage(){
      this.$router.push('/goods/add')
    }
  },
};
</script>

<style scoped>
</style>