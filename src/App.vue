<template>
 <div class="create_market" id="createMarket">
  <div class="market_module"> 
    <div class="node_wraper" data-type="start" data-name="开始">
      <div class="node node_start"></div>
      <span class="node_name">开始</span>
    </div>
    <div class="node_wraper" data-type="time" data-name="时间">
      <div class="node node_time"></div>
      <span class="node_name">时间</span>
    </div>  
    <div class="node_wraper" data-type="user" data-name="用户">
      <div class="node node_user"></div>
      <span class="node_name">用户</span>
    </div>
    <div class="node_wraper" data-type="waiting" data-name="等待">
      <div class="node node_waiting"></div>
      <span class="node_name">等待</span>
    </div>
    <div class="node_wraper" data-type="msg" data-name="消息">
      <div class="node node_msg"></div>
      <span class="node_name">消息</span>
    </div>
    <div class="node_wraper" data-type="switch" data-name="分支">
      <div class="node node_switch"></div>
      <span class="node_name">分支</span>
    </div>
    <div class="node_wraper" data-type="order" data-name="订单">
      <div class="node node_order"></div>
       <span class="node_name">订单</span>
    </div>
    <div class="node_wraper" data-type="end" data-name="结束">      
      <div class="node node_end"></div>
       <span class="node_name">结束</span>
    </div>
  </div>  

  <div class="market_main">
    <div class="market_assist"> 
      <div class="assist_left">

      </div>
      <div class="assist_right">      
        <div class="market_cancel" @click="MarketCancel"><i class="iconfont icon-cancel"></i> 取消返回</div>
        <div class="market_save" @click="MarketSave">保存发布</div>
      </div>  
    </div>    
    <svg xmlns="http://www.w3.org/2000/svg" id="rightSVG" width="100%"  height="100%">      
    </svg>
  </div>

  <node-editor :visiable="isEditor" :id="editorID" :nodedata="vnode"></node-editor>

 </div>
</template>

<script>
import ProcessSVG from './assets/js/ProcessSVG';
import NodeEditor from './components/NodeEditor';
let process=null;
export default {
  name:'ProcessControl',
  data () {
    return {  
      editorID:null,  
      isEditor:false,     
      vnode:null,
      vnodes:null,
      vlines:null
    }
  },
  mounted:function(){
    //流程框架初始化
    process=new ProcessSVG();
    process.init('createMarket');   
    process.$vue=this; 
    this.vnodes=process.NodeData.nodes; 
    this.vlines=process.NodeData.lines;
  },
  methods:{    
    editorConfirm:function(id){
      let name=this.vnode.name,
          node=document.querySelector(`#${id}`);
      node.setAttribute('data-name',name);
      node.querySelector('.node_name').innerHTML=name;
    },
    switchConfirm:function(node){
      process.createSwitch(node);
    },
    MarketCancel:function(){
      
    },
    MarketSave:function(){
      let me=this,noNode=true;
      for(let id in me.vnodes){
        if(me.vnodes[id].type!='start'&&me.vnodes[id].type!='end'&&me.vnodes[id].type!='switch'){
          noNode=false
        }
        if(/switch-(yes|no)/.test(me.vnodes[id].type)){
          return this.$message.error('分支节点没有关联子节点');
        }
      }
      if(noNode)return this.$message.error('至少添加一个有效节点');

      //打印节点数据
      console.log(this.vnodes)
      this.$alert(JSON.stringify(this.vnodes), '节点数据');  
    }
  },
  components:{
    NodeEditor
  }
}
</script>


<style>
  @import url('./assets/css/g.css');
  @import url('./assets/css/process.css');
  @import url('https://at.alicdn.com/t/font_766763_qsub8ca6im.css');
</style>
