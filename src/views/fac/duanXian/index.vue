<template>
  <div class="">
  <el-table :data="tableData" style="width: 100%">
    <el-table-column
      prop="all"
      label="设备编号"
      width="150">
    </el-table-column>
    <el-table-column label="状态">
      <el-table-column
      label="正常"
      prop="normal"
      width="150"
      ></el-table-column>
      <el-table-column
      label="警告"
      prop="warning"
      width="150"
      ></el-table-column>
      <el-table-column
      label="错误"
      prop="error"
      width="150"
      ></el-table-column>
    </el-table-column>
  </el-table>
  <br>
  <p>sss</p>
  <div class="block">
    <span class="demonstration">默认</span>
    <el-date-picker
      v-model="daterangeAcquisitionTime"
      style="width: 240px"
      type="datetimerange"
      value-format="yyyy-MM-dd HH:mm:ss"
      range-separator="-"
      start-placeholder="开始日期"
      end-placeholder="结束日期">
    </el-date-picker>
  </div>

  <p>sssff</p>
  <el-button @click="getList">ssdd</el-button>
  </div>
</template>

<script>
import {listSensor} from '@/api/fac/sensor'

export default {
  dicts: ['fac_sensor_type'],
  name:'duanxian',
  data() {
      return {
        tableData: [{
        }],
        daterangeAcquisitionTime:null,
        temperList: [],
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
          factoryName: null,
          type:'temper',
          time:null,
        },
        num:2

      }
    },
    methods:{ 
      getData(){
      },

      funn(){
        console.log('ss')
        this.$router.push({
          path:'/fac/network',
          query:{
            value:this.num
          }
      })
      },

      getList() {
        // this.loading = true;
        this.queryParams.params = {};
        if (null != this.daterangeAcquisitionTime && '' != this.daterangeAcquisitionTime) {
          this.queryParams.params["beginAcquisitionTime"] = this.daterangeAcquisitionTime[0];
          this.queryParams.params["endAcquisitionTime"] = this.daterangeAcquisitionTime[1];
        }
        listSensor(this.queryParams).then(response => {
          this.sensorList = response.rows;
          this.total = response.total;
          // this.loading = false;
          console.log(response)
        });
      },

    }
}

</script>

<style>

</style>