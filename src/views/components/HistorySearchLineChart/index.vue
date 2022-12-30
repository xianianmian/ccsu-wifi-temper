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
import { listTemper } from '@/api/fac/temper'

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
  props: {
    wordShopId: {
      type: String,
      require: true
    }
  },
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
      chartData: {
        time: [],
        temp1: [],
        temp2: [],
        temp3: [],
        temp4: []
      },

      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 40,
        deviceId: null,//this.value[0]
        electrolyticCellId: null,//this.value[1]
        workshopId: null,//组件传参（由首页传入）this.wordShopId
        temp: null,
        acquisitionTime: null,
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
  mounted() {
    this.chartData = data1
  },
  methods: {
    handleChange() {
      // 设置参数
      this.value.forEach((item, index, arr) => {
        this.queryParams.electrolyticCellId = arr[0]
        this.queryParams.deviceId = arr[1]
        this.queryParams.workshopId = this.wordShopId
      })
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
        console.log('listTemper >>', res.rows)
        // 遍历 处理需要的图表数据
        let list = res.rows.forEach((item, index, arr) => {
          console.log(arr[index].thermocoupleId)
          if (arr[index].thermocoupleId === '1') {
            _chartData.time.push(this.parseTime(arr[index].acquisitionTime, '{h}:{i}:{s}'))//四个电解槽时间一样，取其一
            _chartData.temp1.push(arr[index].temp)
            console.log(1)
          } else if (arr[index].thermocoupleId === '2') {
            _chartData.temp2.push(arr[index].temp)
            console.log(2)
          } else if (arr[index].thermocoupleId === '3') {
            _chartData.temp3.push(arr[index].temp)
            console.log(3)
          } else if (arr[index].thermocoupleId === '4') {
            _chartData.temp4.push(arr[index].temp)
            console.log(4)
          }
        })
        console.log('____', _chartData)
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
