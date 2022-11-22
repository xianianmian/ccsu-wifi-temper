<template>
  <el-table
    :data="tableData"
    style="width: 100%"
    :row-class-name="tableRowClassName"
  >
    <el-table-column
      prop="zb"
      label="电解槽"
      width="100"
    >
    </el-table-column>
    <el-table-column
      prop="tp"
      label="温度"
      width="100"
    >
    </el-table-column>
    <el-table-column
      prop="state"
      label="运行状况"
    >
    </el-table-column>
  </el-table>
</template>

<style>
.el-table .warning-row {
  background: oldlace;
}

.el-table .success-row {
  background: #f0f9eb;
}
</style>

<script>
export default {
  methods: {
    tableRowClassName({ row, rowIndex }) {
      if (row.state === '异常') {
        return 'warning-row'
      } else if (row.state === '正常') {
        return 'success-row'
      }
      return ''
    }
  },
  data() {
    return {
      tableData: [{
        zb: 'zigbee1',
        tp: '1',
        state: '正常'
        },
        {
          zb: 'zigbee1',
          tp: '2',
          state: '正常'
        },
        {
          zb: 'zigbee2',
          tp: '1',
          state: '异常'
        },
        {
          zb: 'zigbee2',
          tp: '2',
          state: '正常'
        },
        {
          zb: 'zigbee3',
          tp: '1',
          state: '正常'
        },
        {
          zb: 'zigbee3',
          tp: '2',
          state: '正常'
        }
        ]
    }
  }
}
</script>
