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
            <div class="switch">
                <el-form label-width="100px">
                    <el-form-item label="分支类型">                           
                        <el-radio v-model="nodedata.query.switchType" label="login">是否登陆</el-radio>  
                        <el-radio v-model="nodedata.query.switchType" label="pay">是否支付</el-radio> 
                        <el-radio v-model="nodedata.query.switchType" label="action">是否新增行为</el-radio> 
                    </el-form-item>     
                    <el-form-item label="时间范围">  
                        <el-radio v-model="nodedata.query.limitType" label="none">无限制</el-radio>                          
                        <el-radio v-model="nodedata.query.limitType" label="absolute">绝对时间</el-radio>  
                        <el-radio v-model="nodedata.query.limitType" label="relative">相对时间</el-radio>  
                    </el-form-item>
                </el-form>
                <el-form label-width="35px">
                    <el-form-item label="">     
                        <el-date-picker v-if="nodedata.query.limitType=='absolute'"
                            v-model="nodedata.query.absoluteTime"
                            type="datetimerange" size="mini"
                            range-separator="至"
                            value-format="timestamp"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期">
                        </el-date-picker>                          
                        <template v-if="nodedata.query.limitType=='relative'">
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
                        </template>
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
export default {  
    props:['id','nodedata'], 
    watch:{        
        'nodedata.query.switchType':function(val){
            switch(val){
                case 'login':
                    this.nodedata.name='是否登陆';
                break;

                case 'action':
                    this.nodedata.name='是否新增行为';
                break;

                case 'pay':
                    this.nodedata.name='是否支付';
                break;
            }
        }
    },   
    data() {
        return { 
        
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
                        
            if(!node.query.switchType) return me.$message.error('请选择分支类型');  
            
            if(node.query.limitType=='absolute'){
                if(node.query.absoluteTime.length!=2) return me.$message.error('请选择绝对时间值');                  
            }else if(node.query.limitType=='relative'){
                if(node.query.extra.relativeType=='day'){
                    if(node.query.extra.days<=0) return me.$message.error('请输入有效的天数数值'); 
                    node.query.relativeTime=node.query.extra.days*24*3600*1e3;
                }else if(node.query.extra.relativeType=='hour'){
                    if(node.query.extra.hours<=0) return me.$message.error('请输入有效的小时数值'); 
                    node.query.relativeTime=node.query.extra.hours*3600*1e3;
                }else if(node.query.extra.relativeType=='minute'){
                    if(node.query.extra.minutes<=0) return me.$message.error('请输入有效的分钟数值'); 
                    node.query.relativeTime=node.query.extra.minutes*60*1e3;
                }
            }  
            
            parentData.query=JSON.parse(JSON.stringify(node.query));                  
            parentData.name=node.name;          
            parent.editorType=null;
            parent.updateNodeName(id); 

            if(node.query.switchType){                    
                if(!parentData.children[0]){
                    parent.switchConfirm(node); 
                }                 
            }              
        }       
    }
}
</script>

<style>
  @import url('../assets/css/nodeeditor.css');
</style>
