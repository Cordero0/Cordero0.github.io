import { createStore } from 'vuex';
import VuexPersistence from 'vuex-persist';

const vuexLocal = new VuexPersistence({
  storage: Window.localStorage,
  // reducer(val) {
  //   return {
  //       user: val.navState
  //   }
  // }
})

export default createStore({
  state () {
    return {
      color:{
        headerColor:'rgb(80, 84, 100)',
        theme:'light',
        themeState:false,
        fontColor:'white'
      },
      navState:{
        selectedKeys:['1'],
        openKeys:['sub1']
      },
      userMsg:{
        account:{
          username:'Cordero',
          email:"2567587967@qq.com"
        },
        msg:{
          name:'Cordero',
          avatar:'https://i04piccdn.sogoucdn.com/aa4ed74234a6c8b3',
          position:'UI designer',
          phone:'15982952070',
          education:'JS in Computer Science from the University of Technology',
          bio:'Want to be a sunny doll !  Want to be happy every day ! ! ! '
        }
      },
      role:"admin",
      language:"en_US"
    }
  },
  mutations: {
    clear(state){
      state.color.headerColor='rgb(80, 84, 100)'
      state.color.theme='light'
      state.color.themeState=false
      state.color.fontColor='white'
      state.navState.selectedKeys[0]='1'
      state.navState.openKeys=[]
      state.role='admin'
      state.language='en_US'
    },
    changeTheme(state,value){
      Object.assign(state.color,value)
    },
    changeSelectedKeys(state,value){
      state.navState.selectedKeys = value
    },
    changeOpenKeys(state,value){
      state.navState.openKeys = value
    },
    changeMsg(state,value){
      Object.assign(state.userMsg.msg,value)
    },
    updateAccount(state,value){
      Object.assign(state.userMsg.account,value)
    },
    updateAvatar(state,value){
      state.userMsg.msg.avatar = value
    },
    changeRole(state,value){
      state.role = value
    },
    changeLanguage(state,value){
      state.language = value
    }
  },
  plugins: [vuexLocal.plugin]
});