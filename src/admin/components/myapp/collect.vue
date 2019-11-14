<template>
  <div class="myapp-comp">
    <a-list
      :grid="{ gutter: 12, sm: 1, md: 3, lg: 4, xl: 4, xxl: 6 }"
      :dataSource="data"
      class="mylist"
      :locale="{'emptyText': '您还没有收藏任何应用，去应用市场看看吧！'}"
    >
      <a-list-item
        class="list"
        slot="renderItem"
        slot-scope="item"
      >
        <a-card hoverable class="mycard">
          <img
            alt="example"
            :src="item.appImg || defaultImg"
            slot="cover"
          />
          <template class="ant-card-actions" slot="actions">
            <a-popconfirm
              title="将该应用从收藏夹中移除?"
              @confirm="handleDelete(item)"
              okText="确认"
              cancelText="取消"
            >
              <a-icon type="delete" />
            </a-popconfirm>
            <a-icon type="edit" @click="goDetails(item)"/>
          </template>
          <a-card-meta :title="item.appName" :description="item.description">
          </a-card-meta>
        </a-card>
      </a-list-item>
    </a-list>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { State, Action, Mutation, namespace } from 'vuex-class';
import { Upload } from 'ant-design-vue';
import { getAppCollect, deleteCompStore, deleteAppCollect, } from '../../service/index';
import Tools from '../../../common/utils/tools';
const utils = new Tools();
const defaultImg = require('../../../../static/images/appImg.png');
const app = namespace('app');

@Component({
  name: 'myapp-collect'
})
export default class MyappCollect extends Vue {
  $route;
  $router;
  $confirm;
  $message;
  data: any = [];
  defaultImg: any = defaultImg;

  @app.Mutation('appDetail')
  setAppDetail;

  created() {
    this.getAppCollect();
  }

  getAppCollect() {
    let userID = utils.getCookie('userID');
    getAppCollect(userID).then((res: any) => {
      this.data = res;
    })
  }

  handleDelete(item) {
    let userID = utils.getCookie("userID");
    deleteAppCollect(userID,{appID: item.appID}).then((res: any)=>{
      if(res === 'success'){
        this.$message.success('应用已从收藏夹移除');
        this.getAppCollect();
      }else{
        this.$message.error('删除失败，请重试！')
      }
    });
  }

  goDetails(record) {
    this.$router.push({
      path: '/admin/myapp/appdetail?appID=' + record.appID
    });
    this.setAppDetail(record);
  }

}
</script>

<style lang='less' scoped>
</style>
