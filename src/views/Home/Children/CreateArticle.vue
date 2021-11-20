<template>
  <div class="create-article">
    <div class="base-msg">
      <div class="title">
        <div class="name">{{t('createArticle.title')}}:</div>
        <a-input v-model:value="articleData.title" :placeholder="t('createArticle.titleInput')"/>
      </div>
      <div class="title">
        <div class="name">{{t('createArticle.author')}}:</div>
        <a-input v-model:value="articleData.author" :placeholder="t('createArticle.authorInput')"/>
      </div>
      <div class="buttons">
        <div class="submit">
          <a-button type='primary' block @click="submitHandle">{{t('createArticle.submit')}}</a-button>
        </div>
        <a-popconfirm
          title="Are you sure clear?"
          ok-text="Yes"
          cancel-text="No"
          @confirm="clear"
        >
          <div class="clear"><a-button block>{{t('createArticle.clear')}}</a-button></div>
        </a-popconfirm>
      </div>
    </div>
    <div class="tinymce">
      <tinymce :clear="clearflag" @editContent="getContent"/>
    </div>
    {{articleData.content}}
  </div>
</template>

<script>
import tinymce from '@/components/Tinymce'
import { Modal,message  } from 'ant-design-vue'
import { reactive, ref } from '@vue/reactivity'
import { useI18n } from 'vue-i18n'

export default {
  name:'SendDynamic',
  components: { tinymce },
  setup(){
    const { t } = useI18n()

    // 文本编辑相关操作
    const articleData = reactive({
      title:'',
      author:'',
      content:''
    })
    const clearflag = ref(false)
    const getContent = (data,flag)=>{
      articleData.content = data
      clearflag.value = flag
    }
    const clear = ()=>{
      clearflag.value = true
    }
    const submitHandle = ()=>{
      Modal.confirm({
        content: t('createArticle.remind'),
        okText: t('createArticle.submit'),
        cancelText: t('createArticle.cancel'),
        onOk(){
          console.log("Already submit.")
          articleData.title=''
          articleData.author=''
          articleData.content=''
          clear()
          message.success(t('createArticle.success'))
        }
      })
    }

    return {
      t,articleData,clearflag,getContent,submitHandle,clear
    }
  }
}
</script>

<style scoped lang='less'>
  .create-article{
    min-height: 650px;
    background-color: white;
    padding: 24px;
    .base-msg{
      display: flex;
      justify-content: space-between;
      width: 920px;
      .title{
        display: flex;
        width: 300px;
      }
      .author{
        display: flex;
        width: 300px;
      }
      .name{
        margin-right: 16px;
        font-size: 17px;
        width: 50px;
        font-weight: 500;
        line-height: 30px;
      }
      .buttons{
        width: 165px;
        justify-content: space-between;
        display: flex;
        .submit{
          width: 76px;
        }
        .clear{
          width: 76px;
        }  
      }
      
    }
    .tinymce{
      margin-top: 20px;
    }
  }
</style>