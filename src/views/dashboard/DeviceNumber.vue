<template>
  <div class="container">
    <span class="central_text_top">{{ dateTime }}</span>
    <div class="central_text_center">
      <div style="font-size: 20px; color: #7a9064; margin-bottom: 10px">
        电解槽总运行数量
      </div>
      <div style="color: #5dbec8; font-size: 20px">
        <span style="font-size: 45px">12</span>个
      </div>
      <div style="color: #7a9064; font-size: 20px">安全运行率：100%</div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dateTime: "",
    };
  },
  mounted() {
    setInterval(() => {
      this.dateTime = this.parseTime(new Date(), "{y}-{m}-{d} {h}:{i}:{s}");
    }, 1000);
  },
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