<template>
  <!-- 系统的一些样式再 layout文件夹，如我首页成了黑色 具体这么改网上搜 -->
  <div class="dashboard-editor-container">
    <el-row :gutter="10">
      <el-col :xs="24" :sm="24" :lg="24">
        <div style="margin: 10px">
          <span style="color: white;">当前车间：</span>
          <div style="margin-top: 20px">
            <el-radio-group v-model="workShopId" size="small">
              <el-radio-button label="1">一号车间</el-radio-button>
              <el-radio-button label="2" >二号车间</el-radio-button>
              <el-radio-button label="3">三号车间</el-radio-button>
              <el-radio-button label="4">四号车间</el-radio-button>
            </el-radio-group>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="8" :xs="24" :sm="24" :lg="8">
        <el-row>
          <div class="central_text chart-wrapper ">
            <!-- 断线断网电压 -->
            <KlhTernminal :workShopId="workShopId"/>
          </div>
        </el-row>
      </el-col>
      <el-col :span="16">
        <el-row :gutter="20">
          <el-col :xs="24" :sm="24" :lg="12">
            <div class="central_text chart-wrapper">
              <!-- 电解槽运行数量 -->
              <device-number></device-number>
            </div>
          </el-col>

          <el-col :xs="24" :sm="24" :lg="12">
            <div class="chart-wrapper">
              <!-- 饼图 -->
              <pie-chart />
            </div>
          </el-col>

          <el-col :xs="24" :sm="24" :lg="24">
            <div class="chart-wrapper">
              <!-- 当前图表 -->
              <history-search-line-chart :word-shop-id="workShopId"/>
            </div>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import PanelGroup from './dashboard/PanelGroup'
import LineChart from './dashboard/LineChart'
import DyLineChart from './dashboard/DyLineChart'
import StateForm from './dashboard/StateForm'
import RaddarChart from './dashboard/RaddarChart'
import PieChart from './dashboard/PieChart'
import BarChart from './dashboard/BarChart'
import HistorySearchLineChart from '@/views/components/HistorySearchLineChart'
import InstantDyLineChart from '@/views/components/InstantDyLineChart'
import DeviceNumber from './dashboard/DeviceNumber.vue'
import KlhTernminal from './dashboard/KlhTernminal.vue'

export default {
  name: 'Index',
  components: {
    PanelGroup,
    DyLineChart,
    LineChart,
    StateForm,
    RaddarChart,
    PieChart,
    BarChart,
    HistorySearchLineChart,
    InstantDyLineChart,
    DeviceNumber,
    KlhTernminal
  },
  data() {
    return {
      radio3: '上海',
      workShopId: '1',
      dateTime: '',
      getData: {
        device_id: null,
        Temp1: null,
        Temp2: null,
        Temp3: null,
        Temp4: null
      },
      device1: {
        time: [],
        temp1: [],
        temp2: [],
        temp3: [],
        temp4: []
      }

    }
  },
  mounted() {
  },
  methods: {

  }
}
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  padding: 12px 32px;
  /* background-color: rgb(240, 242, 245); */
  background-color: #0B253A;
  position: relative;

  .central_text {
    font-family: "Let's go Digital", serif;
    text-align: center;
    margin: auto;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
  }

  // .central_text_top {
  //   margin-top: 10px;
  //   color: #4d6fc1;
  // }

  // .central_text_center {
  //   margin: 82px;
  // }


  .text_title {
    font-family: "Adobe 黑体 Std R", serif;
    text-align: center;
    font-size: 36px;
    font-weight: 600;
    padding: 8px;
  }

  .chart-wrapper {
    background: #263850;
    padding: 16px 16px 0;
    margin-bottom: 32px;
    height: 100%;
    width: 100%;
  }
}

@media (max-width: 1024px) {
  .chart-wrapper {
    padding: 8px;

  }
}
</style>
