<template>
  <div>
    <div class="">
      <span class="current_device">当前设备</span>
      <el-cascader
        v-model="value"
        :options="options"
        :props="{ expandTrigger: 'hover' }"
        @change="handleChange(value)"
      ></el-cascader>
    </div>
    <history-line-chart :chart-data="chartData" chart-title="历史温度"></history-line-chart>
  </div>
</template>

<script>
import HistoryLineChart from '@/views/dashboard/HistoryLineChart'

const data1 = {
  time: ['19:50', '19:55', '20:00', '20:05', '20:10', '20:15', '20:20'],
  temp1: [1, 3, 2, 4, 6, 5, 7],
  temp2: [7, 6, 5, 3, 4, 1, 2],
  temp3: [3, 4, 1, 2, 7, 6, 5],
  temp4: [7, 1, 2, 6, 5, 3, 4]
}
const data2 = {
  time: ['19:50', '19:55', '20:00', '20:05', '20:10', '20:15', '20:20'],
  temp1: [5, 2, 6, 1, 6, 3, 8],
  temp2: [1, 3, 5, 6, 7, 8, 8],
  temp3: [9, 8, 7, 5, 3, 2, 1],
  temp4: [3, 4, 3, 3, 4, 3, 4]
}
export default {
  components: { HistoryLineChart },
  data() {
    return {
      //级联选择器
      value: ['1', '89118469'],
      options: [{
        value: '1',
        label: '一号电解槽',
        children: [{
          value: '89118469',
          label: '一号设备'
        }, {
          value: '88796439',
          label: '二号设备'
        }, {
          value: '41706553465497',
          label: '三号设备'
        }, {
          value: '92106549165495',
          label: '四号设备'
        }, {
          value: '2047215865496',
          label: '五号设备'
        }]
      }, {
        value: '2',
        label: '二号电解槽',
        children: []
      }],
      //图表
      chartData: {}
    }
  },
  mounted() {
    this.chartData = data1
  },
  methods: {
    handleChange(value) {
      console.log(value)
      if (this.value.includes('89118469')) {
        this.chartData = data1
      } else if (this.value.includes('88796439')) {
        this.chartData = data2
      } else {
        this.chartData = {}
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.current_device {
  margin: 0 8px;
}
</style>
