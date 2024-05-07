/*用户列表，其中admin为管理员拥有所有权限。dev为开发者，没有删除权限*/
const userList = [{
  name: 'admin',
  role: 'admin',
  password: 'admin@123'
}, {
  name: 'developer',
  role: 'dev',
  password: 'dev@123'
}]

module.exports = userList
