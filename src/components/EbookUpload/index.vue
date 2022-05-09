<template>
  <div class="upload-container">
    <!-- :headers="headers"请求头，用于向服务器发送token -->
    <!-- :multiple="false"不能上传多个文件; :limit="1"一次上传一本 -->
    <!-- :file-list="fileList"编辑图书时，预先把fileList内容写入控件中，才能开始对此书编辑 -->
    <!-- :on-exceed="onExceed"给用户的警告提示 -->
    <!-- :disabled="disabled"不允许用户再上传 -->
    <!-- drag可以拖拽上传 -->
    <!-- show-file-list在页面显示fileList信息 -->
    <!-- accept="application/epub+zip"定义可接收的文件类型，是epub电子书 -->
    <el-upload :action="action" :headers="headers" :multiple="false" :limit="1" :before-upload="beforeUpload" :on-success="onSuccess" :on-error="onError" :on-remove="onRemove" :file-list="fileList" :on-exceed="onExceed" :disabled="disabled" drag show-file-list accept="application/epub+zip" class="image-upload">
      <i class="el-icon-upload" />
      <div v-if="fileList.length === 0" class="el-upload__text">请将电子书拖入或 <em>点击上传</em></div>
      <div v-else class="el-upload__text">图书已上传</div>
    </el-upload>
  </div>
</template>

<script>
import { getToken } from '@/utils/auth'
export default {
  // 从父组件接收fileList和disabled
  props: {
    fileList: {
      type: Array,
      default() {
        return []
      }
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      action: `${process.env.VUE_APP_BASE_API}/book/upload`
    }
  },
  computed: {
    headers() {
      return {
        Authorization: `Bearer ${getToken()}`
      }
    }
  },
  methods: {
    beforeUpload(file) {
      // console.log(file)
      // 向父组件传值
      this.$emit('beforeUpload', file)
    },
    onSuccess(response, file) {
      // console.log(response, file)
      const { code, msg, data } = response
      if (code === 0) {
        this.$message({
          message: msg,
          type: 'success'
        })
        // 向父组件传值
        this.$emit('onSuccess', data)
      } else {
        this.$message({
          message: (msg && `上传失败，失败原因：${msg}`) || '上传失败',
          type: 'error'
        })
        // 向父组件传值
        this.$emit('onError', file)
      }
    },
    onError(err) {
      const errMsg = err.message && JSON.parse(err.message)
      this.$message({
        message: (errMsg && errMsg.msg && `上传失败，失败原因：${errMsg.msg}`) || '上传失败',
        type: 'error'
      })
      // 向父组件传值,可以在父组件自定义异常处理
      this.$emit('onError', err)
    },
    onRemove() {
      this.$message({
        message: '电子书删除成功',
        type: 'success'
      })
      this.$emit('onRemove')
    },
    onExceed() {
      this.$message({
        message: '每次只能上传一本电子书',
        type: 'warning'
      })
    }
  }
}
</script>

<style lang="scss" scoped></style>
