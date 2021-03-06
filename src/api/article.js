import request from '@/utils/request'
// 列表
export function getList(params) {
  return request({
    url: '/article',
    method: 'post',
    data: {
      ...params
    }
  })
}
// 删除
export function Delete(params) {
  return request({
    url: '/Delete',
    method: 'post',
    params
  })
}
// 搜索
export function search(value) {
  return request({
    url: '/search',
    method: 'get',
    params: value
  })
}
// 留言列表
export function commentList(value) {
  return request({
    url: '/commentList',
    method: 'get',
    params: value
  })
}
// 删除评论
export function deleteComment(params) {
  return request({
    url: '/deleteComment',
    method: 'post',
    params
  })
}
// 查看文章
export function details(params) {
  return request({
    url: '/getDetails',
    method: 'post',
    params,

  })
}
// 新增文章
export function saveArticle(params) {
  return request({
    url: '/addArticle',
    method: 'post',
    data: params
  })
}
// 文章状态
export function articleEdit(params) {
  return request({
    url: '/articleStatus',
    method: 'post',
    params
  })
}
// 添加文章分类
export function addCategory(params) {
  return request({
    url: '/addCategory',
    method: 'post',
    data: {
      ...params
    }
  })
}
// 获取文章分类
export function getCategoryList(params) {
  return request({
    url: '/getCategoryList',
    method: 'POST',
    data: {
      ...params
    }
  })
}