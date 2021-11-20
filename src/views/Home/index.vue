<template>
  <div class="home">
    <a-layout style="min-height: 100vh" >
      <a-layout-sider v-model:collapsed="collapsed" :theme="theme" collapsible>
        <div class="logo" />
        <a-menu v-model:selectedKeys="selectedKeys" v-model:openKeys="openKeys"
          :theme="theme" mode="inline" @click="menuChange" @openChange='openChange'
          >
          <a-menu-item key="1">
            <PartitionOutlined />
            <span>{{t(`tab.menuName.${menuName[0]}`)}}</span>
          </a-menu-item>
          <a-sub-menu key="sub1">
            <template #title>
              <span>
                <user-outlined />
                <span>{{t(`tab.menuName.UserAdmin`)}}</span>
              </span>
            </template>
            <a-menu-item key="2" v-if="editorRole=='admin'">{{t(`tab.menuName.${menuName[1]}`)}}</a-menu-item>
            <a-menu-item key="3">{{t(`tab.menuName.${menuName[2]}`)}}</a-menu-item>
          </a-sub-menu>
          <a-menu-item key="4">
            <LineChartOutlined />
            <span>{{t(`tab.menuName.${menuName[3]}`)}}</span>
          </a-menu-item>
          <a-menu-item key="5">
            <FormOutlined />
            <span>{{t(`tab.menuName.${menuName[4]}`)}}</span>
          </a-menu-item>
        </a-menu>
      </a-layout-sider>
      <a-layout>
        <a-layout-header style="padding: 0;height:56px;z-index:999">
          <div class="header">
            <!-- <div class="home-page"><a>home</a></div> -->
            <a-breadcrumb class="breadcrumb">
              <a-breadcrumb-item><a @click="breadcrumbRoute" class="breadcrumb-item a">{{t(`tab.menuName.Home`)}}</a></a-breadcrumb-item>
              <a-breadcrumb-item v-if="breadcrumb.a" class="breadcrumb-item" :class="{'breadcrumb-item-active':!breadcrumb.b}">{{t(`tab.menuName.${breadcrumb.a}`)}}</a-breadcrumb-item>
              <a-breadcrumb-item v-if="breadcrumb.b" class="breadcrumb-item" :class="{'breadcrumb-item-active':!!breadcrumb.b}">{{t(`tab.menuName.${breadcrumb.b}`)}}</a-breadcrumb-item>
            </a-breadcrumb>
            <div class="header-right ">
              <div class="header-function">
                <Setting class="function-item"/>| 
                <div class="function-item" @click="toProfile">{{name}}</div>
              </div>
              <a-dropdown>
                 <a-avatar class="avatar" @click.prevent :src="avatar" :size="32" shape="square"></a-avatar>
                <template #overlay>
                  <a-menu style="margin-left:-41px;margin-top:4px">
                    <a-menu-item @click="toProfile">
                      <a>{{t(`tab.menuName.Profile.select.profile`)}}</a>
                    </a-menu-item>
                    <a-menu-item>
                      <a href="https://github.com/Cordero0" target="_blank">GitHub</a>
                    </a-menu-item>
                    <a-menu-divider />
                    <a-menu-item @click="toLogOut">
                      <a>{{t(`tab.menuName.Profile.select.logOut`)}}</a>
                    </a-menu-item>
                  </a-menu>
                </template>
              </a-dropdown>
            </div>
          </div>
        </a-layout-header>
        <a-layout-content style="margin: 0 16px">
          <div class="main-container">
            <router-view></router-view>
          </div>
        </a-layout-content>
      </a-layout>
    </a-layout>
  </div>
</template>

<script>
import { PartitionOutlined,UserOutlined,LineChartOutlined,FormOutlined } from '@ant-design/icons-vue';
import { ref,reactive,toRefs,computed,onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { changeStyle } from '@/theme/factory'
import Setting from  '@/components/Setting'
import { useI18n } from 'vue-i18n'

export default {
  name: 'Home',
  components: {
    PartitionOutlined,UserOutlined,LineChartOutlined,FormOutlined,Setting
  },
  setup() {
    const store = useStore()
    const router = useRouter() 
    const { t,locale } = useI18n()

    onMounted(()=>{
      changeStyle(store.state.color)
      let num = parseInt(store.state.navState.selectedKeys[0])
      num ? breadcrumb.a = menuName[num-1]:breadcrumb.a = 'Profile.title'
    })

    // 主题控制
    const theme = computed(()=>(store.state.color.theme))

    // 侧边菜单操作
    const selectedKeys = ref(store.state.navState.selectedKeys)
    const openKeys = ref(store.state.navState.openKeys)
    const menuName = reactive([
      'ServersControl','AccessAdmin','Test','Charts','CreateArticle'
    ])
    let breadcrumb = reactive({
      a:'ServersControl',
      b:''
    })
    const formLoyar = reactive({
      selectedKeys:['1'],
      collapsed:false
    })
    const menuChange = (e)=>{
      const {key} = e
      let obj = []
      obj[0] = key
      store.commit('changeSelectedKeys',obj)
      switch(key){
        case '1':
          breadcrumb.a = menuName[0]
          breadcrumb.b = ''
          router.push('/home/serversControl')
          break
        case '2':
          breadcrumb.a = menuName[1]
          breadcrumb.b = ''
          router.push('/home/userAdmin/accessAdmin')
          break
        case '3':
          breadcrumb.a = menuName[2]
          breadcrumb.b = ''
          router.push('/home/userAdmin/test')
          break
        case '4':
          breadcrumb.a = menuName[3]
          breadcrumb.b = ''
          router.push('/home/charts')
          break
        case '5':
          breadcrumb.a = menuName[4]
          breadcrumb.b = ''
          router.push('/home/createArticle')
          break
      }
    }

    // 用户头像及下拉菜单
    const avatar = computed(()=> store.state.userMsg.msg.avatar )
    const name = computed(()=> store.state.userMsg.msg.name )
    const toProfile = ()=>{
      breadcrumb.a = 'Profile.title'
      breadcrumb.b = ''
      selectedKeys.value = []
      router.push('/home/Profile')
      let obj = []
      store.commit('changeSelectedKeys',obj)
    }
    const toLogOut = ()=>{
      store.commit('clear')
      locale.value = 'en_US'
      router.push('/')
    }
    const openChange = (keys)=>{
      store.commit('changeOpenKeys',keys)
    }

    // 面包屑路由
    const breadcrumbRoute = ()=>{
      selectedKeys.value[0]='1'
      router.push('/home/serversControl')
      breadcrumb.a='ServersControl'
      let obj = ['1']
      store.commit('changeSelectedKeys',obj)
    }
    
    // "权限测试"控制项
    const editorRole = computed(()=>store.state.role)

    return{
      ...toRefs(formLoyar),menuChange,breadcrumb,theme,selectedKeys,openKeys,menuName,avatar,name,
      openChange,breadcrumbRoute,toProfile,toLogOut,editorRole,t
    }
  }
}
</script>
<style lang="less">
  .home{
    .logo{
      height: 32px;
      margin: 16px;
      background: rgba(163, 163, 163, 0.3);
    }
    .main-container{
      min-height: 600px;
      min-width: 1250px;
      padding-top: 15px;
      // padding: 0 -15px;
    }
    .header{
      box-shadow: 2px 1px 3px 1px rgba(233, 233, 233, 0.815);
      height: 56px;
      background-color: @headerColor;
      line-height: 64px;
      display: flex;
      justify-content: space-between;
      padding: 5px 24px;
      .breadcrumb{
        line-height: 24px;
        margin: 10px 10px;
        .breadcrumb-item{
          font-size: 14px;
          color: @fontColor;
          opacity: 0.75;
        }
        .a:hover{
          color: @pointFontColor;
        }
        .breadcrumb-item-active{
          font-size: 15px;
          opacity: 1;
        }
      }
      .header-right{
        display: flex;
        .header-function{
          margin-right: 5px;
          display: flex;
          color: @fontColor;
          line-height: 45px;
          font-weight: 100;
          font-size: 14px;
          // width: 145px;
          // justify-content: space-between;
          .function-item{
            min-width: 30px;
            line-height: 46px;
            font-size: 15px;
            font-weight: 400;
            margin: 0 9px;
          }
          .function-item:hover{
            cursor: pointer;
            color: @pointFontColor;
          }
        }
        .avatar{
          margin-right: 20px;
          margin-top: 8px;
        }
        .avatar:hover{
          cursor: pointer;
        }
      }
    }
  }
</style>
