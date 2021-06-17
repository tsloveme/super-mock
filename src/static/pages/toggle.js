setTimeout(function () {
    // dom
    let div = document.createElement("div");
    div.setAttribute("id", "appvue");
    document.body.appendChild(div);
    // 样式
    var sty = document.createElement("style");
    sty.innerHTML = `
      #devTools{background-color: rgba(0,0,0, 0.15); color: #fff;position: fixed; right: 2rem; bottom:12rem; border-radius: 0.35rem; font-size: 1rem; white-space: nowrap; z-index: 999999}
      #devTools .tb{width: 100%; border-collapse: collapse; border-spacing: 1px 1px;}
      #devTools .tb th{border: 1px #fff solid; line-height: 1.2; padding: 0 2px; text-align: right}
      #devTools .tb td{border: 1px #fff solid; line-height: 1.2; padding: 0 2px}
      #devClose{position: absolute; right: -1rem; top:-1rem; width:1.2rem; height:1.2rem; border-radius:1.2rem; line-height: 1.2rem; background-color:rgba(255,0,0, 0.3); text-align:center;}
      #dev-win{width: 100%; height: 100%; background-color: white; z-index: 9999999; position: fixed; left:0; top:0}
      #dev-win .dev-header{text-align: center; height:4.4rem; line-height: 4.4rem; background-color: #ccc;  color: #222; position: relative}
      #dev-win .dev-header strong{font-size: 2rem}
      #dev-win .header-close{font-size: 2rem; line-height: 2.4rem; position:absolute; left:0.5rem; top:50%; margin-top:-1.2rem; display: inline-block; padding: 0 1rem; cursor: pointer}
      #dev-body{height: calc(100% - 4.4rem)}
      `;
    document.body.appendChild(sty);
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
  