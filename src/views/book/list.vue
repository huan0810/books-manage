<template>
  <div class="app-container">
    <!-- 查询条件 -->
    <div class="filter-container">
      <el-input v-model="listQuery.title" placeholder="书名" style="width: 200px" class="filter-item" clearable @keyup.enter.native="handleFilter" @clear="handleFilter" @blur="handleFilter" />
      <el-input v-model="listQuery.author" placeholder="作者" style="width: 200px" class="filter-item" clearable @keyup.enter.native="handleFilter" @clear="handleFilter" @blur="handleFilter" />
      <el-select v-model="listQuery.category" placeholder="分类" clearable class="filter-item" @change="handleFilter">
        <el-option v-for="item in categoryList" :key="item.value" :label="item.label + '(' + item.num + ')'" :value="item.label" />
      </el-select>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" style="margin-left: 10px" @click="handleFilter">查询</el-button>
      <el-button class="filter-item" type="primary" icon="el-icon-edit" style="margin-left: 5px" @click="handleCreate">新增</el-button>
      <el-checkbox v-model="showCover" class="filter-item" style="margin-left: 5px" @change="changeShowCover">显示封面</el-checkbox>
    </div>
    <!-- 表格 -->
    <el-table :key="tableKey" v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%" :default-sort="defaultSort" @sort-change="sortChange">
      <el-table-column width="80" align="center" sortable="custom" prop="id" label="ID" />
      <el-table-column width="150" align="center" label="书名">
        <template slot-scope="{ row: { titleWrapper }}">
          <span v-html="titleWrapper" />
        </template>
      </el-table-column>
      <el-table-column width="150" align="center" label="作者">
        <template slot-scope="{ row: { authorWrapper }}">
          <span v-html="authorWrapper" />
        </template>
      </el-table-column>
      <el-table-column align="center" width="150" prop="publisher" label="出版社" />
      <el-table-column align="center" width="100" prop="categoryText" label="分类" />
      <el-table-column align="center" prop="language" label="语言" />
      <el-table-column v-if="showCover" align="center" width="150" label="封面">
        <template slot-scope="{ row: { cover }}">
          <a :href="cover" target="_blank">
            <img :src="cover" style="width:120px;height:180px">
          </a>
        </template>
      </el-table-column>
      <el-table-column align="center" width="100" prop="fileName" label="文件名" />
      <el-table-column align="center" width="100" prop="filePath" label="文件路径">
        <template slot-scope="{ row: { filePath }}">
          <span>{{ filePath || '无' }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" width="100" prop="coverPath" label="封面路径">
        <template slot-scope="{ row: { coverPath }}">
          <span>{{ coverPath || '无' }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" width="100" prop="unzipPath" label="解压路径">
        <template slot-scope="{ row: { unzipPath }}">
          <span>{{ unzipPath || '无' }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" width="100" prop="createUser" label="上传人">
        <template slot-scope="{ row: { createUser }}">
          <span>{{ createUser || '无' }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" width="100" prop="createDt" label="上传时间">
        <template slot-scope="{ row: { createDt }}">
          <span>{{ createDt | timeFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" width="120" label="操作" fixed="right">
        <template slot-scope="{ row }">
          <el-button type="text" icon="el-icon-edit" @click="handleUpdate(row)" />
          <el-button type="text" icon="el-icon-delete" style="color: #f56c6c" @click="handleDelete(row)" />
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total > 0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.pageSize" @pagination="refresh" />
  </div>
</template>

<script>
import Pagination from '../../components/Pagination'
import waves from '@/directive/waves/waves'
import { getCategory, listBook, deleteBook } from '../../api/book'
import { parseTime } from '@/utils'

export default {
  components: { Pagination },
  directives: { waves },
  filters: {
    timeFilter(time) {
      return time ? parseTime(time, '{y}-{m}-{d} {h}:{i}') : '无'
    }
  },
  data() {
    return {
      tableKey: 0,
      listLoading: true,
      listQuery: {}, // 查询图书的查询条件
      showCover: false, // 是否展示封面列
      categoryList: [], // 图书分类
      list: [], // 按输入条件查询图书返回的图书列表
      total: 0, // 按条件查询得出的总条数
      defaultSort: {} // 表示按哪个字段排序,升序or降序
    }
  },
  created() {
    this.parseQuery()
  },
  mounted() {
    this.getList()
    this.getCategoryList()
  },
  // url查询参数变化时,列表没有更新,所以添加一个钩子函数,监听查询字符串的变化
  beforeRouteUpdate(to, from, next) {
    if (to.path === from.path) {
      const newQuery = Object.assign({}, to.query)
      const oldQuery = Object.assign({}, from.query)
      if (JSON.stringify(newQuery) !== JSON.stringify(oldQuery)) {
        // 参数不一样时, 就调用按条件查询电子书的接口
        this.getList()
      }
    }
    next()
  },
  methods: {
    parseQuery() {
      // 为了刷新页面时，查询条件不丢失,要获取url地址后面的查询字符串
      const query = Object.assign({}, this.$route.query)
      let sort = '+id'
      const listQuery = {
        page: 1,
        pageSize: 20,
        sort
      }
      if (query) {
        query.page && (query.page = +query.page)
        query.pageSize && (query.pageSize = +query.pageSize)
        query.sort && (sort = query.sort)
      }
      const sortSymbol = sort[0]
      const sortColumn = sort.slice(1)
      this.defaultSort = {
        prop: sortColumn,
        order: sortSymbol === '+' ? 'ascending' : 'descending'
      }
      this.listQuery = { ...listQuery, ...query }
      console.log(this.listQuery)
    },
    sortChange(data) {
      console.log('sortChange', data)
      const { prop, order } = data
      this.sortBy(prop, order)
    },
    // 把两个参数合并成一个排序参数sort
    sortBy(prop, order) {
      if (order === 'ascending') {
        this.listQuery.sort = `+${prop}`
      } else {
        this.listQuery.sort = `-${prop}`
      }
      this.handleFilter()
    },
    // 给选中的文字高亮显示
    wrapperKeyword(key, val) {
      function highlight(value) {
        return `<span style="color: #1890ff">${value}</span>`
      }
      // this.listQuery[k]是要搜索匹配的条件,val表示在哪里搜索
      if (!this.listQuery[key]) {
        return val
      } else {
        return val.replace(new RegExp(this.listQuery[key], 'ig'), v => highlight(v))
      }
    },
    getList() {
      this.listLoading = true
      // 按输入条件查询图书
      listBook(this.listQuery).then(response => {
        const { list, count } = response.data
        this.list = list
        this.total = count
        this.listLoading = false
        // 对查询中匹配的内容高亮显示
        this.list.forEach(book => {
          book.titleWrapper = this.wrapperKeyword('title', book.title)
          book.authorWrapper = this.wrapperKeyword('author', book.author)
        })
      })
    },
    refresh() {
      this.$router.push({
        path: '/book/list',
        query: this.listQuery
      })
    },
    // 图书列表按条件查询
    handleFilter() {
      console.log('handleFilter', this.listQuery)
      this.listQuery.page = 1 // 每次调用查询条件,都重置页码
      // 输入查询条件时,要自动给url加上查询字符串,以便于刷新时查询条件不丢失
      this.refresh()
    },
    handleCreate() {
      this.$router.push('/book/create')
    },
    handleUpdate(row) {
      console.log('handleUpdate', row)
      this.$router.push(`/book/edit/${row.fileName}`)
    },
    handleDelete(row) {
      // 删除电子书前,先弹出提示框
      this.$confirm('此操作将永久删除该电子书,是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 点击确定,执行then,在这里删除电子书
        deleteBook(row.fileName).then(response => {
          this.$notify({
            title: '成功',
            message: response.msg || '删除成功',
            type: 'success',
            duration: 2000
          })
          this.getList()
        })
      })
    },
    changeShowCover(value) {
      this.showCover = value
    },
    getCategoryList() {
      getCategory().then(response => {
        this.categoryList = response.data
      })
    }
  }
}
</script>

<style lang='scss' scoped>
</style>
