<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="电解槽名称" prop="electrolyticcellName">
        <el-input
          v-model="queryParams.electrolyticcellName"
          placeholder="请输入电解槽名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="电解槽的位置" prop="electrolyticcellLocation">
        <el-input
          v-model="queryParams.electrolyticcellLocation"
          placeholder="请输入电解槽的位置"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="车间编号，外键" prop="workshopId">
        <el-input
          v-model="queryParams.workshopId"
          placeholder="请输入车间编号，外键"
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
          v-hasPermi="['fac:cell:add']"
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
          v-hasPermi="['fac:cell:edit']"
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
          v-hasPermi="['fac:cell:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['fac:cell:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="cellList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="电解槽编号" align="center" prop="electrolyticcellId" />
      <el-table-column label="电解槽名称" align="center" prop="electrolyticcellName" />
      <el-table-column label="电解槽的位置" align="center" prop="electrolyticcellLocation" />
      <el-table-column label="车间编号，外键" align="center" prop="workshopId" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['fac:cell:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['fac:cell:remove']"
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

    <!-- 添加或修改电解槽管理对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="电解槽名称" prop="electrolyticcellName">
          <el-input v-model="form.electrolyticcellName" placeholder="请输入电解槽名称" />
        </el-form-item>
        <el-form-item label="电解槽的位置" prop="electrolyticcellLocation">
          <el-input v-model="form.electrolyticcellLocation" placeholder="请输入电解槽的位置" />
        </el-form-item>
        <el-form-item label="车间编号，外键" prop="workshopId">
          <el-input v-model="form.workshopId" placeholder="请输入车间编号，外键" />
        </el-form-item>
        <el-divider content-position="center">设备管理信息</el-divider>
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAddFacEndDevice">添加</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="handleDeleteFacEndDevice">删除</el-button>
          </el-col>
        </el-row>
        <el-table :data="facEndDeviceList" :row-class-name="rowFacEndDeviceIndex" @selection-change="handleFacEndDeviceSelectionChange" ref="facEndDevice">
          <el-table-column type="selection" width="50" align="center" />
          <el-table-column label="序号" align="center" prop="index" width="50"/>
          <el-table-column label="设备名称" prop="deviceName" width="150">
            <template slot-scope="scope">
              <el-input v-model="scope.row.deviceName" placeholder="请输入设备名称" />
            </template>
          </el-table-column>
          <el-table-column label="设备所在电解槽的位置" prop="location" width="150">
            <template slot-scope="scope">
              <el-input v-model="scope.row.location" placeholder="请输入设备所在电解槽的位置" />
            </template>
          </el-table-column>
          <el-table-column label="设备状态" prop="deviceStatus" width="150">
            <template slot-scope="scope">
              <el-select v-model="scope.row.deviceStatus" placeholder="请选择设备状态">
                <el-option label="请选择字典生成" value="" />
              </el-select>
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
import { listCell, getCell, delCell, addCell, updateCell } from "@/api/fac/cell";

export default {
  name: "Cell",
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 子表选中数据
      checkedFacEndDevice: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 电解槽管理表格数据
      cellList: [],
      // 设备管理表格数据
      facEndDeviceList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        electrolyticcellName: null,
        electrolyticcellLocation: null,
        workshopId: null
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
    /** 查询电解槽管理列表 */
    getList() {
      this.loading = true;
      listCell(this.queryParams).then(response => {
        this.cellList = response.rows;
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
        electrolyticcellId: null,
        electrolyticcellName: null,
        electrolyticcellLocation: null,
        workshopId: null
      };
      this.facEndDeviceList = [];
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
      this.ids = selection.map(item => item.electrolyticcellId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加电解槽管理";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const electrolyticcellId = row.electrolyticcellId || this.ids
      getCell(electrolyticcellId).then(response => {
        this.form = response.data;
        this.facEndDeviceList = response.data.facEndDeviceList;
        this.open = true;
        this.title = "修改电解槽管理";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.form.facEndDeviceList = this.facEndDeviceList;
          if (this.form.electrolyticcellId != null) {
            updateCell(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addCell(this.form).then(response => {
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
      const electrolyticcellIds = row.electrolyticcellId || this.ids;
      this.$modal.confirm('是否确认删除电解槽管理编号为"' + electrolyticcellIds + '"的数据项？').then(function() {
        return delCell(electrolyticcellIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
	/** 设备管理序号 */
    rowFacEndDeviceIndex({ row, rowIndex }) {
      row.index = rowIndex + 1;
    },
    /** 设备管理添加按钮操作 */
    handleAddFacEndDevice() {
      let obj = {};
      obj.deviceName = "";
      obj.location = "";
      obj.deviceStatus = "";
      this.facEndDeviceList.push(obj);
    },
    /** 设备管理删除按钮操作 */
    handleDeleteFacEndDevice() {
      if (this.checkedFacEndDevice.length == 0) {
        this.$modal.msgError("请先选择要删除的设备管理数据");
      } else {
        const facEndDeviceList = this.facEndDeviceList;
        const checkedFacEndDevice = this.checkedFacEndDevice;
        this.facEndDeviceList = facEndDeviceList.filter(function(item) {
          return checkedFacEndDevice.indexOf(item.index) == -1
        });
      }
    },
    /** 复选框选中数据 */
    handleFacEndDeviceSelectionChange(selection) {
      this.checkedFacEndDevice = selection.map(item => item.index)
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('fac/cell/export', {
        ...this.queryParams
      }, `cell_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
