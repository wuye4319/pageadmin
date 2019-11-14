<template>
  <div class="myapp-comp">
    <a-list
      :grid="{ gutter: 12, sm: 1, md: 3, lg: 4, xl: 4, xxl: 6 }"
      :dataSource="compStore"
      :locale="{'emptyText': '您还没有收藏任何组件，去应用市场看看吧！'}"
      :pagination="{
        total: compStore.length, // 总数
        showQuickJumper: true,
        onChange: page => {
          console.log(page);
        },
        pageSize: 8,
        hideOnSinglePage: true
      }"
      class="mylist"
    >
      <a-list-item
        class="list"
        slot="renderItem"
        slot-scope="item"
      >
        <a-card hoverable class="mycard">
          <img
            @click="showDetail(item)"
            width="120px"
            alt="example"
            :src="item.pic || defaultImg"
            slot="cover"
          />
          <template class="ant-card-actions" slot="actions">
            <a-icon type="edit" title="编辑"/>
            <a-popconfirm
              title="将该组件从收藏夹中移除?"
              @confirm="handleDelete(item)"
              okText="确认"
              cancelText="取消"
            >
              <a-icon type="delete" />
            </a-popconfirm>
          </template>
          <a-card-meta :title="item.compName" @click="showDetail(item)"></a-card-meta>
          <p @click="showDetail(item)">{{ item.description }}</p>
        </a-card>
      </a-list-item>
    </a-list>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { State, Action, Mutation, namespace } from 'vuex-class';
import { Upload } from 'ant-design-vue';
import UploadModal from '../common/uploadModal.vue';
import { getCompStore, deleteCompStore,getCompCollect,deleteCompCollect } from '../../service/index';
import compStoreComponent from '../../../website/components/comp_store/comp_store.vue';
import AppState from '../../store';
import Tools from '../../../common/utils/tools';
const utils = new Tools();

const app = namespace('app');
const defaultImg = require('../../../../static/images/compImg.png');

@Component({
  name: 'complist-component',
  components: {
    UploadModal
  }
})
export default class complistComponent extends Vue {
  $route;
  $router;
  $confirm;
  $message;
  uploadVisible: boolean = false;
  pagination: object = {};
  defaultImg = defaultImg;
  compStore: any = [];
  visible: boolean = false;

  @app.Mutation('changeCompDetail')
  changeCompDetail;

  async created() {
    this.getCompCollect();
  }

  // 获取组件列表
  async getCompCollect() {
    let userID = utils.getCookie("userID");
    getCompCollect(userID).then((res: any) => {
      this.compStore = res;
    });
  }

  // 删除组件
  async deleteComp(compName) {
    let res = await deleteCompStore('e3b0c44298fc1c1', { compName: compName, type: 'custom' });
    let compStore = res.data.status === 200 && res.data.data;
    this.compStore = compStore;
  }

  handleDelete(item) {
    let userID = utils.getCookie("userID");
    deleteCompCollect(userID,{compID: item.compID}).then((res: any) => {
      if(res === 'success'){
        this.$message.success('组件已从收藏夹移除');
        this.getCompCollect();
      }else{
        this.$message.error('删除失败，请重试！')
      }
    })
  }

  showDetail(item) {
    this.$router.push({
      path: '/admin/myapp/detail'
    });
    this.changeCompDetail(item);
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
  /deep/.ant-card-body {
    padding: 14px;
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
