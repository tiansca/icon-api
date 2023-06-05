const userList = require('../config/user')
const login = (name, password) => {
  return new Promise((resolve, reject) => {
    if (!name || !password) {
      return reject('用户名或密码错误')
    }
    try {
      const user = userList.find(item => {
        return item.name === name
      })
      if (password === user.password) {
        // console.log()  // hello
        return resolve({
          ...user,
          token: Buffer.from(JSON.stringify(user)).toString('base64')
        })
      } else {
        return reject('用户名或密码错误')
      }
    } catch (e) {
      return reject(e)
    }
  })
}
module.exports = login
