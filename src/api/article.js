import request from '@/utils/request'
// 列表
export function getList(params) {
  return request({
    url: '/article',
    method: 'post',
    params
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
    params
  })
}