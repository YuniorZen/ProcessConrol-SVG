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
            <div class="time">
                <el-form label-width="80px">
                    <el-form-item label="周期执行">
                        <el-radio v-model="nodedata.query.extra.cycleType" label="minutes">
                            按分钟，每
                            <el-input type="number" 
                            :disabled="nodedata.query.extra.cycleType!='minutes'" size="mini" 
                            v-model="nodedata.query.extra.minutes" placeholder="分钟"></el-input> 分钟    
                        </el-radio><br/>
                        <el-radio v-model="nodedata.query.extra.cycleType" label="days">
                            按天数，每
                            <el-input type="number" 
                            :disabled="nodedata.query.extra.cycleType!='days'" size="mini" 
                            v-model="nodedata.query.extra.days" placeholder="天数"></el-input> 天    
                        </el-radio><br/>
                        <el-radio v-model="nodedata.query.extra.cycleType" label="weeks">
                            按周数，每
                            <el-input type="number" 
                            :disabled="nodedata.query.extra.cycleType!='weeks'" size="mini" 
                            v-model="nodedata.query.extra.weeks" placeholder="周数"></el-input> 周   
                        </el-radio>
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
    data () {
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
    
            switch(node.query.extra.cycleType){
                case 'minutes':
                    if(node.query.extra.minutes<=0) return me.$message.error('请输入有效的分钟数值');  
                    node.query.cycle=node.query.extra.minutes*60*1e3;
                break;

                case 'days':
                    if(node.query.extra.days<=0) return me.$message.error('请输入有效的天数值'); 
                    node.query.cycle=node.query.extra.days*24*60*60*1e3; 
                break;

                case 'weeks':
                    if(node.query.extra.weeks<=0) return me.$message.error('请输入有效的周数值'); 
                    node.query.cycle=node.query.extra.weeks*7*24*60*60*1e3; 
                break;
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
