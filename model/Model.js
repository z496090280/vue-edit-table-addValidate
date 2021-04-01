/*
 * @Author: daping
 * @Date: 2021-03-04 15:16:16
 * @LastEditTime: 2021-03-23 10:09:31
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \data-dip-web\src\views\targetDataSource-management\classify\Model.js
 */
// import TrDict from '@/components/bussiness/TrDict'

export default {
  data() {
    return {
      title: '',
      workLeaderKeyWords: '',
      workLeader: [],
      workLeaderOpts: [],
      form: {
        // indexName: '',
        modelStatus: '',
        modelName: '',
        modelAlias: '',
        createUser: '',
        page: 1,
        rows: 10,
        current: 1
      },
      loading: true,
      total: 0,
      showPagera: false,
      // 搜索数据
      columns: [],
      tableData: [],
      showColumnStartIndex: 0,
      showColumns: [],
      // 定义每一列
      tanleColumn: [
        { prop: 'modelName', label: this.$t('model.modelName'), align: 'center', sortable: true, formatter: (row) => { return row.dictMap.projectType } },
        { prop: 'modelAlias', label: this.$t('model.modelAliasName'), align: 'center', sortable: true },
        { prop: 'modelStatusDisplay', label: this.$t('table.state'), align: 'center', sortable: true },
        { prop: 'createUserDisplay', label: this.$t('table.creater'), align: 'center', sortable: true, formatter: (row) => { return this.userRender(row, 'createdBy') } },
        { prop: 'updateTime', label: this.$t('table.revisionTime'), align: 'center', sortable: true }
      ]
    }
  }
}
