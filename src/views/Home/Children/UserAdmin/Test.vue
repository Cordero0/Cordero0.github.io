<template>
  <div class="test">
    <div class="title">{{t('test.title')}}</div>
    <a-radio-group v-model:value="role" button-style="solid">
      <a-radio-button value="editor">{{t('test.editor')}}</a-radio-button>
      <a-radio-button value="admin">{{t('test.admin')}}</a-radio-button>
    </a-radio-group>
  </div>
</template>

<script>
import { ref } from '@vue/reactivity'
import { watch } from '@vue/runtime-core'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'

export default {
  name: "test",
  setup(){
    const { t } = useI18n()
    const store = useStore()

    // 角色切换处理
    const role = ref(store.state.role)
    watch(role,(role)=>{
      store.commit('changeRole',role)
    })

    return{
      role,t
    }
  }
}
</script>

<style lang='less' scoped>
.test{
  padding: 30px;
  padding-left: 40px;
  height: 400px;
  background-color: white;
  .title{
    line-height: 45px;
    font-size: 16px;
    font-weight: 500;
  }
}
</style>