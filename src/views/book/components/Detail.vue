<template>
  <!-- :model="postForm"绑定整个表单的数据信息 -->
  <el-form ref="postForm" :model="postForm">
    <!-- sticky实现吸顶效果 -->
    <sticky :class-name="'sub-navbar'">
      <el-button v-if="!isEdit" @click="showGuide">显示帮助</el-button>
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
          <el-form-item prop="title">
            <md-input v-model="postForm.title" :maxlength="100" name="name" required>
              书名
            </md-input>
          </el-form-item>
          <el-row>
            <el-col :span="12">
              <el-form-item label="作者：" :label-width="labelWidth">
                <el-input v-model="postForm.author" placeholder="作者" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="出版社：" :label-width="labelWidth">
                <el-input v-model="postForm.publisher" placeholder="出版社" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="语言：" :label-width="labelWidth">
                <el-input v-model="postForm.language" placeholder="语言" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="根文件：" :label-width="labelWidth">
                <el-input v-model="postForm.rootFile" placeholder="根文件" disabled />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="文件路径：" :label-width="labelWidth">
                <el-input v-model="postForm.filePath" placeholder="文件路径" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="解压路径：" :label-width="labelWidth">
                <el-input v-model="postForm.unzipPath" placeholder="解压路径" disabled />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="封面路径：" :label-width="labelWidth">
                <el-input v-model="postForm.filePath" placeholder="封面路径" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="文件名称：" :label-width="labelWidth">
                <el-input v-model="postForm.unzipPath" placeholder="文件名称" disabled />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="封面：" :label-width="labelWidth">
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
                <div v-if="postForm.contents && postForm.contents.length > 0" class="contents-wrapper">
                  <el-tree />
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

export default {
  components: { Sticky, Warning, EbookUpload, MdInput },
  // 父组件create.vue和edit.vue向子组件Detail.vue传值
  props: {
    isEdit: Boolean
  },
  data() {
    return {
      loading: false,
      postForm: {
        ebook_uri: ''
      },
      fileList: [],
      labelWidth: '120px'
    }
  },
  methods: {
    onUploadSuccess() {
      console.log('onUploadSuccess')
    },
    onUploadRemove() {
      console.log('onUploadRemove')
    },
    submitForm() {
      // 提交表单，将电子书内容保存到数据库
      this.loading = true // 模拟加载等待
      setTimeout(() => {
        this.loading = false
      }, 1000)
    },
    showGuide() {
      console.log('show fuide')
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
