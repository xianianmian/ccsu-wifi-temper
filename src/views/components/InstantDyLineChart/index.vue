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
import {getWorkshop} from '@/api/fac/workshop';
import {listDevice} from '@/api/fac/device';
import {listCell} from '@/api/fac/cell'

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
      tempList1:[],
      optionsObj:{
        value:null,
        label:null,
        children:[]
      },
      options:[],
      //图表
      chartData: {},

      dateTime: '',
      timer: null
    }
  },
  mounted() {
    this.chartData = data1
    this.getData()
    this.getDevicedata()
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
    },
    getDevicedata(){
      let workShopId = 1
      getWorkshop(workShopId)
      .then(res=>{
        this.tempList1 = res.data.facElectrolyticCellList
      })
      .then(res=>{
        this.tempList1.forEach(x=>{
          listDevice(x.electrolyticcellId).then(response=>{
            var tempobj={value:null,label:null,children:[]}
            this.optionsObj.value=x.electrolyticcellId
            this.optionsObj.label=x.electrolyticcellName
            response.rows.forEach(y=>{
              var tempchild={value:null,label:null}
              var temp=tempchild
              tempchild.value=y.deviceId
              tempchild.label=y.deviceName
              if(y.electrolyticellId === x.electrolyticcellId){
                this.optionsObj.children.push(tempchild)
              }
              tempchild=temp
            })
            this.options.push(this.optionsObj)
            this.optionsObj=tempobj
          })
          // console.log(this.options)
        })
      })
      listCell(this.tempList1).then(res=>{
        // console.log(res.rows)
      })
    },
  }
}
</script>

<style lang="scss" scoped>
.current_device {
  margin: 0 8px;
}
</style>

