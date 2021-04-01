<template>
  <!-- 指标分类设置 -->
  <div>
    <el-button type="primary" style="margin: -19px 0px 3px 20px;padding:5px" size="medium" icon="el-icon-back" circle @click="returnRouter()" />
    <!-- 基本信息查看 -->
    <el-form v-show="!baseInfoShow" :model="viewForm" label-width="200px">
      <el-card class="cardStyle" style="margin-bottom:10px">
        <div slot="header" class="clearfix">
          <span>{{ $t('dimension.basicInformation') }}</span>
          <el-button style="float: right; padding: 5px 20px; margin-right: 20px;" type="primary" :disabled="viewForm.modelStatus===1?true:false" @click="editClass">{{ $t('common.edit') }}</el-button>
        </div>
        <!-- <tr-form ref="basicFormRef" v-model="formData" :items="formItems" :rules="rulesData" :show-buttons="false" /> -->

        <el-form-item :label="$t('model.modelName')">
          <span>{{ viewForm.modelName }}</span>
        </el-form-item>
        <el-form-item :label="$t('model.modelAliasName')">
          <span>{{ viewForm.modelAlias }}</span>
        </el-form-item>
        <el-form-item :label="$t('model.configName')">
          <span style="font-size:12px">{{ viewForm.datasourceType }} / {{ viewForm.datasourceName }} / {{ viewForm.tableName }}</span>
        </el-form-item>
        <el-form-item :label="$t('model.modelDesc')">
          <span style="font-size:12px">{{ viewForm.modelDesc }}</span>
        </el-form-item>

        <el-form-item :label="$t('table.creater')">
          <el-tag v-if=" viewForm.createUser" effect="plain">
            <i class="el-icon-user" />  {{ viewForm.createUser }}
          </el-tag>
          <!-- <span style="font-size:12px">{{ viewForm.createUser }}</span> -->
        </el-form-item>
        <el-form-item :label="$t('dimension.creatTime')">
          <span style="font-size:12px">{{ viewForm.createTime }}</span>
        </el-form-item>
        <el-form-item label="修改人">
          <el-tag v-if=" viewForm.updateUser" effect="plain">
            <i class="el-icon-user" />  {{ viewForm.updateUser }}
          </el-tag>
          <!-- <span style="font-size:12px">{{ viewForm.updateUser }}</span> -->
        </el-form-item>
        <el-form-item label="修改时间">
          <span style="font-size:12px">{{ viewForm.updateTime }}</span>
        </el-form-item>
      </el-card>
    </el-form>
    <!-- 基本信息编辑 -->
    <el-form v-show="baseInfoShow" ref="baseInfoFormRef" label-width="200px" :model="baseInfoForm" :rules="baseInfoFormRules" inline-message>
      <el-card v-loading="loadingCard" class="cardStyle">
        <div slot="header" class="clearfix">
          <span>{{ $t('dimension.basicInformation') }}</span>
          <span style="float: right">
            <el-button style="padding: 5px 20px; margin-right: 10px;" @click="cancleBaseInfoEdit('baseInfoFormRef',1,'baseInfoShow')">{{ $t('common.cancel') }}</el-button>
            <el-button style=" padding: 5px 20px; margin-right: 20px;" type="primary" @click="saveEdit('baseInfoFormRef',1,'baseInfoShow')">{{ $t('common.save') }}</el-button>
          </span>
        </div>
        <el-form-item :label="$t('model.modelName')" prop="modelName">
          <el-input
            v-model="baseInfoForm.modelName"
            placeholder=""
            clearable
            maxlength="64"
            show-word-limit
          />
        </el-form-item>

        <el-form-item :label="$t('model.modelAliasName')" prop="modelAlias">
          <el-input
            v-model="baseInfoForm.modelAlias"
            placeholder=""
            clearable
            maxlength="128"
            show-word-limit
          />
        </el-form-item>
        <el-form-item :label="$t('model.configName')" prop="datasourceType">
          <el-select v-model="baseInfoForm.datasourceType" :placeholder="$t('table.DataSourceType')" style="display:inline-block;width:50% !important;" @change="changeDatasourceType">
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
            v-model="baseInfoForm.datasourceId"
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
            v-model="baseInfoForm.tableName"
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
            v-model="baseInfoForm.modelDesc"
            type="textarea"
            placeholder=""
            maxlength="500"
            show-word-limit
          />
        </el-form-item>
      </el-card>
    </el-form>

    <el-card class="cardStyle modelConfigNoError">
      <div slot="header" class="clearfix">
        <span>{{ $t('model.modelConfig') }}</span>
        <el-button v-show="!modelEditView" style="float: right; padding: 5px 20px; margin-right: 20px;" type="primary" :disabled="viewForm.modelStatus===1?true:false" @click="editModleConf">{{ $t('common.edit') }}</el-button>
        <span v-show="modelEditView" style="float: right">
          <el-button style="" type="primary" @click="submitModel('modelConfigForm')">{{ $t('model.modelUpdata') }}</el-button>
          <el-button style="padding: 5px 20px; margin-right: 10px;" @click="cancleBaseInfoEdit('modelConfigForm',2,'modelEditView')">{{ $t('common.cancel') }}</el-button>
          <el-button style=" padding: 5px 20px; margin-right: 20px;" type="primary" @click="saveEdit('modelConfigForm',2,'modelEditView')">{{ $t('common.save') }}</el-button>
        </span>
      </div>
      <!-- <div slot="header" class="clearfix">
          <span>{{ $t('model.modelConfig') }}</span>
          <el-button style="float: right;" type="primary" @click="submitModel('modelConfigForm')">{{ $t('model.modelUpdata') }}</el-button>
        </div> -->

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
                <el-checkbox v-model="checkAll" :data-scope="scope" :disabled="!modelEditView" @change="handleCheckAllChange">{{ $t('common.allSelect') }}</el-checkbox>
              </template>
              <template slot-scope="scope">
                <el-checkbox v-model="scope.row.status" :checked="scope.row.status ? true : false" :disabled="!modelEditView" />
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
                  <el-input v-model="scope.row.fieldAlias" placeholder="" :disabled="!scope.row.status || !modelEditView" />
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
                <el-checkbox v-model="scope.row.primaryKey" :checked="scope.row.primaryKey" disabled />
              </template>
            </el-table-column>
            <el-table-column
              prop="mandatory"
              :label="$t('model.notEmpty')"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                <el-checkbox v-model="scope.row.mandatory" :checked="scope.row.mandatory" disabled />
              </template>
            </el-table-column>
            <el-table-column
              prop="autoIncr"
              :label="$t('model.selfGrowth')"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                <el-checkbox v-model="scope.row.autoIncr" :checked="scope.row.autoIncr" disabled />
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
    </el-card>
  </div>
</template>

<script>
import Model from './Model.js'
import Controller from './Controller.js'
export default {
  name: 'ModelEdit',
  mixins: [Model, Controller]
}
</script>

<style lang="scss" scoped>
    @import './style.scss';
</style>
