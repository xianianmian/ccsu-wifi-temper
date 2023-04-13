
<template>
  <!-- 首页的 -->
  <div >
    <el-card class="box-card" shadow="never">
      <div class="mianban">
        <h1>电解槽总运行数量:</h1>
        <div style="color: red; font-size: 20px">
          <span style="font-size: 45px">{{total}}</span>个
        </div>
        <div style="color: #7a9064; font-size: 20px">安全运行率：{{safePercent}}%</div>
      </div>
    </el-card>
  </div>
</template>

<script>
import { listCellError } from "@/api/fac/cellError.js";
export default {
  data() {
    return {
      dateTime: "",
      total:4,
      normal:0,
      warning:0,
      error:0,
      safePercent:1,
      timer:null,
      CellErorrParams:{
        beginAcquisitionTime: null,
        endAcquisitionTime: null,
        type:'temper',
      }
    };
  },
  mounted() {
    this.updataCellEorrTime()
  },
  methods:{
    updataCellEorrTime(){
    var date = new Date()
    var y = date.getFullYear()
    var m = date.getMonth()
    var d = date.getDate()
    var h = date.getHours()
    var i = date.getMinutes()
    var s = date.getSeconds()
    var nowdate = this.parseTime(new Date(y,m,d,h,i-30,s),"{y}-{m}-{d} {h}:{i}:{s}")
    var agodate = this.parseTime(new Date(y,m,d,h-1,i-30,s),"{y}-{m}-{d} {h}:{i}:{s}")
    this.CellErorrParams.params = {};
    this.CellErorrParams.params["beginAcquisitionTime"] = nowdate
    this.CellErorrParams.params["endAcquisitionTime"] = agodate
    this.getListCellError()

    setInterval(()=>{
      var dates = new Date()
      var ys = dates.getFullYear()
      var ms = dates.getMonth()
      var ds = dates.getDate()
      var hs = dates.getHours()
      var is = dates.getMinutes()
      var ss = dates.getSeconds()
      nowdate = this.parseTime(new Date(ys,ms,hs,is-30,ss),"{y}-{m}-{d} {h}:{i}:{s}")
      agodate = this.parseTime(new Date(ys,ms,ds,hs-1,is-30,ss),"{y}-{m}-{d} {h}:{i}:{s}")
      this.CellErorrParams.params["beginAcquisitionTime"] = nowdate
      this.CellErorrParams.params["endAcquisitionTime"] = agodate
      this.getListCellError()
    },1000*60*30)
    // },1000*6)
  },
    getListCellError() {
      listCellError(this.CellErorrParams).then((res) => {
        // console.log('cellError请求');
        this.total = this.sumArr(res.data.all);
        this.normal = this.sumArr(res.data.normal)
        this.warning = this.sumArr(res.data.warning)
        this.error = this.sumArr(res.data.error)
        this.safePercent = ((this.normal / this.total)*100).toFixed(0);
      });
    },
    sumArr(arr){//js 的方法用的不熟，只能这样了
      let sum=0
      arr.forEach(x=>sum+=x)
      return sum
    }
  }
};
</script>

<style scoped>
*{
    margin: 0px;
    padding: 0px;
} 
.container{
    width: 444px;
    height: 400px;
}
.mianban{
  height: 385px;
}
h1{
  padding-top: 100px;
  color: #31A2EF;
}
.box-card{
  border: none ;
  margin-bottom: 2px;
  background-color: #0B253A;
}
</style>