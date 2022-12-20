<template>
  <div class="container">
    <div class="main">
      <div class="main-left">
        <el-card style="color: #2ec7c9">
          <span>正常电解槽运行数量</span>
          <div class="left1-main">
            <div class="radius" style="background-color: #2ec7c9"></div>
            <div>
              <span>100个</span>
              <br />
              <span>占比:100%</span>
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
              <span>100个</span>
              <br />
              <span>占比:100%</span>
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
              <span>100个</span>
              <br />
              <span>占比:100%</span>
            </div>
          </div>
        </el-card>
      </div>
      <div class="main-right">
        <span style="font-size: 10px">数据每5分钟更新</span>
        <div
          :class="className"
          :style="{ height: height, width: width, marginbottom: marginbottom }"
        />
        <div style="display: flex; justify-content: space-between">
        </div>
      </div>
    </div>
    <div class="footer">
      <img src="@/assets/logo/search.png" alt="" />
      <el-date-picker
        v-model="value2"
        type="datetimerange"
        range-separator="至"
        start-placeholder="故障开始日期"
        end-placeholder="故障结束日期"
        align="right"
        size="mini"
        @change="find"
      >
      </el-date-picker>
    </div>
  </div>
</template>

<script>
import echarts from "echarts";

require("echarts/theme/macarons"); // echarts theme
import resize from "./mixins/resize";

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
      value2: "",
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart();
    });
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
      if(this.value2!=""&&this.value2!=null)
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
.main{
  display: flex;
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
.footer{
  display: flex;
  margin: 21px 0;
}
img {
  width: 24px;
  height: 18px;
  margin: 2px;
}
</style>