<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
       <el-dialog title="物流信息" :visible.sync="wuliuDialogVisible" width="50%">
        <!-- 步骤条 -->
        <el-steps direction="vertical" :active="1">
          <el-step
            :title="item.ftime"
            :description="item.context"
            v-for="(item,i) in wuliuList"
            :key="i"
          ></el-step>
        </el-steps>
      </el-dialog>
    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入搜索内容"
            v-model="queryOrd.query"
            class="input-with-select"
            @clear="getOrderList()"
            clearable
            @keyup.enter.native="getOrderList()"
          >
            <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <el-table :data="orderList" border stripe style="width: 100%">
        <el-table-column type="index" label="序号" width="80"></el-table-column>
        <el-table-column prop="order_number" label="订单编号" width="360"></el-table-column>
        <el-table-column prop="order_price" label="订单价格" width="80"></el-table-column>
        <el-table-column label="是否付款" width="130">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.order_pay=='是'">已付款</el-tag>
            <el-tag type="danger">未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="is_send" label="是否发货" width="80"></el-table-column>
        <el-table-column prop="update_time" label="下单时间" width="150">
          <template slot-scope="scope">
            <span>{{scope.row.update_time|dateFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="trade_no" label="操作" width="200">
          <template slot-scope="info">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
            ></el-button>
            <el-button
              type="success"
              icon="el-icon-location"
               title="查看物流信息"
              size="mini"
              @click="showWuliuDialog"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-sizes="[5,10, 15, 20]"
        :page-size="queryOrd.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  created() {
    this.getOrderList()
  },
  methods: {
    handleSizeChange(val) {
      this.queryOrd.pagesize = val
      this.getOrderList()
    },
    search() {
      this.queryOrd.pagenum = 1
      this.getOrderList()
    },
    async  showWuliuDialog(order) {
      const { data: dt } = await this.$http.get('kuaidi/81337523816')
      if (dt.meta.status !== 200) {
        return this.$message.error(dt.meta.msg)
      }
       this.wuliuList = dt.data
      console.log(this.wuliuList)
      this.wuliuDialogVisible = true
    },

    // 分页每页条数变化回调
    handleCurrentChange(val) {
      this.queryOrd.pagenum = val
      this.getOrderList()
    },
    async getOrderList() {
      const { data: dt } = await this.$http.get('orders', {
        params: this.queryOrd
      })
      if (dt.meta.status != 200) {
        return this.$message.error(dt.meta.msg)
      }
      this.total = dt.data.total
      this.orderList = dt.data.goods
    }
  },
  data() {
    return {
      orderList: [],
      queryOrd: {
        query: '', // 搜索关键字
        pagenum: 1, // 当前页码
        pagesize: 5 // 每页显示数据条数
      },
      total: 0,
      wuliuDialogVisible: false, // 默认不显示物流弹框
      wuliuList: [] 
    }
  }
}
</script>

<style lang="less" scoped>
</style>
