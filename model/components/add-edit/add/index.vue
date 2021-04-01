<!--
 * @Author: your name
 * @Date: 2021-03-15 18:03:30
 * @LastEditTime: 2021-03-26 16:39:49
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \data-dip-web\src\views\model-management\model\components\add-edit\add\index.vue
-->
<template>
  <!-- 指标分类设置 -->
  <div>
    <el-form ref="form" status-icon :rules="formRules" :model="form" label-width="200px" inline-message>
      <tr-cards v-model="isExpand" v-loading="loadingCard" :header="$t('dimension.basicInformation')" class="cardStyle">
        <el-form-item :label="$t('model.modelName')" prop="modelName">
          <el-input
            v-model="form.modelName"
            placeholder=""
            clearable
            maxlength="64"
            show-word-limit
          />
        </el-form-item>

        <el-form-item :label="$t('model.modelAliasName')" prop="modelAlias">
          <el-input
            v-model="form.modelAlias"
            placeholder=""
            clearable
            maxlength="128"
            show-word-limit
          />
        </el-form-item>

        <el-form-item :label="$t('model.configName')" prop="datasourceType">
          <el-select v-model="form.datasourceType" :placeholder="$t('table.DataSourceType')" style="display:inline-block;width:50% !important;" @change="changeDatasourceType">
            <el-option
              v-for="item in datasourceTypeOpts"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item prop="datasourceId" label-width="200px">
          <el-select
            v-model="form.datasourceId"
            style="display:inline-block;width:50% !important;"
            :placeholder="$t('table.dataSourceName')"
            filterable
            remote
            :remote-method="remoteMethod"
            :loading="loading"
            @change="changeDataSourceName"
          >
            <el-option
              v-for="item in dataSourceNameOpt"
              :key="item.id"
              :label="item.datasourceName"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item prop="tableName" label-width="200px">
          <el-select
            v-model="form.tableName"
            style="display:inline-block;width:50% !important;"
            :placeholder="$t('table.dataSourceTableName')"
            filterable
            :loading="loading"
            remote
            :remote-method="remoteMethod1"
          >
            <el-option
              v-for="(item, idx) in datasourceTableOpt"
              :key="idx"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>

        <el-form-item :label="$t('model.modelDesc')" prop="modelDesc">
          <el-input
            v-model="form.modelDesc"
            type="textarea"
            placeholder=""
            maxlength="500"
            show-word-limit
          />
        </el-form-item>
      </tr-cards>

      <tr-cards :header="$t('dimension.basicInformation')" class="modelConfigNoError">
        <div slot="header" class="clearfix">
          <span>{{ $t('model.modelConfig') }}</span>
          <el-button style="float: right;" type="primary" @click.stop="submitModel('modelConfigForm')">{{ $t('model.modelUpdata') }}</el-button>
        </div>

        <!-- <el-col :span="11">
          <el-form-item label="活动名称">
            <el-input v-model="modelConfigForm.modelAlias" />
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item>
            <el-button type="primary" @click="submitForm('formData')">查下</el-button>
          </el-form-item>
        </el-col> -->
        <el-form ref="modelConfigForm" :rules="formData.rules" :model="formData">
          <template>
            <el-table
              ref="multipleTable"
              :data="formData.tableData"
              tooltip-effect="dark"
              style="width: 100%"
              height="350"
              @selection-change="handleSelectionChange"
            >
              <!-- <el-table-column
                type="selection"
                prop="status"
                width="55"
              /> -->
              <el-table-column
                prop="status"
                show-overflow-tooltip
                width="120px"
              >
                <template slot="header" slot-scope="scope">
                  <el-checkbox v-model="checkAll" :data-scope="scope" @change="handleCheckAllChange">{{ $t('common.allSelect') }}</el-checkbox>
                </template>
                <template slot-scope="scope">
                  <el-checkbox v-model="scope.row.status" :checked="scope.row.status ? true : false" />
                </template>
              </el-table-column>
              <el-table-column
                :label="$t('model.fieldName')"
                width="120"
                prop="fieldName"
              />
              <el-table-column
                prop="fieldAlias"
                :label="$t('model.fieldAlias')"
                width="120"
              >
                <template slot-scope="scope">
                  <el-form-item :prop="'tableData.' + scope.$index + '.fieldAlias'" :required="scope.row.status">
                    <i class="red">*</i>
                    <el-input v-model="scope.row.fieldAlias" placeholder="" :disabled="scope.row.status ? false : true" />
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column
                prop="fieldType"
                :label="$t('model.fieldType')"
                show-overflow-tooltip
              />
              <el-table-column
                prop="fieldLength"
                :label="$t('model.fieldLength')"
                show-overflow-tooltip
              />
              <el-table-column
                prop="fieldDesc"
                :label="$t('model.fieldDescribe')"
                show-overflow-tooltip
              />
              <el-table-column
                prop="primaryKey"
                :label="$t('model.primaryKey')"
                show-overflow-tooltip
              >
                <template slot-scope="scope">
                  <el-checkbox v-model="scope.row.primaryKey" :checked="scope.row.primaryKey ? true : false" disabled />
                </template>
              </el-table-column>
              <el-table-column
                prop="mandatory"
                :label="$t('model.notEmpty')"
                show-overflow-tooltip
              >
                <template slot-scope="scope">
                  <el-checkbox v-model="scope.row.mandatory" :checked="scope.row.mandatory ? true : false" disabled />
                </template>
              </el-table-column>
              <el-table-column
                prop="autoIncr"
                :label="$t('model.selfGrowth')"
                show-overflow-tooltip
              >
                <template slot-scope="scope">
                  <el-checkbox v-model="scope.row.autoIncr" :checked="scope.row.autoIncr ? true : false" disabled />
                </template>
              </el-table-column>
              <el-table-column
                prop="defaultValue"
                :label="$t('model.defaultValue')"
                show-overflow-tooltip
              />
            </el-table>
            <!-- <div style="margin-top: 20px">
              <el-button @click="toggleSelection([tableData[1], tableData[2]])">切换第二、第三行的选中状态</el-button>
              <el-button @click="toggleSelection()">取消选择</el-button>
            </div> -->
          </template>
        </el-form>
      </tr-cards>
      <el-card class="m-footer-card">
        <el-button size="medium" @click="onCancel">{{ $t('common.cancel') }}</el-button>
        <el-button size="medium" type="primary" style="margin-left: 30px" @click="onSaveBtnClick">{{ $t('common.save') }}</el-button>
      </el-card>
    </el-form>
  </div>
</template>

<script>
import Model from './Model.js'
import Controller from './Controller.js'
import TrCards from '@/components/feature/TrCard'
export default {
  name: 'ModelAdd',
  components: { TrCards },
  mixins: [Model, Controller]
}
</script>

<style lang="scss" scoped>
    @import './style.scss';
</style>
