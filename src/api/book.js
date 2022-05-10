import request from '../utils/request'

// 调用向数据库中新增电子书的API
export function createBook(book) {
  return request({
    url: '/book/create',
    method: 'post',
    data: book
  })
}

// 调用编辑电子书的API
export function updateBook(book) {
  return request({
    url: '/book/update',
    method: 'post',
    data: book
  })
}

// 调用获取对应图书信息的API
export function getBook(fileName) {
  return request({
    url: '/book/get',
    method: 'get',
    params: { fileName }
  })
}

// 获取电子书所有分类
export function getCategory() {
  return request({
    url: '/book/category',
    method: 'get'
  })
}

// 按输入条件查询图书
export function listBook(params) {
  return request({
    url: '/book/list',
    method: 'get',
    params
  })
}
