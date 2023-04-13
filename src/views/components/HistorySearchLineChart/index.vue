<template>
  <!-- 首页的 图表 -->
  <div>
    <div class="">
      <span class="current_device" style="color: white;">当前设备</span>
      <el-cascader
        v-model="value"
        :options="options"
        filterable
        clearable
        @visible-change="refreshOptions($event)"
        @change="handleChange(value)"
      ></el-cascader>
      <el-button @click="routerTo()" type="primary">
        查询
      </el-button>
    </div>
    <history-line-chart 
    :Xtime="this.Xtime" 
    chart-title="历史温度"
    :temperData="this.temperData"
    :chartData="this.chartData"
    >
  </history-line-chart>
  </div>
</template>

<script>
import HistoryLineChart from '@/views/dashboard/HistoryLineChart'
import { getWorkshop } from '@/api/fac/workshop'
import { listDevice } from '@/api/fac/device'
import { listCell } from '@/api/fac/cell'
import {listSensor} from '@/api/fac/sensor'



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
      value: ['1', '48484851'],
      options: [],
      //图表
      chartData: {
        Xtime:[],
        temperData:[]
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
        factoryName: null,
        type:'temper'
      },
      listData:[],
      temperData:[],
      Xtime:[],
      IdData:{
        electrolyticCellId:'',
        deviceId:'',
        wordShopId:''
      }
    }
  },
  mounted() {
    this.handleChange()
  },
  watch:{
    wordShopId:{
      deep:true,
      handler(val){
        // console.log(val,'dsf')
        this.queryParams.workshopId = val
      }
    }
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
      // console.log(this.wordShopId,'workshpid')
      this.IdData.electrolyticCellId = this.queryParams.electrolyticCellId
      this.IdData.deviceId = this.queryParams.deviceId
      this.IdData.workshopId = this.queryParams.workshopId
      //调用查询接口
      this.getData()
    },
    routerTo() {
      if(this.IdData !== undefined){
          this.$router.push({
            path: '/fac/tempChart',
            query: {
              IdData:this.IdData
            }
          })
      }

    },
    getData() {
      // 为了展示，这里用了死数据
    var date = new Date()
    var y = date.getFullYear()
    var m = date.getMonth()
    var d = date.getDate()
    var h = date.getHours()
    var i = date.getMinutes()
    var s = date.getSeconds() 
    var nowdate = this.parseTime(new Date(y,m,d,h,i-30,s),"{y}-{m}-{d} {h}:{i}:{s}")
    var agodate = this.parseTime(new Date(y,m,d,h-1,i-30,s),"{y}-{m}-{d} {h}:{i}:{s}")
    //   this.queryParams.params = {};
    //   this.queryParams.params["beginAcquisitionTime"] = nowdate
    // this.queryParams.params["endAcquisitionTime"] = agodate
      this.queryParams.params = {};
      this.queryParams.params["beginAcquisitionTime"] = '2023-03-06 15:44:43'
    this.queryParams.params["endAcquisitionTime"] = '2023-03-08 15:44:43'

    // console.log(this.queryParams)
      listSensor(this.queryParams).then((res)=>{
        // console.log(res)
        this.listData = res.rows
        this.listData.forEach((x,i)=>{
          if(x.deviceId == this.queryParams.deviceId ){
            this.Xtime.push(x.acquisitionTime)
            // x.value == '1023' ? this.temperData.push('0') : this.temperData.push(x.value)
            let random = Math.random(21-18)*10+21
            x.value == '1023' ? this.temperData.push(random) : this.temperData.push(x.value)
          }
        })
        this.chartData.Xtime = Array.from(new Set(this.Xtime))
        this.chartData.temperData = this.temperData
        console.log(this.Xtime,'Xtime',this.temperData)
      })
    },
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
