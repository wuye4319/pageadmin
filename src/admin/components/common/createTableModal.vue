<template>
  <div>
    <a-modal
      class="uploadModal"
      title="新建表"
      :visible="visible"
      @cancel="handleCancle"
      :closable="true"
      :footer="null"
      width="700px"
    >
      <a-form :form="form" @submit="handleSubmit">
        <a-form-item
          label="表名"
          :label-col="{ span: 5 }"
          :wrapper-col="{ span: 18 }"
        >
          <a-input
            placeholder="请输入表英文名称"
            v-decorator="[
              'tableName',
              {
                rules: [{ required: true, message: '请输入表英文名称!' },
                        {validator: validateCompName,}
                ],
              }
            ]"
          />
        </a-form-item>
        <a-form-item
          label="中文名"
          :label-col="{ span: 5 }"
          :wrapper-col="{ span: 18 }"
        >
          <a-input
            placeholder="请输入表中文名称"
            v-decorator="[
              'title',
              {
                rules: [{ required: true, message: '请输入表中文名称!' }],
              }
            ]"
          />
        </a-form-item>
        <a-form-item
          label="描述"
          :label-col="{ span: 5 }"
          :wrapper-col="{ span: 18 }"
        >
          <a-textarea
            placeholder="请输入表描述"
            v-decorator="[
              'description',
              {
              }
            ]"
          ></a-textarea>
        </a-form-item>
        <a-form-item :wrapper-col="{ span: 18, offset: 5 }">
          <a-button type="primary" html-type="submit">确认</a-button>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { State, Action, Mutation, namespace } from 'vuex-class';
import { Upload, Form, Input, Modal } from 'ant-design-vue';
import * as service from '../../service/index';
import Tools from '../../../common/utils/tools';
import { addTable } from '../../service/tables';

const utils = new Tools();
@Component({
  name: 'createComp-modal'
})
export default class CreateCompModal extends Vue {
  $form;
  $message;
  fileList: any = [];
  form: any;
  confirmLoading: boolean = false;
  submitData: any = {};

  @Prop() visible;
  @Prop() closeModal;
  @Prop() getCompStore;

  beforeCreate() {
    this.form = this.$form.createForm(this);
  }

  handleOk() {}

  handleCancle() {
    this.closeModal();
    this.form.resetFields();
  }

  getTableMessage(tableName) {}
  async handleSubmit(e) {
    let userID = utils.getCookie('userID');
    e.preventDefault();
    this.form.validateFields(async (err, values) => {
      if (!err) {
        let data = {
          tableName: values.tableName,
          description: values.description,
          title: values.title
        };
        addTable(data).then((res: any) => {
          if (res === 'success') {
            this.$message.success('创建成功')
          }
        });
      }
    });
  }
  // 校验组件名称
  validateCompName(rule, value, cbfn) {
    const form = this.form;
    if (value) {
      let reg = /[a-zA-Z]$/g;
      let res:any = reg.test(value);
      if (!res) {
        cbfn('只能输入英文字母');
      }
      cbfn();
    }
    cbfn();
  }
}
</script>

<style lang='less' scoped>
</style>
