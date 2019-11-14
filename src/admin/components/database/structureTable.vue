<template>
  <div class="structureTable">
    <a-table
      :columns="columns"
      :rowKey="record => record.login.uuid"
      :dataSource="[]"
      local="暂无数据"
    >
      <template slot="name" slot-scope="name">
        {{ name.first }} {{ name.last }}
      </template>
    </a-table>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { State, Getter, Action, Mutation, namespace } from 'vuex-class';
import { getAllTables } from '../../service/tables';

const webSite = namespace('webSite');

@Component({
  name: 'blog-component',
  components: {}
})
export default class blogComponent extends Vue {
  tables: any = [
    { tableName: 'table1' },
    { tableName: 'table2' },
    { tableName: 'table3' }
  ];
  columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      sorter: true,
      width: '20%',
      scopedSlots: { customRender: 'name' }
    },
    {
      title: 'Gender',
      dataIndex: 'gender',
      filters: [{ text: 'Male', value: 'male' }, { text: 'Female', value: 'female' }],
      width: '20%'
    },
    {
      title: 'Email',
      dataIndex: 'email'
    }
  ];
  created() {
    getAllTables().then((res: any) => {
      this.tables = res;
    });
  }

  mounted() {}
}
</script>
<style lang='less' scoped>
.databox {
  height: calc(100vh - 135px);
  display: flex;
  flex-direction: row;
  & > div {
    height: 100%;
  }
  .tables {
    width: 175px;
    border-right: 1px solid #ccc;
  }
  .tableinfo {
    flex: 1;
  }
}
</style>
