<template>
  <div class="emoji">
    <ul class="emoji-controller">
      <li 
        v-for="(pannel,index) in pannels" 
        :key="index"
        @click="changeActive(index)"
        :class="{'active': index === activeIndex}">{{ pannel }}</li>
    </ul>
    <ul class="emoji-container">
      <li 
        style="padding: 0" 
        v-for="(emojiGroup, index) in emojis" :key="index">
        <div v-if="index === activeIndex">
          <a 
            href="javascript:;" 
            v-for="(emoji, index) in emojiGroup"  
            :key="index" @click="selectItem(emoji)">
            <span 
                class="emoji-item"
                :title="emoji"
                :class="'sprite-' + getPureName(emoji)"></span>
          </a>  
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import { computed, reactive,toRefs } from 'vue'
import data from './assets/emoji-data.js'

export default {
  name:'Emoji',
  emits:[ 'select' ] ,
  setup(props,context){
    const dataSource = reactive({
      emojiData:data,
      pannels: ['表情', '自然', '物品', '地点', '符号'],
      activeIndex: 0
    })
    const emojis = computed(()=>{
      return dataSource.pannels.map(item => {
        return Object.keys(dataSource.emojiData[item])
      })
    })
    const changeActive = (index)=>{
      dataSource.activeIndex = index
    }
    const getPureName = (name)=>{
      return name.replace(/:/g, '')
    }
    const selectItem = (emoji)=>{
      context.emit('select', emoji)
    }

    return{
      ...toRefs(dataSource),changeActive,getPureName,selectItem,emojis
    }
  }
}
</script>

<style lang='scss' scoped>
@import './assets/emoji-sprite.scss';

.emoji {
  width: 380px;
  height: 186px;
  // bottom: 30px;
  background: #fff;
  z-index: 10;
  // padding: 10px;
  // margin-right: 10px;
  .emoji-controller {
    height: 36px;
    overflow: hidden;
    margin-bottom: 0;
    li {
      float: left;
      width: 76px;
      font-size: 12px;
      line-height: 36px;
      cursor: pointer;
      text-align: center;
      position: relative;
      &.active::after{
        content: '';
        width: 100%;
        height: 1px;
        background: #0689dd;
        left: 0;
        bottom: 4px;
        position: absolute;
      }
    }
  }
  .emoji-container {
    height: 140px;
    overflow-y: auto;
    overflow-x: hidden;
    position: relative;
    li {
      font-size: 0;
      padding: 5px;
      a {
        float: left;
        overflow: hidden;
        height: 35px;
        transition: all ease-out .2s;
        border-radius: 4px;
        &:hover {
          background-color: #d8d8d8;
          border-color: #d8d8d8;
        }
        span {
          width: 25px;
          height: 25px;
          display: inline-block;
          border: 1px solid transparent;
          cursor: pointer;
        }
      }
    }
  }
}
</style>