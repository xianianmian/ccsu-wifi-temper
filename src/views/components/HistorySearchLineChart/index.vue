<template>
  <div>
    <div class="">
      <span class="current_device">当前设备</span>
      <el-cascader
        v-model="value"
        :options="options"
        filterable
        clearable
        @visible-change="refreshOptions($event)"
        @change="handleChange(value)"
      ></el-cascader>
      <el-button @click="routerTo()">
        查询
      </el-button>
    </div>
    <history-line-chart :chart-data="chartData" chart-title="历史温度"></history-line-chart>
  </div>
</template>

<script>
import HistoryLineChart from '@/views/dashboard/HistoryLineChart'
import { listTemper } from '@/api/fac/temper'
import { getWorkshop } from '@/api/fac/workshop'
import { listDevice } from '@/api/fac/device'
import { listCell } from '@/api/fac/cell'

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
      tempList1: [],
      optionsObj: {
        value: null,
        label: null,
        children: []
      },
      value: ['1', '48484849'],
      options: [],
      //级联选择器
      // options: [{
      //   value: '1',
      //   label: '一号电解槽',
      //   children: [{
      //     value: '48484849',
      //     label: '一号设备'
      //   }, {
      //     value: '48484850',
      //     label: '二号设备'
      //   }, {
      //     value: '48484851',
      //     label: '三号设备'
      //   }]
      // }, {
      //   value: '2',
      //   label: '二号电解槽',
      //   children: [{
      //     value: '48484852',
      //     label: '四号设备'
      //   }]
      // }],
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
    this.handleChange()
  },
  methods: {
    refreshOptions() {
      this.options = []
      this.getDevicedata()
    },
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
    routerTo() {
      this.$router.push({
        path: '/fac/tempChart',
        params: {
          id:this.queryParams.deviceId
        }
      })
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
            _chartData.time.push(this.parseTime(arr[index].acquisitionTime, '{h}:{i}:{s}'))//四个电解槽时间一样，取其一
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
    ,
    getDevicedata() {
      let workShopId = this.wordShopId
      getWorkshop(workShopId)
        .then(res => {
          this.tempList1 = res.data.facElectrolyticCellList
        })
        .then(res => {
          this.tempList1.forEach(x => {
            listDevice(x.electrolyticcellId).then(response => {
              var tempobj = { value: null, label: null, children: [] }
              this.optionsObj.value = x.electrolyticcellId
              this.optionsObj.label = x.electrolyticcellName
              response.rows.forEach(y => {
                var tempchild = { value: null, label: null }
                var temp = tempchild
                tempchild.value = y.deviceId
                tempchild.label = y.deviceName
                if (y.electrolyticellId === x.electrolyticcellId) {
                  this.optionsObj.children.push(tempchild)
                }
                tempchild = temp
              })
              this.options.push(this.optionsObj)
              this.optionsObj = tempobj
            })
          })
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.current_device {
  margin: 0 8px;
}
</style>
