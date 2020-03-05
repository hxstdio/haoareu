// 云函数入口文件
const cloud = require('wx-server-sdk')

// 初始化 cloud
cloud.init({
  env: 'release-6ldlc'
})

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const { content, fileId, longitude, latitude, title, type, isPoi, city, temperature, weather } = event
  const wxContext = cloud.getWXContext()
  const openid = wxContext.OPENID

  try {
    const result = await db.collection(openid).add({
      data: {
        city,
        weather,
        temperature,
        content,
        fileId,
        poi: new db.Geo.Point(longitude, latitude),
        title: '',
        type,
        isPoi,
        createdTime: Date.now()
      }
    });

    return {
      status: 'succ',
      originRet: result
    }

  } catch (err) {
    console.log(`add-article failed with openid: ${openid}`, err)
    return {
      status: 'fail',
      originRet: err
    }
  }
}