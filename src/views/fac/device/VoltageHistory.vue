<template>
  <!-- 点击历史数据 展示的电压图 -->
  <div>
    <el-dialog  :visible.sync="dialogVisible">
      <span class="current_device">日期范围：</span>
      <el-date-picker
        v-model="daterangeAcquisitionTime"
        style="width: 300px"
        value-format="yyyy-MM-dd HH:mm:ss"
        type="datetimerange"
        range-separator="-"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
      ></el-date-picker>
      <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
      <h1>{{ this.deviceId }}</h1>
      <br>
      <br>
      <br>
      <br>
      <div style="width: 100%; height: 500px" id="voltage"></div>
    </el-dialog>
  </div>
</template>

<script>
import echarts from "echarts";
import {listSensor} from '@/api/fac/sensor'

export default {
  props:['deviceId','historyNowTime','historyAgoTime','workShopId'],
    data() {
      return {
        dialogVisible:false,
        chart: null,
        ListData: [],
        VoltageData: [],
        daterangeAcquisitionTime: [],
        temperList: [],
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 100,
          deviceId: null, //this.value[0]
          electrolyticCellId: null, //this.value[1]
          workShopId: null, //组件传参（由首页传入）this.wordShopId
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
          type: "voltage",
        },
        Xtime:[],
      }
    },
    methods: {
      openDialog(){
        this.dialogVisible=true
      },
      handleQuery(){
        // console.log(this.daterangeAcquisitionTime)
        if(this.daterangeAcquisitionTime.length != 0){
          this.queryParams.params = {}
          this.queryParams.params.beginAcquisitionTime = this.daterangeAcquisitionTime[0]
          this.queryParams.params.endAcquisitionTime = this.daterangeAcquisitionTime[1]
        }
        
        this.getList()
        this.showChart()
      },
      getList() {
        this.queryParams.workShopId = this.workShopId
      listSensor(this.queryParams).then(response => {
        // console.log('电压具体数据')
        this.ListData = response.rows
        // console.log(this.ListData,'volData')
        this.ListData.forEach((res)=>{
          if(res.deviceId == this.deviceId){
            // res.value == 'null' ? this.VoltageData.push('0.13') : this.VoltageData.push(res.value)
            res.value == 'null' ? this.VoltageData.push('0.13') : this.VoltageData.push(res.value)
            this.Xtime.push(res.acquisitionTime)
          }
        })
        // console.log(this.VoltageData)
        this.showChart()
      });
    },
    showChart() {
      this.chart = echarts.init(document.getElementById("voltage"));
      this.charpeizhi(this.VoltageData,this.Xtime,this.deviceId);
    },
    charpeizhi(VoltageData,Xtime ) {
      this.chart.setOption({
        title: {
          text: '历史电压'
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
          },
          padding: [5, 10],
        },
        grid: {
          left: 10,
          right: 10,
          bottom: 20,
          top: 80,
          containLabel: true,
        },
        xAxis: {
          data: Xtime,
          boundaryGap: false,
          axisTick: {
            show: false,
          },
        },
        yAxis: {
          axisTick: {
            show: false,
          },
          // scale: true,
          type:'value'
        },
        series: [
          {
            name: "电压值",
            itemStyle: {
              normal: {
                color: "#FF005A",
                lineStyle: {
                  color: "#FF005A",
                  width: 2,
                },
              },
            },
            smooth: true,
            type: "line",
            data: VoltageData,
            markPoint: {
              data: [
                { type: "max", name: "最大值" },
                { type: "min", name: "最小值" },
              ],
            },
          },
        ],
      });
    },
    },
    watch:{
      dialogVisible:{
        handler(old,newValue){
          if(newValue == false){
            this.VoltageData = []
            this.Xtime = []
          }
        }
      },
      workShopId:{
        handler(val){
          this.queryParams.workShopId = val
        }
      }
    },
    mounted(){
      this.queryParams.params = {};
      this.queryParams.params["beginAcquisitionTime"] = this.historyNowTime
      this.queryParams.params["endAcquisitionTime"] = this.historyAgoTime
      this.queryParams.workShopId = this.workShopId
      this.getList()
      this.$nextTick(function(){
        this.showChart()
      })
      
    },
    
}
</script>

<style>

</style>