<template>
  <div>
    <com-crumb nm="角色"/>
    <el-dialog title="分配权限" :visible.sync="distributeDialog" width="50%">
      <el-form ref="distributeRef" :model="distributeForm" label-width="120px">
        <el-form-item label="当前角色:">{{distributeForm.roleName}}</el-form-item>
        <el-form-item label="分配的权限:">
          <el-tree
            :data="rightsInfo"
            :props="treeProps"
            :default-expand-all="true"
            show-checkbox
            node-key="id"
            :default-checked-keys="deFaultChecked"
            ref="treeRef"
          ></el-tree>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="distributeDialog=false">取消</el-button>
        <el-button type="primary" @click="fenRights()">确定</el-button>
      </span>
    </el-dialog>
    <el-card class="box-card">
      <el-button type="primary">添加角色</el-button>
      <el-table :data="roleList" border stripe style="width: 100%">
        <el-table-column type="expand">
          <template slot-scope="info">
            <el-row
              v-for="(v,k) in info.row.son"
              :key="v.id"
              :style="{'border-bottom':'1px solid rgb(235,238,245)',
                'border-top':k===0?'1px solid rgb(235,238,245)'
                :''}"
            >
              <el-col :span="5">
                <el-tag closable @close="delRights(info.row,v.id)">{{v.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="19">
                <el-row
                  v-for="(vv,kk) in v.children"
                  :key="vv.id"
                  :style="{'border-top':kk!==0?'1px solid rgb(235,238,245)':''}"
                >
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="delRights(info.row,vv.id)"
                    >{{vv.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag
                      v-for="vvv in vv.children"
                      :key="vvv.id"
                      type="warning"
                      closable
                      @close="delRights(info.row,vv.id)"
                    >{{vvv.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index" label="序号" width="240"></el-table-column>
        <el-table-column prop="roleName" label="角色名称"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述" width="240"></el-table-column>
        <el-table-column label="操作" width="340px">
          <template slot-scope="info">
            <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
            <el-button
              type="warning"
              icon="el-icon-setting"
              size="mini"
              @click="showDistributeDialog(info.row)"
            >分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  created() {
    this.getRoleList()
  },
  methods: {
    async fenRights() {
      var ids1 = this.$refs.treeRef.getCheckedKeys()
      var ids2 = this.$refs.treeRef.getHalfCheckedKeys()
      var ids12 = ids1.concat(ids2).join(',')
      const { data: dt } = await this.$http.post(
        `roles/${this.distributeForm.id}/rights`,
        { rids: ids12 }
      )
      if (dt.meta.status !== 200) {
        return this.$message.error(dt.meta.msg)
      }
      this.distributeDialog = false
      this.$message.success(dt.meta.msg)
      this.getRoleList()
    },
    async showDistributeDialog(role) {
      const { data: dt } = await this.$http.get('rights/tree')
      if (dt.meta.status !== 200) {
        return this.$message.error(dt.meta.msg)
      }
      this.rightsInfo = dt.data
      var idKeys = []
      this.getHaveRights(role, idKeys)
      console.log(idKeys)
      this.defaultChecked = idKeys
      this.distributeForm = role
      this.distributeDialog = true
    },
    getHaveRights(node, arr) {
      if (node.son) {
        node.children = node.son
      }
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach(item => {
        this.getHaveRights(item, arr)
      })
    },
    delRights(role, rightsId) {
      this.$confirm('确认要删除该权限吗？', '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const { data: dt } = await this.$http.delete(
            `roles/${role.id}/rights/${rightsId}`
          )
          if (dt.meta.status !== 200) {
            return this.$message.error(dt.meta.msg)
          }
          this.$message.success(dt.meta.msg)
          role.son = dt.data
        })
        .catch(() => {})
    },
    async getRoleList() {
      const { data: dt } = await this.$http.get('roles')
      if (dt.meta.status !== 200) {
        return this.$message.error(dt.meta.msg)
      }
      dt.data.forEach(item => {
        item.son = item.children
        delete item.children
      })
      this.roleList = dt.data
    }
  },
  data() {
    return {
      defaultChecked: [],
      treeProps: {
        label: 'authName',
        children: 'children'
      },
      rightsInfo: [],
      distributeDialog: false,
      distributeForm: {
        id: 0,
        roleName: '',
        roleDesc: ''
      },
      roleList: []
    }
  }
}
</script>

<style lang="less" scoped>
.el-row {
  display: flex;
  align-content: center;
}
.el-tag {
  margin: 10px 5px;
}
</style>

