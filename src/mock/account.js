import Mock from 'mockjs'
import { param2Obj } from '@/utils'

const List = []
const count = 50

for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    id: '@id',
    accountUserId: '@id',
    accountType: '@integer(1, 2)',
    account: '@integer(10000, 99999)',
    accountPassword: '@natur()',
    transportToken: '@guid()',
    hasQr: '@integer(1, 2)',
    status: '@integer(0, 1)',
    merchName: '@name()'
  }))
}

export default {
  getAccount: config => {
    const { page = 1, limit = 10 } = param2Obj(config.url)

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
  }
}
