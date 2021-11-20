<template>
  <div @click="showDrawer">
    <span class="setting-content">{{t('setting.title')}}</span>
    <a-drawer
      :title="t('setting.title')"
      placement="right"
      :closable="true"
      v-model:visible="visible"
      :after-visible-change="afterVisibleChange"
      :width="320"
    >
      <div class="item">
        <div class="title"><SkinOutlined /> {{t('setting.theme')}} :</div>
        <div class="select">{{theme}}
          <div><a-switch v-model:checked="themeState" @click='SwitchTheme'/></div>
        </div>
      </div>
      <div class="item">
        <div class="title"><TranslationOutlined /> {{t('setting.language')}} :</div>
        <a-select
          v-model:value="lang"
          style="width: 120px"
          @change="changeLanguage"
        >
          <a-select-option value="en_US">English</a-select-option>
          <a-select-option value="zh_CN">中文</a-select-option>
        </a-select>
      </div>
    </a-drawer>
  </div>
</template>

<script>
import { SkinOutlined,TranslationOutlined } from '@ant-design/icons-vue';
import {useStore} from 'vuex'
import { reactive,toRefs,onMounted } from 'vue'
import theme from '@/theme/model.js'
import { useI18n } from 'vue-i18n'

export default {
  name:'Test',
  components:{ SkinOutlined,TranslationOutlined },
  setup(){
    const store = useStore()
    onMounted(()=>{
      Object.assign(data,store.state.color)
      // data.themeState = computed(()=>store.state.color.themeState)
      // data.theme = ref(store.state.color.theme)
    })

    const state = reactive({
      visible :false
    })
    const afterVisibleChange = bool => {
      console.log('visible', bool);
    };
    const showDrawer = () => {
      state.visible = true;
    };

    const data = reactive({
      theme:'light',
      themeState:false,
      headerColor:'',
      fontColor:''
    })
    const changeStyle = (obj)=>{
      for(let key in obj){
        document.getElementsByTagName('body')[0].style.setProperty(`--${key}`, obj[key]);
      }
    }
    const SwitchTheme = ()=>{
      if(data.themeState){
        data.theme = theme.themeB.navColor
        data.headerColor = theme.themeB.headerColor
        data.fontColor = theme.themeB.fontColor
      }else{
        data.theme = theme.themeA.navColor
        data.headerColor = theme.themeA.headerColor
        data.fontColor = theme.themeA.fontColor
      }
      store.commit('changeTheme',data)
      changeStyle(data)
    }

    const { t,locale } = useI18n()
    const lang = locale
    const changeLanguage = (lang) => {
      store.commit('changeLanguage',lang)
    }
    
    return {
      ...toRefs(data),SwitchTheme,...toRefs(state),afterVisibleChange,showDrawer,
      t,lang,changeLanguage
    } 
  }
}
</script>

<style lang='less'>
.item{
  margin-bottom: 10px;
  width: 230px;
  line-height: 30px;
  display: flex;
  justify-content: space-between;
  .title{
    font-size: 16px;
  }
  .select{
    width: 85px;
    display: flex;
    font-size: 16px;
    color: @pointFontColor;
    justify-content: space-between;
  }
}  
</style>