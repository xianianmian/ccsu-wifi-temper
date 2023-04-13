<template>
  <!-- 这个文件的没用了，我测试用的 页面隐藏了 -->
  <div class="container">
    <div>
      <el-button @click="getStatus"> 断网</el-button>
      <el-button @click="Wiredata"> 断线的</el-button>
      <el-button @click="canshu"> 测试电压的</el-button>
      <el-button @click="voldata"> 测试电压数据的</el-button>
      <el-button @click="temperdata"> wendud的</el-button>
      <el-button @click="fun"> luoyou</el-button>
    </div>
    <div>
      <el-row>
        <el-col :span="8">
          <el-row>
            <div class="grid-content bg-purple  hei">
              <el-select v-model="value" placeholder="请选择">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </div>
            
          </el-row>
        </el-col>
        <el-col :span="16">
          <el-row>
            <el-col :span="12"><div class="grid-content bg-purple">
              xxxxxxxxxxxx 
            </div></el-col>
            <el-col :span="12"><div class="grid-content bg-purple">
              gggggggggg 
            </div></el-col>
            <el-col :span="12"><div class="grid-content bg-purple">
              xxxxxxxxxxxx 
            </div></el-col>
            <el-col :span="12"><div class="grid-content bg-purple">
              <div>
                <el-radio-group v-model="radio1" @change="abbb">
                  <el-radio-button label="上海"></el-radio-button>
                  <el-radio-button label="北京"></el-radio-button>
                  <el-radio-button label="广州"></el-radio-button>
                  <el-radio-button label="深圳"></el-radio-button>
                </el-radio-group>
              </div>
            </div></el-col>
          </el-row>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import {listNetWorkDect} from '@/api/fac/NetWorkDect'
import {listWireDect} from '@/api/fac/WireDect'
import { listSensor, getSensor, delSensor, addSensor, updateSensor } from "@/api/fac/sensor";

export default {
  created(){
  },
  name:'network',
  data(){
    return{
      options: [{
        value: '选项1',
        label: '黄金糕'
      }, {
        value: '选项2',
        label: '双皮奶'
      }, {
        value: '选项3',
        label: '蚵仔煎'
      }, {
        value: '选项4',
        label: '龙须面'
      }, {
        value: '选项5',
        label: '北京烤鸭'
      }],
      value: '',
      num:4,
      dataList:'',
      netWorkParamse:{
        beginAcquisitionTime: null,
        endAcquisitionTime: null,
        token:''
      },
      wireParamse:{
        beginAcquisitionTime: null,
        endAcquisitionTime: null,
        token:''
      },
      abab:['aaa','aaa','b','b','b'],
      wireList:'',
      Volparams:{ 
        beginAcquisitionTime: null,
        endAcquisitionTime: null,
        type:'voltage',
        deviceName: null,
        location: null,
        electrolyticellId: null,
        deviceStatus: null,
      },
      vol:null,


      queryParams: {
        pageNum: 1,
        pageSize: 10,
        value: null,
        type: null,
        acquisitionTime: null,
        thermocoupleId: null,
        thermocoupleName: null,
        thermocoupleLocation: null,
        deviceId: null,
        deviceName: null,
        electrolyticCellId: null,
        electrolyticCellName: null,
        workshopId: null,
        workshopName: null,
        factoryId: null,
        factoryName: null,
        type:null
      },
      radio1: '上海',
    }
  },
  methods:{

    fun(){
      // this.$router.push({ 
      //     path: '/fac/voltage',
      //     params:{
      //       time:this.time
      //     } 
      //   })
      var t = this.$moment().day(0).format('YYYY-MM-DD');
      console.log(t)
    },


    Wiredata(){
      this.wireParamse.params = {};
      this.wireParamse.params["beginAcquisitionTime"] = '2023-02-14 13:00:00'
      this.wireParamse.params["endAcquisitionTime"] = '2023-02-21 15:30:00'
      listWireDect(this.wireParamse).then((res)=>{
        console.log(res)
        this.wireList = res.data
        // this.wireList = chuliWireData()
      })
    },
    // chuliWireData(){
    //   let arr = []
    //   this.wireList.forEach((x,i)=>{
    //     let s = x.split(',')
    //     arr.push(s[0])
    //     s = []
    //   })
    //   console.log(arr)
    //   return arr
    // },
    ggg(){
      let tempArr = []
      let obj = []
      let resultArr = []
      this.abab.forEach((x,i)=>{
        if(!tempArr.includes(x)){tempArr.push(x)}
      })
      this.abab.forEach((v)=>{
        if(obj[v]){obj[v]++}else{obj[v]=1}
      })
      tempArr.forEach((x)=>{
        resultArr.push({id:x,num:obj[x]})
      })
      console.log(resultArr)
    },


    canshu(){
      this.getConfigKey('fac.net.time').then(response => {
            this.vol = response.msg;
            this.getPtime()
        });
    },
    getPtime(){
      var date = new Date()
      var y = date.getFullYear()
      var m = date.getMonth()
      var d = date.getDate()
      var h = date.getHours()
      var i = date.getMinutes()
      var s = date.getSeconds()
      var nowdate = this.parseTime(new Date(y,m,d,h,i-30,s),"{y}-{m}-{d} {h}:{i}:{s}")
      var agodate = this.parseTime(new Date(y,m,d,h,i-60,s),"{y}-{m}-{d} {h}:{i}:{s}")
      this.netWorkParamse.params = {};
      this.netWorkParamse.params["beginAcquisitionTime"] = nowdate
      this.netWorkParamse.params["endAcquisitionTime"] = agodate
      this.getStatus()

      // setInterval(()=>{
      //   nowdate = this.parseTime(new Date(),"{y}-{m}-{d} {h}:{i}:{s}")
      //   var dates = new Date()
      //   var ys = dates.getFullYear()
      //   var ms = dates.getMonth()
      //   var ds = dates.getDate()
      //   var hs = dates.getHours()
      //   var is = dates.getMinutes()
      //   var ss = dates.getSeconds()
      //   agodate = this.parseTime(new Date(ys,ms,ds,hs,is-30,ss),"{y}-{m}-{d} {h}:{i}:{s}")
      //   this.netWorkParamse.beginAcquisitionTime = nowdate
      //   this.netWorkParamse.endAcquisitionTime = agodate
      //   this.getStatus()
      //   },1000*6*this.vol)
      },
    getStatus(){
      listNetWorkDect(this.netWorkParamse).then((res)=>{
        console.log(res)
      })
    },

    //温度
    temperdata(){
      this.queryParams.type='temper'
      this.queryParams.params = {};
      this.queryParams.params["beginAcquisitionTime"] = '2023-02-14 13:00:00'
      this.queryParams.params["endAcquisitionTime"] = '2023-02-21 15:30:00'
      listSensor(this.queryParams).then((res)=>{
        console.log(res)

      })

    },
    voldata(){
      var date = new Date()
      var y = date.getFullYear()
      var m = date.getMonth()
      var d = date.getDate()
      var h = date.getHours()
      var i = date.getMinutes()
      var s = date.getSeconds()
      var nowdate = this.parseTime(new Date(y,m,d-1,h-1,i,s),"{y}-{m}-{d} {h}:{i}:{s}")
      var agodate = this.parseTime(new Date(y,m,d,h-1,i-60,s),"{y}-{m}-{d} {h}:{i}:{s}")
      this.queryParams.params = {};
      this.queryParams.params["beginAcquisitionTime"] = nowdate
      this.queryParams.params["endAcquisitionTime"] = agodate
      this.queryParams.type = 'voltage'
      listSensor(this.queryParams).then((res)=>{
        console.log(res)
        console.log('voltag')
      })
    },
    abbb(){
      console.log(this.radio1,'radio')
    }

  },
  mounted(){
    // console.log(this.$router,'value')
    // console.log(this.$router.currentRoute.query.value,'value')
    this.canshu()
    // this.num = this.$router.params.value
    // console.log(this.num,'num')
    // console.log('sss')
    // console.log(this.$router.name,'name')
  }
  
};
</script>
<style scoped>
  .el-row {
    margin-bottom: 20px;
  }
  .el-col {
    border-radius: 4px;
  }
  .bg-purple-dark {
    background: #99a9bf;
  }
  .bg-purple {
    background: #d3dce6;
  }
  .bg-purple-light {
    background: #e5e9f2;
  }
  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }
  .row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
  }
  .hei{
    height: 200%;
  }
</style>
