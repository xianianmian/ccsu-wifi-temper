<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="热点偶名称" prop="thermocoupleName">
        <el-input
          v-model="queryParams.thermocoupleName"
          placeholder="请输入热点偶名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="热点偶所在的位置" prop="thermocoupleLocation">
        <el-input
          v-model="queryParams.thermocoupleLocation"
          placeholder="请输入热点偶所在的位置"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="所属的终端名称" prop="endDeviceId">
        <el-input
          v-model="queryParams.endDeviceId"
          placeholder="请输入所属的终端编号"
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
          v-hasPermi="['fac:thermocouple:add']"
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
          v-hasPermi="['fac:thermocouple:edit']"
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
          v-hasPermi="['fac:thermocouple:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['fac:thermocouple:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="thermocoupleList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="热点偶编号" align="center" prop="thermocoupleId" />
      <el-table-column label="热点偶名称" align="center" prop="thermocoupleName" />
      <el-table-column label="热点偶所在的位置" align="center" prop="thermocoupleLocation" />
      <el-table-column label="所属的终端编号" align="center" prop="endDeviceId" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['fac:thermocouple:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['fac:thermocouple:remove']"
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

    <!-- 添加或修改热电偶对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="热点偶编号" prop="thermocoupleId">
          <el-input v-model="form.thermocoupleId" placeholder="请输入热点偶编号" />
        </el-form-item>
        <el-form-item label="热点偶名称" prop="thermocoupleName">
          <el-input v-model="form.thermocoupleName" placeholder="请输入热点偶名称" />
        </el-form-item>
        <el-form-item label="热点偶所在的位置" prop="thermocoupleLocation">
          <el-input v-model="form.thermocoupleLocation" placeholder="请输入热点偶所在的位置" />
        </el-form-item>
        <el-form-item label="所属的终端编号" prop="endDeviceId">
          <el-input v-model="form.endDeviceId" placeholder="请输入所属的终端编号" />
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
import { listThermocouple, getThermocouple, delThermocouple, addThermocouple, updateThermocouple } from "@/api/fac/thermocouple";

export default {
  name: "Thermocouple",
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
      // 热电偶表格数据
      thermocoupleList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        thermocoupleName: null,
        thermocoupleLocation: null,
        endDeviceId: null
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
    /** 查询热电偶列表 */
    getList() {
      this.loading = true;
      listThermocouple(this.queryParams).then(response => {
        this.thermocoupleList = response.rows;
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
        thermocoupleId: null,
        thermocoupleName: null,
        thermocoupleLocation: null,
        endDeviceId: null
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
      this.ids = selection.map(item => item.thermocoupleId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加热电偶";
      this.isEdit=false
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const thermocoupleId = row.thermocoupleId || this.ids
      getThermocouple(thermocoupleId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改热电偶";
        this.isEdit=true
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.isEdit) {
            updateThermocouple(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addThermocouple(this.form).then(response => {
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
      const thermocoupleIds = row.thermocoupleId || this.ids;
      this.$modal.confirm('是否确认删除热电偶编号为"' + thermocoupleIds + '"的数据项？').then(function() {
        return delThermocouple(thermocoupleIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('fac/thermocouple/export', {
        ...this.queryParams
      }, `thermocouple_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
