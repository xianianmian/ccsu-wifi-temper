<template>
  <div class="app-container">
    <!-- <Voltage></Voltage> -->
    <!-- 电压 -->
    <el-row :gutter="12">
      <el-col :span="8">
        <el-card shadow="hover">
          <div class="label" style="color: rgb(46, 299, 201); ">运行电压正常数：</div>
          <div style="text-align:center">
            <span style="font-size: 45px; color: rgb(93,190,200);">{{ this.status.normalNum }}  </span>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="hover">
          <div class="label" style="color: rgb(200, 178, 244); ">运行电压异常数：</div>
          <div style="text-align:center">
            <span style="font-size: 45px; color: rgb(93,190,200);">{{this.status.warningNum}} </span>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="hover">
          <div class="label" style="color: rgb(90, 177, 239); ">运行电压错误数：</div>
          <div style="text-align:center">
            <span style="font-size: 45px; color: rgb(93,190,200);">{{this.status.errorNum}} </span>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <br>
    
    <VoltageHistory 
    ref="chart"
    :deviceId="historyDeiveceId" 
    :historyNowTime="historyNowTime"
    :historyAgoTime="historyAgoTime"
    :workShopId="workShopId"
    ></VoltageHistory>

    <div class="filter">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="170px">
      <el-form-item label="设备名称" prop="deviceName">
        <el-input
          v-model="queryParams.deviceName"
          placeholder="请输入设备名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="设备所在电解槽的位置" prop="location" >
        <el-input
          v-model="queryParams.location"
          placeholder="请输入设备所在电解槽的位置"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="设备所属的电解槽的编号" prop="electrolyticellId"  >
        <el-input
          v-model="queryParams.electrolyticellId"
          placeholder="请输入设备所属的电解槽的编号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="设备状态" prop="deviceStatus" label-width="170px">
        <el-select v-model="queryParams.deviceStatus" placeholder="请选择设备状态" clearable>
          <el-option
            v-for="dict in dict.type.fac_device_state"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          /> 
        </el-select>
      </el-form-item>
      <el-form-item label="设备电压状态" prop="volstatus" label-width="170px">
        <el-select v-model="Volparams.deviceStatus" placeholder="请选择设备状态" clearable>
          <el-option
            v-for="item in volstatus" 
            :key="item.value" 
            :label="item.lable"
            :value="item.value"
          /> 
        </el-select>
      </el-form-item>
      <el-form-item label="设备网络状态" prop="netStatus" label-width="170px">
        <el-select v-model="netWorkParamse.deviceStatus" placeholder="请选择设备状态" clearable>
          <el-option
            v-for="item in netStatus" 
            :key="item.value" 
            :label="item.lable"
            :value="item.value"
          /> 
        </el-select>
      </el-form-item>
      <el-form-item label="设备断线状态" prop="wireStatus" label-width="170px">
        <el-select v-model="wireParamse.deviceStatus" placeholder="请选择设备状态" clearable>
          <el-option
            v-for="item in wireStatus" 
            :key="item.value" 
            :label="item.lable"
            :value="item.value"
          /> 
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    </div>
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['fac:device:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['fac:device:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['fac:device:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['fac:device:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="deviceList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="id" align="center" prop="deviceId" />
      <el-table-column label="设备名称" align="center" prop="deviceName" />
      <el-table-column label="设备所在电解槽的位置" align="center" prop="location" />
      <el-table-column label="设备所属的电解槽的编号" align="center" prop="electrolyticellId" />
      <el-table-column label="设备电压状态" align="center" prop="status" />
      <el-table-column label="设备电压数据" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            @click="checkHistoryData(scope.$index,scope.row)"
          >历史数据</el-button>
        </template>
      </el-table-column>
      <el-table-column label="设备网络状态" align="center" prop="netStatus" />
      <el-table-column label="设备线路断开数" align="center" prop="wireStatus"/>
      <el-table-column label="设备状态" align="center" prop="deviceStatus">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.fac_device_state" :value="scope.row.deviceStatus"/>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['fac:device:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['fac:device:remove']"
          >删除</el-button>
        </template>
      </el-table-column>

    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改设备管理对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="设备编号" prop="deviceId">
          <el-input v-model="form.deviceId" placeholder="请输入设备编号" />
        </el-form-item>
        <el-form-item label="设备名称" prop="deviceName">
          <el-input v-model="form.deviceName" placeholder="请输入设备名称" />
        </el-form-item>
        <el-form-item label="设备所在电解槽的位置" prop="location">
          <el-input v-model="form.location" placeholder="请输入设备所在电解槽的位置" />
        </el-form-item>
        <el-form-item label="设备所属的电解槽的编号" prop="electrolyticellId">
          <el-input v-model="form.electrolyticellId" placeholder="请输入设备所属的电解槽的编号" />
        </el-form-item>
        <el-form-item label="设备状态">
          <el-radio-group v-model="form.deviceStatus">
            <el-radio
              v-for="dict in dict.type.fac_device_state"
              :key="dict.value"
              :label="dict.value"
            >{{dict.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-divider content-position="center">热电偶信息</el-divider>
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAddFacThermocouple">添加</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="handleDeleteFacThermocouple">删除</el-button>
          </el-col>
        </el-row>
        <el-table :data="facThermocoupleList" :row-class-name="rowFacThermocoupleIndex" @selection-change="handleFacThermocoupleSelectionChange" ref="facThermocouple">
          <el-table-column type="selection" width="50" align="center" />
          <el-table-column label="序号" align="center" prop="index" width="50"/>
          <el-table-column label="热点偶名称" prop="thermocoupleName" width="150">
            <template slot-scope="scope">
              <el-input v-model="scope.row.thermocoupleName" placeholder="请输入热点偶名称" />
            </template>
          </el-table-column>
          <el-table-column label="热点偶所在的位置" prop="thermocoupleLocation" width="150">
            <template slot-scope="scope">
              <el-input v-model="scope.row.thermocoupleLocation" placeholder="请输入热点偶所在的位置" />
            </template>
          </el-table-column>
        </el-table>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listDevice, getDevice, delDevice, addDevice, updateDevice } from "@/api/fac/device";
import {listEndDeviceVol} from '@/api/fac/endDeviceVol'
import VoltageHistory from './VoltageHistory.vue'
import network from './network.vue'
import {listNetWorkDect} from '@/api/fac/NetWorkDect'
import {listWireDect} from '@/api/fac/WireDect'

export default {
  components:{VoltageHistory,network},
  name: "Device",
  dicts: ['fac_device_state'],
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 子表选中数据
      checkedFacThermocouple: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 设备管理表格数据
      deviceList: [],
      // 热电偶表格数据
      facThermocoupleList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        deviceName: null,
        location: null,
        electrolyticellId: null,
        deviceStatus: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      },
      isEdit:false,

      // 电压的
      workShopId:'',
      //遮罩层
      dialogVisible:false,
      // 设备编号
      status:{
        all:[],
        allNum:0,
        normal:[],
        normalNum:0,
        warning:[],
        warningNum:0,
        error:[],
        errorNum:0,
      },
      // 查询参数
      Volparams:{ 
        beginAcquisitionTime: null,
        endAcquisitionTime: null,
        type:'voltage',
        deviceName: null,
        location: null,
        electrolyticellId: null,
        deviceStatus: null
      },
      historyNowTime:null,
      historyAgoTime:null,
      historyDeiveceId:null,
      volstatus: [{
          value: '正常',
          label: 'nomral'
        }, {
          value: '警告',
          label: 'warning'
        }, {
          value: '错误',
          label: 'error'
        }],
      


        //断网的
        netWokrList:[],
        netWorkParamse:{
          beginAcquisitionTime: null,
          endAcquisitionTime: null,
          deviceName: null,
          location: null,
          electrolyticellId: null,
          deviceStatus: null
        },
        netStatus: [{
          value: '正常',
          label: 'normal'
        }, {
          value: '错误',
          label: 'error'
        }],
        //刷新时间倍速
        netTimeNum:null,


        //断线的
        wireParamse:{
          beginAcquisitionTime: null,
          endAcquisitionTime: null,
          deviceName: null,
          location: null,
          electrolyticellId: null,
          deviceStatus: null
        },
        wireList:[],
        wireListData:[],
        wireStatus: [{
          value: '正常',
          label: 'normal'
        }, {
          value: '错误',
          label: 'error'
        }],
      };
  },
  created() {
    this.getList();
    this.updataVolTime()//电压的
    
  },
  methods: {
    /** 查询设备管理列表 */
    getList() {
      this.loading = true;
      listDevice(this.queryParams).then(response => {
        this.deviceList = response.rows;
        this.total = response.total;
        this.loading = false;
        this.filterVolData(this.Volparams.deviceStatus)
        this.filterNetData(this.netWorkParamse.deviceStatus,this.deviceList,this.netWokrList)
        this.filterWireData(this.wireParamse.deviceStatus,this.deviceList,this.wireList,this.wireListData)      });
    },

    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        deviceId: null,
        deviceName: null,
        location: null,
        electrolyticellId: null,
        deviceStatus: "0"
      };
      this.facThermocoupleList = [];
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.Volparams.deviceStatus = ''
      this.netWorkParamse.deviceStatus = ''
      this.wireParamse.deviceStatus = ''
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.deviceId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加设备管理";
      this.isEdit=false
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const deviceId = row.deviceId || this.ids
      getDevice(deviceId).then(response => {
        this.form = response.data;
        this.facThermocoupleList = response.data.facThermocoupleList;
        this.open = true;
        this.title = "修改设备管理";
        this.isEdit=true
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.form.facThermocoupleList = this.facThermocoupleList;
          if (this.isEdit) {
            updateDevice(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addDevice(this.form).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const deviceIds = row.deviceId || this.ids;
      this.$modal.confirm('是否确认删除设备管理编号为"' + deviceIds + '"的数据项？').then(function() {
        return delDevice(deviceIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 热电偶序号 */
    rowFacThermocoupleIndex({ row, rowIndex }) {
      row.index = rowIndex + 1;
    },
    /** 热电偶添加按钮操作 */
    handleAddFacThermocouple() {
      let obj = {};
      obj.thermocoupleName = "";
      obj.thermocoupleLocation = "";
      this.facThermocoupleList.push(obj);
    },
    /** 热电偶删除按钮操作 */
    handleDeleteFacThermocouple() {
      if (this.checkedFacThermocouple.length == 0) {
        this.$modal.msgError("请先选择要删除的热电偶数据");
      } else {
        const facThermocoupleList = this.facThermocoupleList;
        const checkedFacThermocouple = this.checkedFacThermocouple;
        this.facThermocoupleList = facThermocoupleList.filter(function(item) {
          return checkedFacThermocouple.indexOf(item.index) == -1
        });
      }
    },
    /** 复选框选中数据 */
    handleFacThermocoupleSelectionChange(selection) {
      this.checkedFacThermocouple = selection.map(item => item.index)
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('fac/device/export', {
        ...this.queryParams
      }, `device_${new Date().getTime()}.xlsx`)
    },


    // 电压的
    //请求数据
    updataVolTime(){
    var date = new Date()
    var y = date.getFullYear()
    var m = date.getMonth()
    var d = date.getDate()
    var h = date.getHours()
    var i = date.getMinutes()
    var s = date.getSeconds()
    var nowdate = this.parseTime(new Date(y,m,d,h,i-30,s),"{y}-{m}-{d} {h}:{i}:{s}")
    var agodate = this.parseTime(new Date(y,m,d,h-1,i-30,s),"{y}-{m}-{d} {h}:{i}:{s}")
    this.Volparams.params = {};
    this.Volparams.params["beginAcquisitionTime"] = nowdate
    this.Volparams.params["endAcquisitionTime"] = agodate
    this.historyNowTime = nowdate
    this.historyAgoTime = agodate

    this.getVolList()
    setInterval(()=>{
      var nowdate = this.parseTime(new Date(y,m,d,h,i-30,s),"{y}-{m}-{d} {h}:{i}:{s}")
      var dates = new Date()
      var ys = dates.getFullYear()
      var ms = dates.getMonth()
      var ds = dates.getDate()
      var hs = dates.getHours()
      var is = dates.getMinutes()
      var ss = dates.getSeconds()
      var agodate = this.parseTime(new Date(y,m,d,h-1,i-30,s),"{y}-{m}-{d} {h}:{i}:{s}")
      this.Volparams.params = {};
      this.Volparams.params["beginAcquisitionTime"] = nowdate
      this.Volparams.params["endAcquisitionTime"] = agodate

      this.historyNowTime = nowdate
      this.historyAgoTime = agodate

      this.getVolList()
    },1000*60*30)
  },

  getVolList(){
    // console.log('电压请求')
    listEndDeviceVol(this.Volparams).then((res)=>{
      this.status.all = this.changeJson(res.data.all)
      this.status.allNum = res.data.all.length
      this.status.normal = this.changeJson(res.data.normal)
      this.status.normalNum = res.data.normal.length
      this.status.warning = this.changeJson(res.data.warning)
      this.status.warningNum = this.status.warning.length
      this.status.error = this.changeJson(res.data.error)
      this.status.errorNum = this.status.error.length
      this.addVolStatus()
    })
    
  },
  // 数组转json
  changeJson(arr){ 
    let shebei = {deviceId:''}
    const list = []
    arr.forEach(x=>{
      shebei.deviceId = x
      list.push(shebei)
      shebei = {deviceId:''}
    })
    return list
  },
  filterVolData(k){
    this.addVolStatus()
    if(k == '正常'){
      this.deviceList=this.deviceList.filter((x)=>{return x.status == '正常' })
    }
    if(k == '警告'){
      this.deviceList=this.deviceList.filter((x)=>{return x.status === '警告' })
    }
    if(k == '错误'){
      this.deviceList=this.deviceList.filter((x)=>{return x.status === '错误' })
    }
    if(k == ''){
      this.deviceList = this.deviceList.filter((x)=>{return x.status != ''})
    }
    
  },
  //添加volstatus属性
  addVolStatus(){
    this.deviceList.forEach((x,index)=>{
      this.status.normal.forEach((n,index)=>{
        if(x.deviceId == n.deviceId){
          this.$set(x,'status','正常')
        }
      })
      this.status.warning.forEach((w,index)=>{
        if(x.deviceId == w.deviceId){
          this.$set(x,'status','警告')
        }
      })
      this.status.error.forEach((e,index)=>{
        if(x.deviceId == e.deviceId){
          this.$set(x,'status','错误')
        }
      })
      if(! x.hasOwnProperty('status')){
      this.$set(x,'status','--')
    }
    })
  },
    // 电压历史图开关
    checkHistoryData(index,row){
    this.dialogVisible = true
    this.historyDeiveceId = row.deviceId
    // console.log(this.$router.currentRoute.query.workShopId,'dfsdf')
    this.workShopId = this.$router.currentRoute.query.workShopId
    // console.log(this.Volparams.beginAcquisitionTime,'ttttt')
    this.$refs.chart.openDialog()
    this.$refs.chart.getList()
    this.showChart()
  },

  
  //断网的
  netTimeCanShu(){
      this.getConfigKey('fac.net.time').then(response => {
            this.netTimeNum = response.msg;
            this.updateNetTime()
        });
    },
  updateNetTime(){
      var date = new Date()
      var y = date.getFullYear()
      var m = date.getMonth()
      var d = date.getDate()
      var h = date.getHours()
      var i = date.getMinutes()
      var s = date.getSeconds()
      var nowdate = this.parseTime(new Date(y,m,d,h,i-30,s),"{y}-{m}-{d} {h}:{i}:{s}")
      var agodate = this.parseTime(new Date(y,m,d,h-1,i-30,s),"{y}-{m}-{d} {h}:{i}:{s}")
      this.netWorkParamse.params = {};
      this.netWorkParamse.params["beginAcquisitionTime"] = nowdate
      this.netWorkParamse.params["endAcquisitionTime"] = agodate
      this.getNetWorkList()

      setInterval(()=>{
        var nowdate = this.parseTime(new Date(ys,ms,ds,hs,is-30,ss),"{y}-{m}-{d} {h}:{i}:{s}")
      var dates = new Date()
      var ys = dates.getFullYear()
      var ms = dates.getMonth()
      var ds = dates.getDate()
      var hs = dates.getHours()
      var is = dates.getMinutes()
      var ss = dates.getSeconds()
      var agodate = this.parseTime(new Date(ys,ms,ds,hs-1,is-30,ss),"{y}-{m}-{d} {h}:{i}:{s}")
      this.netWorkParamse.params = {};
      this.netWorkParamse.params["beginAcquisitionTime"] = nowdate
      this.netWorkParamse.params["endAcquisitionTime"] = agodate
        this.getNetWorkList()
        },1000*60*30*this.netTimeNum)
      },
  getNetWorkList(){
    // console.log('断网请求')
    listNetWorkDect(this.netWorkParamse).then((res)=>{
      // console.log('kkkk',this.netTimeNum)
      this.netWokrList = res.data
      this.addNetstatus(this.deviceList,this.netWokrList)
    })
  },
    //添加netstatus属性
  addNetstatus(arr,arr2){
    arr.forEach((x,index)=>{
      if( arr2.indexOf(x.deviceId) != -1){
        this.$set(x,'netStatus','错误')
      }
      else{
        this.$set(x,'netStatus','正常')
      }
    })
  },
  //过滤断网数据
  filterNetData(k,arr,arr2){
    this.addNetstatus(arr,arr2)
    if(k == '正常'){
      this.deviceList=this.deviceList.filter((x)=>{return x.netStatus == '正常' })
    }
    if(k == '错误'){
      this.deviceList=this.deviceList.filter((x)=>{return x.netStatus == '错误' })
    }
    if(k == ''){}
  },


  //断线的
  updateWireTime(){
    //这个时间可用mount.js 查一下怎么用这个东西，就不要原生的了
      var date = new Date()
      var y = date.getFullYear()
      var m = date.getMonth()
      var d = date.getDate()
      var h = date.getHours()
      var i = date.getMinutes()
      var s = date.getSeconds()
      var nowdate = this.parseTime(new Date(y,m,d,h,i-30,s),"{y}-{m}-{d} {h}:{i}:{s}")
      var agodate = this.parseTime(new Date(y,m,d,h-1,i-30,s),"{y}-{m}-{d} {h}:{i}:{s}")
      this.wireParamse.params = {};
      this.wireParamse.params["beginAcquisitionTime"] = nowdate
      this.wireParamse.params["endAcquisitionTime"] = agodate
      this.getWireList()//在getlist有了

      setInterval(()=>{
        nowdate = this.parseTime(new Date(ys,ms,ds,hs,is-30,ss),"{y}-{m}-{d} {h}:{i}:{s}")
        var dates = new Date()
        var ys = dates.getFullYear()
        var ms = dates.getMonth()
        var ds = dates.getDate()
        var hs = dates.getHours()
        var is = dates.getMinutes()
        var ss = dates.getSeconds()
        agodate = this.parseTime(new Date(ys,ms,ds,hs-1,is-30,ss),"{y}-{m}-{d} {h}:{i}:{s}")
        this.wireParamse.beginAcquisitionTime = nowdate
        this.wireParamse.endAcquisitionTime = agodate
        this.getWireList()
        },1000*60*30)
      },
  getWireList(){
    listWireDect(this.wireParamse).then((res)=>{
      this.wireList = res.data
      this.wireList = this.chuliWireDataone()
      this.wireListData = this.chuliWireDatatwo(this.wireList)
      this.addWirestatus(this.deviceList,this.wireList,this.wireListData)
    })
  },
  chuliWireDataone(){
      let arr = []
      this.wireList.forEach((x,i)=>{
        let s = x.split(',')
        arr.push(s[0])
        s = []
      })
      return arr
    },
  chuliWireDatatwo(arr){
    let tempArr = []
      let obj = []
      let resultArr = []
      arr.forEach((x,i)=>{
        if(!tempArr.includes(x)){tempArr.push(x)}
      })
      arr.forEach((v)=>{
        if(obj[v]){obj[v]++}else{obj[v]=1}
      })
      tempArr.forEach((x)=>{
        resultArr.push({id:x,num:obj[x]})
      })
      return resultArr
  },
  //添加wirestatus
  addWirestatus(arr,arr1,arr2){
    var num = 0
    arr.forEach((x,index)=>{
      if(arr1.indexOf(x.deviceId) != -1){
          arr2.forEach((y)=>{
            if(y.id == x.deviceId){
              num = y.num
            }
        })
        this.$set(x,'wireStatus',num)
      }
      else{
        this.$set(x,'wireStatus',num)
      }
      num=0
    })
  },
  filterWireData(k,arr,arr1,arr2){
    arr1 = this.chuliWireDataone()
    arr2 = this.chuliWireDatatwo(arr1)
    this.addWirestatus(arr,arr1,arr2)
    // console.log(this.deviceList,'wireStatus ',k)
    if(k == '正常'){
      this.deviceList = this.deviceList.filter((x)=>{
        console.log('normal',x.wireStatus)
        return x.wireStatus == 0
        
      })
    }

    if(k == '错误'){
      this.deviceList = this.deviceList.filter((x)=>{
        // console.log('error',x.wireStatus)
        return  x.wireStatus != 0
      })
    }
    if(k == ''){}
    // console.log(this.deviceList,'wireStatus 后',k)
  },

},




  mounted(){
    this.netTimeCanShu()//断网的
    this.updateWireTime()//断线的
  }
};
</script>

<style scoped lang="scss">
.label{
  height: 80px;
  text-align: center;
  font-size: 30px;
  color: #5dbec8;
}
</style>

