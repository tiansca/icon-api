const userDB = require('../utils/userDb')
const login = (name, password) => {
  return new Promise(async (resolve, reject) => {
    if (!name || !password) {
      return reject('用户名或密码错误')
    }
    try {
      // 判断用户名是否存在
      const isExists = await userDB.exists(`/${name}`)
      if (!isExists) {
        return reject('用户名或密码错误')
      }
      // 查找用户
      const user = await userDB.getData(`/${name}`)
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
