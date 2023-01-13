<template>
  <div>
    <div class="">
      <span class="current_device">当前设备：</span>
      <el-cascader
        v-model="value"
        :options="options"
        filterable
        clearable
      ></el-cascader>
      <span class="current_device">日期范围：</span>
      <el-date-picker
        v-model="daterangeAcquisitionTime"
        style="width: 240px"
        value-format="yyyy-MM-dd HH:mm:ss"
        type="datetimerange"
        range-separator="-"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
      ></el-date-picker>
      <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
    </div>
    <history-line-chart-single :chart-data="{time:chartData.time,temp:chartData.temp1}" chart-title="热电偶1" class-name="his1"
    ></history-line-chart-single>
    <history-line-chart-single :chart-data="{time:chartData.time,temp:chartData.temp2}" chart-title="热电偶2" class-name="his2"
    ></history-line-chart-single>
    <history-line-chart-single :chart-data="{time:chartData.time,temp:chartData.temp3}" chart-title="热电偶3" class-name="his3"
    ></history-line-chart-single>
    <history-line-chart-single :chart-data="{time:chartData.time,temp:chartData.temp4}" chart-title="热电偶4" class-name="his4"
    ></history-line-chart-single>
  </div>
</template>

<script>
import HistoryLineChartSingle from '@/views/dashboard/HistoryLineChartSingle'
import { listTemper } from '@/api/fac/temper'

export default {
  components: { HistoryLineChartSingle },
  props: {
    wordShopId: {
      type: String,
      require: true
    }
  },
  data() {
    return {
      //级联选择器
      value: ['2', '48484852'],
      options: [{
        value: '1',
        label: '一号电解槽',
        children: [{
          value: '48484849',
          label: '一号设备'
        }, {
          value: '48484850',
          label: '二号设备'
        }, {
          value: '48484851',
          label: '三号设备'
        }]
      }, {
        value: '2',
        label: '二号电解槽',
        children: [{
          value: '48484852',
          label: '四号设备'
        }]
      }],
      singleChartData: {
        time: [],
        temp: []
      },
      //图表
      chartData: {
        time: [],
        temp1: [],
        temp2: [],
        temp3: [],
        temp4: []
      },
      // 时间范围
      daterangeAcquisitionTime: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 800,
        deviceId: null,//this.value[0]
        electrolyticCellId: null,//this.value[1]
        workshopId: null,//组件传参（由首页传入）this.wordShopId
        temp: null,
        acquisitionTime: null,
        beginAcquisitionTime: null,
        endAcquisitionTime: null,
        thermocoupleId: null,
        thermocoupleName: null,
        thermocoupleLocation: null,
        deviceName: null,
        electrolyticCellName: null,
        workshopName: null,
        factoryId: null,
        factoryName: null
      }
    }
  },
  created() {
    if (this.$route.params.value !== undefined) {
      this.queryParams.deviceId = this.$route.params.value
    }
  },
  mounted() {
    this.handleQuery()
  },
  methods: {
    handleQuery() {
      // 设置参数
      this.value.forEach((item, index, arr) => {
        this.queryParams.electrolyticCellId = arr[0]
        this.queryParams.deviceId = arr[1]
        this.queryParams.workshopId = this.wordShopId
      })
      //设置时间范围参数
      this.queryParams.params = {}
      if (null != this.daterangeAcquisitionTime && '' !== this.daterangeAcquisitionTime) {
        this.queryParams.params.beginAcquisitionTime = this.daterangeAcquisitionTime[0]
        this.queryParams.params.endAcquisitionTime = this.daterangeAcquisitionTime[1]
      }
      //调用查询接口
      this.getData()
    },
    getData() {
      let _chartData = {//临时变量（图表数据）
        time: [],
        temp1: [],
        temp2: [],
        temp3: [],
        temp4: []
      }
      // 执行请求，拿到数据
      listTemper(this.queryParams).then(res => {
        // 遍历 处理需要的图表数据
        let list = res.rows.forEach((item, index, arr) => {
          if (arr[index].thermocoupleId === '1') {
            _chartData.time.push(this.parseTime(arr[index].acquisitionTime, '{y}-{m}-{d} {h}:{i}:{s}'))//四个电解槽时间一样，取其一
            _chartData.temp1.push(arr[index].temp)
          } else if (arr[index].thermocoupleId === '2') {
            _chartData.temp2.push(arr[index].temp)
          } else if (arr[index].thermocoupleId === '3') {
            _chartData.temp3.push(arr[index].temp)
          } else if (arr[index].thermocoupleId === '4') {
            _chartData.temp4.push(arr[index].temp)
          }
        })
      })
      //将临时变量数据赋值给图表数据
      this.chartData = _chartData
    }
  }
}
</script>

<style lang="scss" scoped>
.current_device {
  margin: 0 8px;
}
</style>
