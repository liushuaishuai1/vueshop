<template>
  <div>
    <com-crumb nm="用户"/>
    <el-dialog
      title="分配角色"
      :visible.sync="setRoleDialog"
      width="50%"
      @close="$refs.setRoleRef.resetFields()"
    >
      <el-form :rules="setRoleRules" ref="setRoleRef" :model="setRole" label-width="120px">
        <el-form-item label="当前用户：" prop="username">{{setRole.username}}</el-form-item>
        <el-form-item label="目前角色：" prop="role_name">{{setRole.role_name}}</el-form-item>
        <el-form-item label="分配新角色：" prop="rid">
          <el-select v-model="setRole.rid" placeholder="请选择">
            <el-option
              v-for="item in roleList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRoleDialog=false">取消</el-button>
        <el-button type="primary" @click="fenrole()">确定</el-button>
      </span>
    </el-dialog>
    <!--卡片区-->
    <el-card class="box-card">
      <el-dialog
        title="修改用户"
        :visible.sync="editUserDialog"
        width="50%"
        @close="$refs.editUserRef.resetFields()"
      >
        <el-form :rules="editUserRules" ref="editUserRef" :model="editUser" label-width="80px">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="editUser.username" disabled></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="editUser.email"></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="mobile">
            <el-input v-model="editUser.mobile"></el-input>
          </el-form-item>
        </el-form>

        <span slot="footer" class="dialog-footer">
          <el-button @click="editUserDialog = false">取 消</el-button>
          <el-button type="primary" @click="xiugai()">确 定</el-button>
        </span>
      </el-dialog>
      <el-dialog
        title="添加用户"
        :visible.sync="addUserDialog"
        width="50%"
        @close="$refs.addUserRef.resetFields()"
      >
        <el-form :rules="addUserRules" ref="addUserRef" :model="addUser" label-width="80px">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="addUser.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="addUser.password"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="addUser.email"></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="mobile">
            <el-input v-model="addUser.mobile"></el-input>
          </el-form-item>
        </el-form>

        <span slot="footer" class="dialog-footer">
          <el-button @click="addUserDialog = false">取 消</el-button>
          <el-button type="primary" @click="tianjia()">确 定</el-button>
        </span>
      </el-dialog>
      <!--搜索框 和 添加按钮-->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入搜索内容"
            v-model="querycdt.query"
            class="input-with-select"
            clearable
            @clear="getUserList()"
            @keyup.enter.native="getUserList()"
          >
            <el-button slot="append" icon="el-icon-search" @click="getUserList()"></el-button>
          </el-input>
        </el-col>
        <el-col :span="7">
          <el-button type="primary" @click="addUserDialog=true">添加用户</el-button>
        </el-col>
      </el-row>
      <el-table :data="userList" border stripe style="width: 100%">
        <el-table-column type="index" label="序号" width="60"></el-table-column>
        <el-table-column prop="username" label="用户" width="160"></el-table-column>
        <el-table-column prop="mobile" label="手机号" width="130"></el-table-column>
        <el-table-column prop="role_name" label="角色" width="130"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="mg_state" label="状态" width="60">
          <el-switch
            v-model="info.row.mg_state"
            slot-scope="info"
            @change="stateChange(info.row, info.row.mg_state)"
          ></el-switch>
        </el-table-column>
        <el-table-column label="操作" width="230">
          <template slot-scope="info">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditDialog(info.row.id)"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="delUser(info.row.id)"
            ></el-button>
            <el-tooltip content="分配角色" placement="top" :enterable="false">
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="mini"
                @click="showSetRoleDialog(info.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="querycdt.pagenum"
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
    this.getUserList()
  },
  methods: {
    async stateChange(user, state) {
      const { data: dt } = await this.$http.put(
        `users/${user.id}/state/${state}`
      )
      if(dt.meta.status !==200){
       return this.$message.error(dt.meta.msg)
      }
      this.$message.success(dt.meta.msg)
    },
    fenrole() {
      this.$refs.setRoleRef.validate(async valid => {
        if (valid === true) {
          const { data: dt } = await this.$http.put(
            `users/${this.setRole.id}/role`,
            { rid: this.setRole.rid }
          )
          if (dt.meta.status !== 200) {
            return this.$message.error(dt.meta.msg)
          }
          this.$message.success(dt.meta.msg)
          this.setRoleDialog = false
          this.getUserList()
        }
      })
    },
    async showSetRoleDialog(user) {
      const { data: dt } = await this.$http.get('roles')
      if (dt.meta.status !== 200) {
        return this.$message.error(dt.meta.msg)
      }
      this.roleList = dt.data
      this.setRole = user
      this.setRoleDialog = true
    },
    xiugai() {
      this.$refs.editUserRef.validate(async valid => {
        if (valid === true) {
          const { data: dt } = await this.$http.put(
            'users/' + this.editUser.id,
            this.editUser
          )
          if (dt.meta.status != 200) {
            return this.$message.error(dt.meta.msg)
          }
          this.$message.success(dt.meta.msg)
          this.editUserDialog = false
          this.getUserList()
        }
      })
    },
    async showEditDialog(id) {
      const { data: dt } = await this.$http.get('users/' + id)
      this.editUser = dt.data
      this.editUserDialog = true
    },
    delUser(id) {
      this.$confirm('确定要删除该用户么?', '删除用户', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const { data: dt } = await this.$http.delete('users/' + id)
          if (dt.meta.status !== 200) {
            return this.$message.error(dt.meta.msg)
          }
          this.$message.success(dt.meta.msg)
          if (this.getUserList.length === 1 && this.querycdt.pagenum > 1) {
            this.querycdt.pagenum--
          }
          this.getUserList()
        })
        .catch(() => {})
    },
    tianjia() {
      this.$refs.addUserRef.validate(async valid => {
        if (valid) {
          const { data: dt } = await this.$http.post('users', this.addUser)
          if (dt.meta.status != 201) {
            return this.$message.error(dt.meta.msg)
          }
          this.addUserDialog = false
          this.$message.success(dt.meta.msg)
          this.getUserList()
        }
      })
    },
    handleSizeChange(val) {
      this.querycdt.pagesize = val
      this.getUserList()
    },
    handleCurrentChange(val) {
      this.querycdt.pagenum = val
      this.getUserList()
    },
    async getUserList() {
      const { data: dt } = await this.$http.get('users', {
        params: this.querycdt
      })
      // console.log(dt)
      if (dt.meta.status != 200) {
        return this.$message.error(dt.meta.msg)
      }
      this.tot = dt.data.total
      this.userList = dt.data.users
    }
  },
  data() {
    var chekMobile = (rule, value, callback) => {
      var reg = /^1[3456789]\d{9}$/
      if (!reg.test(value)) {
        return callback(new Error('手机号格式不正确'))
      }
      callback()
    }
    return {
      setRoleRules: {
        rid: [
          { required: true, message: '必须选取一个角色', trigger: 'change' }
        ]
      },
      roleList: [],
      setRoleDialog: false,
      setRole: {
        username: '',
        role_name: '',
        rid: 0
      },
      editUserDialog: false,
      editUserRules: {
        mobile: [
          { required: true, message: '手机号必填', trigger: 'blur' },
          { validator: chekMobile, trigger: 'blur' }
        ]
      },
      editUser: {
        username: '',
        mobile: '',
        email: ''
      },
      addUserRules: {
        username: [{ required: true, message: '用户名必填', trigger: 'blur' }],
        password: [{ required: true, message: '密码必填', trigger: 'blur' }],
        mobile: [
          { required: true, message: '手机号必填', trigger: 'blur' },
          { validator: chekMobile, trigger: 'blur' }
        ]
      },
      addUser: {
        username: '',
        password: '',
        mobile: '',
        email: ''
      },
      addUserDialog: false,
      tot: 0,
      userList: [],
      querycdt: {
        query: '',
        pagenum: 1,
        pagesize: 3
      }
      // tableData: [
      //   {
      //     date: '2016-05-02',
      //     name: '王小虎',
      //     address: '上海市普陀区金沙江路 1518 弄'
      //   },
      //   {
      //     date: '2016-05-04',
      //     name: '王小虎',
      //     address: '上海市普陀区金沙江路 1517 弄'
      //   },
      //   {
      //     date: '2016-05-01',
      //     name: '王小虎',
      //     address: '上海市普陀区金沙江路 1519 弄'
      //   },
      //   {
      //     date: '2016-05-03',
      //     name: '王小虎',
      //     address: '上海市普陀区金沙江路 1516 弄'
      //   }
      // ]
    }
  }
}
</script>

<style lang="less" scoped>
</style>
