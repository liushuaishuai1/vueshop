<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-alert title="
注意：只允许为第三级分类设置相关参数！" type="warning" show-icon></el-alert>
      <el-row>
        <el-col>
          请选择商品分类：
          <el-cascader
            expand-trigger="hover"
            :options="catThreeList"
            :props="catThreeProps"
            v-model="catThreeSelected"
            @change="catThreeChange()"
            clearable
          ></el-cascader>
        </el-col>
      </el-row>
      <el-tabs v-model="activeName" @tab-click="tabsClick()">
        <el-tab-pane label="动态参数" name="many">
          <el-button type="primary" size:mini :disabled="showButton">添加动态参数</el-button>
          <el-table :data="manyParamList" border stripe style="width: 100%">
            <el-table-column type="expand" width="50">
              <template slot-scope="info">
                <el-tag v-for="(v,k) in info.row.attr_vals_arr" :key="k">{{v}}</el-tag>
              </template>
            </el-table-column>
            <el-table-column type="index" label="序号" width="200"></el-table-column>
            <el-table-column prop="attr_name" label="参数名称"></el-table-column>
            <el-table-column label="操作" widht="200">
              <el-button type="primary" icon="el-icon-edit" size="mini">修改</el-button>
              <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态参数" name="only">
          <el-button type="primary" size:mini :disabled="showButton">添加静态属性</el-button>
          <el-table :data="onlyParamList" border stripe style="width: 100%">
            <el-table-column type="expand" width="50">
              <template slot-scope="info">
                <el-tag v-for="(v,k) in info.row.attr_vals_arr" :key="k">{{v}}</el-tag>
              </template>
            </el-table-column>
            <el-table-column type="index" label="序号" width="200"></el-table-column>
            <el-table-column prop="attr_name" label="参数名称"></el-table-column>
            <el-table-column label="操作" widht="200">
              <el-button type="primary" icon="el-icon-edit" size="mini">修改</el-button>
              <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
export default {
  created() {
    this.getCatThreeList()
  },
  methods: {
    async getParamList() {
      const { data: dt } = await this.$http.get(
        `categories/${this.catTHreeId}/attributes`,
        { params: { sel: this.activeName } }
      ) 
      if (dt.meta.status !== 200) {
        return this.$message.error(dt.meta.msg)
      }
      dt.data.forEach(item => {
        item.attr_vals_arr=item.attr_vals.split(' ')
      })
      if (this.activeName === 'many') {
        this.manyParamList = dt.data
      } else {
        this.onlyParamList = dt.data
      }
    },
    tabsClick() {
      if (this.catThreeId !== 0) {
        this.getParamList()
      }
    },
    catThreeChange() {
      var len = this.catThreeSelected.length
      if (len === 3) {
        this.showButton = false
        this.catTHreeId = this.catThreeSelected[2]
        this.getParamList()
      } else {
        this.showButton = true
        this.catThreeSelected = []
        this.catTHreeId = 0
        this.manyParamList = []
        this.onlyParamList = []
      }
    },
    async getCatThreeList() {
      const { data: dt } = await this.$http.get('categories', {
        params: { type: 3 }
      })
      if (dt.meta.status !== 200) {
        return this.$message.error(dt.meta.msg)
      }
      this.catThreeList = dt.data
    }
  },
  data() {
    return {
      manyParamList: [],
      onlyParamList: [],
      showButton: true,
      activeName: 'many',
      catThreeList: [],
      catThreeSelected: [],
      catThreeProps: {
        label: 'cat_name',
        value: 'cat_id',
        children: 'children'
      }
    }
  }
}
</script>

<style lang="less" scoped>
.el-row {
  margin-top: 15px;
}
.el-tag{
  margin:10px 5px;
}
</style>
