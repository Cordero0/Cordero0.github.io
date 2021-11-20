<template>
  <div class="account">
    <div class="form">
      <div>
        <div class="title">{{t('profile.account.account')}}</div>
        <div class="input">
          <a-input loading="loading" style="height:40px;" v-model:value="account"></a-input>
        </div>
      </div>
      <div>
        <div class="title">{{t('profile.account.email')}}</div>
        <div class="input">
          <a-input style="height:40px;" v-model:value="email"></a-input>
        </div>
      </div>
      <div class="button"><a-button :loading="loading" @click="update" type="primary">{{t('profile.account.update')}}</a-button></div>
    </div>
  </div>
</template>

<script>
import { message } from 'ant-design-vue'
import { ref } from '@vue/reactivity'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'

export default {
  name:'',
  setup(){
    const { t } = useI18n()
    const store = useStore()

    // 账号相关信息修改
    const loading = ref(false)
    const account = ref(store.state.userMsg.account.username)
    const email = ref(store.state.userMsg.account.email)
    const update = ()=>{
      const obj = {
        username:account,email
      }
      store.commit('updateAccount',obj)
      loading.value = true
      setTimeout(()=>{
        loading.value = false
        message.success(t('profile.account.prompt'))
      },1000)
    }

    return{
      t,loading,account,email,update
    }
  }
}
</script>

<style lang='less' scoped>
.account{
  height: 500px;
  margin-left: 40px;
  margin-top: 20px;
  .form{
    width: 800px;
    border: 1px solid @borderColor;
    padding: 30px 50px 50px 40px;
    .title{
      font-weight: 500;
      font-size: 15px;
      line-height: 40px;
      margin-top: 10px;
    }
    .button{
      margin-top: 24px;
    }
  }
}
</style>