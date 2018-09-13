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
            <div class="waiting">
                <el-radio v-model="nodedata.query.extra.timeType" label="absolute">绝对时间</el-radio>
                <el-radio v-model="nodedata.query.extra.timeType" label="relative">相对时间</el-radio>
                <div class="waiting_absolute_input" v-if="nodedata.query.extra.timeType=='absolute'">
                    等待至：
                    <el-date-picker
                        size="mini" 
                        v-model="nodedata.query.absoluteTime"
                        type="datetime"                          
                        :picker-options="pickerOptions"
                        placeholder="选择日期时间">
                    </el-date-picker>
                </div> 
                <div class="waiting_relative_input" v-if="nodedata.query.extra.timeType=='relative'">
                    <el-radio v-model="nodedata.query.extra.relativeType" label="day"> 
                        <el-input type="number" 
                        :disabled="nodedata.query.extra.relativeType!='day'" size="mini"  class="size-mini"
                        v-model="nodedata.query.extra.days" placeholder="天数"></el-input> 天后    
                    </el-radio>                            
                    <el-radio v-model="nodedata.query.extra.relativeType" label="hour">
                        <el-input type="number" 
                        :disabled="nodedata.query.extra.relativeType!='hour'" size="mini" class="size-mini"
                        v-model="nodedata.query.extra.hours" placeholder="小时"></el-input> 小时后 
                    </el-radio>
                    <el-radio v-model="nodedata.query.extra.relativeType" label="minute">
                        <el-input type="number" 
                        :disabled="nodedata.query.extra.relativeType!='minute'" size="mini" class="size-mini"
                        v-model="nodedata.query.extra.minutes" placeholder="分钟"></el-input> 分钟后 
                    </el-radio>                                              
                </div>
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
export default {  
    props:['id','nodedata'], 
    data () {
        return { 
            pickerOptions:{
                disabledDate(time) {                    
                    return time.getTime() <(Date.now()-24*60*60*1000);
                }
            }         
        }
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
                       
            if(node.query.extra.timeType=='absolute'){
                let absoluteTime;
                if(!node.query.absoluteTime) return me.$message.error('绝对时间值不能为空');  
                if(typeof node.query.absoluteTime!='object'){
                    absoluteTime=new Date(node.query.absoluteTime).getTime(); 
                }else{
                    absoluteTime=node.query.absoluteTime.getTime(); 
                }   
                if(absoluteTime<Date.now()) return me.$message.error('绝对时间值不能小于当前时间');      
                node.query.absoluteTime=absoluteTime;
                node.query.relativeTime=null;
            }else{
                if(node.query.extra.relativeType=='day'){
                    if(!node.query.extra.days||node.query.extra.days<=0) return me.$message.error('请输入有效的天数值');
                    node.query.relativeTime=node.query.extra.days*24*3600*1e3;
                }else if(node.query.extra.relativeType=='hour'){
                    if(!node.query.extra.hours||node.query.extra.hours<=0) return me.$message.error('请输入有效的小时数值');
                    node.query.relativeTime=node.query.extra.hours*3600*1e3;
                }else if(node.query.extra.relativeType=='minute'){
                    if(!node.query.extra.minutes||node.query.extra.minutes<=0) return me.$message.error('请输入有效的分钟数值');
                    node.query.relativeTime=node.query.extra.minutes*60*1e3;
                }                   
                node.query.absoluteTime=null;
            }
            
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
