<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="故障发生的时间" prop="happenTime">
        <el-date-picker clearable
          v-model="queryParams.happenTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择故障发生的时间">
        </el-date-picker>
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
          v-hasPermi="['fac:cellError:add']"
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
          v-hasPermi="['fac:cellError:edit']"
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
          v-hasPermi="['fac:cellError:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['fac:cellError:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="cellErrorList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="编号" align="center" prop="id" />
      <el-table-column label="故障发生的时间" align="center" prop="happenTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.happenTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="所属电解槽的名称" align="center" prop="electrolyticCellName" />
      <el-table-column label="故障电解槽的位置" align="center" prop="electrolyticCellLocation" />
      <el-table-column label="所属车间的名称" align="center" prop="workshopName" />
      <el-table-column label="所属工厂的名称" align="center" prop="factoryName" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['fac:cellError:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['fac:cellError:remove']"
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

    <!-- 添加或修改电解槽故障对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="故障发生的时间" prop="happenTime">
          <el-date-picker clearable
            v-model="form.happenTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择故障发生的时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="所属电解槽的编号" prop="electrolyticCellId">
          <el-input v-model="form.electrolyticCellId" placeholder="请输入所属电解槽的编号" />
        </el-form-item>
        <el-form-item label="所属电解槽的名称" prop="electrolyticCellName">
          <el-input v-model="form.electrolyticCellName" placeholder="请输入所属电解槽的名称" />
        </el-form-item>
        <el-form-item label="故障电解槽的位置" prop="electrolyticCellLocation">
          <el-input v-model="form.electrolyticCellLocation" placeholder="请输入故障电解槽的位置" />
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
import { listCellError, getCellError, delCellError, addCellError, updateCellError } from "@/api/fac/cellError";

export default {
  name: "CellError",
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
      // 电解槽故障表格数据
      cellErrorList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        happenTime: null,
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
    /** 查询电解槽故障列表 */
    getList() {
      this.loading = true;
      listCellError(this.queryParams).then(response => {
        this.cellErrorList = response.rows;
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
        id: null,
        happenTime: null,
        electrolyticCellId: null,
        electrolyticCellName: null,
        electrolyticCellLocation: null,
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
      this.ids = selection.map(item => item.id)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加电解槽故障";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getCellError(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改电解槽故障";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateCellError(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addCellError(this.form).then(response => {
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
      const ids = row.id || this.ids;
      this.$modal.confirm('是否确认删除电解槽故障编号为"' + ids + '"的数据项？').then(function() {
        return delCellError(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('fac/cellError/export', {
        ...this.queryParams
      }, `cellError_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
