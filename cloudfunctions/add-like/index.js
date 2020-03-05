// 云函数入口文件
const cloud = require('wx-server-sdk')

// 初始化 cloud
cloud.init({
  env: 'release-6ldlc'
})

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const { id } = event
  const wxContext = cloud.getWXContext()
  const openid = wxContext.OPENID

  try {
    const result = await db.collection(openid).doc(id).update({
      data: {
        likes: db.command.inc(1)
      },
    })

    return {
      status: 'succ',
      originRet: result
    }

  } catch (err) {
    console.log(`add-like failed with id: ${id}`, err)
    return {
      status: 'fail',
      originRet: err
    }
  }
}