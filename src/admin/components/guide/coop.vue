<template>
  <div class="notice">
    敬请期待...
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { State, Action, Mutation, namespace } from 'vuex-class';

@Component({
  name: 'notice-component'
})
export default class noticeComponent extends Vue {
  $router;
}
</script>

<style lang='less' scoped>
/deep/blockquote{
  border-left: 6px solid #e6e6e6;
  background: #fafafa;
  padding-left: 5px;
}
/deep/pre{
  background: #f2f2f2;
  border-radius: 4px;
}
/deep/li{
  list-style: initial;
}

</style>
