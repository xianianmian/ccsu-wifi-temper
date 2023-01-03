<template>
  <div class="container">
    <span class="central_text_top">{{ dateTime }}</span>
    <div class="central_text_center">
      <div style="font-size: 20px; color: #7a9064; margin-bottom: 10px">
        电解槽总运行数量
      </div>
      <div style="color: #5dbec8; font-size: 20px">
        <span style="font-size: 45px">{{total}}</span>个
      </div>
      <div style="color: #7a9064; font-size: 20px">安全运行率：{{safePercent}}%</div>
    </div>
  </div>
</template>

<script>
import { listCellError } from "@/api/fac/cellError.js";
export default {
  data() {
    return {
      dateTime: "",
      total:4,
      safePercent:1,
      timer:null,
    };
  },
  mounted() {
    setInterval(() => {
      this.dateTime = this.parseTime(new Date(), "{y}-{m}-{d} {h}:{i}:{s}");
    }, 1000);
    // 启动时自动调用一次获取相关信息
    this.getListCellError();
    // 每隔30分钟获取一次数据
    this.timer=setInterval(()=>{
      this.getListCellError()
    },1000*60*30);
  },
  methods:{
    getListCellError() {
      listCellError().then((res) => {
        console.log(res.data);
        this.total=res.data.all;
        this.safePercent = (res.data.normal / res.data.all).toFixed(0);
      });
    },
  }
};
</script>

<style>
*{
    margin: 0px;
    padding: 0px;
}
.container{
    width: 444px;
    height: 287px;
}
.central_text_top {
  margin-top: 10px;
  color: #4d6fc1;
}

.central_text_center {
  margin: 82px;
}
</style>