import Mock from 'mockjs'
import { param2Obj } from '@/utils'

const List = []
const merchList = []
const count = 50

for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    id: '@id',
    balance: '@float(1000, 99999, 0, 2)',
    fee: '@float(0, 0, 0, 2)',
    merchName: '@csentence(5)',
    signKey: '@guid'
  }))
}

for (let i = 0; i < 30; i++) {
  merchList.push(Mock.mock({
    id: '@increment()',
    merchName: '@csentence(5)'
  }))
}

export default {
  getMerchInfo: config => {
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
  getMerchList: config => {
    console.log('getMerchList', config);
    
    return {
      code: 101,
      data: merchList
    }
  }
}
