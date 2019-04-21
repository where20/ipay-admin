<template>
  <el-row :gutter="40" class="panel-group">
    <el-col :xs="12" :sm="12" :lg="8" class="card-panel-col">
      <div class="card-panel">
        <div class="card-panel-icon-wrapper icon-success">
          <svg-icon icon-class="success" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">成功笔数</div>
          <div class="card-panel-num"> {{ panelData.successCount }} </div>
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="8" class="card-panel-col">
      <div class="card-panel">
        <div class="card-panel-icon-wrapper icon-total">
          <svg-icon icon-class="total" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">总笔数</div>
          <div class="card-panel-num"> {{ panelData.allCount }} </div>
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="8" class="card-panel-col">
      <div class="card-panel">
        <div class="card-panel-icon-wrapper icon-probability">
          <svg-icon icon-class="probability" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">成功率</div>
          <div class="card-panel-num"> {{ panelData.rate + '%' }} </div>
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script>
export default {
  props: {
    panelData: {
      type: Object,
      required: true
    }
  },
  created() {
    // console.log('panelData', this.panelData)
  },
  methods: {
    handleSetLineChartData(type) {
      this.$emit('handleSetLineChartData', type)
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.panel-group {
  margin-top: 18px;
  .card-panel-col{
    margin-bottom: 32px;
  }
  .card-panel {
    height: 108px;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
    border-color: rgba(0, 0, 0, .05);
    &:hover {
      .card-panel-icon-wrapper {
        color: #fff;
      }
      .icon-success {
        background: #40c9c6;
      }
      .icon-total {
        background: #36a3f7;
      }
      .icon-probability {
        background: #f4516c;
      }
    }
    .icon-success {
      color: #40c9c6;
    }
    .icon-total {
      color: #36a3f7;
    }
    .icon-probability {
      color: #f4516c;
    }
    .card-panel-icon-wrapper {
      float: left;
      margin: 14px 0 0 14px;
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }
    .card-panel-icon {
      float: left;
      font-size: 48px;
    }
    .card-panel-description {
      float: right;
      font-weight: bold;
      margin: 26px;
      margin-left: 0px;
      .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 16px;
        margin-bottom: 12px;
      }
      .card-panel-num {
        font-size: 20px;
      }
    }
  }
}
</style>
