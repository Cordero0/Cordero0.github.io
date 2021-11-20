<template>
    <TranslationOutlined class="lang" @click="changeLanguage"  />
</template>

<script>
import { ref } from 'vue'
import { useStore } from 'vuex'
import { TranslationOutlined } from '@ant-design/icons-vue'
import { useI18n } from 'vue-i18n'

export default {
  name:'',
  components:{ TranslationOutlined },
  setup(){
    const { locale } = useI18n()
    const store = useStore()
    const lang = ref(store.state.language)
    const changeLanguage = () => {
      lang.value === 'zh_CN'? lang.value = 'en_US':lang.value = 'zh_CN'
      locale.value = lang.value
      store.commit('changeLanguage',lang.value)
    }

    return{
      changeLanguage
    }
  }
}
</script>

<style scoped lang='less'>
  .lang:hover{
    cursor: pointer;
    color: @pointFontColor;
  }
</style>