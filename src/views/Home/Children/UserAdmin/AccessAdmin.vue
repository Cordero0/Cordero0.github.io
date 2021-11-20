<template>
  <div class="access-admin">
    <!-- 搜索功能和添加功能 -->
    <div class="other-action">
      <div class="search">
        <a-input v-model:value="nameSearch" style="width: 200px" :placeholder="t('accessAdmin.name')"></a-input>
        <a-input v-model:value="positionSearch" style="width: 200px" :placeholder="t('accessAdmin.position')"></a-input>
        <a-button type='primary' @click="searchHandle"><template #icon><SearchOutlined /></template>{{t('accessAdmin.search')}}</a-button>
      </div>
      <div class="add">
        <a-button type='primary' @click="addHandle"><template #icon><PlusOutlined /></template>{{t('accessAdmin.add')}}</a-button>
      </div>
    </div>
    <!-- 表格主体 -->
    <a-table :columns='columns' :data-source='dataSource' bordered :pagination="{pageSize:6}">
      <template v-for="col in ['name', 'position', 'email']" #[col]="{ text, record }" :key="col">
        <div>
          <a-input
            v-if="editableData[record.key]"
            v-model:value="editableData[record.key][col]"
            style="margin: -5px 0"
          />
          <a-input
            v-else-if="record.key == addData.key && addEdit"
            v-model:value="addData[col]"
            style="margin: -5px 0"
          />
          <template v-else>
            {{ text }}
          </template>
        </div>
      </template>
      <template #servers={record}>
        <template v-for="(server) in record.servers" :key="server">
          <a-tag :closable="editableData[record.key] != null" @close="handleClose(server,record.key)" color="geekblue">
            {{ server }}
          </a-tag>
        </template>
        <span v-if="addEdit && (addData.key == record.key || editableData[record.key])" class="add-server">
          <a-input
            v-if="inputVisible && (addData.key == record.key || editableData[record.key])"
            ref="inputRef"
            v-model:value="inputValue"
            type="text"
            size="small"
            :style="{ width: '78px' }"
            @blur="handleInputConfirm(record.key)"
            @keyup.enter="handleInputConfirm(record.key)"
          />
          <a-tag v-else style="background: #fff; border-style: dashed" @click="showInput">
            <plus-outlined />
            {{t('accessAdmin.actions.newTag')}}
          </a-tag>  
        </span>
      </template>
      <template #action={record}>
        <div v-if="addData.key == record.key && addEdit" class="add-action">
          <div class="edit-sure">
            <a @click="addSave">{{t('accessAdmin.actions.save')}}</a>
            <a-popconfirm title="Sure to cancel?" okText='YES' cancelText='NO' @confirm="addCancel">
              <a>{{t('accessAdmin.actions.cancel')}}</a>
            </a-popconfirm>
          </div>
        </div>
        <div v-else class="action">
          <a @click="deleteHandle(record.key)">{{t('accessAdmin.actions.delete')}}</a>
          <div class="edit">
            <div class="edit-sure" v-if="editableData[record.key]">
              <a @click="save(record.key)">{{t('accessAdmin.actions.save')}}</a>
              <a-popconfirm title="Sure to cancel?" okText='YES' cancelText='NO' @confirm="cancel(record.key)">
                <a>{{t('accessAdmin.actions.cancel')}}</a>
              </a-popconfirm>
            </div>
            <span v-else>
              <a @click="editHandle(record.key)">{{t('accessAdmin.actions.edit')}}</a>
            </span>  
          </div>
        </div>
      </template> 
    </a-table>
  </div>
</template>

<script>
import { cloneDeep } from 'lodash-es'
import { ref,reactive,toRefs,nextTick,onMounted, watch} from 'vue'
import { PlusOutlined,SearchOutlined } from '@ant-design/icons-vue'
import axios from '@/assets/js/axios.js'
import { message } from 'ant-design-vue'
import { useI18n } from 'vue-i18n'

// 表格配置项
const columns = [
  {
    title:'',
    dataIndex:'name',
    width:'15%',
    key:'name',
    slots:{customRender:'name'}  
  },{
    title:'',
    dataIndex:'position',
    width:'15%',
    key:'position',
    slots:{customRender:'position'}  
  },{
    title:'',
    dataIndex:'email',
    width:'25%',
    key:'email',
    slots:{customRender:'email'}  
  },{
    title:'',
    dataIndex:'servers',
    width:'30%',
    key:'servers',
    slots: {customRender:'servers'}
  },{
    title:'',
    dataIndex:'action',
    key:'action',
    slots:{customRender:'action'}
  }
]

export default {
  name:'AccessAdmin',
  components:{ PlusOutlined,SearchOutlined },
  setup(){
    const { t,locale } = useI18n()

    onMounted(()=>{
      axios.get('/members/msg').then( res=>{
        dataSource.value = res
        data = res
      })
      columns.map(item=>{
        item.title = t(`accessAdmin.${item.key}`)
      })
    })

    // 语言切换
    watch(locale,()=>{
      columns.map(item=>{
        item.title = t(`accessAdmin.${item.key}`)
      })
    })

    // 表格数据
    const dataSource = ref([])
    let data = [] //作为获得的表格数据的备份

    // 基础编辑功能
    const editableData = reactive({});
    const deleteHandle = (key)=>{
      console.log(dataSource)
      dataSource.value = dataSource.value.filter(res=> key!=res.key)
      console.log('delete'+key)
    }
    const editHandle = (key)=>{
      state.addEdit = true
      editableData[key] = cloneDeep(dataSource.value.filter(item => key === item.key)[0]);
    }
    const handleClose = (removedTag,key)=>{
      dataSource.value.map(item=>{
        if(item.key === key){
          const servers = item.servers.filter(server => server !== removedTag)
          item.servers = servers
        }
      })
    }
    const save = key => {
      state.addEdit = false
      Object.assign(dataSource.value.filter(item => key === item.key)[0], editableData[key]);
      delete editableData[key];
    };
    const cancel = key => {
      state.addEdit = false
      delete editableData[key];
    };

    // 搜索功能（直接对dataSource做筛选）
    const search = reactive({
      nameSearch:'',
      positionSearch:''
    })
    const searchHandle = ()=>{
      dataSource.value = data
      const reg1 = RegExp(`${search.nameSearch}`,'i')
      const reg2 = RegExp(`${search.positionSearch}`,'i')
      dataSource.value = dataSource.value.filter(res=>reg1.test(res.name)&&reg2.test(res.position)) 
    }

    // 添加表项
    let addData = ref({})
    const addHandle = ()=>{
      state.addEdit = true
      addData.value = {
        key:`${dataSource.value.length+1}`,
        name:'',
        position:'position',
        email:'',
        servers:[]  
      }
      dataSource.value = [addData.value,...dataSource.value]
    }
    const addSave = ()=>{
      axios.post('/members/add',addData.value).then(
        res=>{
          if(res.code === 200){
            message.success('Added successfully!')
          }else{
            message.error('Add failed!')
            dataSource.value.shift()
          }
        }
      ).catch(err=>{
        message.error(err)
        dataSource.value.shift()
      })
      state.addEdit = false
      addData.value = {}
    }
    const addCancel = ()=>{
      dataSource.value.shift()
      state.addEdit = false
      addData.value = {}
    }

    // 处理标签项的添加
    const inputRef = ref() //获取input标签，实现聚焦
    const state = reactive({
      inputVisible: false, //标签项输入框是否可见
      inputValue: '', //标签项输入的值
      addEdit:false //“添加标签项”是否可见
    })
    const showInput = () => {
      state.inputVisible = true;
      nextTick(() => {
        inputRef.value.focus();
      });
    }
    const handleInputConfirm = (key) => {
      const inputValue = state.inputValue;
      dataSource.value.map(item=>{
        if(item.key === key){
          let servers = item.servers
          if (inputValue && servers.indexOf(inputValue) === -1) {
            servers = [...servers, inputValue];
          }
          item.servers = servers
          editableData[key] ? editableData[key].servers = servers : 1
        }
      })
      Object.assign(state, {
        inputVisible: false,
        inputValue: '',
      });
    }

    return{
      t,columns,dataSource,editableData,...toRefs(search),addData,...toRefs(state),inputRef,
      deleteHandle,editHandle,save,cancel,searchHandle,
      addHandle,showInput,handleClose,handleInputConfirm,addSave,addCancel
    }
  }
}
</script>

<style lang="less">
  .access-admin{
    height: 600px;
    background-color: white;
    padding: 25px;
    .other-action{
      margin-bottom: 15px;
      display: flex;
      width: 100%;
      justify-content: space-between;
      .search{
        width: 520px;
        display: flex;
        justify-content: space-between;
      }
    }
    .action{
      display: flex;
      .edit{
        padding-left: 10px;
        margin-left: 10px;
        border-left: 1px solid @borderColor;
      }
    }
    // sure-cancle通用样式
    .edit-sure{
        width: 80px;
        display: flex;
        justify-content: space-between;  
      }
  }
</style>