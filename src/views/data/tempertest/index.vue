<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="温度1" prop="temp1">
        <el-input
          v-model="queryParams.temp1"
          placeholder="请输入温度1"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="温度2" prop="temp2">
        <el-input
          v-model="queryParams.temp2"
          placeholder="请输入温度2"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="温度3" prop="temp3">
        <el-input
          v-model="queryParams.temp3"
          placeholder="请输入温度3"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="温度4" prop="temp4">
        <el-input
          v-model="queryParams.temp4"
          placeholder="请输入温度4"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="温度5" prop="temp5">
        <el-input
          v-model="queryParams.temp5"
          placeholder="请输入温度5"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="温度6" prop="temp6">
        <el-input
          v-model="queryParams.temp6"
          placeholder="请输入温度6"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="温度7" prop="temp7">
        <el-input
          v-model="queryParams.temp7"
          placeholder="请输入温度7"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="温度8" prop="temp8">
        <el-input
          v-model="queryParams.temp8"
          placeholder="请输入温度8"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="温度9" prop="temp9">
        <el-input
          v-model="queryParams.temp9"
          placeholder="请输入温度9"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="温度10" prop="temp10">
        <el-input
          v-model="queryParams.temp10"
          placeholder="请输入温度10"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="采集时间" prop="time">
        <el-date-picker clearable
          v-model="queryParams.time"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择采集时间">
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
          v-hasPermi="['data:tempertest:add']"
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
          v-hasPermi="['data:tempertest:edit']"
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
          v-hasPermi="['data:tempertest:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['data:tempertest:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="tempertestList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="id" align="center" prop="id" />
      <el-table-column label="温度1" align="center" prop="temp1" />
      <el-table-column label="温度2" align="center" prop="temp2" />
      <el-table-column label="温度3" align="center" prop="temp3" />
      <el-table-column label="温度4" align="center" prop="temp4" />
      <el-table-column label="温度5" align="center" prop="temp5" />
      <el-table-column label="温度6" align="center" prop="temp6" />
      <el-table-column label="温度7" align="center" prop="temp7" />
      <el-table-column label="温度8" align="center" prop="temp8" />
      <el-table-column label="温度9" align="center" prop="temp9" />
      <el-table-column label="温度10" align="center" prop="temp10" />
      <el-table-column label="采集时间" align="center" prop="time" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.time, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['data:tempertest:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['data:tempertest:remove']"
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

    <!-- 添加或修改温度数据测试对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="温度1" prop="temp1">
          <el-input v-model="form.temp1" placeholder="请输入温度1" />
        </el-form-item>
        <el-form-item label="温度2" prop="temp2">
          <el-input v-model="form.temp2" placeholder="请输入温度2" />
        </el-form-item>
        <el-form-item label="温度3" prop="temp3">
          <el-input v-model="form.temp3" placeholder="请输入温度3" />
        </el-form-item>
        <el-form-item label="温度4" prop="temp4">
          <el-input v-model="form.temp4" placeholder="请输入温度4" />
        </el-form-item>
        <el-form-item label="温度5" prop="temp5">
          <el-input v-model="form.temp5" placeholder="请输入温度5" />
        </el-form-item>
        <el-form-item label="温度6" prop="temp6">
          <el-input v-model="form.temp6" placeholder="请输入温度6" />
        </el-form-item>
        <el-form-item label="温度7" prop="temp7">
          <el-input v-model="form.temp7" placeholder="请输入温度7" />
        </el-form-item>
        <el-form-item label="温度8" prop="temp8">
          <el-input v-model="form.temp8" placeholder="请输入温度8" />
        </el-form-item>
        <el-form-item label="温度9" prop="temp9">
          <el-input v-model="form.temp9" placeholder="请输入温度9" />
        </el-form-item>
        <el-form-item label="温度10" prop="temp10">
          <el-input v-model="form.temp10" placeholder="请输入温度10" />
        </el-form-item>
        <el-form-item label="采集时间" prop="time">
          <el-date-picker clearable
            v-model="form.time"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="请选择采集时间">
          </el-date-picker>
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
import { listTempertest, getTempertest, delTempertest, addTempertest, updateTempertest } from "@/api/data/tempertest";

export default {
  name: "Tempertest",
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
      // 温度数据测试表格数据
      tempertestList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        temp1: null,
        temp2: null,
        temp3: null,
        temp4: null,
        temp5: null,
        temp6: null,
        temp7: null,
        temp8: null,
        temp9: null,
        temp10: null,
        time: null
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
    /** 查询温度数据测试列表 */
    getList() {
      this.loading = true;
      listTempertest(this.queryParams).then(response => {
        this.tempertestList = response.rows;
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
        temp1: null,
        temp2: null,
        temp3: null,
        temp4: null,
        temp5: null,
        temp6: null,
        temp7: null,
        temp8: null,
        temp9: null,
        temp10: null,
        time: null
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
      this.title = "添加温度数据测试";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getTempertest(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改温度数据测试";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateTempertest(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addTempertest(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除温度数据测试编号为"' + ids + '"的数据项？').then(function() {
        return delTempertest(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('data/tempertest/export', {
        ...this.queryParams
      }, `tempertest_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
