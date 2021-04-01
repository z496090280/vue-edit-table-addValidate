/*
 * @Author: your name
 * @Date: 2021-03-04 15:16:16
 * @LastEditTime: 2021-03-24 14:26:04
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \data-dip-web\src\views\targetDataSource-management\classify\Controller.js
 */
import { getTableData, changeModelStatus } from '@/api/manager/model'
import { getworkLeader } from '@/api/manager/target-class'
import TrSelect from '@/components/feature/TrSelect'

const Controller = {
  created() {
    this.getTableData()
    // this.form.indexName = this.$route.query.name
    this.title = this.$route.query.name
  },
  mounted() {
  },
  methods: {
    // 搜索业务负责人
    async remoteSearchLeader(val) {
      this.workLeaderKeyWords = val
      this.workLeader = []
      if (val !== '') {
        // this.loading = true
        // this.getworkLeader()
        const res = await getworkLeader(this.workLeaderKeyWords)
        const data = res.data
        if (data) {
          this.workLeader = this.workLeader.concat(
            data.map((item) => {
              return {
                value: item.employeeNo,
                label: item.employeeDisplay
              }
            })
          )
          // console.log(this.workLeader)
        }
        // this.loading = false
      }
    },
    // 设置列表中不同状态的颜色
    cellStyle(row, column, rowIndex, columnIndex) {
      if (row.column.label === this.$t('table.state')) {
        if (row.row.modelStatus === 1) {
          return 'color: #00BAAD'
        } else if (row.row.modelStatus === 2) {
          return 'color: orange'
        } else {
          return
        }
      }
    },
    cellClass(row) {
      if (row.column.label === this.$t('table.testConnection')) {
        if (row.row.testConnection === 0) {
          return 'test-class'
        }
      }
    },

    async  getTableData() {
      const { data: res } = await getTableData(this.form)
      this.tableData = res.rows
      this.total = res.total
      this.loading = false
    },
    onSizeChange(val) {
      this.form.rows = val
      this.getTableData()
    },
    onCurrentChange(val) {
      this.form.page = val
      this.form.current = val
      this.getTableData()
    },
    handleQuery() {
      this.onCurrentChange(1)
      this.getTableData()
    },
    handleReset(formName) {
      this.$refs[formName].resetFields()
    },
    // 启用停用方法
    startOrStopClick(id, type, name) {
      this.$confirm(`${this.$t('classify.areYouSure')}${name}${this.$t('model.thisModelRecord')}`, {
        confirmButtonText: this.$t('common.ok'),
        cancelButtonText: this.$t('common.cancel')
      })
        .then(() => {
          changeModelStatus(id, type)
            .then(() => {
              this.$message.success((name === this.$t('dimension.disable')) ? this.$t('dimension.disabled') : this.$t('dimension.enabled'))
              this.getTableData()
            })
        })
        .catch(() => {})
    },
    // 新增
    toAddRecord() {
      this.$router.push({
        name: 'addModel'
      })
    },
    // 管理查看
    onViewBtnClick(row) {
      this.$router.push({ path: `model/edit/${row.id}` })
    },
    showColumnsDialog() {
      this.$refs.dialog.show()
    }

  },
  computed: {
    formItems() {
      return [
        { label: this.$t('table.state'), span: 8, labelWidth: '150px', prop: 'modelStatus', component: TrSelect, attrs: { data: [{ label: this.$t('dimension.draft'), value: 0 }, { label: this.$t('dimension.enabled'), value: 1 }, { label: this.$t('dimension.disabled'), value: 2 }] }},
        { label: this.$t('model.modelName'), span: 8, labelWidth: '150px', prop: 'modelName', attrs: { placeholder: '', maxlength: '30' }},
        { label: this.$t('model.modelAliasName'), span: 8, labelWidth: '150px', prop: 'modelAlias', attrs: { placeholder: '', maxlength: '30' }},
        { label: this.$t('table.creater'), span: 8, labelWidth: '150px', prop: 'createUser', component: TrSelect, attrs: { data: this.workLeader, remoteMethod: this.remoteSearchLeader, filterable: true, remote: true }}
      ]
    }
  }
}
export default Controller
