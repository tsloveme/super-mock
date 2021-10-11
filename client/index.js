import Request from './request';
import './client.css';
const sockjs = require('./sockjs.min.js');
setTimeout(function () {
  // dom
  let = document.createElement("div");
  div.setAttribute("id", "app-tools");
  document.body.appendChild(div);
  // vue组件
  let vData = {
    pannelShow: true,
    current: '',
    enableMock:false
  };
  function getSystemsInfo(){
    axios.get('/devTools/api/env-system-info').then(ret=>{
      vData.current = ret.data.data.current;
      vData.enableMock = ret.data.data.enableMock;
    })
  }
  let instance = new Vue({
    el: "#appvue",
    template: `
      <div id="devTools" :style="{display: pannelShow ? 'block': 'none'}" @click="openDevWin">
        <table class="tb" border="0" width="100%">
          <tr>
            <th>env</th>
            <td>{{current}}</td>
          </tr>
          <tr>
            <th>mock</th>
            <td>{{enableMock? 'on' : 'off'}}</td>
          </tr>
        </table>
        <div id="devClose" @click.stop="pannelShow=false">x</div>
      </div>
      `,
    data: vData,
    created(){
      getSystemsInfo();
    },
    methods: {
      openDevWin
    },
  });
  let maxConnectTime = 100;
  let connectCount = 0;
  let isConnect = false
  function connectWebsocket(){
    let isHttps = location.protocol == 'https:';
    let port = isHttps ? __devVar.wssPort : __devVar.wsPort;
    let sockjs_url = '//'+ __devVar.host +':'+ port +'/env-ws';
    let sockjs = new SockJS(sockjs_url);
    sockjs.onopen = ()=>{
      console.log(`**** devTools wss connect open! ****`);
      isConnect = true;
      connectCount ++;
    }
    sockjs.onmessage = function(e) {
      console.log(`devTools message:`);
      console.log(e.data);
      let data = JSON.parse(e.data);
      if (data.envChange) {
        getSystemsInfo();
      }
    };
    sockjs.onclose = ()=>{
        // 小于重连次数
      if (connectCount < maxConnectTime) {
        setTimeout(function() {
          connectWebsocket();
        }, 10000);   
      }
    }
  }
  connectWebsocket();
  

  window.SHOWDEVTOOLS = function () {
    vData.pannelShow = true;
  };
  window.HIDEDEVTOOLS = function () {
    vData.pannelShow = false;
  };

  function openDevWin() {
    let maxHeight = document.documentElement.clientHeight;
    var winDom = document.getElementById("dev-win");
    if (!winDom) {
      winDom = document.createElement("div");
      winDom.setAttribute("id", "dev-win");
      winDom.innerHTML += `<div class="dev-header">
        <div class="header-close" id="dev-header-close" onclick="document.getElementById('dev-win').style.display = 'none'">&lt;</div>
          <strong>devTools</strong>
        </div>`;
      winDom.innerHTML += `<div id="dev-body">
        <iframe height="100%" width="100%" frameborder="0" src="/devTools/index.html"></frame>
      </div>`;
      document.body.appendChild(winDom);
    }
    winDom.style.height = maxHeight + "px";
    winDom.style.display = "block";
  }
}, 1000);
