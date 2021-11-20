<template>
  <div class="severs-control">
    <a-row :gutter='16'>
      <a-col :span='6' v-for="item of servers.serverData" :key="item.id" @click="showOut(item.id)">
        <div class="server">
          <div class="server-title"><div class="server-icon"><HddOutlined /></div><div class="server-name">{{item.name}}</div></div>
          <div class="server-content">
            <div><WifiOutlined v-if="item.onlineState" /><GlobalOutlined v-else /> {{t('serversControl.onlineState')}}：{{item.onlineState}}</div>
            <div><TeamOutlined /> {{t('serversControl.onlinePeople')}}：{{item.onlinePeopleNum}}</div>
            <div><AppstoreOutlined /> {{t('serversControl.gameModel')}}：{{item.gameModel}}</div>
          </div>
        </div>
      </a-col>
      <a-modal
        v-model:visible="visible"
        :title="t('serversControl.title')"
        :confirm-loading="confirmLoading"
        :ok-text="t('serversControl.sure')"
        :cancel-text="t('serversControl.cancel')"
        @ok="handleOk"
      >
        <p v-if="confirmLoading">{{ modalText }}</p>
        <div v-else class="control-container">
          <div class="machine-control">
            <div class="title">{{t('serversControl.machineControl')}}： </div>
            <div class="buttons">
              <a-button @click="startHandler" type='primary' >{{t('serversControl.start')}}</a-button>
              <a-button @click="endHandler" type='primary' danger>{{t('serversControl.close')}}</a-button>
              <a-button @click="restartHandler" style="backgroundColor:rgb(84, 230, 91);color:white">{{t('serversControl.restart')}}</a-button> 
              <a-button @click="updateHandler">{{t('serversControl.update')}}</a-button>
            </div>
          </div>
          <div class="title">
            <div>{{t('serversControl.changeAds')}}： </div>
            <a-upload
              action="https://www.fastmock.site/mock/219f2a4d01e826eeff1491024c86c2ba/servers-control/ads/files"
              v-model:file-list="fileList"
              name="file"
              :multiple="true"
              @change="handleChange"
            >
              <a-button>
                <upload-outlined></upload-outlined>
                {{t('serversControl.upload')}}
              </a-button>
            </a-upload>
          </div>
        </div>
      </a-modal>
    </a-row>
  </div>
</template>

<script>
import { reactive,toRefs,onMounted,watch } from 'vue'
import { UploadOutlined,TeamOutlined,WifiOutlined,HddOutlined,AppstoreOutlined,GlobalOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue'
import axios from '@/assets/js/axios'
import { useI18n } from 'vue-i18n'

export default {
  name:'ServerControl',
  components:{
    TeamOutlined,WifiOutlined,HddOutlined,AppstoreOutlined,GlobalOutlined,UploadOutlined
  },
  setup() {
    const { t,locale } = useI18n()

    onMounted(()=>{
      // 服务器数据
      getServeresDate()
      // 语言切换数据
      for(let key in prompts){
        prompts[key] = t(`serversControl.prompts.${key}`)
      }
    })
    
    // servers的数据
    let servers = reactive({
      serverData:[]
    })
    const getServeresDate = ()=>{
      axios.get("/servers").then((res) => {
        servers.serverData=res
      });
    }
    
    //语言切换 
    const prompts = reactive({
      alreadyStarted:'',
      alreadyClosed:'',
      didNotStart:'',
      retarting:'',
      updating:'',
      uploadedSuccessfully:'',
      fileUploadFailed:''
    })
    watch(locale,()=>{
      for(let key in prompts){
        prompts[key] = t(`serversControl.prompts.${key}`)
      }
    })

    // modal的数据方法
    const modal = reactive({
      id:1,
      visible:false,
      confirmLoading:false,
      fileList:[]
    })
    const handleOk = ()=>{
      modal.visible = false;
    }
    const showOut = (id)=>{
      modal.visible = true
      modal.id = id
    }
    const startHandler = ()=>{
      modal.visible = false
      if(servers.serverData[modal.id-1].onlineState == true){
        message.warning(prompts.alreadyStarted);
      }else{
        servers.serverData[modal.id-1].onlineState = true
      }
    }
    const endHandler = ()=>{
      modal.visible = false
      if(servers.serverData[modal.id-1].onlineState == false){
        message.warning(prompts.alreadyClosed);
      }else{
        servers.serverData[modal.id-1].onlineState = false
      }
    }
    const restartHandler = ()=>{
      modal.visible = false
      if(servers.serverData[modal.id-1].onlineState == false){
        message.error(prompts.didNotStart);
      }else{
        servers.serverData[modal.id-1].onlineState = false
        let hide = message.loading(prompts.retarting, 0)
        setTimeout(hide,1000)
        setTimeout(()=>{servers.serverData[modal.id-1].onlineState = true},1000)  
      }
    }
    const updateHandler = ()=>{
      modal.visible = false
      let hide = message.loading(prompts.updating, 0)
      getServeresDate()
      setTimeout(hide,1000)
    }
    const handleChange = (info)=>{
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === 'done') {
        message.success(`${info.file.name}${prompts.uploadedSuccessfully}`);
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name}${prompts.fileUploadFailed}`);
      }
    }

    return{
      t,servers,...toRefs(modal),
      showOut,handleOk,startHandler,endHandler,restartHandler,updateHandler,handleChange
    }  
  }
}
</script>

<style lang='less'>
  .severs-control{
    height: 600px;
    padding: 5px 30px;
    background-color: white;
    .server{
      height: 130px;
      background-color: rgb(80, 84, 100);
      border-radius: 8px;
      margin-top: 25px;
      display: flex;
      .server-title{
        width: 100px;
        color: white;
        text-align: center;
        margin: 27px 0px;
        border-right: 1px solid white;
        .server-icon{
          font-size: 50px;
          line-height: 50px;
          // background-color: aliceblue;
        }
        .server-name{
          line-height: 30px;
        }
      }
      
      .server-content{
        color: white;
        padding: 18px 20px;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
      }
    } 
    .server:hover{
      cursor: pointer;
    }
  }
  .control-container{
      padding-left: 20px;
      margin-top: -20px;
      margin-bottom: 20px;
      height: 150px;
      // background-color: rgb(233, 233, 233);
      display: flex;
      flex-direction: column;
      justify-content: space-evenly;
      .title{
        line-height: 30px;
      }
      .machine-control{
        .buttons{
          width: 300px;
          display: flex;
          justify-content: space-between;
        }
      }
  }
</style>