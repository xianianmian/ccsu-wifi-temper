<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="车间名称" prop="workshopName">
        <el-input
          v-model="queryParams.workshopName"
          placeholder="请输入车间名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="车间位置" prop="workshopLocation">
        <el-input
          v-model="queryParams.workshopLocation"
          placeholder="请输入车间位置"
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
          v-hasPermi="['fac:workshop:add']"
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
          v-hasPermi="['fac:workshop:edit']"
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
          v-hasPermi="['fac:workshop:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['fac:workshop:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="workshopList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="车间编号，自增" align="center" prop="workshopId" />
      <el-table-column label="车间名称" align="center" prop="workshopName" />
      <el-table-column label="车间位置" align="center" prop="workshopLocation" />
      <el-table-column label="所属工厂的编号" align="center" prop="factoryId" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['fac:workshop:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['fac:workshop:remove']"
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

    <!-- 添加或修改生产车间对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="车间名称" prop="workshopName">
          <el-input v-model="form.workshopName" placeholder="请输入车间名称" />
        </el-form-item>
        <el-form-item label="车间位置" prop="workshopLocation">
          <el-input v-model="form.workshopLocation" placeholder="请输入车间位置" />
        </el-form-item>
        <el-form-item label="所属工厂的编号" prop="factoryId">
          <el-input v-model="form.factoryId" placeholder="请输入所属工厂的编号" />
        </el-form-item>
        <el-divider content-position="center">电解槽管理信息</el-divider>
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAddFacElectrolyticCell">添加</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="handleDeleteFacElectrolyticCell">删除</el-button>
          </el-col>
        </el-row>
        <el-table :data="facElectrolyticCellList" :row-class-name="rowFacElectrolyticCellIndex" @selection-change="handleFacElectrolyticCellSelectionChange" ref="facElectrolyticCell">
          <el-table-column type="selection" width="50" align="center" />
          <el-table-column label="序号" align="center" prop="index" width="50"/>
          <el-table-column label="电解槽名称" prop="electrolyticcellName" width="150">
            <template slot-scope="scope">
              <el-input v-model="scope.row.electrolyticcellName" placeholder="请输入电解槽名称" />
            </template>
          </el-table-column>
          <el-table-column label="电解槽的位置" prop="electrolyticcellLocation" width="150">
            <template slot-scope="scope">
              <el-input v-model="scope.row.electrolyticcellLocation" placeholder="请输入电解槽的位置" />
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
import { listWorkshop, getWorkshop, delWorkshop, addWorkshop, updateWorkshop } from "@/api/fac/workshop";

export default {
  name: "Workshop",
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 子表选中数据
      checkedFacElectrolyticCell: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 生产车间表格数据
      workshopList: [],
      // 电解槽管理表格数据
      facElectrolyticCellList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        workshopName: null,
        workshopLocation: null,
        factoryId: null
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
    /** 查询生产车间列表 */
    getList() {
      this.loading = true;
      listWorkshop(this.queryParams).then(response => {
        this.workshopList = response.rows;
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
        workshopId: null,
        workshopName: null,
        workshopLocation: null,
        factoryId: null
      };
      this.facElectrolyticCellList = [];
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
      this.ids = selection.map(item => item.workshopId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加生产车间";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const workshopId = row.workshopId || this.ids
      getWorkshop(workshopId).then(response => {
        this.form = response.data;
        this.facElectrolyticCellList = response.data.facElectrolyticCellList;
        this.open = true;
        this.title = "修改生产车间";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.form.facElectrolyticCellList = this.facElectrolyticCellList;
          if (this.form.workshopId != null) {
            updateWorkshop(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addWorkshop(this.form).then(response => {
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
      const workshopIds = row.workshopId || this.ids;
      this.$modal.confirm('是否确认删除生产车间编号为"' + workshopIds + '"的数据项？').then(function() {
        return delWorkshop(workshopIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
	/** 电解槽管理序号 */
    rowFacElectrolyticCellIndex({ row, rowIndex }) {
      row.index = rowIndex + 1;
    },
    /** 电解槽管理添加按钮操作 */
    handleAddFacElectrolyticCell() {
      let obj = {};
      obj.electrolyticcellName = "";
      obj.electrolyticcellLocation = "";
      this.facElectrolyticCellList.push(obj);
    },
    /** 电解槽管理删除按钮操作 */
    handleDeleteFacElectrolyticCell() {
      if (this.checkedFacElectrolyticCell.length == 0) {
        this.$modal.msgError("请先选择要删除的电解槽管理数据");
      } else {
        const facElectrolyticCellList = this.facElectrolyticCellList;
        const checkedFacElectrolyticCell = this.checkedFacElectrolyticCell;
        this.facElectrolyticCellList = facElectrolyticCellList.filter(function(item) {
          return checkedFacElectrolyticCell.indexOf(item.index) == -1
        });
      }
    },
    /** 复选框选中数据 */
    handleFacElectrolyticCellSelectionChange(selection) {
      this.checkedFacElectrolyticCell = selection.map(item => item.index)
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('fac/workshop/export', {
        ...this.queryParams
      }, `workshop_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
