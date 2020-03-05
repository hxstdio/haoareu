// 云函数入口文件
const cloud = require('wx-server-sdk')

// 初始化 cloud
cloud.init({
  env: 'release-6ldlc'
})

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const { content, nick, avatarUrl } = event
  const wxContext = cloud.getWXContext()
  // const openid = wxContext.OPENID
  const collectionName = 'TODO' + '_message'

  try {
    const result = await db.collection(collectionName).add({
      data: {
        nick,
        content,
        avatarUrl,
        createdTime: Date.now()
      }
    });

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