// 云函数入口文件
const cloud = require('wx-server-sdk')

// 初始化 cloud
cloud.init({
  env: 'release-6ldlc'
})

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const openid = wxContext.OPENID

  try {
    const ret = await db.createCollection(openid)
    if (ret && ret.errorCode) {
      console.log(`createCollection fail with openid: ${openid}`, ret)
      return {
        status: 'fail',
        originRet: ret
      }
    } else {
      console.log(`createCollection succfully with openid: ${openid}`)
      return {
        status: 'succ',
        originRet: ret
      }
    }
  } catch(err) {
    console.log(`createCollection fail with openid: ${openid}`, err)
    return {
      status: 'fail',
      originRet: err
    }
  }
}