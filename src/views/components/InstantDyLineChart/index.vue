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
    <dy-line-chart :chart-data="chartData" chart-title="实时温度"></dy-line-chart>
  </div>
</template>

<script>
import DyLineChart from '@/views/dashboard/DyLineChart'

let data1 = {
  time: ['19:50', '19:55', '20:00', '20:05', '20:10', '20:15', '20:20'],
  temp1: [1, 3, 2, 4, 6, 5, 7],
  temp2: [7, 6, 5, 3, 4, 1, 2],
  temp3: [3, 4, 1, 2, 7, 6, 5],
  temp4: [7, 1, 2, 6, 5, 3, 4]
}
let data2 = {
  time: ['19:50', '19:55', '20:00', '20:05', '20:10', '20:15', '20:20'],
  temp1: [5, 2, 6, 1, 6, 3, 8],
  temp2: [1, 3, 5, 6, 7, 8, 8],
  temp3: [9, 8, 7, 5, 3, 2, 1],
  temp4: [3, 4, 3, 3, 4, 3, 4]
}
export default {
  components: { DyLineChart },
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
      chartData: {},

      dateTime: '',
      timer: null
    }
  },
  mounted() {
    this.chartData = data1
    this.getData()
  },
  methods: {
    handleChange(value) {
      console.log(value)
      if (this.value.includes('89118469')) {
        data1 = data2
        this.chartData = data1
        this.getData()
      } else if (this.value.includes('88796439')) {
        data1 = data2
        this.chartData = data1
        this.getData()
      } else {
        this.chartData = {}
      }
    },
    getData() {
      if (this.timer != null) {
        clearInterval(this.timer)
      }
      this.timer = setInterval(() => {
        this.dateTime = this.parseTime(new Date(), '{y}-{m}-{d} {h}:{i}:{s}')
        data1.temp1.push(+(Math.random() * 30 + 5).toFixed(1))
        data1.temp2.push(+(Math.random() * 10 + 5).toFixed(1))
        data1.temp3.push(+(Math.random() * 20 + 15).toFixed(1))
        data1.temp4.push(+(Math.random() * 15 + 10).toFixed(1))
        data1.time.push(this.parseTime(new Date(), '{h}:{i}:{s}'))
        if (data1.temp1.length > 10) data1.temp1.shift()
        if (data1.temp2.length > 10) data1.temp2.shift()
        if (data1.temp3.length > 10) data1.temp3.shift()
        if (data1.temp4.length > 10) data1.temp4.shift()
        if (data1.time.length > 10) data1.time.shift()
      }, 1000)
    }
  }
}
</script>

<style lang="scss" scoped>
.current_device {
  margin: 0 8px;
}
</style>
