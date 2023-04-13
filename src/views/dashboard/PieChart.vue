<template>
  <div >
    <!-- 首页的 -->
    <el-card class="box-card" shadow="never">
      <div class="main">
        <div class="main-left">
          <el-card style="color: #2ec7c9" class="min-box-card">
            <span>正常电解槽运行数量</span>
            <div class="left1-main">
              <div class="radius" style="background-color: #2ec7c9"></div>
              <div>
                <span>{{ condition.normal }}</span>
                <br />
                <span>占比:{{ normalPercent }}%</span>
              </div>
            </div>
          </el-card>
          <el-card style="color: rgb(200, 178, 244)" class="min-box-card">
            <span>预警电解槽运行数量</span>
            <div class="left1-main">
              <div
                class="radius"
                style="background-color: rgb(200, 178, 244)"
              ></div>
              <div>
                <span>{{ condition.warning }}</span>
                <br />
                <span>占比:{{ warningPercent  }}%</span>
              </div>
            </div>
          </el-card>
          <el-card style="color: rgb(90, 177, 239)" class="min-box-card">
            <span> 故障电解槽运行数量</span>
            <div class="left1-main">
              <div
                class="radius"
                style="background-color: rgb(90, 177, 239)"
              ></div>
              <div>
                <span>{{ condition.error }}</span>
                <br />
                <span>占比:{{ errorPercent }}%</span>
              </div>
            </div>
          </el-card>
        </div>
        <div class="main-right">
          <span style="font-size: 10px">数据每30分钟更新</span>
          <div
            :class="className"
            :style="{ height: height, width: width, marginbottom: marginbottom }"/>
          <div style="display: flex; justify-content: space-between"></div>
        </div>
      </div>
      <div class="footer">
        <el-date-picker
          v-model="daterangeAcquisitionTime"
          type="datetimerange"
          value-format="yyyy-MM-dd HH:mm:ss"
          range-separator="至"
          start-placeholder="故障开始日期"
          end-placeholder="故障结束日期"
        >
        </el-date-picker>
        <el-button type="primary" @click="find()">查询</el-button>
      </div>
    </el-card>

  </div>
</template>

<script>
import echarts from "echarts";

require("echarts/theme/macarons"); // echarts theme
import resize from "./mixins/resize";
import { listCellError } from "@/api/fac/cellError.js";
export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: "errorPie",
    },
    width: {
      type: String,
      default: "220px",
    },
    height: {
      type: String,
      default: "200px",
    },
    marginbottom: {
      type: String,
      default: "40px",
    },
    chartData: {
      type:Array,
      default:function(){
        return [
        { value: 320, name: "正常" },
        { value: 22, name: "预警" },
        { value: 9, name: "故障" },
      ]
      } 
    },
  },
  data() {
    return {
      chart: null,
      // 设置查询故障时间的默认值
      daterangeAcquisitionTime:[],
      // 定时器
      timer1:null,
      timer2:null,
      // 电解槽情况
      condition: {
        all: 2,
        error: 2,
        normal: 0,
        warning: 1,
      },
      errorPercent: 1,
      normalPercent: 1,
      warningPercent: 1,
      CellErorrParams:{
        beginAcquisitionTime: null,
        endAcquisitionTime: null,
        type:'temper',
      },
      nowTime:'',
      agoTime:''
    };
  },
  mounted() {
    this.updataCellEorrTime()
  },
  beforeDestroy() {
    if (!this.chart) {
      return;
    }
    this.chart.dispose();
    this.chart = null;
  },

  methods: {
    find() {
        this.$router.push({ 
        path: '/fac/cellError',
        query:{
          time:this.daterangeAcquisitionTime
        }
      })
    },
    updataCellEorrTime(){
    var date = new Date()
    var y = date.getFullYear()
    var m = date.getMonth()
    var d = date.getDate()
    var h = date.getHours()
    var i = date.getMinutes()
    var s = date.getSeconds()
    var nowdate = this.parseTime(new Date(),"{y}-{m}-{d} {h}:{i}:{s}")
    var agodate = this.parseTime(new Date(y,m,d,h,i-30,s),"{y}-{m}-{d} {h}:{i}:{s}")
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
        this.condition.all=this.sumArr(res.data.all);
        this.condition.error=this.sumArr(res.data.error)
        this.condition.normal=this.sumArr(res.data.normal);
        this.condition.warning=this.sumArr(res.data.warning);
        this.errorPercent = ((this.sumArr(res.data.error) / this.sumArr(res.data.all))*100).toFixed(0);
        this.normalPercent = ((this.sumArr(res.data.normal) / this.sumArr(res.data.all))*100).toFixed(0);
        this.warningPercent = ((this.sumArr(res.data.warning) / this.sumArr(res.data.all))*100).toFixed(0);
        this.initChart()
      });
    },
    sumArr(arr){
      let sum=0
      arr.forEach(x=>sum+=x)
      return sum
    },
    initChart() {
      this.chart = echarts.init(
        document.getElementsByClassName(this.className)[0],
        "macarons"
      );

      this.chart.setOption({
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)",
        },
        series: [
          {
            name: "故障占比",
            type: "pie",
            radius: "40%",
            data: [
              {value:this.condition.normal,name:"正常"},
              {value:this.condition.warning,name:"预警"},
              {value:this.condition.error,name:"故障"}
            ],
            animationEasing: "cubicInOut",
            animationDuration: 2600,
          },
        ],
      });
    },
  },
};
</script>
<style scoped>
* {
  margin: 0;
  padding: 0;
}
.container {
  height: 400px;;
  display: flex;
  flex-direction: column;
  color: #7a97a5;
  justify-content: space-between;
}
.box-card{
  border: none ;
  margin-bottom: 2px;
  background-color: #0B253A;
}
.min-box-card{
  background-color: #0B253A;
}
.main {
  display: flex;
  justify-content: space-around;
  height: 358px;
}
.main-left {
  width: 143px;
  height: 100%;
  font-size: 13px;
  display: flex;
  flex-direction: column;
  margin: 15px 7px;
}
.left1-main {
  display: flex;
}
.el-card.is-always-shadow {
  margin-bottom: 4px;
}
/deep/.el-card__body {
  padding: 5px;
}
.radius {
  width: 15px;
  height: 15px;
  border-radius: 15px;
  margin-top: 16px;
}
.main-right {
  display: flex;
  flex-direction: column;
  width: 220px;
  height: 100%;
}
.footer {
  display: flex;
  justify-content: center;
  margin: 12px 28px;
}
img {
  width: 24px;
  height: 34px;
}
.el-input {
  width: 282px;
  margin: 0 12px;
}
.el-button {
  margin-left: 10px;
  width: 50px;
}
</style>
