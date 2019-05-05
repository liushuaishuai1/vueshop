<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <el-dialog title="添加分类" :visible.sync="addCatDialog" width="50%" @close="resetForm()">
      <el-form :rules="addCatRules" ref="addCatRef" :model="addCat" label-width="120px">
        <el-form-item label="分类名称：" prop="cat_name">
          <el-input v-model="addCat.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="分类上级：">
          <el-cascader
            expand-trigger="hover"
            :options="catTwoList"
            :props="catTwoProps"
            v-model="catTwoSelected"
            @change="catTwoChange()"
            change-on-select
            clearable
            style="width:100%"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCatDialog=false">取消</el-button>
        <el-button type="primary" @click="tianjia()">确定</el-button>
      </span>
    </el-dialog>
    <el-card class="box-card">
      <el-button type="primary" @click="showAddCatDialog()">添加分类</el-button>
      <el-table :data="catList" border stripe style="width: 100%" row-key="cat_id">
        <el-table-column prop="cat_name" label="分类名称"></el-table-column>
        <el-table-column prop="cat_level" label="等级" width="240">
          <template slot-scope="info">
            <el-tag v-if="info.row.cat_level==0">一级</el-tag>
            <el-tag v-else-if="info.row.cat_level==1" type="success">二级</el-tag>
            <el-tag v-else type="warning">三级</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="340">
          <template slot-scope="info">
            <el-button type="primary" icon="el-icon-edit" size="mini">修改</el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage4"
        :page-sizes="[3, 5, 10, 20]"
        :page-size="querycdt.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="tot"
      ></el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  created() {
    this.getCatList()
  },
  methods: {
    resetForm() {
      this.$refs.addCatRef.resetFields()
      this.catTwoSelected = []
      this.addCat.cat_pid = 0
      this.addCat.cat_level = 0
    },
    tianjia() {
      this.$refs.addCatRef.validate(async valid => {
        if (valid === true) {
          const { data: dt } = await this.$http.post('categories', this.addCat)
          if (dt.meta.status !== 201) {
            return this.$message.error(dt.meta.msg)
          }
          this.$message.success(dt.meta.msg)
          this.addCatDialog = false
          this.getCatList()
        }
      })
    },
    catTwoChange() {
      var len = this.catTwoSelected.length
      if (len === 0) {
        this.addCat.cat_pid = 0
        this.addCat.cat_level = 0
      } else {
        this.addCat.cat_pid = this.catTwoSelected[len - 1]
        this.addCat.cat_level = len
      }
    },
    async showAddCatDialog() {
      const { data: dt } = await this.$http.get('categories', {
        params: { type: 2 }
      })
      if (dt.meta.status !== 200) {
        return this.$message.error(dt.meta.msg)
      }
      this.catTwoList = dt.data
      this.addCatDialog = true
    },
    handleSizeChange(val) {
      this.querycdt.pagesize = val
      this.getCatList()
    },
    handleCurrentChange(val) {
      this.querycdt.pagenum = val
      this.getCatList()
    },
    async getCatList() {
      const { data: dt } = await this.$http.get('categories', {
        params: this.querycdt
      })
      // console.log(dt)
      if (dt.meta.status != 200) {
        return this.$message.error(dt.meta.msg)
      }
      this.tot = dt.data.total
      this.catList = dt.data.result
    }
  },
  data() {
    return {
      catTwoSelected: [],
      catTwoProps: {
        label: 'cat_name',
        value: 'cat_id',
        children: 'children'
      },
      catTwoList: [],
      addCatDialog: false,
      addCatRules: {
        cat_name: [{ required: true, message: '分类名称必填', trigger: 'blur' }]
      },
      addCat: {
        cat_name: '',
        cat_pid: 0,
        cat_level: 0
      },
      catList: [],
      querycdt: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      }
    }
  }
}
</script>

<style lang="less" scoped>
</style>
