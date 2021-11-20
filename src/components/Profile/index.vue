<template>
  <div class="profile">
    <a-row justify="space-between" :gutter="16">
      <a-col :span="6">
        <PersonalMsg />
      </a-col>
      <a-col :span="18">
        <div class="other-me">
          <a-tabs v-model:activeKey="activeKey">
            <a-tab-pane key="1" :tab="t('profile.tab.activity')"><Activity /></a-tab-pane>
            <a-tab-pane key="2" :tab="t('profile.tab.timeLine')" force-render><TimeLine /></a-tab-pane>
            <a-tab-pane key="3" :tab="t('profile.tab.account')"><Account /></a-tab-pane>
          </a-tabs>
        </div>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import Activity from '@/components/Activity'
import TimeLine from '@/components/TimeLine'
import Account from '@/components/Account'
import PersonalMsg from '@/components/PersonalMsg'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'


export default {
  name:'profile',
  components:{ Activity,TimeLine,Account,PersonalMsg },
  setup(){
    const { t } = useI18n()
    // 菜单选项状态保存
    const activeKey = ref("1")

    return{
      activeKey,t,
    } 
  }
}
</script>

<style lang='less' scoped>
  .profile{
    padding: 10px;
    .other-me{
      background-color: white;
      border-radius: 5px;
      // box-shadow: 0 0 5px 3px rgba(247, 247, 247, 0.719);
      box-shadow: 0 0 5px 3px rgba(238, 238, 238, 0.719);
      border: 1px solid @borderColor;
      padding: 16px;
    }
  }
</style>