<template>
  <div class="home">
    <div class="module">
      <label>{{$t('message.home_mock')}}:</label>
      <div class="cont">
        <el-switch v-model="enableMock" @change="toggleMock"></el-switch>
      </div>
    </div>
    <div class="module">
      <label>{{$t('message.home_proxy')}}:</label>
      <div class="cont">
        <a href="javascript:;" @click="goToProxy">{{$t('message.home_proxy_go')}}</a>
      </div>
    </div>
  </div>
</template>
<script>
import axios from 'axios';
// import api from '@/api/api';
export default {
  data(){
    return {
      current: '',
      enableMock:false,
      envList:['stg1', 'stg3'],
    }
  },
  created(){
    this.getSystemsInfo()
  },
  methods: {
    goToProxy(){
      // this.$router.push('/proxy');
      window.open(`${window.location.origin}${window.location.pathname}#/proxy`, '_blank');
    },
    getSystemsInfo(){
      // api.envSystemInfo()
      axios.get('/devTools/api/env-system-info')
      .then(ret=>{
        let returnData = ret.data.data;
        this.enableMock = returnData.enableMock;
      })
    },
    toggleMock(){
      axios.get('/devTools/api/env-toggle-mock')
      .then((ret)=>{
        this.enableMock = ret.data.data
      })
    },
    showMsg(str){
      this.$message({type: 'success', message: str, duration: 3000})
    }
  }
}
</script>
<style scoped>
 .home h3{text-align: center; font-size: 1.5rem;}
 .home .module{display: flex; padding: 1rem 0;border-bottom: 1px #e0e0e0 solid; }
 .home .module > label {flex: 1;}
 .home .module > .cont {flex: 3;}
 .home .module-page{border-bottom: 1px #e0e0e0 solid; padding: 1rem 0 1.5rem 0;}
</style>