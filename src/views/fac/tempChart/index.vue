<template>
  <div>
    <!-- 点击首页图表那个查询会到这  这里是温度图表  另外这里接受的首页传输的数据好像还有问题 -->
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
import {listSensor} from '@/api/fac/sensor'


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
      // value: ['2', '48484852'],
      value:[],
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
        pageSize: 100,
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
        factoryName: null,
        type:'temper'
      }
    }
  },
  created() {
    //这个地方接收首页传过来的数据好像有问题，试试其它方法。别的页面也是一样。this.$router.currentRoute.query
    if(this.$router.currentRoute.query.IdData !== undefined){
      this.queryParams.electrolyticCellId = this.$router.currentRoute.query.IdData.electrolyticCellId
      this.queryParams.deviceId = this.$router.currentRoute.query.IdData.deviceId
      this.queryParams.workshopId = this.$router.currentRoute.query.IdData.wordShopId
      }
  },
  mounted() {
    // this.handleQuery()
    this.initTime()
    this.getData()
  },
  methods: {
    
    initTime(){
      var date = new Date()
      var y = date.getFullYear()
      var m = date.getMonth()
      var d = date.getDate()
      var h = date.getHours()
      var i = date.getMinutes()
      var s = date.getSeconds()
      var nowdate = this.parseTime(new Date(),"{y}-{m}-{d} {h}:{i}:{s}")
      var agodate = this.parseTime(new Date(y,m,d,h,i-30,s),"{y}-{m}-{d} {h}:{i}:{s}")
      this.queryParams.params = {};
      this.queryParams.params["beginAcquisitionTime"] = nowdate
      this.queryParams.params["endAcquisitionTime"] = agodate
    },
    handleQuery() {
      // 设置参数
      if(this.value != undefined){
        this.value.forEach((item, index, arr) => {
          this.queryParams.electrolyticCellId = arr[0]
          this.queryParams.deviceId = arr[1]
          this.queryParams.workshopId = this.wordShopId
        })
      }
      //设置时间范围参数
      this.queryParams.params = {}
      if (this.daterangeAcquisitionTime.length != 0) {
        console.log('xuanzh')
        this.queryParams.params.beginAcquisitionTime = this.daterangeAcquisitionTime[0]
        this.queryParams.params.endAcquisitionTime = this.daterangeAcquisitionTime[1]
      }
      // this.initTime()
      console.log(this.queryParams,'参数')
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
      listSensor(this.queryParams).then(response=>{
        let chartList = response.rows
        // console.log(chartList,'huiying')
        chartList.forEach((item,index)=>{
          if(item.thermocoupleId == '1'){
            //这里用假数据填充图表，为了看效果，本来应该用以下注释的内容
            _chartData.time.push(this.parseTime(item.acquisitionTime, '{y}-{m}-{d} {h}:{i}:{s}'))//四个电解槽时间一样，取其一
            let random = Math.random(21-19)*10+21
            _chartData.temp1.push(random) 
            // _chartData.temp1.push(item.value) 
          }
          if(item.thermocoupleId == '2'){
            let random = Math.random(21-19)*10+21
            _chartData.temp1.push(random) 
            // _chartData.temp1.push(item.value) 
          }
          if(item.thermocoupleId == '3'){
            let random = Math.random(21-19)*10+21
            _chartData.temp1.push(random) 
            // _chartData.temp1.push(item.value) 
          }
          if(item.thermocoupleId == '4'){
            _chartData.temp4.push(item.value)
          }
        })
        //将临时变量数据赋值给图表数据
      this.chartData = _chartData
      // console.log(this.chartData)
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
