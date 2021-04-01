<!--
 * @Author: daping
 * @Date: 2021-03-04 15:16:16
 * @LastEditTime: 2021-03-24 11:47:49
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \data-dip-web\src\views\targetDataSource-management\dataSource\index.vue
-->
<template>
  <el-card>
    <div slot="header" class="clearfix">
      <span>{{ $t('route.modelManagement') }}</span>
      <!-- <span>{{ title }} / {{ $t('route.modelManagement') }}</span> -->
      <el-button type="primary" style="float: right; padding: 8px 15px" @click="toAddRecord">{{ $t('table.creat') }}</el-button>
    </div>
    <!-- 筛选框form -->
    <tr-form ref="formRRRR" v-model="form" class="operateBtnOneLine" :collapseable="false" :items="formItems" style="margin-left:-30px" @query="handleQuery" @reset="handleReset('formRRRR')" />
    <!-- table组件 -->
    <tr-table
      v-loading="loading"
      element-loading-text=""
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
      :data="tableData"
      :cell-style="cellStyle"
      :show-pager="showPagera"
    >
      <el-table-column v-for="(item,index) in tanleColumn" :key="index" :label="item.label" :prop="item.prop" :align="item.align">
        <template slot-scope="{row}">
          <div v-if="item.label == $t('table.testConnection')">
            <span v-show="row.testConnection == 0"><i class="dot" />{{ row[item.prop] }}</span>
            <span v-show="row.testConnection == 1" class="success-text-color"><i class="dot success-background" />{{ row[item.prop] }}</span>
            <span v-show="row.testConnection == 2" class="failed-text-color"><i class="dot failed-background" />{{ row[item.prop] }}</span>
          </div>
          <div v-else>{{ row[item.prop] }}</div>
        </template>
      </el-table-column>
      <template slot="after">
        <el-table-column :label="$t('table.operation')" align="center" width="150px">
          <template slot-scope="{row}" style="display: flex">
            <!-- 管理 -->
            <el-button
              type="text"
              size="small"
              @click="onViewBtnClick(row)"
            >{{ $t('dimension.manage') }}</el-button>
            <div class="m-operate-btn-separator-line" />
            <el-button
              v-if="row.modelStatus === 2 || row.modelStatus === 0"
              type="text"
              size="small"
              @click="startOrStopClick(row.id,1, $t('table.enable'))"
            >
              {{ $t('table.enable') }}
            </el-button>
            <el-button
              v-else
              class="disabledButton"
              type="text"
              size="small"
              @click="startOrStopClick(row.id,2, $t('table.disable'))"
            >
              {{ $t('table.disable') }}

            </el-button>
          </template>
        </el-table-column>
      </template>
    </tr-table>

    <el-pagination
      :total="total"
      :page-size="form.size"
      :current-page="form.current"
      :page-sizes="[10, 20, 50, 100]"
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="onSizeChange"
      @current-change="onCurrentChange"
    />
  </el-card>
</template>

<script>
import Model from './Model.js'
import Controller from './Controller.js'
import TrForm from '@/components/feature/TrForm'
import TrTable from '@/components/feature/TrTable'
import userMin from '@/views/mixin/user'
export default {
  name: 'Model',
  components: { TrForm, TrTable },
  mixins: [Model, Controller, userMin]
}
</script>

<style lang="scss" scoped>
@import "./style.scss";
</style>
