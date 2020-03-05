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
  // const openid = wxContext.OPENID
  const openid = 'TODO'
  const id = event.id

  try{
    const result = await db.collection(openid)
      .doc(id)
      .get()

    return {
      status: 'succ',
      originRet: result
    }
  } catch (err) {
    return {
      status: 'fail',
      originRet: err
    }
  }
}