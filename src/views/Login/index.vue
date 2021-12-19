<template>
  <div class="login"> 
    <a-row class="input" align='middle'>
      <a-col :offset='8' class="inputs-container">
        <div class="login-form-container clear-fix">
          <div class="title">{{t('login.title')}}<LangSelect class="lang" /></div>
          <a-form class="login-form" layout="horizontal" :model="userAccount" :label-col='{span:4,offset:2}' :wrapper-col='{span:15}'>
            <a-form-item :label="t('login.username')" style="fontSize:16px">
              <a-input style="height:36px" v-model:value="userAccount.username" placeholder="input username" />
            </a-form-item>
            <a-form-item :label="t('login.password')">
              <a-input-password style="height:36px" v-model:value="userAccount.password" placeholder="input password" />
            </a-form-item> 
            <a-form-item :wrapper-col='{span:19,offset:6}'>
              <a-button @click="signIn" type="primary">{{t('login.signIn')}}</a-button>
              <a-button @click="signUp" style="marginLeft:17px;marginTop:10px">{{t('login.signUp')}}</a-button>
            </a-form-item>
          </a-form>
        </div>
      </a-col>
    </a-row>
      
  </div>
</template>

<script>
import {reactive,onBeforeMount} from 'vue'
import LangSelect from '@/i18n/LangSelect.vue'
import {useRouter} from 'vue-router'
import {message} from 'ant-design-vue'
import axios from '@/assets/js/axios'
import { useI18n } from 'vue-i18n'

export default {
  name:'Login',
  components:{ LangSelect },
  setup() {
    const { t } = useI18n()
    const router = useRouter()

    // 用户账号密码
    const userAccount =  reactive({
      username:'卡德罗',
      password:'123456'
    })
    const allAccounts = reactive({
      accounts:[]
    })
    const getAccounts = ()=>{
      axios.get('/users/account').then(res=>{
        allAccounts.accounts = res
      })
    }
    onBeforeMount(() => {
       getAccounts()
    })
    // 验证登录
    const verifi = ()=>{
      let flag = 0
      let res = 0
      allAccounts.accounts.map(item=>{
        if(item.username == userAccount.username){
          flag = 1
          if(item.password == userAccount.password){
            res = 1
          }else{
            message.warning('wrong password!')
          }
        } 
      }) 
      if(res){
        return true
      }
      if(!flag){
        message.warning('User does not exist!')
      }
    }
    // 登录注册操作
    const signIn = ()=>{
      let flag = verifi()
      if(flag){
        router.push('/home/serversControl')
      }
    }
    const signUp = ()=>{
      console.log('go to sign up')
    }
    

    return{
      t,userAccount,signIn,signUp
    }
  }
}
</script>

<style lang="less">
  .login{
    height: 750px;
    background: url('../../assets/img/login.jpg');
    background-size: auto 750px;
    // padding-top: 120px;
    .input{
      height: 750px;
      min-width: 500px;
    }
    .inputs-container{
      width: 500px;
    }
    .login-form-container{
      height: 320px;
      width: 540px;
      background-color: rgba(173, 186, 214, 0.8);
      border-radius: 10px; 
      box-shadow: 1px 1px 4px 1px rgba(0,0,0,0.1);
      .title{
        position: relative;
        text-align: center;
        font-size: 23px;
        line-height: 110px;
        .lang{
          font-size: 18px;
          position: absolute;
          right: 68px;
          top:47px;
        }
      }
      // .login-form{
      //   margin-top: 20px;
      // }
    }
  }
</style>