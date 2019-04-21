import Mock from 'mockjs'
import { param2Obj } from '@/utils'

const List = []
const count = 50

for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    id: '@id',
    username: '@cname',
    nickName: '@name',
    merchName: '@name',
    email: '@email',
    telegram: '182@integer(10000000, 99999999)',
    phone: '0755-@integer(1000000, 9999999)',
    role: '@integer(1, 2)'
  }))
}

export default {
  getUser: config => {
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
