<template>
  <div>
    <!-- 面包屑区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片区域 -->
    <el-card>
      <!-- 搜索输入框 -->
      <el-row>
        <el-col :span="8">
          <el-input placeholder="请输入内容">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>

      <!-- 渲染订单的数据列表 -->
      <el-table :data="orderList" border stripe>
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="订单编号" prop="order_number"></el-table-column>
        <el-table-column label="订单价格" prop="order_price"></el-table-column>
        <el-table-column label="是否付款" prop="pay_status">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.pay_status === '1'"
              >已付款</el-tag
            >
            <el-tag type="danger" v-else>未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否发货" prop="is_send"></el-table-column>
        <el-table-column label="下单时间" prop="create_time">
          <template slot-scope="scope">
            {{ scope.row.create_time | dataFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="editAddress"
            ></el-button>
            <el-button
              type="success"
              icon="el-icon-location"
              size="mini"
              @click="showProgress"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 订单页面的分页功能 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[10, 15, 20, 30]"
        :page-size="10"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>

      <!-- 修改对话框的显示 -->
      <el-dialog
        title="修改地址"
        :visible.sync="editAddressdialogVisible"
        width="50%"
        @close="addressDialog"
      >
        <!-- 表单区域 -->
        <el-form
          :model="editAddressruleForm"
          :rules="editAddressRules"
          ref="editAddressRef"
          label-width="100px"
        >
          <el-form-item label="省市区/县" prop="address1">
            <el-cascader
              :options="cateDate"
              v-model="editAddressruleForm.address1"
            ></el-cascader>
          </el-form-item>
          <el-form-item label="详细地址" prop="address2">
            <el-input v-model="editAddressruleForm.address2"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editAddressdialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editAddressdialogVisible = false"
            >确 定</el-button
          >
        </span>
      </el-dialog>
    </el-card>

    <!--展示物流进度的对话框 -->
      <el-dialog
        title="展示物流"
        :visible.sync="progressDialogVisible"
        width="50%"
      >
        <span>这是一段信息</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="progressDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="progressDialogVisible = false"
            >确 定</el-button
          >
        </span>
      </el-dialog>
  </div>
</template>

<script>
import cateDate from "./citydata";
export default {
  data() {
    return {
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 10,
      },
      orderList: [],
      total: 0,
      //对话框的显示与隐藏
      editAddressdialogVisible: false,
      editAddressruleForm: {
        address1: [],
        address2: "",
      },
      editAddressRules: {
        address1: [
          { required: true, message: "请输入正确的省市县", trigger: "blur" },
        ],
        address2: [
          { required: true, message: "请填写详细地址", trigger: "blur" },
        ],
      },
      cateDate,
      progressDialogVisible:false,
      progressList:[]
    };
  },
  created() {
    this.getOrderList();
  },
  methods: {
    async getOrderList() {
      //获取订单列表的数据
      const { data: res } = await this.$http.get("orders", {
        params: this.queryInfo,
      });

      if (res.meta.status !== 200) {
        return this.$message.error("获取订单数据失败");
      }

      this.orderList = res.data.goods;
      this.total = res.data.total;
      console.log(this.orderList);
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getOrderList();
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getOrderList();
    },
    //点击按钮以后，弹出对话框
    editAddress() {
      this.editAddressdialogVisible = true;
    },
    addressDialog() {
      this.$refs.editAddressRef.resetFields();
    },
    async showProgress(){
      // //获取订单物流信息
    //   const {data:res} = await this.$http.get('/kuaidi/1106975712662');
    //   if(res.meta.status !==200){
    //    return this.$message.error('请求物流先洗数据失败')
    //   }
    //   this.progressList = res.data;
      this.progressDialogVisible =true;
    //   console.log(this.progressList);
    // }
   },
  }
}
</script>

<style scoped>
.el-cascader {
  width: 100%;
}
</style>