<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="设备名称" prop="deviceName">
        <el-input
          v-model="queryParams.deviceName"
          placeholder="请输入设备名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="设备所在电解槽的位置" prop="location">
        <el-input
          v-model="queryParams.location"
          placeholder="请输入设备所在电解槽的位置"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="设备所属的电解槽的编号" prop="electrolyticellId">
        <el-input
          v-model="queryParams.electrolyticellId"
          placeholder="请输入设备所属的电解槽的编号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="设备状态" prop="deviceStatus">
        <el-select v-model="queryParams.deviceStatus" placeholder="请选择设备状态" clearable>
          <el-option
            v-for="dict in dict.type.fac_device_state"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

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

export default {
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
      isEdit:false
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询设备管理列表 */
    getList() {
      this.loading = true;
      listDevice(this.queryParams).then(response => {
        this.deviceList = response.rows;
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
    }
  }
};
</script>
