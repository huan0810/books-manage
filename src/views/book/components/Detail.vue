<template>
  <!-- :model="postForm"绑定整个表单的数据信息 -->
  <!-- :rules="rules"绑定表单的校验规则 -->
  <el-form ref="postForm" :model="postForm" :rules="rules">
    <!-- sticky实现吸顶效果 -->
    <sticky :class-name="'sub-navbar'">
      <el-button v-loading="loading" type="success" style="margin-left: 10px" @click="submitForm">{{ isEdit ? '编辑电子书' : '新增电子书' }}</el-button>
    </sticky>

    <!-- 表单容器 -->
    <div class="detail-container">
      <el-row>
        <Warning />
        <el-col :span="24">
          <!-- 上传电子书的控件 -->
          <!-- 向子组件EbookUpload传入fileList和disabled -->
          <!-- :disabled="isEdit"表示编辑图书时，禁用上传功能 -->
          <!-- 从子组件EbookUpload中接收自定义事件beforeUpload，onSuccess等 -->
          <ebook-upload :file-list="fileList" :disabled="isEdit" @onSuccess="onUploadSuccess" @onRemove="onUploadRemove" />
        </el-col>
        <el-col :span="24">
          <!-- prop="title"绑定校验规则rules中的title校验项 -->
          <el-form-item prop="title">
            <md-input v-model="postForm.title" :maxlength="100" name="name" required>
              书名
            </md-input>
          </el-form-item>
          <el-row>
            <el-col :span="12">
              <el-form-item prop="author" label="作者：" :label-width="labelWidth">
                <el-input v-model="postForm.author" placeholder="作者" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="publisher" label="出版社：" :label-width="labelWidth">
                <el-input v-model="postForm.publisher" placeholder="出版社" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item prop="language" label="语言：" :label-width="labelWidth">
                <el-input v-model="postForm.language" placeholder="语言" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="rootFile" label="根文件：" :label-width="labelWidth">
                <el-input v-model="postForm.rootFile" placeholder="根文件" disabled />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item prop="filePath" label="文件路径：" :label-width="labelWidth">
                <el-input v-model="postForm.filePath" placeholder="文件路径" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="unzipPath" label="解压路径：" :label-width="labelWidth">
                <el-input v-model="postForm.unzipPath" placeholder="解压路径" disabled />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item prop="coverPath" label="封面路径：" :label-width="labelWidth">
                <el-input v-model="postForm.coverPath" placeholder="封面路径" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="originalName" label="文件名称：" :label-width="labelWidth">
                <el-input v-model="postForm.originalName" placeholder="文件名称" disabled />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item prop="cover" label="封面：" :label-width="labelWidth">
                <!-- a标签的作用是点击显示大图 -->
                <a v-if="postForm.cover" :href="postForm.cover" target="_blank">
                  <img :src="postForm.cover" class="preview-img">
                </a>
                <span v-else>无</span>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 目录组件 -->
          <el-row>
            <el-col :span="24">
              <el-form-item label="目录：" :label-width="labelWidth">
                <div v-if="contentsTree && contentsTree.length > 0" class="contents-wrapper">
                  <el-tree :data="contentsTree" @node-click="onContentClick" />
                </div>
                <span v-else>无</span>
              </el-form-item>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </div>
  </el-form>
</template>

<script>
import Sticky from '../../../components/Sticky'
import Warning from './Warning'
import EbookUpload from '../../../components/EbookUpload'
import MdInput from '../../../components/MDinput'
import { createBook, getBook, updateBook } from '../../../api/book'

// 字段英文映射为中文
const fields = {
  title: '书名',
  author: '作者',
  publisher: '出版社',
  language: '语言'
}

export default {
  components: { Sticky, Warning, EbookUpload, MdInput },
  // 父组件create.vue和edit.vue向子组件Detail.vue传值
  props: {
    isEdit: Boolean
  },
  data() {
    const validateRequire = (rule, value, callback) => {
      // console.log(rule, value)
      if (value.length === 0) {
        callback(new Error(fields[rule.field] + '必须填写'))
      } else {
        callback()
      }
    }
    return {
      loading: false,
      postForm: {},
      fileList: [],
      labelWidth: '120px',
      contentsTree: [],
      rules: {
        title: [{ validator: validateRequire }],
        author: [{ validator: validateRequire }],
        publisher: [{ validator: validateRequire }],
        language: [{ validator: validateRequire }]
      }
    }
  },
  created() {
    if (this.isEdit) {
      // 编辑模式时，要拿到fileName，知道编辑哪本书
      const fileName = this.$route.params.fileName
      this.getBookData(fileName)
    }
  },
  methods: {
    getBookData(fileName) {
      // 调接口，获取电子书信息
      getBook(fileName).then(response => {
        this.setData(response.data)
      })
    },
    onContentClick(data) {
      // console.log(data)
      window.open(data.text) // 打开章节对应内容
    },
    setData(data) {
      // 更新postForm表单数据
      const { title, author, publisher, language, rootFile, cover, url, originalName, contents, contentsTree, fileName, coverPath, filePath, unzipPath } = data
      this.postForm = {
        ...this.postForm,
        title,
        author,
        publisher,
        language,
        rootFile,
        cover,
        url,
        originalName,
        contents,
        contentsTree,
        fileName,
        coverPath,
        filePath,
        unzipPath
      }
      // 把contentsTree赋值给data数据中
      this.contentsTree = contentsTree
      // 新数据书名是originalName，旧数据书名是fileName
      this.fileList = [{ name: originalName || fileName, url }]
    },
    // 上传成功后，表单项还原为默认值
    setDefault() {
      // this.postForm = Object.assign({}, defaultForm)
      this.contentsTree = []
      this.fileList = []
      // resetFields()将整个表单重置为初始值，并移除校验结果。这需要每个表单都绑定prop
      this.$refs.postForm.resetFields()
    },
    onUploadSuccess(data) {
      // console.log('onUploadSuccess', data)
      this.setData(data)
    },
    onUploadRemove() {
      // console.log('onUploadRemove')
      // 将表单值还原为默认值
      this.setDefault()
    },
    submitForm() {
      const onSuccess = response => {
        const { msg } = response
        this.$notify({
          title: '操作成功',
          message: msg,
          type: 'success',
          duration: 2000
        })
        this.loading = false
      }
      if (!this.loading) {
        // 提交表单，将电子书内容保存到数据库
        this.loading = true // 模拟加载等待
        // this.$refs.postForm拿到模板里的表单,提交前进行表单规则校验
        this.$refs.postForm.validate((valid, fields) => {
          // console.log(valid, fields)
          if (valid) {
            // valid为true表示通过验证
            // 对表单项postForm做一个浅拷贝，删除无用项，不用向服务器传递冗余数据
            const book = Object.assign({}, this.postForm)
            delete book.contentsTree
            if (!this.isEdit) {
              // 新增图书
              createBook(book)
                .then(response => {
                  onSuccess(response)
                  this.setDefault()
                })
                .catch(() => {
                  this.loading = false
                })
            } else {
              // 更新(编辑)图书
              updateBook(book)
                .then(response => {
                  onSuccess(response)
                })
                .catch(() => {
                  this.loading = false
                })
            }
          } else {
            // 验证失败，弹出错误信息
            const message = fields[Object.keys(fields)[0]][0].message
            this.$message({ message, type: 'error' })
            this.loading = false
          }
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.detail-container {
  padding: 40px 50px 20px;
  .preview-img {
    width: 200px;
    height: 270px;
  }
}
</style>
