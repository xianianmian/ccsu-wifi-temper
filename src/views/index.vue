<template>
  <div class="dashboard-editor-container">
    <el-row :gutter="32">
      <el-col :xs="24" :sm="24" :lg="8">
        zigbee 终端 断网 电池监测 （支持查询）
      </el-col>
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="central_text chart-wrapper">
          {{ dateTime }}
          <p>总运行数量10个</p>
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <pie-chart :chart-data="pieChartData"/>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="32">
      <el-col :xs="24" :sm="24" :lg="8">
        zigbee终端状态实时分页展示（支持查询）
        <div class="chart-wrapper">
          <state-form/>
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="8">
        温度实时曲线展示（支持查询，以电解槽或zigbee为单位）
        <div class="chart-wrapper">
          <dy-line-chart chartTitle="zigbee2" :chart-data="lineChartData"/>
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="8">
        温度数据实时分页展示（支持查询）
        <div class="chart-wrapper">
          <dy-line-chart chartTitle="zigbee3" :chart-data="lineChartData"/>
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
  shoppings: {
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
    BarChart
  },
  data() {
    return {
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
    this.mqttSubscribe()
    setInterval(() => {
      this.dateTime = this.parseTime(new Date(), '{y}-{m}-{d} {h}:{i}:{s}')
      lineChartData.temp.temp1.push(+(Math.random() * 10 + 5).toFixed(1))
      lineChartData.temp.temp2.push(+(Math.random() * 10 + 5).toFixed(1))
      lineChartData.temp.temp3.push(+(Math.random() * 10 + 5).toFixed(1))
      lineChartData.temp.temp4.push(+(Math.random() * 10 + 5).toFixed(1))
      lineChartData.temp.time.push(this.parseTime(new Date(), '{h}:{i}:{s}'))
      if (lineChartData.temp.temp1.length > 10) lineChartData.temp.temp1.shift()
      if (lineChartData.temp.temp2.length > 10) lineChartData.temp.temp2.shift()
      if (lineChartData.temp.temp3.length > 10) lineChartData.temp.temp3.shift()
      if (lineChartData.temp.temp4.length > 10) lineChartData.temp.temp4.shift()
      if (lineChartData.temp.time.length > 10) lineChartData.temp.time.shift()
    }, 1000)
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
  padding: 32px;
  background-color: rgb(240, 242, 245);
  position: relative;

  .central_text {
    font-family: "Let's go Digital", serif;
    font-size: 64px;
    text-align: center;
    margin: auto;
  }

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
