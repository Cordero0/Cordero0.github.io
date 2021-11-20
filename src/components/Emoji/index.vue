<template>
  <a-popover placement="bottomLeft">
    <template #content style="margin-left:-6px">
      <Emoji @select="selectEmoji"/>  
    </template>
    <SmileOutlined class="emoji-start"/>
  </a-popover>
</template>

<script>
import { ref } from 'vue'
import Emoji from '@/components/Emoji/emoji.vue'
import { SmileOutlined } from '@ant-design/icons-vue'

export default {
  name:'emojiSelect',
  components:{ Emoji,SmileOutlined },
  emits:[ 'getEmoji' ] ,
  setup(props,context){
    const content = ref('')

    const selectEmoji = (code)=>{
      content.value += code
      context.emit('getEmoji',content.value)
    }

    return{
      selectEmoji
    }
  }
}
</script>

<style scoped lang='less'>
  // .emoji{
    .emoji-start{
      padding-left: 8px;
      position: relative;
      color:rgb(136, 136, 136);
      // font-size:20px;  
    }
    .emoji-start:hover{
      cursor: pointer;
      color:@pointFontColor;  
    }
    .emoji-panel{
      border: 1px solid @borderColor;
      box-shadow: 0 0 3px 1px rgba(231, 231, 231, 0.4);
      // background-color: gray;
      position: absolute;
      top:20px;
      margin-left: -6px;
    }
  // }
 
</style>