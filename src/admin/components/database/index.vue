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
            :locale="{emptyText: '暂无数据'}"
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
          <a-tabs defaultActiveKey="1">
            <a-tab-pane key="1">
              <span slot="tab">内容</span>
              <a-button type="primary" @click="addContentRow">添加内容</a-button>
              <a-table
                :columns="contentColumns"
                :rowKey="record => record.login.uuid"
                :dataSource="contentMessage"
                :locale="{emptyText: '暂无数据'}"
              >
                <template slot="name" slot-scope="name">{{ name.first }} {{ name.last }}</template>
              </a-table>
            </a-tab-pane>
            <a-tab-pane key="2">
              <span slot="tab">结构</span>
              <a-button type="primary" @click="addStructRow">添加字段</a-button>
              <a-table
                :columns="columns.struct"
                :rowKey="record => record.column_name"
                :dataSource="structMessage"
                :locale="{emptyText: '暂无数据'}"
              >
                <template
                  v-for="col in ['column_name', 'data_type', 'mark']"
                  :slot="col"
                  slot-scope="text, record,index"
                >
                  <div :key="col">
                    <a-input
                      v-if="record.editable"
                      style="margin: -5px 0"
                      :value="text"
                      @change="e => handleChange(e.target.value, index,col, 'structMessage')"
                    />
                    <template v-else>{{ text }}</template>
                  </div>
                </template>
                <template slot="operation" slot-scope="text, record,index">
                  <div class="editable-row-operations">
                    <span v-if="record.editable">
                      <a @click="() => save(record,index,'structMessage')">保存</a>
                      <a-popconfirm
                        title="Sure to cancel?"
                        @confirm="() => cancel(index,'structMessage')"
                      >
                        <a>取消</a>
                      </a-popconfirm>
                    </span>
                    <span v-else>
                      <a @click="() => edit(index,'structMessage')">编辑</a>
                    </span>
                  </div>
                </template>
              </a-table>
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
import {
  getAllTables,
  getTableMessage,
  addTableColunm
} from '../../service/tables';
import createTableModal from '../common/createTableModal.vue';
import Tools from '../../../common/utils/tools';
import { columns } from './columns';

const utils = new Tools();
@Component({
  name: 'dataBase-component',
  components: {
    createTableModal
  }
})
export default class dataBaseComponent extends Vue {
  tableType: string = 'content';
  tables: any = [];
  visible: boolean = false;
  structMessage: any = [];
  contentMessage: any = [];
  cacheData: any = [];
  columns = columns;
  currentTable: string = '';
  contentColumns: any = [];

  created() {
    this.getAllTables();
  }

  getAllTables() {
    let userID = utils.getCookie('userID');
    getAllTables(userID).then((res: any) => {
      this.tables = res;
    });
  }

  mounted() {}

  tableChage(e) {
    this.tableType = e.target.value;
  }
  hanldeAddTable() {
    this.visible = true;
  }
  getTableMessage(tableName) {
    this.currentTable = tableName;
    getTableMessage(tableName).then((res: any) => {
      this.structMessage = res.tableStruct;
      this.contentMessage = res.tableContent;
      this.setContentColumns(res.tableStruct);
    });
  }
  setContentColumns(struct) {
    let columns1: any = [];
    struct.forEach(item => {
      let temp: any = {};
      item.title = item.column_name;
      item.dataIndex = item.column_name;
      item.scopedSlots = { customRender: item.column_name };
      columns1.push(item);
    });
    this.contentColumns = columns1;
  }
  closeModal() {
    this.visible = false;
  }
  addStructRow() {
    const { structMessage } = this;
    let newRow = { column_name: '', data_type: '', mark: '' };
    this.structMessage = [...structMessage, newRow];
  }
  addContentRow() {
    const { contentMessage } = this;
    let newRow = {};
  }
  changeStruct(data) {
    this.structMessage = data;
  }
  edit(index, type) {
    const newData = [...this[type]];
    const target = newData[index];
    if (target) {
      target.editable = true;
      this[type] = newData;
    }
  }
  save(record, key, type) {
    console.log(record);
    const newData = [...this[type]];
    const target = newData.filter(item => key === item.column_name)[0];
    if (target) {
      delete target.editable;
      this[type] = newData;
    }
    addTableColunm(this.currentTable, record);
  }
  cancel(key, type) {
    const newData = [...this[type]];
    const target = newData[key];
    if (target) {
      Object.assign(target, this.cacheData.filter(item => key === item.key)[0]);
      delete target.editable;
      this[type] = newData;
    }
  }
  handleChange(value, key, column, type) {
    // console.log(value, key, column, type)
    const newData = [...this[type]];
    const target = newData[key];
    console.log(target);
    if (target) {
      target[column] = value;
      this[type] = newData;
      // this.cacheData = newData;
    }
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
  .tablelist {
    cursor: pointer;
    &:hover {
      color: #17bc94;
    }
  }
}
</style>
