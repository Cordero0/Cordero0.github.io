<template>
  <div class="activity">
    <div class="activity-item">
      <div v-for="item in activities" :key="item.id" class="item-content">
        <a-comment>
          <template #actions>
            <span key="comment-basic-like">
              <a-tooltip title="Like">
                <template v-if="item.action === 'liked'">
                  <LikeFilled @click="like(item.id)" />
                </template>
                <template v-else>
                  <LikeOutlined @click="like(item.id)" />
                </template>
              </a-tooltip>
              <span style="padding-left: 8px; cursor: auto">
                {{ item.likes }}
              </span>
            </span>
            <span key="comment-basic-dislike">
              <a-tooltip title="Dislike">
                <template v-if="item.action === 'disliked'">
                  <DislikeFilled @click="dislike(item.id)" />
                </template>
                <template v-else>
                  <DislikeOutlined @click="dislike(item.id)" />
                </template>
              </a-tooltip>
              <span style="padding-left: 8px; cursor: auto">
                {{ item.dislikes }}
              </span>
            </span>
            <span key="comment-basic-reply-to" @click="replyHandle(item.id)">Reply to</span>
          </template>
          <template #author><a>{{item.name}}</a></template>
          <template #avatar>
            <a-avatar
              :src="item.avatar"
              :alt="item.name"
            />
          </template>
          <template #content>
            <p>
              {{item.activityContent}}
            </p>
            <div class="pictures">
              <div class="picture" v-for="(picture,index) in item.pictures" :key="index">
                <a-image :src="picture"/>
              </div>
            </div>
          </template>
          <template #datetime>
            <a-tooltip :title="moment().format('YYYY-MM-DD HH:mm:ss')">
              <span>{{ moment().fromNow() }}</span>
            </a-tooltip>
          </template>
        </a-comment>
        <div class="comments">
          <Reply v-if="replyShow && item.id === activityId" @replyBack="getReply" @replyCancel="cancelReply"/>
          <div class="comment-container" v-for="comment in item.comments" :key="comment.id">
            <div class="comment first" style="margin-left:-6px" @mouseenter="enter(item.id,comment.id)" @mouseleave="leave">
              <a class="name">{{comment.name}}</a>
              <div style="fontSize:12px">&nbsp;:&nbsp;</div>
              <div class="comment-content">
                <span v-html="emoji(comment.content)"></span>
              </div>
              <div @click="followHandle(item.id,comment.id)" v-if="showFollowReply && comment.id===commentId && item.id===activityId" class="followReply">reply</div>  
            </div>
            <Reply 
              v-if="followReplyShow && followFlag.commentId === commentId && followFlag.activityId === activityId && comment.id === commentId && item.id===activityId" 
              @replyBack="getFollowReply" @replyCancel="cancelFollowReply"
              />
            <div class="comment" v-for="follow in comment.follows" :key="follow.id">
              <a class="name">{{follow.name}}</a>
              <div class="target">
                <CaretRightOutlined style="margin:2px 4px" /><a class="name">{{follow.target}}</a>
              </div>
              <div style="fontSize:12px">&nbsp;:&nbsp;</div>
              <div class="comment-content">
                <span v-html="emoji(follow.content)"></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
  </div>
</template>

<script>
import { CaretRightOutlined,LikeFilled, LikeOutlined, DislikeFilled, DislikeOutlined } from '@ant-design/icons-vue';
import Reply from '@/components/Reply'
import moment from 'moment'
import { useStore } from 'vuex'
import { computed, reactive,ref } from 'vue'
import { cloneDeep } from 'lodash-es'

export default {
  name:'Activity',
  components: { Reply,LikeFilled,LikeOutlined,DislikeFilled,DislikeOutlined,CaretRightOutlined },
  setup(){
    const store = useStore()
    const name = computed(()=> store.state.userMsg.msg.name)

    // 朋友圈的数据
    const activities = reactive([
      {
        id:1,
        name:'一只小葫芦',
        activityContent:"EDG牛逼！！！太帅了吧！！！！",
        avatar:"http://5b0988e595225.cdn.sohucs.com/images/20170831/fdbca554ad3c4df589a4311322b5bb3c.gif",
        pictures:["https://p1.itc.cn/q_70/images03/20211107/5d8626942d0a459f8767a7f5b80ea8d1.jpeg",
          "https://i03piccdn.sogoucdn.com/26155a8751017642"],
        likes: 12,
        dislikes: 0,
        action: '',
        comments:[
          {
            id:1,
            name:"kiki",
            content:"太棒啦！！",
            target:"aku",
            follows:[]
          }
        ]
      },{
        id:2,
        name:'aku',
        activityContent:"这个空调什么时候能修好啊！！真的会冷死人的！！！",
        avatar:"https://i01piccdn.sogoucdn.com/4c13a9240bffcd62",
        pictures:["https://nimg.ws.126.net/?url=http%3A%2F%2Fdingyue.ws.126.net%2F2021%2F1028%2Ffb99fd4bj00r1oeql000oc000dw00dwc.jpg&thumbnail=650x2147483647&quality=80&type=jpg"],
        likes: 12,
        dislikes: 0,
        action: '',
        comments:[
          {
            id:1,
            name:"Cordero",
            content:"加一，我还坐在窗边！哭了~",
            target:"aku",
            follows:[
              {
                id:1,
                name:"aku",
                content:"太惨了吧！！！抱抱~",
                target:"Cordero"
              },{
                id:2,
                name:"kiki",
                content:"经历过同样的痛苦！",
                target:"Cordero"
              }
            ]
          },
        ]
      },{
        id:3,
        name:'machile',
        activityContent:"I was praised today! So happy!!!! ",
        avatar:"https://img02.sogoucdn.com/app/a/100520093/ae588be27ee085c4-fd668f66a830d70e-bcb76412aab683a7d1f972c04a769065.jpg",
        pictures:[],
        likes: 12,
        dislikes: 0,
        action: '',
        comments:[]
      },{
        id:4,
        name:'kiki',
        activityContent:"Does anyone know what happened when the computer suddenly went black? I'm going crazy...",
        avatar:"https://img02.sogoucdn.com/app/a/100520093/8379901cc65ba509-45c21ceb904429fc-d7500b9f247a7ac06c65928ec07daad9.jpg",
        pictures:[],
        likes: 52,
        dislikes: 0,
        action: '',
        comments:[]
      },{
        id:5,
        name:'君君',
        activityContent:"茶百道奶茶yyds好吗？给我冲！！！！",
        avatar:"https://img02.sogoucdn.com/app/a/100520093/8379901cc65ba509-45c21ceb904429fc-3d76954af80d02665d56409b836b4f63.jpg",
        pictures:["https://p4.itc.cn/images01/20210906/68d72690f0244b10b4235b3db25d56fd.jpeg","http://qcloud.dpfile.com/pc/BIa8jzFXWaVOibhu_ZSWp7VGCAoUTeaKOL-evrLUR0WVBubuiLj4PQk2zA8dmd3quzFvxlbkWx5uwqY2qcjixFEuLYk00OmSS1IdNpm8K8twhW7bzr4O88Ivp4FuDG0SfCF2ubeXzk49OsGrXt_KYDCngOyCwZK-s3fqawWswzk.jpg"],
        likes: 117,
        dislikes: 0,
        action: '',
        comments:[]
      }
    ])
    // 点赞
    const like = (id) => {
      if(activities[id-1].action !== 'liked' && activities[id-1].action !== 'disliked'){
        activities[id-1].likes += 1
        activities[id-1].action = 'liked'
      }else if(activities[id-1].action !== 'disliked'){
        activities[id-1].likes -= 1
        activities[id-1].action = ''
      }
    }
    const dislike = (id) => {
      if(activities[id-1].action !== 'liked' && activities[id-1].action !== 'disliked'){
        activities[id-1].dislikes += 1
        activities[id-1].action = 'disliked'
      }else if(activities[id-1].action !== 'liked'){
        activities[id-1].dislikes -= 1
        activities[id-1].action = ''
      }
    }
    // 评论
    const replyShow = ref(false)
    const replyData = ref({})
    const activityId = ref(0)
    const replyHandle = (id)=>{
      activities.map(item=>{
        if(item.id===id){
          Object.assign(replyData.value,{
            id:item.comments?item.comments.length+1:1,
            name:name,
            content:"",
            target:item.name,
            follows:[]
          })
          activityId.value = id
        }
      })
      replyShow.value = true
    }
    const getReply = (data)=>{
      // console.log(data)
      replyShow.value = false
      replyData.value.content = data
      const obj = cloneDeep(replyData.value)
      activities[activityId.value-1].comments.push(obj)
    }
    const cancelReply = ()=>{
      replyShow.value = false
    }
    // 追评
    const commentId = ref(0)
    const followData = ref({})
    const showFollowReply = ref(false)
    const followReplyShow = ref(false)
    const followFlag = reactive({
      activityId:0,
      commentId:0
    })
    const enter = (aId,cId)=>{
      showFollowReply.value = true
      activityId.value = aId
      commentId.value = cId
    }
    const leave = ()=>{
      showFollowReply.value = false
    } 
    const followHandle = (aId,cId)=>{
      followFlag.activityId = aId
      followFlag.commentId = cId
      activityId.value = aId
      commentId.value = cId
      followReplyShow.value = true
      activities[activityId.value-1].comments.map(item=>{
        if(item.id===commentId.value){
          Object.assign(followData.value,{
            id:item.follows?item.follows.length+1:1,
            name:name,
            content:"",
            target:item.name
          })
        }
      })
    }
    const getFollowReply = (data)=>{
      followFlag.value = 0
      followReplyShow.value = false
      followData.value.content = data
      const obj = cloneDeep(followData.value)
      activities[activityId.value-1].comments[commentId.value-1].follows.push(obj)
      console.log(activities)
    }
    const cancelFollowReply = ()=>{
      followReplyShow.value = false
    }

    return { 
      activities,like,dislike,moment,replyShow,replyHandle,getReply,cancelReply,activityId,commentId,
      showFollowReply,followReplyShow,followFlag,enter,leave,followHandle,getFollowReply,cancelFollowReply
    };
  }
}
</script>

<style lang='less'>
  .activity{
    padding: 10px;
    .activity-item{
      border: 1px solid @borderColor;
      padding: 20px;
      .item-content{
        border-bottom: 1px solid @borderColor;
        padding-bottom: 10px;
      }
      .item-content:last-child{
        border-bottom: 0;
      }
      .pictures{
        margin: 10px 0;
        display: flex;
        .picture{
          max-width: 240px;
          overflow: hidden;
          text-align: center;
          margin-right: 8px;
          img{
            height: 180px;
          }
        }
      }
      .comments{
        margin-left: 40px;
        padding-bottom: 10px;
        // border-left: 1px solid @borderColor;
        // background-color: antiquewhite;
        .comment-container{
          // border-bottom: 1px solid @borderColor;
          display: flex;
          flex-direction: column;
          width: 600px;
          // padding: 3px 20px;
          padding: 0px 20px 0px 22px;
          .comment{
            line-height: 26px;
            // margin: 3px 0;
            // margin-right: 16px;
            display: flex;
            .target{
              color: rgb(88, 101, 126);
              font-size: 11px;
            }
            .name{
              color: rgb(59, 59, 59);
              font-weight: 500;
              font-size: 12px;
            }
            .name:hover{
              color: @pointFontColor;
            }
            .comment-content{
              font-size: 12px;
              // margin-top: 3px;
            }   
          }
          .first{
            position: relative;
            
            .followReply{
              position: absolute;
              right: 30px;
              line-height: 24px;
              font-size: 12px;
              color: rgb(160, 160, 160);
            }
            .followReply:hover{
              cursor: pointer;
              color: @pointFontColor;
            }
          }
          .first:hover{
            cursor: pointer;
            background-color: rgb(247, 247, 247);
          }

        }
        .comment:last-child{
          border-bottom:none;
        }
      }
    }
  }
</style>