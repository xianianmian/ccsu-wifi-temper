<template>
  <!-- 这个好像是没用的，用来测试的 -->
  <div class="container">
  </div>
</template>

<script>
import {listNetWorkDect} from '@/api/fac/NetWorkDect'
export default {
  data(){
    return{
      dataList:'',
      netWorkParamse:{
        beginAcquisitionTime: null,
        endAcquisitionTime: null,
        token:''
      }
    }
  },
  methods:{
    getStatus(){
    this.netWorkParamse.params = {};
    this.netWorkParamse.params["beginAcquisitionTime"] = '2023-02-23 12:00:00'
    this.netWorkParamse.params["endAcquisitionTime"] = '2023-02-23 15:30:00'
    listNetWorkDect(this.netWorkParamse).then((res)=>{
      // console.log(res.data,'zinet')
      this.dataList = res.data
      this.emitData(this.dataList)
    })
    },

    emitData(data){
      this.$emit('getNetWorkList',data)
    }

  },
  mounted(){
    this.getStatus()
  }
};
</script>
<style scoped>

</style>
