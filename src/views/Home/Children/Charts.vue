<template>
  <div class="charts">
    <div class="title">{{t('charts.title')}}</div>
    <div class="main-content">
      <div id="chartsTest"></div>
      <div class="text">
        <div class="part">
          <div class="aside-title">Title:</div>
          <div class="aside-content">Apache ECharts supports several download methods, which are further explained in the next tutorial Installation. Here, we take the example of getting it from the jsDelivr CDN and explain how to install it quickly.</div>
        </div>
        <div class="part">
          <div class="aside-title">Title:</div>
          <div class="aside-content">Apache ECharts supports several download methods, which are further explained in the next tutorial Installation. Here, we take the example of getting it from the jsDelivr CDN and explain how to install it quickly.</div>
        </div>
      </div>
    </div>
  </div>
  
</template>

<script>
import * as echarts from 'echarts'
import { onMounted,watch } from 'vue'
import axios from '@/assets/js/axios.js'
import { useI18n } from 'vue-i18n'

// echarts配置项
const chartData = {
  legend:{
    data:[
    {
      name:'Yesterday\'s highest quantity',
      icon:'rect'
    },{
      name:'Current usage quantity',
      icon:'rect'
    }]
  },
  xAxis: {
    name:'servers',
    data: ['server1', 'server1', 'server3', 'server4', 'server5', 'server6']
  },
  yAxis: {
    name:'number'
  },
  series: [
    {
      name:'Yesterday\'s highest quantity',
      data: [120,222,425,336,321,125],
      type: 'line',
      label: {
        show: true
      }
    },
    {
      name:'Current usage quantity',
      data: [],
      type: 'line',
      label: {
        show: true
      }
    }
  ]
}
export default{
  name:'Charts',
  setup() {
    const { t,locale } = useI18n()

    onMounted(()=>{
      initCharts()
    })

    // 应用配置
    const initCharts = ()=>{
      const myChart = echarts.init(document.getElementById("chartsTest"))
      chartData.series[0].name = t('charts.chart.name1')
      chartData.legend.data[0].name = t('charts.chart.name1')
      chartData.series[1].name = t('charts.chart.name2')
      chartData.legend.data[1].name = t('charts.chart.name2')
      axios.get('/servers').then(res=>{
        chartData.series[1].data = res.map(item=>{
          return item.onlinePeopleNum
        })
        myChart.setOption(chartData)
      })
    }

    // 语言切换
    watch(locale,()=>{
      initCharts()
    })
     
    return{ t }
  }
}
</script>

<style lang='less'>
  .charts{
    padding: 10px 20px 40px 20px;
    height: 650px;
    background-color: white;
    .title{
      text-align: center;
      width: 900px;
      font-size: 21px;
      line-height: 64px;
    }
    .main-content{
      display: flex;
      width: 100%;
      justify-content: space-evenly;
      #chartsTest{
        width: 860px;
        height: 500px;
        background-color: @chartColor;
        padding-top: 15px;
      }
      .text{
        box-sizing: border-box;
        height: 500px;
        width: 320px;
        border: 2px solid @borderColor;
        padding: 15px;
        padding-left: 22px;
        .part{
          margin-bottom: 20px;
          .aside-title{
            line-height: 32px;
            font-size: 18px;
          }
          .aside-content{
            line-height: 28px;
          }  
        }
        
      }    
    }
    
  }
  
</style>