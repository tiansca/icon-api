
const isAdmin = (token) => {
  return new Promise((resolve, reject) => {
    if (!token) {
      return reject('请登录')
    }
    try {
      const userObj = JSON.parse(Buffer.from(token, 'base64').toString('ascii'))
      console.log(userObj.role)
      if (userObj.role !== 'admin') {
        throw Error()
      }
      return resolve(true)
    } catch (e) {
      return reject('没有权限')
    }
  })
}
module.exports = isAdmin
