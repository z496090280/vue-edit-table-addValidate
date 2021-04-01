import { submitAddRecord, getDataSourceName, getDataSourceTable, getModelCongif } from '@/api/manager/model'
import { isCreateEmpty } from '@/utils'

const Controller = {
  computed: {

  },
  created() {
  },
  mounted() {
  },
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
  methods: {
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
    async handlerGetDataSourceName(query) {
      const res = await getDataSourceName(this.form.datasourceType, query)
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
      if (this.form.datasourceId === '') {
        return this.$message({
          message: this.$t('table.dataSourceTableName') + ' ' + this.$t('common.required'),
          showClose: true,
          type: 'warning'
        })
      }
      const _this = this
      if (query !== '') {
        this.loading = true
        const res = await getDataSourceTable(this.form.datasourceId, query)
        if (res.code !== '200') return false
        const data = res.data
        this.datasourceTableOpt = data
        this.datasourceTableOptCopy = data
        this.loading = false
      } else {
        _this.dataSourceNameOpt = _this.datasourceTableOptCopy
      }
    },
    // 选择第一级
    async changeDatasourceType(event) {
      // 清除第二、三级
      this.form.datasourceId = ''
      this.datasourceTableOpt = []
      this.form.tableName = ''
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
    },
    // 选择第二级
    async changeDataSourceName(event) {
      // 清除第三级
      this.loadingCard = true
      this.form.tableName = ''
      this.datasourceTableOpt = []
      const res = await getDataSourceTable(event)
      if (res.code !== '200') return false
      const data = res.data
      this.datasourceTableOpt = data
      this.loadingCard = false
    },
    async submitModel(formName) {
      var dataId = this.form.datasourceId
      var name = this.form.tableName
      var _this = this
      var res
      if (this.form.datasourceId === '' || this.form.tableName === '') {
        return this.$message({
          message: this.$t('table.dataSourceTableName') + '、' + this.$t('table.dataSourceName') + this.$t('common.required'),
          showClose: true,
          type: 'warning'
        })
      }
      // // // 测试用
      // // const res = await getModelCongif({ id: '', datasourceId: 75, tableName: 'index_change_record' })
      if (this.formData.tableData.length === 0) {
        res = await getModelCongif({ id: '', datasourceId: dataId, tableName: name })
        this.formData.tableData = res.data
      } else {
        this.$confirm(this.$t('model.modelUpdataHint'))
          .then(async(_) => {
            res = await getModelCongif({ id: '', datasourceId: dataId, tableName: name })
            _this.formData.tableData = res.data
          })
          .catch(_ => {
            return false
          })
      }
    },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row)
        })
      } else {
        this.$refs.multipleTable.clearSelection()
      }
    },
    handleSelectionChange(val, ...args) {
      this.multipleSelection = val
    },
    // 取消
    onCancel() {
      if (isCreateEmpty(this.form)) {
        this.doReturn()
      } else {
        this.$confirm(this.$t('classify.sureAddClass'))
          .then(_ => {
            this.initData()
            this.doReturn()
          })
          .catch(_ => {
            return false
          })
      }
    },
    // goBack() {
    //   this.$router.go(-1)
    // },
    // 页面跳转
    doReturn() {
      this.$store.dispatch('tagsView/delVisitedView', this.$route)
      this.$store.dispatch('tagsView/delView', this.$route)
      this.$router.push({ name: 'model_index' })
      this.$EventBus.$emit('return', { route: this.$route, name: 'model' })
    },
    // 保存操作
    onSaveBtnClick() {
      var _this = this
      const list = []
      list.push(
        this.checkForm('form'),
        this.checkForm('modelConfigForm')
      )
      Promise.all(list).then(() => {
        _this.doSave()
      }).catch(() => {
        console.log('0')
      })
    },
    checkForm(formName) {
      return new Promise((resolve, reject) => {
        this.$refs[formName].validate(valid => {
          if (valid) {
            resolve()
          } else {
            reject()
          }
        })
      })
    },

    async doSave() {
      // 拼接后台字段
      var data = {}
      data.modelConfigList = this.formData.tableData
      Object.assign(data, this.form)
      const res = await submitAddRecord(data, 'POST')
      if (res.code !== '200') return false
      this.$message.success(this.$t('dimension.saveSuccess'))

      this.doReturn()
    },

    initData() {
      // 移除表单项的校验结果
      this.form = {
        className: '',
        parentId: 0,
        classLevel: 1,
        empNos: [],
        classDesc: '',
        classTl: [],
        classNameOther: '',
        classNameOther1: ''
      }
      // this.$nextTick(() => {
      //   this.$refs.form.clearValidate()
      // })
    }

  }
}
export default Controller
