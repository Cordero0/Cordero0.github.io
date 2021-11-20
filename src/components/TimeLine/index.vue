<template>
  <div class="timeline">
    <a-timeline>
      <a-timeline-item v-for="item in timelineData" :key="item.id" :color="item.state" @click="showDetail(item)">
        {{item.time}}
        <div class="timeline-item" :class="{'doing-item':item.state!=='gray','done-item':item.state==='gray'}">
          <div class="item-head">
            <div class="item-title" :class="{'done':item.state==='gray'}">{{item.title}}</div>
            <div class="item-deadline">Deadline : {{item.deadline}}</div>
          </div>
          <div class="item-content">{{item.content}}</div>
        </div>
      </a-timeline-item>
    </a-timeline>
  </div>
</template>

<script>
import { reactive } from '@vue/reactivity'
import { Modal } from 'ant-design-vue';

export default {
  name:'SendDynamic',
  components:{ },
  setup(){
    // 时间线数据
    const timelineData = reactive([
      {
        id:1,
        state:"blue",
        time:"2021-11-13",
        deadline:"2021-12-10",
        title:"Update Github template",
        content:"This is a specific description of the task.This is a specific description of the task."
      },{
        id:2,
        state:"blue",
        time:"2021-11-10",
        deadline:"2021-12-2",
        title:"Update Github template",
        content:"This is a specific description of the task."
      },{
        id:3,
        state:"green",
        time:"2021-11-8",
        deadline:"2021-11-23",
        title:"Build Template",
        content:`This is a specific description of the task.This is a specific description of the task.
                 This is a specific description of the task.`
      },{
        id:4,
        state:"gray",
        time:"2021-9-25",
        deadline:"2021-10-13",
        title:"Release New Version",
        content:`This is a specific description of the task.This is a specific description of the task.
                 This is a specific description of the task.`
      }
    ])
    // 详情展示
    const showDetail = (item)=>{
      Modal.info({
        title:item.title,
        content:item.content,
        width:500,
        centered:true,
      });
    }

    return {
      timelineData,showDetail
    }
  }
}
</script>

<style lang='less' scoped>
.timeline{
  min-height: 550px;
  padding: 24px;
  padding-left: 40px;
  .timeline-item{
    padding: 10px;
    padding-left: 20px;
    width: 700px;
    height: 100px;
    margin-top: 10px;
    margin-left: 5px;
    border: 1px solid @borderColor;
    box-shadow: 0.5px 0.5px 3px 2px rgba(241, 241, 241, 0.5);
    border-radius: 5px;
    .item-head{
      width: 640px;
      display: flex;
      justify-content: space-between;
      .item-title{
        line-height: 30px;
        font-weight: 500;
      }
      .done{
        color: rgb(121, 121, 121);
      }
      .item-deadline{
        line-height: 30px;
        font-size: 12px;
        color: rgb(163, 163, 163);
      }  
    }
    .item-content{
      margin-top: 5px;
      font-size: 13px;
      color: rgb(121, 121, 121);
      padding-right: 20px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
  .done-item{
    box-shadow:none;
  }
  .doing-item:hover{
    cursor: pointer;
    // border-color: rgba(41, 41, 41, 0.61);
    box-shadow:inset -0.5px -0.5px 3px 2px rgba(241, 241, 241, 0.5);
  }
}
</style>