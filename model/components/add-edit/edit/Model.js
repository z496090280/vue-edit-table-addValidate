/*
 * @Author: your name
 * @Date: 2021-03-04 15:16:16
 * @LastEditTime: 2021-03-26 16:21:18
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \data-dip-web\src\views\targetDataSource-management\dataSource\components\add-edit\edit\Model.js
 */
// const Base64 = require('js-base64').Base64
import { isNumber } from 'lodash'
import { getCheckModelName, getCheckModelAliasName } from '@/api/manager/model'

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
          res = await getCheckModelName(this.baseInfoForm.id, this.baseInfoForm.modelName, this.$store.getters.language)
        } else {
          res = await getCheckModelAliasName(this.baseInfoForm.id, this.baseInfoForm.modelAlias, this.$store.getters.language)
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
      title: '指标分类查看编辑',
      modelEditView: false,
      viewForm: {
        id: '',
        modelCode: '',
        modelDesc: '',
        modelName: '',
        modelAlias: '',
        datasourceType: '',
        datasourceId: '',
        tableName: '',
        modelStatus: ''
      },
      baseInfoForm: {
        id: '',
        modelCode: '',
        modelDesc: '',
        modelName: '',
        modelAlias: '',
        datasourceType: '',
        datasourceId: '',
        tableName: '',
        modelStatus: ''
      },
      baseInfoFormRules: {
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
            required: true,
            message: ''
          }
        },

        tableData: [],
        initTableData: []
      },
      multipleSelection: [],
      isExpand: true,
      showForm: false,
      expandedKeys: [], // 默认父分类树展开的层级

      datasourceTypeOpts: [
        { label: 'mysql', value: 'mysql' },
        { label: 'clickhouse', value: 'clickhouse' }
      ],
      datasourceDataOpt: [],
      dataSourceNameOpt: [],
      dataSourceNameOptCopy: [],
      datasourceTableOptCopy: [],
      datasourceTableOpt: [],
      modelConfigForm: {
        modelAlias: ''
      },
      langInfoFormRules: {
        classNameOther1: [{ required: true, trigger: 'blur' }]
      },

      editTrue: false,
      baseInfoShow: false, // 显示基础信息编辑页面
      langInfoShow: false, // 显示语种信息编辑页面
      showSelectTree: false,
      treeInputsearch: true, // 树有无取消输入
      languages: [],

      langClass: {},
      otherlangClass: {},
      // 编辑语种的信息
      languagesEdit: [],
      langEditInfo: {
        otherlangBoxCheck: false,
        langBoxCheck: true,
        langDisabledStatus: true,
        otherlangDisabledStatus: true,
        // 展示选中的语种表单
        showCheckedLangOTher: false,
        // 默认的编辑语种的带入值
        otherClassNameRequire: '',
        // 默认的编辑描述的带入值
        otherClassDec: '',
        otherlangDim: '',
        langId: {
          langId: '',
          otherlangId: ''
        },
        empFlag: true
      }
    }
  }
}
