<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-alert title="消息提示的文案" type="info" center show-icon></el-alert>
      <el-steps :active="activeName-1" align-center class="step">
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <el-form :model="formGoodsAdd" label-width="80px" :rules="addFormRules">
        <el-tabs
          tab-position="left"
          v-model="activeName"
          :before-leave="beforeTab"
          @tab-click="handleClick"
        >
          <el-tab-pane name="1" label="基本信息">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="formGoodsAdd.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input type="number" v-model="formGoodsAdd.goods_price"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input type="number" v-model="formGoodsAdd.goods_weight"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input type="number" v-model="formGoodsAdd.goods_number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <!-- {{seleOption}} -->
              <el-cascader
                expand-trigger="hover"
                :options="catList"
                v-model="seleOption"
                :props="catProps"
                @change="catChange()"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane name="2" label="商品参数">
            <el-form-item :label="item1.attr_name" v-for="(item1,i) in manyParams" :key="i">
              <el-checkbox-group v-model="item1.attr_vals">
                <el-checkbox border :label="item2" v-for="(item2,j) in item1.attr_vals" :key="j"></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane name="3" label="商品属性">
            <el-form-item :label="item.attr_name" v-for="(item,i) in onlyParams" :key="i">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane name="4" label="商品图片">
            <el-upload
              action="http://127.0.0.1:11333/api/private/v1/upload"
              :headers="headers"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :on-success="handleSuccess"
              list-type="picture"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane name="5" label="商品内容">
            <quill-editor class="editor" v-model="formGoodsAdd.goods_introduce"></quill-editor>
            <el-button type="primary" @click="addGoods">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import { quillEditor } from 'vue-quill-editor'

export default {
  components: {
    //  <quill-editor>
    quillEditor
  },
  created() {
    this.getCatList()
  },
  methods: {
    async addGoods() {
      this.formGoodsAdd.goods_cat = this.seleOption.join(',')
      this.manyParams.forEach((item, i) => {
        if (item.attr_vals.length > 0) {
          let obj = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(',')
          }
          this.formGoodsAdd.attrs.push(obj)
        }
      })

      // 静态数组

      this.onlyParams.forEach((item, i) => {
        if (item.attr_vals.length > 0) {
          let obj = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals
          }
          this.formGoodsAdd.attrs.push(obj)
        }
      })

      // console.log(this.formGoodsAdd.attrs)

      // 2. 发送post请求 -> 请求体
      const { data } = await this.$http.post(`goods`, this.formGoodsAdd)
      if (data.meta.status !== 201) {
        // 提示
        return this.$message({
          message: res.meta.msg,
          type: 'error',
          duration: 1500
        })
      }
       this.$message.success(data.meta.msg)
      // 回到列表->改变页面的内容->改变组件->1.router-link 2.js编程式导航
      this.$router.push('/goods')
    },
    handlePreview(file) {},
    handleRemove(file) {
      const tmp_path = file.response.data.tmp_path
      const index = this.formGoodsAdd.pics.findIndex((item, i) => {
        return item.pic === tmp_path
      })
      this.formGoodsAdd.pics.splice(index, 1)
    },

    handleSuccess(response) {
      const tmp_path = response.data.tmp_path
      this.formGoodsAdd.pics.push({
        pic: tmp_path
      })
    },
    handleRemove(file) {
      // 图片的临时保存路径,将来会用
      const tmp_path = file.response.data.tmp_path
    },

    handleSuccess(response) {
      // 图片的临时保存路径,将来会用
      const tmp_path = response.data.tmp_path
    },
    async handleClick() {
      if (this.activeName === '2') {
        const { data: res } = await this.$http.get(
          `categories/${this.threeCatId}/attributes`,
          {
            params: {
              sel: 'many'
            }
          }
        )
        if (res.meta.status !== 200) {
          return this.$message({
            message: '获取商品参数失败',
            type: 'error',
            duration: 1500
          })
        }
        res.data.forEach((item, i) => {
          item.attr_vals = item.attr_vals.split(',')
          // console.log(item.attr_vals)
        })
        this.manyParams = res.data
        console.log(this.manyParams)
      }
      if (this.activeName === '3') {
        // 判断点击了“商品属性”标签，就获取对应的属性信息
        const { data: res } = await this.$http.get(
          `categories/${this.threeCatId}/attributes`,
          {
            params: {
              sel: 'only'
            }
          }
        )
        console.log(res)
        if (res.meta.status !== 200) {
          return this.$message({
            message: '获取商品属性失败',
            type: 'error',
            duration: 1500
          })
        }
        // console.log(res)
        this.onlyParams = res.data
        console.log(this.onlyParams)
      }
    },
    catChange() {
      this.threeCatId = this.seleOption[2]
    },
    beforeTab(activeName, oldActiveName) {
      if (oldActiveName === '1' && this.seleOption.length !== 3) {
        this.$message({
          message: '请选取第三级商品分类',
          type: 'error',
          duration: 1500
        })
        return false
      }
    },
    async getCatList() {
      const { data: dt } = await this.$http.get('categories', {
        params: { type: 3 }
      })
      if (dt.meta.status !== 200) {
        return this.$message.error(dt.meta.msg)
      }

      this.catList = dt.data
    }
  },

  data() {
    return {
      activeName: '1',
      formGoodsAdd: {
        goods_name: '',
        goods_price: '',
        goods_weight: '',
        goods_numbe: '',
        goods_introduce: '',
        goods_cat: '',
        pics: [],
        attrs: []
      },
      addFormRules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' }
        ],
        goods_cat: [
          { required: true, message: '请选取商品分类', trigger: 'blur' }
        ]
      },
      catList: [],
      catProps: {
        value: 'cat_id',
        label: 'cat_name'
      },
      seleOption: [],
      manyParams: [],
      onlyParams: [],
      threeCatId: '',
      headers: {
        // var token = window.sessionStorage.getItem('token')
        // config.headers.Authorization = token
        Authorization: window.sessionStorage.getItem('token')
      }
    }
  }
}
</script>

<style lang="less" scoped>
.el-card {
  margin-top: 15px;
  .el-steps {
    margin-top: 15px;
  }
}
.el-steps {
  margin-top: 15px;
}
.el-tabs {
  margin-top: 15px;
}
.el-button {
  margin-top: 15px;
}
</style>
