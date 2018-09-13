<template>
<div class="dialog_wraper">
    <div class="dialog">
        <div class="dialog_head">
            名称：
            <el-input
              size="mini"
              placeholder="请输入内容"   
              v-model="nodedata.name">             
            </el-input>
            <i class="iconfont icon-delete" @click="cancel"></i>
        </div>
        <div class="dialog_content">
            <div class="msg">
                <el-form label-width="100px">
                    <el-form-item label="消息类型">                           
                        <el-radio v-model="nodedata.query.extra.msgType" label="type1">小程序</el-radio>  
                        <el-radio v-model="nodedata.query.extra.msgType" label="type2">短信</el-radio> 
                        <el-radio v-model="nodedata.query.extra.msgType" label="type0">服务号</el-radio>
                    </el-form-item>
                    <el-form-item label="触达消息">
                        <el-select v-model="nodedata.query.extra.type1" 
                        placeholder="请选择" size="mini" v-if="nodedata.query.extra.msgType=='type1'">
                            <el-option
                            v-for="msg in msgList.type1"
                            :key="msg.id"
                            :label="msg.title"
                            :value="msg.id">
                            </el-option>
                        </el-select> 
                        <el-select v-model="nodedata.query.extra.type2" 
                            placeholder="请选择" size="mini" v-if="nodedata.query.extra.msgType=='type2'">
                            <el-option
                            v-for="msg in msgList.type2"
                            :key="msg.id"
                            :label="msg.title"
                            :value="msg.id">
                            </el-option>
                        </el-select> 
                        <el-select v-model="nodedata.query.extra.type0" 
                            placeholder="请选择" size="mini" v-if="nodedata.query.extra.msgType=='type0'">
                            <el-option
                            v-for="msg in msgList.type0"
                            :key="msg.id"
                            :label="msg.title"
                            :value="msg.id">
                            </el-option>
                        </el-select> 
                    </el-form-item> 
                </el-form>                    
            </div> 
        </div>
        <div class="dialog_foot">           
            <el-button type="info" size="mini" @click="cancel">取消</el-button>
            <el-button type="success" size="mini" @click="confirm">确认</el-button>
        </div>
    </div>
</div>
</template>

<script>
import {msgtype0,msgtype1,msgtype2} from '@/assets/data/msglist';
export default {  
    props:['id','nodedata'], 
    data () {
        return {    
            msgList:{
                "type0":[],
                "type1":[],
                "type2":[]
            }
        }
    },   
    beforeMount:function(){      
        //模板消息列表
        this.msgList.type0=msgtype0;
        this.msgList.type1=msgtype1;
        this.msgList.type2=msgtype2;
    },
    methods:{      
        cancel:function(){         
            this.$parent.editorType=null
        },
        confirm:function(){
            let me=this,
                id=me.id,
                node=me.nodedata,
                type=node.type,              
                parent=me.$parent,
                parentData=me.$parent.vnodes[id];
           
            if(!node.name.trim()) return me.$message.error('节点名称不能为空');            
       
            let msgType=node.query.extra.msgType;
            if(msgType=='type1'&&!node.query.extra.type1) 
                return me.$message.error('请选择小程序触达消息'); 
            if(msgType=='type2'&&!node.query.extra.type2) 
                return me.$message.error('请选择短信触达消息'); 
            if(msgType=='type0'&&!node.query.extra.type0) 
                return me.$message.error('请选择服务号触达消息'); 

            me.msgList[msgType].forEach(tmp => {
                if(node.query.extra[msgType]==tmp.id){
                    return node.query.noticeType=tmp.noticeType,
                        node.query.templateId=tmp.id,
                        node.query.title=tmp.title;
                }
            });

            parentData.query=JSON.parse(JSON.stringify(node.query));            
            parentData.name=node.name;          
            parent.editorType=null;
            parent.updateNodeName(id);
        }
    }
}
</script>

<style>
  @import url('../assets/css/nodeeditor.css');
</style>
