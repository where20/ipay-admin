<template>
  <div class="app-container">
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item label="">
        <el-input v-model="formInline.merchOrderId" placeholder="交易流水" style="width: 150px;" clearable></el-input>
      </el-form-item>
      <el-form-item label="" v-if="role === '0'?true:false"> 
        <el-select v-model="formInline.merchId" placeholder="交易商户" style="width: 150px;" clearable>
          <el-option v-for="(item, i) in merchList" :key="i" :label="item.merchName" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="">
        <el-date-picker
          v-model="formInline.time"
          type="datetimerange"
          value-format="timestamp"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="交易类型">
        <el-select v-model="formInline.dealType" placeholder="请选择" style="width: 150px;" clearable>
          <el-option v-for="(item, i) in dealTypeArr" :label="item.label" :value="item.value" :key="i"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="交易状态">
        <el-select v-model="formInline.status" placeholder="请选择" style="width: 150px;" clearable>
          <el-option v-for="(item, i) in statusArr" :label="item.label" :value="item.value" :key="i"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="success" @click="onSubmit">查询</el-button>
        <!-- <el-button type="primary" @click="onSubmit">添加订单</el-button>
        <el-button type="danger" @click="onSubmit">批量删除</el-button> -->
      </el-form-item>
    </el-form>
    <el-table
      v-loading="listLoading"
      ref="multipleTable"
      :data="list"
      element-loading-text="拼命加载中"
      border
      fit
      highlight-current-row
      @selection-change="handleSelectionChange">
      <el-table-column align="center" label="序号" width="50">
        <template slot-scope="scope">
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="账户名称">
        <template slot-scope="scope">
          {{ scope.row.accountName }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="交易流水">
        <template slot-scope="scope">
          {{ scope.row.merchOrderId }}
        </template>
      </el-table-column>
      <el-table-column label="交易金额" align="center">
        <template slot-scope="scope">
          {{ scope.row.amt }}
        </template>
      </el-table-column>
      <el-table-column label="交易类型" align="center">
        <template slot-scope="scope">
          {{ dealTypeArr[scope.row.dealType].label }}
        </template>
      </el-table-column>
      <el-table-column label="交易状态" align="center">
        <template slot-scope="scope">
          <span :class="statusArr[scope.row.status].value == 0? 'danger':'success'"> {{ statusArr[scope.row.status].label }} </span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="交易时间" width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.dealTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="交易商户名称" v-if="role === '0'?true:false">
        <template slot-scope="scope">
          <span>{{ scope.row.merchName }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column align="center" label="操作" width="150">
        <template slot-scope="scope">
          <el-button size="small" type="primary">编辑</el-button>
          <el-button size="small" type="danger">删除</el-button>
        </template>
      </el-table-column> -->
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" @pagination="getList" />
  </div>
</template>

<script>
import { getRole } from '@/utils/auth' // 验权
import { getTradeInfo } from '@/api/trade'
import { getMerchList } from '@/api/merch'
import Pagination from '@/components/Pagination'

export default {
  name: 'Trade',
  components: { Pagination },
  data() {
    return {
      role: null,
      dealTypeArr: [
        {
          value: 0,
          label: '支付宝-扫码'
        },
        {
          value: 1,
          label: '支付宝-WAP'
        }
      ],
      statusArr: [
        {
          value: 0,
          label: '未支付'
        },
        {
          value: 1,
          label: '已支付'
        }
      ],
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1
      },
      list: [],
      multipleSelection: [],
      formInline: {
        merchOrderId: '',
        merchId: '',
        dealType: '',
        dealStartTime: '',
        dealEndTime: '',
        time: '',
        status: ''
      },
      merchList: []
    }
  },
  created() {
    // console.log(getOrderList());
    this.role = getRole();
    if(this.role === '0') {
      this.getMerchList();
    }
    this.getList();
  },
  methods: {
    getList(query) {
      // var self = this;
      this.listLoading = true
      getTradeInfo(query).then(response => {
        console.log('getTradeInfo', response.data)
        const data = response.data
        if(data.code == 101) {
          this.list = data.data.bizContent
          this.total = data.data.count
          this.listLoading = false
        }
      }).catch (reason => {
        console.log(reason)
      })
    },
    getMerchList(query) {
      getMerchList(query).then(response => {
        console.log('getMerchList', response.data)
        const data = response.data
        if(data.code == 101) {
          this.merchList = data.data
        }
      }).catch (reason => {
        console.log(reason)
      })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    onSubmit() {
      console.log('submit!', this.formInline);
      this.getList({
        merchOrderId: this.formInline.merchOrderId,
        merchId: this.formInline.merchId,
        dealType: this.formInline.dealType,
        status: this.formInline.status,
        dealStartTime: this.formInline.time === null? '':this.formInline.time[0],
        dealEndTime: this.formInline.time === null? '':this.formInline.time[1]
      })
    }
  }
}
</script>
<style>
  .success{
    color: #67C23A;
  }
  .danger{
    color: #F56C6C;
  }
</style>

