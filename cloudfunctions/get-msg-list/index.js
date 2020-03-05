// 云函数入口文件
const cloud = require('wx-server-sdk')

// 初始化 cloud
cloud.init({
  env: 'release-6ldlc'
})

const db = cloud.database()
const MAX_LIMIT = 50

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  // const openid = wxContext.OPENID
  const openid = 'TODO'
  const collectionName = openid + '_message'

  try {
    const countResult = await db.collection(collectionName).count()
    const total = countResult.total

    if (total === 0) {
      return {
        status: 'succ',
        originRet: countResult,
        total: 0,
      }
    }

    const batchTimes = Math.ceil(total / MAX_LIMIT)
    const tasks = []
    for (let i = 0; i < batchTimes; i++) {
      const promise = db.collection(collectionName)
        .skip(i * MAX_LIMIT)
        .limit(MAX_LIMIT)
        .field({
          _id: true,
          nick: true,
          content: true,
          avatarUrl: true
        })
        .get()
      tasks.push(promise)
    }

    const result = (await Promise.all(tasks)).reduce((acc, cur) => {
      return {
        data: acc.data.concat(cur.data),
        errMsg: acc.errMsg,
      }
    })

    return {
      status: 'succ',
      originRet: result,
      total: total
    }
  } catch (err) {
    console.log(`get-msg-list fail with openid: ${openid}`, err)
    return {
      status: 'fail',
      originRet: err,
      total: -1
    }
  }
}