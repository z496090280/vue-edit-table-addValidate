/*
 * @Author: lee
 * @Date: 2021-03-04 15:16:16
 * @LastEditTime: 2021-03-26 16:40:14
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \data-dip-web\src\views\targetDataSource-management\dataSource\components\add-edit\add\Model.js
 */

import { isNumber } from 'lodash'
import { getCheckModelName, getCheckModelAliasName } from '@/api/manager/model'

// const Base64 = require('js-base64').Base64
export default {
  data() {
    // 自定义校验分类名称
    var checkClassName = async(label, rule, value, callback) => {
      if (!value) {
        return callback(new Error(label + this.$t('table.notEmpty')))
      }
      // var regu = /^[A-Za-z0-9\u4e00-\u9fa5]+$/
      var re = new RegExp(/^[a-zA-Z\u4e00-\u9fa5]+[0-9a-zA-Z_\u4e00-\u9fa5]*$/)
      if (re.test(value)) {
        let res
        if (label === this.$t('model.modelName')) {
          res = await getCheckModelName(0, this.form.modelName, this.$store.getters.language)
        } else {
          res = await getCheckModelAliasName(0, this.form.modelAlias, this.$store.getters.language)
        }
        res.data ? callback(new Error(label + this.$t('common.isExists'))) : callback()
      } else {
        return callback(new Error(this.$t('dimension.checkingTips')))
      }
    }

    var checkClassName1 = async(label, rule, value, callback) => {
      if (!value) {
        return callback(new Error(label + this.$t('table.notEmpty')))
      }
      if (rule.field === 'port' && !isNumber(value)) {
        return callback(new Error(this.$t('table.port') + this.$t('dimension.numberType')))
      }
    }
    return {
      formRules: {
        modelName: [{ validator: (...args) => checkClassName(this.$t('model.modelName'), ...args), required: true, trigger: 'blur' }],
        modelAlias: [{ validator: (...args) => checkClassName(this.$t('model.modelAliasName'), ...args), required: true, trigger: 'blur' }],
        datasourceType: [{ validator: (...args) => checkClassName1(this.$t('model.configName'), ...args), required: true, trigger: 'blur' }],
        datasourceId: [{ validator: (...args) => checkClassName1(this.$t('table.dataSourceName'), ...args), required: true, trigger: 'blur' }],
        tableName: [{ validator: (...args) => checkClassName1(this.$t('table.dataSourceTableName'), ...args), required: true, trigger: 'blur' }]
      },
      // 树的配置
      loadingCard: false,
      loading: false,
      checkAll: false,
      formData: {
        rules: {
          name: {
            type: 'string',
            message: ''
          }
        },

        tableData: []
      },
      multipleSelection: [],
      title: '指标分类新增编辑',
      isExpand: true,
      showForm: false,
      expandedKeys: [], // 默认父分类树展开的层级

      datasourceTypeOpts: [
        { label: 'mysql', value: 'mysql' },
        { label: 'clickhouse', value: 'clickhouse' }
      ],
      datasourceDataOpt: [],
      dataSourceNameOpt: [],
      datasourceTableOptCopy: [],
      dataSourceNameOptCopy: [],
      datasourceTableOpt: [],
      modelConfigForm: {
        modelAlias: ''
      },
      form: {
        id: '',
        modelCode: '',
        modelDesc: '',
        modelName: '',
        modelAlias: '',
        datasourceType: '',
        datasourceId: '',
        tableName: ''
      }
    }
  }
}
