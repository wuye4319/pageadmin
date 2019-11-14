<template>
  <div class="myapp-comp">
    <a-row class="header" :gutter="24">
      <a-col :span="10">
        <a-button
          @click="openModal"
          type="primary"
          style="margin-right: 8px"
        >
          <a-icon type="upload"/>上传组件
        </a-button>
        <a-button type="primary" @click="openCompModal">
          <a-icon type="plus"/>快速创建
        </a-button>
      </a-col>
      <a-col :span="14">
        <a-input-search
          @search="handleSearcheName"
          placeholder="请输入组件名称"
          enterButton
        />
      </a-col>
    </a-row>
    <a-table
      :rowKey="record => record.compName"
      :columns="columns.compList"
      :dataSource="compStore"
      :scroll="{y:scrollHeight,x: 900}"
      :locale="{'emptyText': '您还没有组件，去创建一个吧'}"
    >
      <template slot="pic" slot-scope="pic">
        <img
          :src="pic || defaultImg"
          width="60px"
          height="60px"
          alt="组件缩略"
        />
      </template>
      <div slot="actions" slot-scope="actions,record">
        <a-tag
          v-if="!record.isMarket"
          color="#17BC94"
          @click="addToCompMarket(record)"
        >发布</a-tag>
        <a-tag
          v-if="record.isMarket"
          color="#17BC94"
          @click="deleteCompMarket(record)"
        >下架</a-tag>
        <a-tag color="#17BC94" @click="handleAttr(record)">编辑</a-tag>
        <a-tag @click="showDetail(record)" color="#17BC94">详情</a-tag>
        <a-tag
          v-if="record.status != 'firing'"
          color="red"
          @click="showConfirm(record)"
        >删除</a-tag>
      </div>
    </a-table>
    <upload-modal
      :getCompStore="getCompStore"
      :visible="visible"
      :closeModal="closeModal"
    />
    <EditeModal
      :saveComp="saveComp"
      :visible="editVisible"
      :closeModal="closeEditModal"
      :editCompAttr="editCompAttr"
    />
    <CreateCompModal
      :visible="compVisible"
      :closeModal="closeCompModal"
      :getCompStore="getCompStore"
    />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { State, Action, Mutation, namespace } from 'vuex-class';
import UploadModal from '../common/uploadModal.vue';
import EditeModal from '../common/editAttrModal.vue';
import CreateCompModal from '../common/createCompModal.vue';
import { getCompStore, deleteCompStore, saveComp, updateCompMarket } from '../../service/index';
import { columns } from '../common/columns';
import Tools from '../../../common/utils/tools';

const utils = new Tools();
const app = namespace('app');
const defaultImg = require('../../../../static/images/img.png');

@Component({
  name: 'complist-component',
  components: {
    UploadModal,
    EditeModal,
    CreateCompModal
  }
})
export default class complistComponent extends Vue {
  $route;
  $router;
  $confirm;
  $message;
  columns: any = columns;
  uploadVisible: boolean = false;
  pagination: object = {};
  defaultImg = defaultImg;
  compStore: any = [];
  visible: boolean = false;
  editVisible: boolean = false;
  compVisible: boolean = false;
  editCompAttr: any = {};
  scrollHeight = window.innerHeight - 292;
  userID: string = '';

  @app.Mutation('changeCompDetail')
  changeCompDetail;

  async created() {
    let userID = utils.getCookie('userID');
    this.getCompStore(userID, { type: 'custom', compName: '' });
    this.userID = userID;
  }

  handleSearcheName(value) {
    this.getCompStore(this.userID, { type: 'custom', compName: value });
  }

  // 获取组件列表
  async getCompStore(user, data) {
    let res = await getCompStore(user, data);
    let compStore = (res.data.status === 200 && res.data.data) || [];
    this.compStore = compStore;
  }

  // 删除组件
  async deleteComp(compName) {
    let res = await deleteCompStore(this.userID, {
      compName: compName,
      type: 'custom'
    });
    if (res.data && res.data.data === 'success') {
      this.$message.success('删除成功！');
      this.getCompStore(this.userID, { type: 'custom', compName: '' });
    } else {
      this.$message.error('删除失败！');
    }
  }

  handleAttr(record) {
    this.editVisible = true;
    this.editCompAttr = record;
  }

  async saveComp(data) {
    let res = await saveComp(this.userID, data);
    if (res.data && res.data.status === 200) {
      this.$message.success('上传成功！');
      this.closeEditModal();
      this.getCompStore(this.userID, { type: 'custom', compName: '' });
    } else {
      this.$message.info('上传失败！');
    }
  }

  openModal() {
    this.visible = true;
  }

  closeModal() {
    this.visible = false;
  }

  closeEditModal() {
    this.editVisible = false;
  }
  openCompModal() {
    this.compVisible = true;
  }
  closeCompModal() {
    this.compVisible = false;
  }

  handleDelete(item) {
    this.showConfirm(item);
  }

  showConfirm(item) {
    let self = this;
    this.$confirm({
      title: `确认删除 ${item.compName} 组件?`,
      cancelText: '取消',
      okText: '确认',
      onOk() {
        self.deleteComp(item.compName);
      },
      onCancel() {}
    });
  }

  showDetail(item) {
    this.$router.push({
      path: '/admin/mycomp/detail?id=' + item.compID
    });
    this.changeCompDetail(item);
  }
  addToCompMarket(record) {
    this.updateCompMarket({ isMarket: 1, compID: record.compID });
  }
  deleteCompMarket(record) {
    this.updateCompMarket({ isMarket: 0, compID: record.compID });
  }
  updateCompMarket(data) {
    let userID = utils.getCookie('userID');
    updateCompMarket(userID, data).then((res: any) => {
      if (res === 'success') {
        this.$message.success('组件已发布到组件市场!');
        this.getCompStore(userID, { type: 'custom', compName: '' });
      } else {
        this.$message.error('组件发布失败，请重试!');
      }
    });
  }
}
</script>

<style lang='less' scoped>
.mylist {
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  justify-content: space-between;
  padding-top: 10px;
  border-top: 1px solid #ccc;
  /deep/.ant-card-body {
    padding: 14px;
  }
}
.list {
  min-width: 120px;

  p {
    height: 100px;
    overflow: auto;
    margin-top: 5px;
  }
  .pic {
    height: 150px;
  }
}
.header {
  padding-bottom: 10px;
  .operateButton {
    button {
      margin-left: 10px;
    }
  }
  .ant-form-item {
    margin: 0;
  }
}
</style>
