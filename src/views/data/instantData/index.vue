<template>
  <!-- 首页 -->
  <div class="container">
    <temperature-show :item_no="item_no" :tempData="tempData" right="烟道管"></temperature-show>
    <temperature-show :item_no="item_no+1"></temperature-show>
    <temperature-show :item_no="item_no+2"></temperature-show>
    <temperature-show :item_no="item_no+3"></temperature-show>
  </div>
</template>

<script>
import TemperatureShow from '@/components/TemperatureShow'
export default {
  name: 'Index',
  components: { TemperatureShow },
  data() {
    return {
      item_no: 1,
      item_1: {
        item_no: 1
      },
      tempData: { tempTest: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
      getData:{}
    }
  },
  methods: {
    mqttSubscribe() {
      this.client.on('message', (top, message) => {
        switch (top) {
          case 'temp_getdata':
            try {
              this.getData = JSON.parse(message.toString())
            } catch (error) {
              console.log('temp_getdata_error :>> ', error)
            }
            for (let key in this.getData) {
              let i = 0
              this.tempData.tempTest[i] = this.getData[key]
              i++
              console.log(this.getData[key])
            }
            break
          default:
            break
        }
      })
    }
  },
  watch: {},
  mounted() {
    // this.timer = window.setInterval(() => {}, 2000);
    this.mqttSubscribe() //订阅
    // console.log("dayjs :>> ", this.dayjs().format("YYYY-MM-DD HH:mm:ss"));
  }
}
</script>

<style scoped lang="scss">
.container {
  width: 100%;
}

.item {
  width: 100%;
}
</style>
