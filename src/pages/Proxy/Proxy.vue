
<template>
  <div class="proxy">
    <h1>动态代理</h1>
    <div class="proxy-module" v-for="(item, index) in proxyList" :key="index">
      <el-form :ref="'form'+index" :model="item" label-width="80px">
        <el-form-item label="代理路径">
          <el-input v-model="item.proxyPath" :disabled="!item.canEdit"></el-input>
        </el-form-item>
        <el-form-item label="启用状态">
          <el-switch v-model="item.active" :disabled="!item.canEdit"></el-switch>
        </el-form-item>
        <el-form-item label="代理配置">
          <el-input type="textarea" autosize v-model="item.proxyConfig" :disabled="!item.canEdit"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="tryProxy(item, index)">尝试</el-button>
          <el-button v-if="!item.canEdit && item.id" type="primary" @click="enableEdit(item, index)">修改</el-button>
          <template v-else>
            <el-button v-if="item.id" type="primary" @click="doModify(item, index)">提交修改</el-button>
            <el-button v-else type="primary" @click="doAddProxy(item, index)">确认新增</el-button>
            <el-button @click="onCancel(item,index)">取消</el-button>
          </template>
        </el-form-item>
      </el-form>
    </div>
    <div style="text-align: center;">
      <el-button @click="addProxy" type="primary" icon="el-icon-plus">新增动态代理</el-button>
    </div>
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="80%">
      <div>
        <p>{{result.origin}}</p>
        <p>代理到了</p>
        <p>{{result.remote}}</p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data(){
    return {
      backup:[],
      proxyList: [],
      dialogVisible: false,
      result:{
        origin: '',
        remote: '',
      }
    }
  },
  created: function(){
    axios.get('/devTools/api/env-proxy-list')
      .then(ret=>{
        data.proxyList = ret.data.data;
        data.proxyList.forEach(item=>{
          item.proxyConfig  = JSON.stringify(item.proxyConfig, null, 2);
          item.canEdit = false;
        });
        this.bakupData();
      })
  },
  methods: {
    doModify(item, index){
      this.checkConfig(item)
      .then(()=>{
        let reqData = JSON.parse(JSON.stringify(item));
        reqData.proxyConfig = JSON.parse(reqData.proxyConfig);
        return axios.post('/devTools/api/env-proxy-modify', reqData);
      })
      .then(ret=>{
        if (ret.data.code == '0000') {
          showMsg(ret.data.message);
          this.$set(this.proxyList, index, {...item, canEdit: false});
          this.bakupData();
        } else {
          showMsg(ret.data.message, 'error');
        }
      })
    },
    checkConfig(item){
      try {
        JSON.parse(item.proxyConfig);
        return Promise.resolve();
      } catch(e) {
        showMsg('配置为正规的JSON格式，请先校验正确性！', 'error', 2000);
        return Promise.reject();
      }
    },
    onCancel(item, index){
      let backItem = JSON.parse(JSON.stringify(this.backup[index]));
      this.$set(this.proxyList, index, backItem);
    },
    enableEdit(item, index){
      this.$set(this.proxyList, index, {...item, canEdit: true});
    },
    // 尝试动态代理
    tryProxy(item, index){
      this.checkConfig(item)
      .then(()=>{
        let reqData = JSON.parse(JSON.stringify(item));
        reqData.proxyConfig = JSON.parse(reqData.proxyConfig);
        return axios.post(`${reqData.proxyPath.replace(/\/$/,'')}?__tryProxy=1`, reqData);
      })
      .then(ret=>{
        if (ret.data.code == '0000') {
          this.result.origin = `${window.location.origin}${item.proxyPath}`;
          this.result.remote = `${JSON.parse(item.proxyConfig).target || window.__envVar.remoteServiceIp}${ret.data.path}`;
          this.dialogVisible = true;
        } else {
          showMsg(ret.data.message, 'error');
        }
      })
    },
    // 新增动态代理
    addProxy(){
      this.proxyList.push({
        proxyPath: '/api/aaaa/bbbb/',
        proxyConfig: JSON.stringify({
          target: "http://10.118.120.224:8080",
          headers: {user_id: '45545422'},
          pathRewrite: {
            "^/": "/"
          }
        }, null, 2),
        canEdit: true,
        active: true
      })
    },
    doAddProxy(item, index){
      this.checkConfig(item)
      .then(()=>{
        let reqData = JSON.parse(JSON.stringify(item));
        reqData.proxyConfig = JSON.parse(reqData.proxyConfig);
        return axios.post('/devTools/api/env-proxy-add', reqData);
      })
      .then(ret=>{
        if (ret.data.code == '0000') {
          showMsg(ret.data.message);
          this.$set(this.proxyList, index, {...item, canEdit: false, id: ret.data.data.id});
          this.bakupData();
        } else {
          showMsg(ret.data.message, 'error');
        }
      })
    },
    //备 份用于重置
    bakupData(){
      data.backup = JSON.parse(JSON.stringify(data.proxyList));
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
 .proxy-module{border: 1px #e0e0e0 solid; margin: 1rem; padding: 1rem;}
</style>