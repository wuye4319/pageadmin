<template>
  <div class="dataCenter">
    <a-row :gutter="24">
      <a-col class="leftside" :span="5">
        <a-button @click="hanldeAddTable" type="primary">
          <a-icon type="plus"/>新建表
        </a-button>
        <div class="tables">
          <a-list
            size="small"
            :bordered="false"
            :dataSource="tables"
          >
            <a-list-item
              class="tablelist"
              @click="getTableMessage(item.tableName)"
              slot="renderItem"
              slot-scope="item"
            >{{ item.tableName }}</a-list-item>
          </a-list>
        </div>
      </a-col>
      <a-col :span="19">
        <div class="databox">
          <a-tabs defaultActiveKey="2">
            <a-tab-pane key="1">
              <span slot="tab">内容</span>
              <contentT/>
            </a-tab-pane>
            <a-tab-pane key="2">
              <span slot="tab">结构</span>
              <strucT/>
            </a-tab-pane>
          </a-tabs>
        </div>
      </a-col>
    </a-row>
    <create-table-modal :visible="visible" :closeModal="closeModal"/>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { State, Getter, Action, Mutation, namespace } from 'vuex-class';
import { getAllTables, getTableMessage } from '../../service/tables';
import contentT from './contentTable.vue';
import strucT from './structureTable.vue';
import createTableModal from '../common/createTableModal.vue';

const webSite = namespace('webSite');

@Component({
  name: 'blog-component',
  components: {
    contentT,
    strucT,
    createTableModal
  }
})
export default class blogComponent extends Vue {
  tableType: string = 'content';
  tables: any = [];
  visible: boolean = false;

  created() {
    getAllTables().then((res: any) => {
      this.tables = res;
    });
  }

  mounted() {}

  tableChage(e) {
    console.log(e.target.value);
    this.tableType = e.target.value;
  }
  hanldeAddTable() {
    this.visible = true;
  }
  getTableMessage(tableName) {
    getTableMessage(tableName).then((res: any) => {
      console.log(res);
    });
  }
  closeModal() {
    this.visible = false;
  }
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
  .tableinfo {
    flex: 1;
  }
  .ant-tabs {
    width: 100%;
  }
}
.leftside {
  border-right: 1px solid #ccc;
}
.tables {
  height: calc(100vh - 170px);
  // border-right: 1px solid #ccc;
  .tablelist{
    cursor: pointer;
    &:hover{
      color: #17BC94;
    }
  }
}
</style>
