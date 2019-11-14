<template>
  <div>
    <a-modal
      class="myModal"
      title="自定义组件属性"
      :visible="visible"
      @cancel="handleCancle"
      @ok="handleOk"
      :closable="true"
      okText="确认"
      cancelText="取消"
      width="700px"
    >
      <h4>{{ editCompAttr.title }}:</h4>
      <a-textarea
        :row="8"
        style="height: 200px"
        v-model="editCompAttr.compAttr"
        placeholder="请输入自定义组件属性"
      ></a-textarea>
      <p style="margin-bottom: 0;margin-top: 8px">注: 请输入json格式的数据</p>
    </a-modal>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { State, Action, Mutation, namespace } from 'vuex-class';
import { Upload, Form, Input, Modal } from 'ant-design-vue';
import { editComp } from '../../service/index';
import Tools from '../../../common/utils/tools';

const utils = new Tools();

@Component({
  name: 'upload-modal',
  components: {
  }
})
export default class UploadModal extends Vue {
  @Prop() visible;
  @Prop() closeModal;
  @Prop() saveComp;
  @Prop() editCompAttr;

  $form;
  $message;
  fileList: any = [];
  confirmLoading: boolean = false;
  submitData: any = {};
  compAttr: any = this.editCompAttr.compAttr;

  async handleOk() {
    let userID = utils.getCookie('userID');
    if (this.isJSON(this.editCompAttr.compAttr)) {
      let res = await editComp(userID, this.editCompAttr);
      if (res.data.data === 'success') {
        this.$message.success('保存成功！');
      } else {
        this.$message.error('请重试');
      }
    } else {
      this.$message.error('请输入正确的json格式数据')
    }
  }

  isJSON(str) {
    if (typeof str === 'string') {
      try {
        JSON.parse(str);
        return true;
      } catch (e) {
        return false;
      }
    }
  }

  async handleCancle() {
    this.closeModal();
  }
}
</script>

<style lang='less' scoped>
</style>
