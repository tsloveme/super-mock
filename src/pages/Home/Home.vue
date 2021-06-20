<template>
  <div class="home">
    <div class="module">
      <label>当前环境1</label>
      <div class="cont">
        <el-select v-model="formEnv" @change="envChange">
          <el-option v-for="(item ,key) in envList" :key="key" :value="item">{{item}}</el-option>
        </el-select>
      </div>
    </div>
    <div class="module">
      <label>mock数据:</label>
      <div class="cont">
        <el-switch v-model="enableMock" @change="toggleMock"></el-switch>
      </div>
    </div>
    <div class="module">
      <label>动态代理:</label>
      <div class="cont">
        <a target="_blank" href="javascript:;" @click="goToProxy">查看配置</a>
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
      formEnv: '',
      envList:['stg1', 'stg3'],
    }
  },
  created(){
    this.getSystemsInfo()
  },
  methods: {
    goToProxy(){
      this.$router.push('/proxy');
    },
    getSystemsInfo(){
      // api.envSystemInfo()
      axios.get('/devTools/api/env-system-info')
      .then(ret=>{
        let returnData = ret.data.data;
        this.enableMock = returnData.enableMock;
      })
    },
    envChange(val){
      axios.get('/devTools/api/env-change-env',{params:{current: this.formEnv}})
      .then(ret=>{
        this.current = this.formEnv;
        this.showMsg('处理成功！')
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