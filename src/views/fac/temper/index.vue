<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="温度值" prop="temp">
        <el-input
          v-model="queryParams.temp"
          placeholder="请输入温度值"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="采集的时间" prop="acquisitionTime">
        <el-date-picker clearable
          v-model="queryParams.acquisitionTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择采集的时间">
        </el-date-picker>
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
      <el-form-item label="热电偶的编号" prop="thermocoupleId">
        <el-input
          v-model="queryParams.thermocoupleId"
          placeholder="请输入热电偶的编号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="热电偶的名称" prop="thermocoupleName">
        <el-input
          v-model="queryParams.thermocoupleName"
          placeholder="请输入热电偶的名称"
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
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['fac:temper:add']"
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
          v-hasPermi="['fac:temper:edit']"
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
          v-hasPermi="['fac:temper:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['fac:temper:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="temperList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="编号" align="center" prop="temperId" />
      <el-table-column label="温度值" align="center" prop="temp" />
      <el-table-column label="采集的时间" align="center" prop="acquisitionTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.acquisitionTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="终端设备的编号" align="center" prop="deviceId" />
      <el-table-column label="终端设备的名称" align="center" prop="deviceName" />
      <el-table-column label="热电偶的编号" align="center" prop="thermocoupleId" />
      <el-table-column label="热电偶的名称" align="center" prop="thermocoupleName" />
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
            v-hasPermi="['fac:temper:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['fac:temper:remove']"
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

    <!-- 添加或修改温度管理对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="温度值" prop="temp">
          <el-input v-model="form.temp" placeholder="请输入温度值" />
        </el-form-item>
        <el-form-item label="采集的时间" prop="acquisitionTime">
          <el-date-picker clearable
            v-model="form.acquisitionTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择采集的时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="终端设备的编号" prop="deviceId">
          <el-input v-model="form.deviceId" placeholder="请输入终端设备的编号" />
        </el-form-item>
        <el-form-item label="终端设备的名称" prop="deviceName">
          <el-input v-model="form.deviceName" placeholder="请输入终端设备的名称" />
        </el-form-item>
        <el-form-item label="热电偶的编号" prop="thermocoupleId">
          <el-input v-model="form.thermocoupleId" placeholder="请输入热电偶的编号" />
        </el-form-item>
        <el-form-item label="热电偶的名称" prop="thermocoupleName">
          <el-input v-model="form.thermocoupleName" placeholder="请输入热电偶的名称" />
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
import { listTemper, getTemper, delTemper, addTemper, updateTemper } from "@/api/fac/temper";

export default {
  name: "Temper",
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
      // 温度管理表格数据
      temperList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        temp: null,
        acquisitionTime: null,
        deviceId: null,
        deviceName: null,
        thermocoupleId: null,
        thermocoupleName: null,
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
    /** 查询温度管理列表 */
    getList() {
      this.loading = true;
      listTemper(this.queryParams).then(response => {
        this.temperList = response.rows;
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
        temperId: null,
        temp: null,
        acquisitionTime: null,
        deviceId: null,
        deviceName: null,
        thermocoupleId: null,
        thermocoupleName: null,
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
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.temperId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加温度管理";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const temperId = row.temperId || this.ids
      getTemper(temperId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改温度管理";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.temperId != null) {
            updateTemper(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addTemper(this.form).then(response => {
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
      const temperIds = row.temperId || this.ids;
      this.$modal.confirm('是否确认删除温度管理编号为"' + temperIds + '"的数据项？').then(function() {
        return delTemper(temperIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('fac/temper/export', {
        ...this.queryParams
      }, `temper_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
