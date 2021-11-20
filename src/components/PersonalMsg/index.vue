<template>
  <div class="about-me">
    <div class="avatar-container">
      <div class="avatar-content">
        <a-avatar :size="66" :src="imageUrl"></a-avatar>
      </div>
      <div class="user-name">
        {{name}}
      </div>
      <div class="edit-profile">
        <a-button v-if="!edit" @click="editState" type="dashed" size="small" style="font-size:12px">{{t('profile.userMsg.edit')}}</a-button>
        <a-upload v-else 
          :showUploadList="false" @change="updateAvatar"
          :before-upload="beforeUpload"
          action="https://www.fastmock.site/mock/219f2a4d01e826eeff1491024c86c2ba/servers-control/avatar">
          <a-button type="dashed" size="small" style="font-size:12px">
            <loading-outlined v-if="loading"></loading-outlined>
            <plus-outlined v-else></plus-outlined>
            {{t('profile.userMsg.uploadAvatar')}}
          </a-button>
        </a-upload>
      </div>
    </div>
    <div v-if="edit" class="edit-content">
      <a-form layout="vertical" :model="editData">
        <a-form-item :label="t('profile.userMsg.name')">
          <a-input v-model:value="editData.name" placeholder="Name"></a-input>
        </a-form-item>
        <a-form-item style="margin-top:-14px" :label="t('profile.userMsg.position')">
          <a-input v-model:value="editData.position" placeholder="Position"></a-input>
        </a-form-item>
        <a-form-item style="margin-top:-14px" :label="t('profile.userMsg.phone')">
          <a-input v-model:value="editData.phone" placeholder="Phone Numbe"></a-input>
        </a-form-item>
        <a-form-item style="margin-top:-14px" :label="t('profile.userMsg.education')">
          <a-input v-model:value="editData.education" placeholder="Education"></a-input>
        </a-form-item>
        <a-form-item style="margin-top:-14px" :label="t('profile.userMsg.bio')">
          <a-textarea placeholder="Add a bio" :maxlength="100" allow-clear v-model:value="editData.bio" :auto-size="{ minRows: 3, maxRows: 5 }"/>
          <EmojiSelect class="emoji" @getEmoji="emojiHandle"/> 
        </a-form-item>
        <a-form-item class="error-infos" :wrapper-col="{ span: 14 }">
          <a-button type="primary" @click.prevent="saveHandle">{{t('profile.userMsg.save')}}</a-button>
          <a-button style="margin-left: 10px" @click="cancelHandle">{{t('profile.userMsg.cancel')}}</a-button>
        </a-form-item>
      </a-form>
    </div>
    <div v-else class="user-msg">
      <div class="msg-content inline">
        <div class="title"><CaretRightOutlined /> {{t('profile.userMsg.position')}} -</div>
        <div class="content">
          {{position}}
        </div>
      </div>
      <div class="msg-content inline">
        <div class="title"><CaretRightOutlined /> {{t('profile.userMsg.phone')}} -</div>
        <div class="content" style="color:black;fontWeight:400">
          {{phone}}
        </div>
      </div>
      <div class="msg-content">
        <div class="title"><CaretRightOutlined /> {{t('profile.userMsg.education')}} -</div>
        <div class="content">
          {{education}}
        </div>
      </div>
      <div class="msg-content">
        <div class="title"><CaretRightOutlined /> {{t('profile.userMsg.bio')}} -</div>
        <div class="content">
          <span v-html="emoji(bio)"></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { reactive,onMounted,watch,computed,toRefs,ref } from 'vue'
import { CaretRightOutlined,PlusOutlined,LoadingOutlined  } from '@ant-design/icons-vue';
import EmojiSelect from '@/components/Emoji'
import { message } from 'ant-design-vue'
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'
import { cloneDeep } from 'lodash-es'

// 头像上传的文件处理
function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

export default {
  name:'PersonalMsg',
  components:{ EmojiSelect,CaretRightOutlined,PlusOutlined,LoadingOutlined },
  setup(){
    // 语言切换
    const { t,locale } = useI18n()
    const prompts = reactive({
      uploadedSuccessfully:'',
      uploadFailed:'',
      fileType:'',
      fileSize:''
    })
    onMounted(()=>{
      for(let key in prompts){
        prompts[key] = t(`profile.userMsg.prompts.${key}`)
      }
    })
    watch(locale,()=>{
      for(let key in prompts){
        prompts[key] = t(`profile.userMsg.prompts.${key}`)
      }
    })

    // 用户信息
    const store = useStore()
    const data = computed(()=> store.state.userMsg.msg ) 

    // 资料编辑处理
    const edit = ref(false)
    const loading = ref(false)
    const imageUrl = ref(store.state.userMsg.msg.avatar)
    const editData = ref({
      name:'',
      position:'',
      phone:'',
      education:'',
      bio:'',
      avatar:''
    })
    const editState = ()=>{
      editData.value = cloneDeep(data.value)
      edit.value = true
    }
    const saveHandle = ()=>{
      editData.value.avatar = imageUrl.value
      store.commit('changeMsg',editData.value)
      edit.value = !edit.value
    }
    const cancelHandle = ()=>{
      edit.value = !edit.value
    }

    //emoji-selecter
    const emojiHandle = (data)=>{
      editData.value.bio += data
    }

    // 上传头像
    const updateAvatar = (info)=>{
      loading.value = true
      if (info.file.status === 'done') {
        getBase64(info.file.originFileObj, base64Url => {
          imageUrl.value = base64Url;
          store.commit('updateAvatar',imageUrl.value)
          loading.value = false
        });
        message.success(`${info.file.name}${prompts.uploadedSuccessfully}`);
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name}${prompts.uploadFailed}`);
      }
    }
    const beforeUpload = (file)=>{
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/gif';
      if (!isJpgOrPng) {
        message.error(prompts.fileType);
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        message.error(prompts.fileSize);
      }
      return isJpgOrPng && isLt2M;
    }

    return{
      t,...toRefs(data.value),edit,editData,imageUrl,loading,
      editState,saveHandle,cancelHandle,emojiHandle,updateAvatar,beforeUpload
    }
  }
}
</script>

<style scoped lang='less'>
.about-me{
  background-color: white;
  // height: 500px;
  border-radius: 5px;
  // box-shadow: 0 0 5px 3px rgba(247, 247, 247, 0.719);
  box-shadow: 0 0 5px 3px rgba(238, 238, 238, 0.719);
  border: 1px solid @borderColor;
  .avatar-container{
    height: 180px;
    border-bottom: 1px solid @borderColor;
    margin: 0 14px;
    .avatar-content{
      text-align: center;
      line-height: 120px;
    }
    .user-name{
      font-size: 18px;
      color: rgb(82, 82, 82);
      font-weight: 500;
      text-align: center;
      margin-top: -10px;
    }
    .edit-profile{
      text-align: center;
      margin-top: 6px;
    }
  }
  .user-msg{
    padding-top: 4px;
    padding-bottom: 16px;
    .msg-content{
      margin: 12px 10px;
      margin-left: 18px;
      .title{
        line-height: 32px;
        font-size: 15px;
        font-weight: 500;
        color: rgb(82, 82, 82);
      }
      .content{
        padding-right: 10px;
        padding-left: 10px;
      }
    }
    .inline{
      display: flex;
      margin-bottom: -2px;
      .content{
        line-height: 34px;
        color: @pointFontColor;
        font-weight: 500;
      }
    }
  }
  .edit-content{
    padding: 6px 20px;
    margin-top: 4px;
    position: relative;
    .emoji{
      position: absolute;
      bottom: 10px;
      left: 1px;
      font-size: 16px;
      // margin-top: 5px;
    }
  }
}
</style>