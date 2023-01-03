<template>
  <div class="container">
    <div class="main">
      <div class="main-left">
        <el-card style="color: #2ec7c9">
          <span>正常电解槽运行数量</span>
          <div class="left1-main">
            <div class="radius" style="background-color: #2ec7c9"></div>
            <div>
              <span>{{ condition.normal }}</span>
              <br />
              <span>占比:{{ normalPercent * 100 }}%</span>
            </div>
          </div>
        </el-card>
        <el-card style="color: rgb(200, 178, 244)">
          <span>预警电解槽运行数量</span>
          <div class="left1-main">
            <div
              class="radius"
              style="background-color: rgb(200, 178, 244)"
            ></div>
            <div>
              <span>{{ condition.warning }}</span>
              <br />
              <span>占比:{{ warningPercent * 100 }}%</span>
            </div>
          </div>
        </el-card>
        <el-card style="color: rgb(90, 177, 239)">
          <span> 故障电解槽运行数量</span>
          <div class="left1-main">
            <div
              class="radius"
              style="background-color: rgb(90, 177, 239)"
            ></div>
            <div>
              <span>{{ condition.error }}</span>
              <br />
              <span>占比:{{ errorPercent * 100 }}%</span>
            </div>
          </div>
        </el-card>
      </div>
      <div class="main-right">
        <span style="font-size: 10px">数据每30分钟更新</span>
        <div
          :class="className"
          :style="{ height: height, width: width, marginbottom: marginbottom }"
        />
        <div style="display: flex; justify-content: space-between"></div>
      </div>
    </div>
    <div class="footer">
      <img src="@/assets/logo/search.png" alt="" />
      <!-- <el-input placeholder="故障记录查询"></el-input> -->
      <el-date-picker
        v-model="value1"
        type="datetimerange"
        range-separator="至"
        start-placeholder="故障开始日期"
        end-placeholder="故障结束日期"
      >
      </el-date-picker>
      <el-button type="primary" @click="find()">查询</el-button>
    </div>
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
      default: "chart",
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
      type: Array,
      default: [
        { value: 320, name: "正常" },
        { value: 22, name: "预警" },
        { value: 9, name: "故障" },
      ],
    },
  },
  data() {
    return {
      chart: null,
      // 设置查询故障时间的默认值
      value1: "",
      // 定时器
      timer:null,
      // 电解槽情况
      condition: {
        all: 0,
        error: 0,
        normal: 0,
        warning: 0,
      },
      errorPercent: 1,
      normalPercent: 1,
      warningPercent: 1,
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart();
    });
    // 启动时自动调用一次获取相关信息
    this.getListCellError();
    // 每隔30分钟获取一次数据
    this.timer=setInterval(()=>{
      this.getListCellError()
    },1000*60*30);
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
      if (this.value1 != "" && this.value1 != null)
        this.$router.push("/fac/cellError");
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
            data: this.chartData,
            animationEasing: "cubicInOut",
            animationDuration: 2600,
          },
        ],
      });
    },
    getListCellError() {
      listCellError().then((res) => {
        console.log(res.data);
        this.condition.all=res.data.all;
        this.condition.error=res.data.error;
        this.condition.normal=res.data.normal;
        this.condition.warning=res.data.warning;
        this.errorPercent = (res.data.error / res.data.all).toFixed(2);
        this.normalPercent = (res.data.normal / res.data.all).toFixed(2);
        this.warningPercent = (res.data.warning / res.data.all).toFixed(2);
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
  display: flex;
  flex-direction: column;
  color: #7a97a5;
  justify-content: space-between;
}
.main {
  display: flex;
  justify-content: space-around;
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