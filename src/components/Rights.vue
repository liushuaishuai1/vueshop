<template>
  <div>
    <com-crumb nm ='权限' />

    <el-card class="box-card">
      <el-table :data="rightsList" border stripe style="width: 100%">
        <el-table-column type="index" label="序号" width="200"></el-table-column>
        <el-table-column prop="authName" label="权限名称"></el-table-column>
        <el-table-column prop="path" label="路径" width="200"></el-table-column>
        <el-table-column prop="level" label="等级">
          <template slot-scope="info">
            <el-tag v-if="info.row.level==='0'">一级</el-tag>
            <el-tag v-else-if="info.row.level==='1'" type="success">二级</el-tag>
            <el-tag v-else type="warning">三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
    created() {
        this.getRightsList()
    },
    methods: {
        async getRightsList(){
            const {data:dt}= await this.$http.get('rights/list')
            if(dt.meta.status!==200){
            return this.$message.error(dt.meta.msg)
            }
            this.rightsList=dt.data
        }
    },
    data() {
        return {
            rightsList:[]
        }
    },
}
</script>

<style lang="less" scoped>
</style>
