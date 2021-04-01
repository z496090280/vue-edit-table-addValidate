import { getRecordInfoById, submitAddRecord, getDataSourceName, getDataSourceTable, getModelCongif } from '@/api/manager/model'
import { cloneDeep } from 'lodash'
import { compareOjb } from '@/utils'
const Controller = {
  watch: {
    'formData.tableData': {
      handler: function(val, oldval) {
        var _this = this
        var count = 0
        for (let i = 0; i < val.length; i++) {
          if (val[i].status === true) {
            count++
          }
        }
        if (count === val.length) {
          _this.checkAll = true
        } else {
          _this.checkAll = false
        }
      },
      deep: true
    }
  },
  computed: {
  },
  created() {
    this.getRecordInfoById()
  },
  mounted() {

  },
  methods: {
    returnRouter() {
      if (this._.isEqual(this.viewForm, this.baseInfoForm)) {
        this.$router.go(-1)
      } else {
        this.$confirm(this.$t('classify.sureSaveClass'))
          .then(_ => {
          // 返回列表
            this.$router.go(-1)
          })
          .catch(_ => {
            return false
          })
      }
    },
    editModleConf() {
      this.modelEditView = !this.modelEditView
    },
    async submitModel(formName) {
      var dataId = this.baseInfoForm.datasourceId
      var name = this.baseInfoForm.tableName
      var _this = this
      var res
      if (this.baseInfoForm.datasourceId === '' || this.baseInfoForm.tableName === '') {
        return this.$message({
          message: this.$t('table.dataSourceTableName') + '、' + this.$t('table.dataSourceName') + this.$t('common.required'),
          showClose: true,
          type: 'warning'
        })
      }
      if (this.formData.tableData.length === 0) {
        res = await getModelCongif({ id: this.baseInfoForm.id, datasourceId: dataId, tableName: name })
        this.formData.tableData = res.data
      } else {
        this.$confirm(this.$t('model.modelUpdataHint'))
          .then(async(_) => {
            res = await getModelCongif({ id: this.baseInfoForm.id, datasourceId: dataId, tableName: name })
            _this.formData.tableData = res.data
          })
          .catch(_ => {
            return false
          })
      }
    },
    handleCheckAllChange(val) {
      var _this = this
      if (val) {
        _this.formData.tableData.forEach((item) => {
          item.status = true
        })
      } else {
        _this.formData.tableData.forEach((item) => {
          item.status = false
        })
      }
    },
    // 选择第一级
    async changeDatasourceType(event, isEditEcho = false) {
      const query = event
      const res = await getDataSourceName(query)
      if (res.code !== '200') return false
      const data = res.data.rows
      // 取前十个，后面搜索筛选
      if (data.length > 10) {
        this.dataSourceNameOpt = data.splice(0, 10)
        this.dataSourceNameOptCopy = data.splice(0, 10)
      } else {
        this.dataSourceNameOpt = data
        this.dataSourceNameOptCopy = data
      }
      // 清除第二、三级
      if (!isEditEcho) {
        this.baseInfoForm.datasourceId = ''
        this.datasourceTableOpt = []
        this.baseInfoForm.tableName = ''
      }
    },
    // 选择第二级
    async changeDataSourceName(event, isEditEcho = false) {
      // 清除第三级
      this.loadingCard = true
      if (!isEditEcho) {
        this.datasourceTableOpt = []
        this.baseInfoForm.tableName = ''
      }
      const res = await getDataSourceTable(event)
      if (res.code !== '200') return false
      const data = res.data
      this.datasourceTableOpt = data
      this.loadingCard = false
    },
    async handlerGetDataSourceName(query) {
      const res = await getDataSourceName(this.baseInfoForm.datasourceType, query)
      if (res.code !== '200') return false
      this.loading = false
      this.dataSourceNameOpt = res.data.rows
    },
    remoteMethod(query) {
      const _this = this
      if (query !== '') {
        this.loading = true
        this.handlerGetDataSourceName(query)
      } else {
        _this.dataSourceNameOpt = _this.dataSourceNameOptCopy
      }
    },
    async remoteMethod1(query) {
      if (this.baseInfoForm.datasourceId === '') {
        return this.$message({
          message: this.$t('table.dataSourceTableName') + ' ' + this.$t('common.required'),
          showClose: true,
          type: 'warning'
        })
      }
      const _this = this
      if (query !== '') {
        this.loading = true
        const res = await getDataSourceTable(this.baseInfoForm.datasourceId, query)
        if (res.code !== '200') return false
        const data = res.data
        this.datasourceTableOpt = data
        this.datasourceTableOptCopy = data
        this.loading = false
      } else {
        _this.dataSourceNameOpt = _this.datasourceTableOptCopy
      }
    },
    // 进入查询分类查看
    async getRecordInfoById() {
      const { data: res } = await getRecordInfoById(this.$route.params.id)
      this.viewForm = res
      const data = cloneDeep(res)
      this.baseInfoForm = data
      // 表格数据
      this.formData.tableData = cloneDeep(res.modelConfigList)
      this.formData.initTableData = res.modelConfigList
    },
    // 点击基本信息编辑按钮
    editClass() {
      this.baseInfoShow = true
      // 查询下拉单
      if (this.dataSourceNameOpt.length === 0) {
        this.changeDatasourceType(this.baseInfoForm.datasourceType, true)
        this.changeDataSourceName(this.baseInfoForm.datasourceId, true)
      }
      // this.$set(this.baseInfoForm, 'passwordCopy', this.viewForm.password)
    },
    // 取消基础信息编辑
    cancleBaseInfoEdit(forName, flag, showView) {
      var data1, data2
      if (flag === 1) {
        data1 = this.viewForm
        data2 = this.baseInfoForm
      } else if (flag === 2) {
        data1 = this.formData.initTableData
        data2 = this.formData.tableData
      }
      if (compareOjb(data2, data1)) {
        this[showView] = false
        // 回到查看页面
      } else {
        this.$confirm(this.$t('classify.sureSaveClass'))
          .then(_ => {
            // 确认就保存
            // this.saveEdit(forName, flag, showView)
            //  重新调取查看接口
            this[showView] = false
            this.getRecordInfoById()
          })
          .catch(_ => {
            return false
          })
      }
    },
    goBack() {
      this.$router.go(-1)
    },
    doReturn() {
      // this.$router.go(-1)
      this.$store.dispatch('tagsView/delVisitedView', this.$route)
      this.$store.dispatch('tagsView/delView', this.$route)
      this.$router.push({ name: 'classify_index' })
      this.$EventBus.$emit('return', { route: this.$route, name: 'classify' })
    },
    // 编辑保存
    saveEdit(forName, flag, showView) {
      // 校验表单

      this.$refs[forName].validate(async(valid) => {
        if (valid) {
          let res
          if (flag === 1) {
            res = await submitAddRecord(this.baseInfoForm, 'PUT', 1)
          } else if (flag === 2) {
            res = await submitAddRecord({ modelConfigList: this.formData.tableData, id: this.viewForm.id }, 'PUT', 2)
          }
          if (res.code !== '200') return false
          this.$message.success(this.$t('dimension.saveSuccess'))
          // 返回刷新查看列表
          this[showView] = false
          this.getRecordInfoById()
        } else {
          return false
        }
      })
    }
  }

}
export default Controller
