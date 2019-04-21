import Mock from 'mockjs'
import { param2Obj } from '@/utils'

const List = []
const count = 50

for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    merchOrderId: '@guid()',
    accountName: '@name()',
    amt: '@float(1000, 99999, 0, 2)',
    dealTime: +Mock.Random.date('T'),
    dealType: '@integer(0, 1)',
    status: '@integer(0, 1)',
    merchName: '@name()',
  }))
}

export default {
  getTradeInfo: config => {
    const { page = 1, limit = 30 } = param2Obj(config.url)

    const mockList = List.filter(item => {
      return true
    })

    const pageList = mockList.filter((item, index) => index < limit * page && index >= limit * (page - 1))

    return {
      code: 101,
      data: {
        count: mockList.length,
        bizContent: pageList
      }
    }
  },
  getTradeInfoSR: config => {
    return {
      code: 101,
      data: {
        allCount: 9,
        rate: "44.44",
        successCount: 4
      }
    }
  },
  getTradeInfoMC: config => {
    return {
      code: 101,
      data: [
        {
          count: 3,
          countAmt: 4.9,
          time: '2018-12-01'
        },
        {
          count: 9,
          countAmt: 9.9,
          time: '2018-12-02'
        },
        {
          count: 2,
          countAmt: 1.9,
          time: '2018-12-03'
        }
      ]
    }
  }
}
