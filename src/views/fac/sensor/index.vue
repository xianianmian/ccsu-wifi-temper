<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="170px">
      <el-form-item label="数值" prop="value">
        <el-input
          v-model="queryParams.value"
          placeholder="请输入数值"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="数据类型" prop="type">
        <el-select v-model="queryParams.type" placeholder="请选择数据类型" clearable>
          <el-option
            v-for="dict in dict.type.fac_sensor_type"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="采集的时间">
        <el-date-picker
          v-model="daterangeAcquisitionTime"
          style="width: 240px"
          value-format="yyyy-MM-dd HH:mm:ss"
          type="datetimerange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="所属热电偶的编号" prop="thermocoupleId">
        <el-input
          v-model="queryParams.thermocoupleId"
          placeholder="请输入所属热电偶的编号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="所属热电偶的名称" prop="thermocoupleName">
        <el-input
          v-model="queryParams.thermocoupleName"
          placeholder="请输入所属热电偶的名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="所属热电偶的位置" prop="thermocoupleLocation">
        <el-input
          v-model="queryParams.thermocoupleLocation"
          placeholder="请输入所属热电偶的位置"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="终端设备的编号" prop="deviceId">
        <el-input
          v-model="queryParams.deviceId"
          placeholder="请输入终端设备的编号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="终端设备的名称" prop="deviceName">
        <el-input
          v-model="queryParams.deviceName"
          placeholder="请输入终端设备的名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="所属电解槽的编号" prop="electrolyticCellId">
        <el-input
          v-model="queryParams.electrolyticCellId"
          placeholder="请输入所属电解槽的编号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="所属电解槽的名称" prop="electrolyticCellName">
        <el-input
          v-model="queryParams.electrolyticCellName"
          placeholder="请输入所属电解槽的名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="所属车间的编号" prop="workshopId">
        <el-input
          v-model="queryParams.workshopId"
          placeholder="请输入所属车间的编号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="所属车间的名称" prop="workshopName">
        <el-input
          v-model="queryParams.workshopName"
          placeholder="请输入所属车间的名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="所属工厂的编号" prop="factoryId">
        <el-input
          v-model="queryParams.factoryId"
          placeholder="请输入所属工厂的编号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="所属工厂的名称" prop="factoryName">
        <el-input
          v-model="queryParams.factoryName"
          placeholder="请输入所属工厂的名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['fac:sensor:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="sensorList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="传感器数据编号" align="center" prop="sensorDataId" />
      <el-table-column label="数值" align="center" prop="value" />
      <el-table-column label="数据类型" align="center" prop="type">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.fac_sensor_type" :value="scope.row.type"/>
        </template>
      </el-table-column>
      <el-table-column label="采集的时间" align="center" prop="acquisitionTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.acquisitionTime, '{y}-{m}-{d} {h}-{i}-{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="所属热电偶的编号" align="center" prop="thermocoupleId" />
      <el-table-column label="所属热电偶的名称" align="center" prop="thermocoupleName" />
      <el-table-column label="所属热电偶的位置" align="center" prop="thermocoupleLocation" />
      <el-table-column label="终端设备的编号" align="center" prop="deviceId" />
      <el-table-column label="终端设备的名称" align="center" prop="deviceName" />
      <el-table-column label="所属电解槽的编号" align="center" prop="electrolyticCellId" />
      <el-table-column label="所属电解槽的名称" align="center" prop="electrolyticCellName" />
      <el-table-column label="所属车间的编号" align="center" prop="workshopId" />
      <el-table-column label="所属车间的名称" align="center" prop="workshopName" />
      <el-table-column label="所属工厂的编号" align="center" prop="factoryId" />
      <el-table-column label="所属工厂的名称" align="center" prop="factoryName" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['fac:sensor:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['fac:sensor:remove']"
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

    <!-- 添加或修改传感器数据对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="数值" prop="value">
          <el-input v-model="form.value" placeholder="请输入数值" />
        </el-form-item>
        <el-form-item label="数据类型" prop="type">
          <el-select v-model="form.type" placeholder="请选择数据类型">
            <el-option
              v-for="dict in dict.type.fac_sensor_type"
              :key="dict.value"
              :label="dict.label"
:value="dict.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="采集的时间" prop="acquisitionTime">
          <el-date-picker clearable
            v-model="form.acquisitionTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择采集的时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="所属热电偶的编号" prop="thermocoupleId">
          <el-input v-model="form.thermocoupleId" placeholder="请输入所属热电偶的编号" />
        </el-form-item>
        <el-form-item label="所属热电偶的名称" prop="thermocoupleName">
          <el-input v-model="form.thermocoupleName" placeholder="请输入所属热电偶的名称" />
        </el-form-item>
        <el-form-item label="所属热电偶的位置" prop="thermocoupleLocation">
          <el-input v-model="form.thermocoupleLocation" placeholder="请输入所属热电偶的位置" />
        </el-form-item>
        <el-form-item label="终端设备的编号" prop="deviceId">
          <el-input v-model="form.deviceId" placeholder="请输入终端设备的编号" />
        </el-form-item>
        <el-form-item label="终端设备的名称" prop="deviceName">
          <el-input v-model="form.deviceName" placeholder="请输入终端设备的名称" />
        </el-form-item>
        <el-form-item label="所属电解槽的编号" prop="electrolyticCellId">
          <el-input v-model="form.electrolyticCellId" placeholder="请输入所属电解槽的编号" />
        </el-form-item>
        <el-form-item label="所属电解槽的名称" prop="electrolyticCellName">
          <el-input v-model="form.electrolyticCellName" placeholder="请输入所属电解槽的名称" />
        </el-form-item>
        <el-form-item label="所属车间的编号" prop="workshopId">
          <el-input v-model="form.workshopId" placeholder="请输入所属车间的编号" />
        </el-form-item>
        <el-form-item label="所属车间的名称" prop="workshopName">
          <el-input v-model="form.workshopName" placeholder="请输入所属车间的名称" />
        </el-form-item>
        <el-form-item label="所属工厂的编号" prop="factoryId">
          <el-input v-model="form.factoryId" placeholder="请输入所属工厂的编号" />
        </el-form-item>
        <el-form-item label="所属工厂的名称" prop="factoryName">
          <el-input v-model="form.factoryName" placeholder="请输入所属工厂的名称" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listSensor, getSensor, delSensor, addSensor, updateSensor } from "@/api/fac/sensor";

export default {
  name: "Sensor",
  dicts: ['fac_sensor_type'],
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 传感器数据表格数据
      sensorList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 所属工厂的名称时间范围
      daterangeAcquisitionTime: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        value: null,
        type: null,
        acquisitionTime: null,
        thermocoupleId: null,
        thermocoupleName: null,
        thermocoupleLocation: null,
        deviceId: null,
        deviceName: null,
        electrolyticCellId: null,
        electrolyticCellName: null,
        workshopId: null,
        workshopName: null,
        factoryId: null,
        factoryName: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询传感器数据列表 */
    getList() {
      this.loading = true;
      this.queryParams.params = {};
      if (null != this.daterangeAcquisitionTime && '' != this.daterangeAcquisitionTime) {
        this.queryParams.params["beginAcquisitionTime"] = this.daterangeAcquisitionTime[0];
        this.queryParams.params["endAcquisitionTime"] = this.daterangeAcquisitionTime[1];
      }
      listSensor(this.queryParams).then(response => {
        this.sensorList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        sensorDataId: null,
        value: null,
        type: null,
        acquisitionTime: null,
        thermocoupleId: null,
        thermocoupleName: null,
        thermocoupleLocation: null,
        deviceId: null,
        deviceName: null,
        electrolyticCellId: null,
        electrolyticCellName: null,
        workshopId: null,
        workshopName: null,
        factoryId: null,
        factoryName: null
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.daterangeAcquisitionTime = [];
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.sensorDataId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加传感器数据";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const sensorDataId = row.sensorDataId || this.ids
      getSensor(sensorDataId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改传感器数据";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.sensorDataId != null) {
            updateSensor(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addSensor(this.form).then(response => {
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
      const sensorDataIds = row.sensorDataId || this.ids;
      this.$modal.confirm('是否确认删除传感器数据编号为"' + sensorDataIds + '"的数据项？').then(function() {
        return delSensor(sensorDataIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('fac/sensor/export', {
        ...this.queryParams
      }, `sensor_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
