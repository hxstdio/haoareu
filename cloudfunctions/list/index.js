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
  const { pageNum = 1, pageSize = 2 } = event

  try{
    const countResult = await db.collection(openid).count()
    const total = countResult.total

    if (total === 0) {
      return {
        status: 'succ',
        originRet: countResult,
        pageNum: pageNum,
        pageSize: pageSize,
        totalPage: 0
      }
    }

    const totalPage = Math.ceil(total / pageSize)
    const dataSize = total > pageSize * pageNum ? pageSize : total
    const skip = (pageNum - 1) * pageSize
    console.log(`get list with pageNum:${pageNum}, pageSize:${pageSize}, skip:${skip}, limit:${dataSize}`)
    const result = await db.collection(openid)
      .skip(skip)
      .limit(dataSize)
      .get()

    return {
      status: 'succ',
      originRet: result,
      pageNum: pageNum,
      pageSize: pageSize,
      totalPage: totalPage
    }

  } catch(err) {
    console.log(`get fail with openid: ${openid}`, err)
    return {
      status: 'fail',
      originRet: err
    }
  }
}