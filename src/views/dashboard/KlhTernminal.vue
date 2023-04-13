<template>
  <!-- 首页的东西 -->
  <div  @click="checkDianYa">
    <el-card class="box-card" shadow="never">
      <div class="duanxian">
        <h2>断线情况：</h2>
        <div class="neirong"><span>断线个数：</span>{{wireListData.length}} </div>
      </div>
    </el-card>
    <el-card class="box-card" shadow="never">
      <div class="dianya">
        <h2>电压情况：</h2>
        <div class="neirong"><span>正常运行率:</span>{{ ((this.status.normalNum/this.status.allNum)*100).toFixed(0) }}%</div>
      </div>
    </el-card>
    <el-card class="box-card" shadow="never">
      <div class="duanwang">
        <h2>断网情况：</h2>
        <div class="neirong"><span>断网个数：</span>{{netWokrList.length}}</div>
      </div>
    </el-card>
  </div>
</template>

<script>
import { listDevice } from '@/api/fac/device'
import {listNetWorkDect} from '@/api/fac/NetWorkDect'
import {listWireDect} from '@/api/fac/WireDect'
import {listEndDeviceVol} from '@/api/fac/endDeviceVol'

export default {
  props:['workShopId'],
  data(){
    return{
      wireDect:0,
      voltage:0,
      networkDect:0,

            // 电压的
      //遮罩层
      dialogVisible:false,
      // 设备编号
      status:{
        all:[],
        allNum:0,
        normal:[],
        normalNum:0,
        warning:[],
        warningNum:0,
        error:[],
        errorNum:0,
      },
      daterangeAcquisitionTime: [],
      // 查询参数
      Volparams:{ 
        beginAcquisitionTime: null,
        endAcquisitionTime: null,
        type:'voltage',
        deviceName: null,
        location: null,
        electrolyticellId: null,
        deviceStatus: null
      },
      historyNowTime:null,
      historyAgoTime:null,
      historyDeiveceId:null,
      volstatus: [{
          value: 'normal',
          label: 'normal'
        }, {
          value: 'warning',
          label: 'warning'
        }, {
          value: 'error',
          label: 'error'
        }],
      


        //断网的
        netWokrList:[],
        dataList:'',
        netWorkParamse:{
          beginAcquisitionTime: null,
          endAcquisitionTime: null,
          deviceName: null,
          location: null,
          electrolyticellId: null,
          deviceStatus: null
        },
        netStatus: [{
          value: 'normal',
          label: 'normal'
        }, {
          value: 'error',
          label: 'error'
        }],
        netTimeNum:null,


        //断线的
        wireParamse:{
          beginAcquisitionTime: null,
          endAcquisitionTime: null,
          token:''
        },
        wireList:[],
        wireListData:[]
    }
  },
  methods:{
    checkDianYa(){
      this.$router.push({
        path: '/fac/device',
        query:{
          workShopId:this.workShopId
        }
      })
    },


      //断线的
    updateWireTime(){
      //推荐用 mount.js  网上搜一下mount.js
      var date = new Date()
      var y = date.getFullYear()
      var m = date.getMonth()
      var d = date.getDate()
      var h = date.getHours()
      var i = date.getMinutes()
      var s = date.getSeconds()
      var nowdate = this.parseTime(new Date(y,m,d,h,i-30,s),"{y}-{m}-{d} {h}:{i}:{s}")
      var agodate = this.parseTime(new Date(y,m,d,h-1,i-30,s),"{y}-{m}-{d} {h}:{i}:{s}")
      this.wireParamse.params = {};
      this.wireParamse.params["beginAcquisitionTime"] = nowdate
      this.wireParamse.params["endAcquisitionTime"] = agodate
      this.getWireList()
      },
    getWireList(){
      listWireDect(this.wireParamse).then((res)=>{
        // console.log('断线请求')
        this.wireList = res.data
        this.wireList = this.chuliWireDataone()
        this.wireListData = this.chuliWireDatatwo(this.wireList)
      })
    },
    chuliWireDataone(){
        let arr = []
        this.wireList.forEach((x,i)=>{
          let s = x.split(',')
          arr.push(s[0])
          s = []
        })
        return arr
      },
    chuliWireDatatwo(arr){
      let tempArr = []
        let obj = []
        let resultArr = []
        arr.forEach((x,i)=>{
          if(!tempArr.includes(x)){tempArr.push(x)}
        })
        arr.forEach((v)=>{
          if(obj[v]){obj[v]++}else{obj[v]=1}
        })
        tempArr.forEach((x)=>{
          resultArr.push({id:x,num:obj[x]})
        })
        return resultArr
    },
  
  
    netTimeCanShu(){
      this.getConfigKey('fac.net.time').then(response => {
            this.netTimeNum = response.msg;
            this.updateNetTime()
        });
    },
  updateNetTime(){
      var date = new Date()
      var y = date.getFullYear()
      var m = date.getMonth()
      var d = date.getDate()
      var h = date.getHours()
      var i = date.getMinutes()
      var s = date.getSeconds()
      var nowdate = this.parseTime(new Date(y,m,d,h,i-30,s),"{y}-{m}-{d} {h}:{i}:{s}")
      var agodate = this.parseTime(new Date(y,m,d,h-1,i-30,s),"{y}-{m}-{d} {h}:{i}:{s}")
      this.netWorkParamse.params = {};
      this.netWorkParamse.params["beginAcquisitionTime"] = nowdate
      this.netWorkParamse.params["endAcquisitionTime"] = agodate
      this.getNetWorkList()
      },
  getNetWorkList(){
    // console.log('断网请求')
    listNetWorkDect(this.netWorkParamse).then((res)=>{
      this.netWokrList = res.data
      // console.log(this.netWokrList,'dsfsdf')
    })
  },


  updataVolTime(){
    var date = new Date()
    var y = date.getFullYear()
    var m = date.getMonth()
    var d = date.getDate()
    var h = date.getHours()
    var i = date.getMinutes()
    var s = date.getSeconds()
    var nowdate = this.parseTime(new Date(y,m,d,h,i-30,s),"{y}-{m}-{d} {h}:{i}:{s}")
    var agodate = this.parseTime(new Date(y,m,d,h-1,i-30,s),"{y}-{m}-{d} {h}:{i}:{s}")
    this.Volparams.params = {};
    this.Volparams.params["beginAcquisitionTime"] = nowdate
    this.Volparams.params["endAcquisitionTime"] = agodate
    this.historyNowTime = nowdate
    this.historyAgoTime = agodate
    this.getVolList()
  },

  getVolList(){
    // console.log('电压请求')
    listEndDeviceVol(this.Volparams).then((res)=>{
      this.status.all = this.changeJson(res.data.all)
      this.status.allNum = res.data.all.length
      this.status.normal = this.changeJson(res.data.normal)
      this.status.normalNum = res.data.normal.length
      this.status.warning = this.changeJson(res.data.warning)
      this.status.warningNum = this.status.warning.length
      this.status.error = this.changeJson(res.data.error)
      this.status.errorNum = this.status.error.length
    })
  },
  // 数组转json
  changeJson(arr){ 
    let shebei = {deviceId:''}
    const list = []
    arr.forEach(x=>{
      shebei.deviceId = x
      list.push(shebei)
      shebei = {deviceId:''}
    })
    return list
  },
  },
  mounted(){
    this.updateWireTime()//断线的
    this.netTimeCanShu()//断网的
    this.updataVolTime()//电压的
  },
  beforDestroy(){
    this.$bus.$off('VoltageNum')
  },
  computed:{
  }
}
</script>

<style scoped>
  .container :hover{
    cursor:pointer ;
  }
.duanxian,.duanwang,.dianya{
  height: 178px;
}
.duanxian,.duanwang,.dianya:hover{
  cursor:pointer ;
}
h2{
  color:#7A9282;
}
.neirong{
  /* background-color: blue; */
  height: 100px;
    font-size: 30px;
    color: #FF005A;
    padding: 30px 0;
}
.neirong span{
  color: #5AB1EF;
}
.box-card{
  border: none ;
  margin-bottom: 2px;
  background-color: #0B253A;
}
</style>