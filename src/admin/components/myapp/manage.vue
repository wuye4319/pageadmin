<template>
  <div class="myapp-manage">
    <a-row class="header" :gutter="24">
      <a-col :span="5">
        <a-button @click="openModal" type="primary">
          <a-icon type="plus"/>新建
        </a-button>
      </a-col>
      <a-col :span="7">
        <a-input placeholder="请输入应用名称" @change="searchName"/>
      </a-col>
      <a-col :span="7">
        <a-select
          style="width: 100%"
          placeholder="请选择应用类型"
          @change="searchType"
        >
          <a-select-option value>全部</a-select-option>
          <a-select-option value="mobile">手机端</a-select-option>
          <a-select-option value="desktop">PC端</a-select-option>
        </a-select>
      </a-col>
      <a-col :span="3">
        <a-button type="primary" @click="handleSearch">查询</a-button>
      </a-col>
    </a-row>
    <div class="header"></div>
    <a-table
      :rowKey="(record,i) => record.appID"
      :columns="columns.manage"
      :dataSource="data"
      :loading="loading"
      :scroll="{y:scrollHeight,x: 1090}"
      :locale="{'emptyText': '您还没有应用，去新建一个吧'}"
    >
      <template slot="pic" slot-scope="pic">
        <img
          :src="pic || defaultImg"
          width="60px"
          height="60px"
          alt="应用缩略"
        />
      </template>
      <div slot="actions" slot-scope="actions,record">
        <a-tag color="#17BC94" @click="goDesigner(record)">设计</a-tag>
        <a-popconfirm
          title="将应用发不到应用市场?"
          @confirm="addToAppstore(record)"
          okText="确认"
          cancelText="取消"
          v-if="!record.isMarket"
        >
          <a-tag color="#17BC94">发布</a-tag>
        </a-popconfirm>
        <a-popconfirm
          title="将该应用从应用市场下架?"
          @confirm="deleteFromAppstore(record)"
          okText="确认"
          cancelText="取消"
          v-if="record.isMarket"
        >
          <a-tag color="#17BC94">下架</a-tag>
        </a-popconfirm>
        <a-tag @click="goDetails(record)" color="#17BC94">详情</a-tag>
        <a-tag color="#17BC94" @click="handleEdit(record)">编辑</a-tag>
        <a-tag
          v-if="record.status != 'firing'"
          color="red"
          @click="showConfirm(record)"
        >删除</a-tag>
      </div>
    </a-table>
    <create-app-modal
      :visible="visible"
      :closeModal="closeModal"
      :appData="appData"
    ></create-app-modal>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { State, Action, Mutation, namespace } from 'vuex-class';
import createAppModal from '../common/createAppModal.vue';
import { columns } from '../common/columns';
import * as service from '../../service/index';
import Tools from '../../../common/utils/tools';
import { updateAppstore } from '../../service/index';

const utils = new Tools();
const app = namespace('app');
const defaultImg = require('../../../../static/images/img.png');

@Component({
  name: 'myapp-manage',
  components: {
    createAppModal
  }
})
export default class MyappManage extends Vue {
  $route;
  $router;
  $message;
  $confirm;
  visible: boolean = false;
  columns: any = columns;
  loading: boolean = false;
  defaultImg = defaultImg;
  data: any = [];
  selectedRowKeys: any = [];
  scrollHeight: number = window.innerHeight - 292;
  userID: string = '';
  appData: any = {};

  @app.Mutation('appDetail')
  setAppDetail;

  searchParam: any = { appName: '', screen: '' };

  created() {}

  mounted() {
    let userID: any = utils.getCookie('userID');
    if (!userID) {
      this.$router.push({
        path: '/login'
      });
    }
    this.userID = userID;
    this.getApps(userID, { appName: '', screen: '' });
  }

  async getApps(userID, query) {
    let res = await service.getApps(userID, query);
    if (res.data.status === 200) {
      this.data = res.data.data;
    }
  }
  goDetails(record) {
    this.$router.push({
      path: '/admin/myapp/appdetail?appID=' + record.appID
    });
    this.setAppDetail(record);
  }
  goDesigner(record) {
    let pageInfor = JSON.parse(record.pageInfor);
    let defaultPage = Object.keys(pageInfor)[0];
    this.$router.push({
      path: `/designer/${record.appID}/${defaultPage}`,
      query: {
        screen: record.screen
      }
    });
  }
  handleEdit(record) {
    this.openModal();
    this.appData = record;
  }
  closeModal(message) {
    if (message === 'success') {
      this.getApps(this.userID, { appName: '', screen: '' });
    }
    this.visible = false;
    this.appData = {};
  }
  openModal() {
    this.visible = true;
  }

  async deleteApp(id) {
    let res = await service.deleteApp(this.userID, {
      appID: id
    });
    if (res.data && res.data.data === 'success') {
      this.$message.success('删除成功！');
      this.getApps(this.userID, { appName: '', screen: '' });
    } else {
      this.$message.error('删除失败！');
    }
  }

  showConfirm(item) {
    let self = this;
    this.$confirm({
      title: `确认删除 ${item.appName} 应用?`,
      cancelText: '取消',
      okText: '确认',
      onOk() {
        self.deleteApp(item.appID);
      },
      onCancel() {}
    });
  }
  async handleActions(type) {
    if (type === 'deleteMore') {
      if (!this.selectedRowKeys.length) {
        this.$message.warning('请选择需要删除的应用！');
      }
    }
  }

  searchType(value) {
    this.searchParam.screen = value;
  }
  searchName(value) {
    this.searchParam.appName = value.data || '';
  }
  handleSearch() {
    let userID = utils.getCookie('userID');
    this.getApps(userID, this.searchParam);
  }
  addToAppstore(record) {
    this.updateAppstore({appID: record.appID,isMarket: 1})
  }
  deleteFromAppstore(record) {
    this.updateAppstore({appID: record.appID,isMarket: 0})
  }
  updateAppstore(data){
    let userID = utils.getCookie('userID');
    service.updateAppstore(userID, data).then((res: any) => {
      if (res === 'success') {
        this.$message.success('应用下架成功！')
        this.getApps(this.userID, { appName: '', screen: '' });
      } else {
        this.$message.error('应用下架失败，请重试！')
      }
    })
  }
}
</script>

<style lang='less' scoped>
.myapp-manage {
  .header {
    margin-bottom: 12px;
  }
}
</style>
