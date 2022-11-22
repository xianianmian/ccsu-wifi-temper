<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="工厂名称" prop="factoryName">
        <el-input
          v-model="queryParams.factoryName"
          placeholder="请输入工厂名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="工厂地址" prop="factoryLocation">
        <el-input
          v-model="queryParams.factoryLocation"
          placeholder="请输入工厂地址"
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
          v-hasPermi="['fac:factoryManage:add']"
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
          v-hasPermi="['fac:factoryManage:edit']"
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
          v-hasPermi="['fac:factoryManage:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['fac:factoryManage:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="factoryManageList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="工厂编号" align="center" prop="factoryId" />
      <el-table-column label="工厂名称" align="center" prop="factoryName" />
      <el-table-column label="工厂地址" align="center" prop="factoryLocation" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['fac:factoryManage:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['fac:factoryManage:remove']"
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

    <!-- 添加或修改工厂管理对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="工厂名称" prop="factoryName">
          <el-input v-model="form.factoryName" placeholder="请输入工厂名称" />
        </el-form-item>
        <el-form-item label="工厂地址" prop="factoryLocation">
          <el-input v-model="form.factoryLocation" placeholder="请输入工厂地址" />
        </el-form-item>
        <el-divider content-position="center">车间管理信息</el-divider>
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAddFacWorkshop">添加</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="handleDeleteFacWorkshop">删除</el-button>
          </el-col>
        </el-row>
        <el-table :data="facWorkshopList" :row-class-name="rowFacWorkshopIndex" @selection-change="handleFacWorkshopSelectionChange" ref="facWorkshop">
          <el-table-column type="selection" width="50" align="center" />
          <el-table-column label="序号" align="center" prop="index" width="50"/>
          <el-table-column label="车间名称" prop="workshopName" width="150">
            <template slot-scope="scope">
              <el-input v-model="scope.row.workshopName" placeholder="请输入车间名称" />
            </template>
          </el-table-column>
          <el-table-column label="车间位置" prop="workshopLocation" width="150">
            <template slot-scope="scope">
              <el-input v-model="scope.row.workshopLocation" placeholder="请输入车间位置" />
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
import { listFactoryManage, getFactoryManage, delFactoryManage, addFactoryManage, updateFactoryManage } from "@/api/fac/factoryManage";

export default {
  name: "FactoryManage",
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 子表选中数据
      checkedFacWorkshop: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 工厂管理表格数据
      factoryManageList: [],
      // 车间管理表格数据
      facWorkshopList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        factoryName: null,
        factoryLocation: null
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
    /** 查询工厂管理列表 */
    getList() {
      this.loading = true;
      listFactoryManage(this.queryParams).then(response => {
        this.factoryManageList = response.rows;
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
        factoryId: null,
        factoryName: null,
        factoryLocation: null
      };
      this.facWorkshopList = [];
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
      this.ids = selection.map(item => item.factoryId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加工厂管理";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const factoryId = row.factoryId || this.ids
      getFactoryManage(factoryId).then(response => {
        this.form = response.data;
        this.facWorkshopList = response.data.facWorkshopList;
        this.open = true;
        this.title = "修改工厂管理";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.form.facWorkshopList = this.facWorkshopList;
          if (this.form.factoryId != null) {
            updateFactoryManage(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addFactoryManage(this.form).then(response => {
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
      const factoryIds = row.factoryId || this.ids;
      this.$modal.confirm('是否确认删除工厂管理编号为"' + factoryIds + '"的数据项？').then(function() {
        return delFactoryManage(factoryIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
	/** 车间管理序号 */
    rowFacWorkshopIndex({ row, rowIndex }) {
      row.index = rowIndex + 1;
    },
    /** 车间管理添加按钮操作 */
    handleAddFacWorkshop() {
      let obj = {};
      obj.workshopName = "";
      obj.workshopLocation = "";
      this.facWorkshopList.push(obj);
    },
    /** 车间管理删除按钮操作 */
    handleDeleteFacWorkshop() {
      if (this.checkedFacWorkshop.length == 0) {
        this.$modal.msgError("请先选择要删除的车间管理数据");
      } else {
        const facWorkshopList = this.facWorkshopList;
        const checkedFacWorkshop = this.checkedFacWorkshop;
        this.facWorkshopList = facWorkshopList.filter(function(item) {
          return checkedFacWorkshop.indexOf(item.index) == -1
        });
      }
    },
    /** 复选框选中数据 */
    handleFacWorkshopSelectionChange(selection) {
      this.checkedFacWorkshop = selection.map(item => item.index)
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('fac/factoryManage/export', {
        ...this.queryParams
      }, `factoryManage_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
