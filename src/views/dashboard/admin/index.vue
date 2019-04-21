<template>
  <div class="dashboard-editor-container">

    <panel-group :panel-data="panelData" @handleSetLineChartData="handleSetLineChartData"/>

    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <line-chart :chart-data="lineChartData"/>
    </el-row>
  </div>
</template>

<script>
import PanelGroup from './components/PanelGroup'
import LineChart from './components/LineChart'
import { getTradeInfoSR, getTradeInfoMC } from '@/api/trade'

export default {
  name: 'DashboardAdmin',
  components: {
    PanelGroup,
    LineChart
  },
  data() {
    return {
      panelData: {
        allCount: 9,
        rate: "44.44",
        successCount: 4
      },
      lineData: {
        countData: [],
        countAmtData: [],
        time: []
      },
      lineChartData: {
        countData: [130, 140, 141, 142, 145, 120, 130],
        countAmtData: [120, 82, 91, 104, 122, 130, 130],
        time: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      }
    }
  },
  created() {
    this.getTradeSuccessRate();
    this.getTradeMonthCount()
  },
  methods: {
    getTradeSuccessRate(query) {
      getTradeInfoSR(query).then(response => {
        const data = response.data
        if(data.code == 101) {
          if(data.data) {
            this.panelData = data.data
          }
        }
      }).catch (reason => {
        console.log(reason)
      })
    },
    getTradeMonthCount(query) {
      getTradeInfoMC(query).then(response => {
        const data = response.data
        console.log(data)
        if(data.code == 101) {
          if(data.data) {
            this.lineChartData.countData = [];
            this.lineChartData.countAmtData = [];
            this.lineChartData.time = [];

            for(var x in data.data) {
              this.lineChartData.countData.push( data.data[x].count )
              this.lineChartData.countAmtData.push( data.data[x].countAmt )
              this.lineChartData.time.push( data.data[x].time )
            }
            // this.lineData = data.data.map(item => {
            //   return {
            //     time: item.time
            //   }
            // })
            console.log('lineChartData', this.lineData)
          }
        }
      }).catch (reason => {
        console.log(reason)
      })
    },
    handleSetLineChartData(type) {
      this.lineChartData = lineChartData[type]
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}
</style>
