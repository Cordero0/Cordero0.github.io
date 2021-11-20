<template>
  <div class="reply">
    <a-form>
      <a-form-item style="width:400px">
        <a-textarea :rows="4" v-model:value="content" />
      </a-form-item>
      <a-form-item>
        <div class="operate">
          <div class="emojiSelect">
            <EmojiSelect @getEmoji="emojiHandle"/>
          </div>  
          <div class="buttons">
            <a-button size="small" style="font-size:12px;" type="primary" @click="handleSubmit">
              submit
            </a-button>
            <a-button size="small" style="font-size:12px;margin-left:8px" @click="handleCancel">
              cancel
            </a-button>  
          </div>
        </div>
      </a-form-item>
    </a-form>
  </div>
</template>

<script> 
import { ref } from 'vue'
import EmojiSelect from '@/components/Emoji'

export default {
  name:'Reply',
  components:{ EmojiSelect },
  emits:[ 'replyBack','replyCancel' ] ,
  setup(props,context){
    const content = ref('')
    let data = ''

    const handleSubmit = ()=>{
      data = content.value
      content.value = ''
      context.emit('replyBack',data)
    }
    const handleCancel = ()=>{
      content.value = ''
      context.emit('replyCancel')
    }
    const emojiHandle = (data)=>{
      content.value += data
    }

    return{
      content,handleSubmit,data,handleCancel,emojiHandle
    }
  }
}
</script>

<style lang='less' scoped>
  .reply{
    margin-top: 8px;
    margin-bottom: -38px;
    .operate{
      display: flex;
      margin-top:-32px;
      // padding-left: 6px;
      color: rgb(136, 136, 136);
      width: 400px;
      justify-content: space-between;
      .emojiSelect{
        font-size: 19px;
      }
      // .buttons{
        // margin-top: -2px;
      // }
    }
  }
</style>