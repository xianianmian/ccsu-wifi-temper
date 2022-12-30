<template>
  <div class="dashboard-editor-container">
    <el-row :gutter="10">
      <el-col :xs="24" :sm="24" :lg="24">
        <div style="margin: 10px">
          <span>车间选择：</span>
          <el-radio-group v-model="workshopSelected" size="mini">
            <el-radio-button label="车间1"></el-radio-button>
            <el-radio-button label="车间2"></el-radio-button>
            <el-radio-button label="车间3"></el-radio-button>
            <el-radio-button label="车间4"></el-radio-button>
          </el-radio-group>
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="8">
        zigbee 终端 断网 电池监测 （支持查询）
      </el-col>
      <el-col :xs="24" :sm="24" :lg="8">
<!--       <span>电解槽在线数量</span>-->
        <div class="central_text chart-wrapper">
          <device-number></device-number>
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="8">
<!--        <span>运行状况</span>-->
        <div class="chart-wrapper">
          <pie-chart :chart-data="pieChartData"/>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :xs="24" :sm="24" :lg="8">
        zigbee终端状态实时分页展示（支持查询）
      </el-col>
      <el-col :xs="24" :sm="24" :lg="8">
<!--        温度实时曲线展示（支持查询，以电解槽或zigbee为单位）-->
          <div class="chart-wrapper">
            <instant-dy-line-chart/>
          </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="8">
<!--        温度数据实时分页展示（支持查询）-->
        <div class="chart-wrapper">
          <history-search-line-chart/>
        </div>
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
import {listTemper} from '@/api/fac/temper'
import DeviceNumber from './dashboard/DeviceNumber.vue'

const lineChartData = {
  newVisitis: {
    expectedData: [100, 120, 161, 134, 105, 160, 165],
    actualData: [120, 82, 91, 154, 162, 140, 145]
  },
  messages: {
    expectedData: [200, 192, 120, 144, 160, 130, 140],
    actualData: [180, 160, 151, 106, 145, 150, 130]
  },
  purchases: {
    expectedData: [80, 100, 121, 104, 105, 90, 100],
    actualData: [120, 90, 100, 138, 142, 130, 130]
  },
  shopping: {
    expectedData: [130, 140, 141, 142, 145, 150, 160],
    actualData: [120, 82, 91, 154, 162, 140, 130]
  },
  temp: {
    time: ['19:50', '19:55', '20:00', '20:05', '20:10', '20:15', '20:20'],
    temp1: [1, 3, 2, 4, 6, 5, 7],
    temp2: [7, 6, 5, 3, 4, 1, 2],
    temp3: [7, 6, 5, 3, 4, 1, 2],
    temp4: [7, 6, 5, 3, 4, 1, 2]
  }
}
const pieChartData = {
  pieData: [
    { value: 320, name: '正常' },
    { value: 220, name: '预警' },
    { value: 9, name: '故障' }
  ]
}
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
    DeviceNumber
  },
  data() {
    return {
      workshopSelected: '车间1',
      lineChartData: lineChartData.temp,
      pieChartData: pieChartData.pieData,
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
    // this.mqttSubscribe()
    listTemper().then((res)=>{
      console.log(res.data)
    })
  },
  methods: {
    handleSetLineChartData(type) {
      this.lineChartData = lineChartData[type]
    },
    mqttSubscribe() {
      this.client.on('message', (top, message) => {
        switch (top) {
          case 'temp_getdata':
            try {
              this.getData = JSON.parse(message.toString())
            } catch (error) {
              console.log('temp_getdata_error :>> ', error)
            }
            if (this.getData.device_id === '2047215865496') {
              this.device1.time.push(this.parseTime(new Date(), '{h}:{i}:{s}'))
              this.device1.temp1.push(this.getData.Temp1)
              this.device1.temp2.push(this.getData.Temp2)
              this.device1.temp3.push(this.getData.Temp3)
              this.device1.temp4.push(this.getData.Temp4)
              if (this.device1.length > 8) this.device1.shift()
            }
            break
          default:
            break
        }
      })
    }

  }
}
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  padding: 12px 32px;
  background-color: rgb(240, 242, 245);
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
    background: #fff;
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
