<template class="tinymce-box">
  <div>
    <editor v-model="myValue" :init="init">
    </editor>
  </div>
</template>

<script>
import tinymce from 'tinymce/tinymce'
import Editor from '@tinymce/tinymce-vue'
import 'tinymce/icons/default'
import 'tinymce/themes/silver'
import 'tinymce/themes/mobile'
import 'tinymce/plugins/emoticons'
import 'tinymce/plugins/image'// 插入上传图片插件
import 'tinymce/plugins/media'// 插入视频插件
import 'tinymce/plugins/table'// 插入表格插件
import 'tinymce/plugins/link' //超链接插件
import 'tinymce/plugins/code' //代码块插件
import 'tinymce/plugins/lists'// 列表插件
import 'tinymce/plugins/contextmenu'  //右键菜单插件
import 'tinymce/plugins/wordcount' // 字数统计插件
import 'tinymce/plugins/colorpicker' //选择颜色插件
import 'tinymce/plugins/textcolor'  //文本颜色插件
import 'tinymce/plugins/fullscreen' //全屏
import 'tinymce/plugins/help'       
import 'tinymce/plugins/charmap'
import 'tinymce/plugins/paste'
import 'tinymce/plugins/print'
import 'tinymce/plugins/preview'
import 'tinymce/plugins/hr'
import 'tinymce/plugins/anchor'
import 'tinymce/plugins/pagebreak'
import 'tinymce/plugins/searchreplace'
import 'tinymce/plugins/visualblocks'
import 'tinymce/plugins/visualchars'
import 'tinymce/plugins/insertdatetime'
import 'tinymce/plugins/nonbreaking'
import 'tinymce/plugins/autosave'
import { computed, ref } from '@vue/reactivity'
import { onBeforeMount, onMounted, watch } from '@vue/runtime-core'
import { useI18n } from 'vue-i18n'

const init = {
  skin_url:'/tinymce/skins/ui/oxide',
  language_url:'/tinymce/langs/zh_CN.js',
  language:"",
  height:500,
  emoticons_database_url:'/tinymce/emoticons/js/emojis.js',
  plugins:'lists image media table wordcount code fullscreen help autosave emoticons nonbreaking insertdatetime visualchars visualblocks searchreplace pagebreak link charmap paste print preview hr anchor' ,
  toolbar: ['newdocument undo redo | formatselect |cut copy paste selectall| bold italic underline strikethrough |codeformat blockformats| superscript subscript  | forecolor backcolor | alignleft aligncenter alignright alignjustify | outdent indent |  removeformat ',
    'code  bullist numlist | lists image media table link |fullscreen help emoticons restoredraft nonbreaking insertdatetime visualchars visualblocks searchreplace pagebreak anchor charmap  pastetext print preview hr',
  ],
}

export default {
  name:'Tinymce',
  components:{ Editor },
  props:['clear'],
  emits:[ 'editContent' ],
  setup(props,context){
    // 语言切换
    const { locale } = useI18n()
    onBeforeMount(()=>{
      init.language = locale.value
    })
    
    onMounted(()=>{
      tinymce.init({})
    })

    // 文本内容
    const myValue = ref("")
    watch(myValue,(myValue)=>{
      const show = false
      context.emit('editContent',myValue,show)
    })

    // 清空
    const flag = computed(()=>props.clear)
    watch(flag,(flag)=>{
      if(flag){
        myValue.value = ""
      }
    })
    
    return{
      init,myValue
    }
  }
}
</script>

<style scoped lang='less'>
  
</style>