<template>
<div class="dialog_wraper">
    <div class="dialog" v-show="!city_dialog&&!user_dialog">
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
            <div class="user">
                <div class="user_left">
                    <ul class="user_propety1">
                        <li>
                            <div class="item">用户属性</div>
                            <ul class="user_propety2">
                                <li @click="userPropetySelect('city')">
                                    <div class="item">城市</div>
                                </li>
                                <li @click="userPropetySelect('sex')">
                                    <div class="item">性别</div>
                                </li>
                                <li @click="userPropetySelect('device')">
                                    <div class="item">设备</div>
                                </li>
                                <li @click="userPropetySelect('register')">
                                    <div class="item">注册</div>
                                </li>
                            </ul>
                        </li>
                        <li>
                            <div class="item">用户行为</div>
                            <ul class="user_propety2">
                                <li @click="userPropetySelect('pv')">
                                    <div class="item disabled">浏览</div>
                                </li>
                                <li @click="userPropetySelect('click')">
                                    <div class="item disabled">点击</div>
                                </li>
                                <li @click="userPropetySelect('collect')">
                                    <div class="item disabled">收藏</div>
                                </li>
                                    <li @click="userPropetySelect('cart')">
                                    <div class="item disabled">购物车</div>
                                </li>
                                <li @click="userPropetySelect('pay')">
                                    <div class="item">支付</div>
                                </li>
                                <li @click="userPropetySelect('share')">
                                    <div class="item disabled">分享</div>
                                </li>
                                <li @click="userPropetySelect('comment')">
                                    <div class="item disabled">评论</div>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </div>
                <div class="user_right">
                    <div class="right_head flex-between">                             
                        <div class="flex-child0">
                            <el-radio v-model="nodedata.query.relationship" label="include">包含</el-radio>    
                            <el-radio v-model="nodedata.query.relationship" label="exclude">排除</el-radio>  
                        </div>
                        <div class="flex-child0">
                            <span class="label-span">多指标关系</span>                                   
                            <el-radio v-model="nodedata.query.interrelation" label="and">和关系</el-radio>    
                            <el-radio v-model="nodedata.query.interrelation" label="or">或关系</el-radio>                        
                        </div>  
                    </div> 
                    <div class="right_item" v-if="nodedata.query.city.citys.length>0">
                        <div class="item_h flex-between">
                            <div class="item_h_name flex-child0">城市</div>
                            <div class="item_h_operate flex-child0">
                                <i class="iconfont icon-editor" @click="userPropetySelect('city')"></i>
                                <i class="iconfont icon-remove" @click="removeUserPropety('city')"></i>
                            </div>
                        </div>
                        <div class="item_detail">
                            {{getUserPropetyDetail('city')}}
                        </div>
                    </div>
                    <div class="right_item" v-if="nodedata.query.sex.sexs.length>0">
                        <div class="item_h flex-between">
                            <div class="item_h_name flex-child0">性别</div>
                            <div class="item_h_operate flex-child0">
                                <i class="iconfont icon-editor" @click="userPropetySelect('sex')"></i>
                                <i class="iconfont icon-remove" @click="removeUserPropety('sex')"></i>
                            </div>
                        </div>
                        <div class="item_detail">
                            {{getUserPropetyDetail('sex')}}
                        </div>
                    </div>                      
                    <div class="right_item" v-if="nodedata.query.device.devices.length>0">
                        <div class="item_h flex-between">
                            <div class="item_h_name flex-child0">设备</div>
                            <div class="item_h_operate flex-child0">
                                <i class="iconfont icon-editor" @click="userPropetySelect('device')"></i>
                                <i class="iconfont icon-remove" @click="removeUserPropety('device')"></i>
                            </div>
                        </div>
                        <div class="item_detail">
                            {{getUserPropetyDetail('device')}}
                        </div>
                    </div>
                    <div class="right_item" v-if="nodedata.query.register.registerTime.length!=0">
                        <div class="item_h flex-between">
                            <div class="item_h_name flex-child0">注册时间</div>
                            <div class="item_h_operate flex-child0">
                                <i class="iconfont icon-editor" @click="userPropetySelect('register')"></i>
                                <i class="iconfont icon-remove" @click="removeUserPropety('register')"></i>
                            </div>
                        </div>
                        <div class="item_detail">
                            {{nodedata.query.register.registerTime[0]|parseToDateTime}} 至 {{nodedata.query.register.registerTime[1]|parseToDateTime}}
                        </div>
                    </div>
                    <div class="right_item" v-if="nodedata.query.extra.createTime.length!=0">
                        <div class="item_h flex-between">
                            <div class="item_h_name flex-child0">支付</div>
                            <div class="item_h_operate flex-child0">
                                <i class="iconfont icon-editor" @click="userPropetySelect('pay')"></i>
                                <i class="iconfont icon-remove" @click="removeUserPropety('pay')"></i>
                            </div>
                        </div>
                        <div class="item_condition">
                            满足支付条件（多指标关系：{{nodedata.query.pay.payCondition.interrelation=='or'?'或关系':'和关系'}}）
                        </div>
                        <div class="item_detail">
                            创建时间：{{nodedata.query.extra.createTime[0]|parseToDateTime}}-{{nodedata.query.extra.createTime[1]|parseToDateTime}}，<br>
                            付款时间：{{nodedata.query.extra.payTime[0]|parseToDateTime}}-{{nodedata.query.extra.payTime[1]|parseToDateTime}}，<br>
                            总费用：{{nodedata.query.pay.payCondition.totalCost.type+nodedata.query.pay.payCondition.totalCost.value}}， 
                            实付金额：{{nodedata.query.pay.payCondition.realCost.type+nodedata.query.pay.payCondition.realCost.value}};
                        </div>
                        <div class="item_condition">
                            满足汇总条件（多指标关系：{{nodedata.query.pay.sumCondition.interrelation=='or'?'或关系':'和关系'}}）
                        </div>
                        <div class="item_detail">
                            <template v-for="condition in nodedata.query.pay.sumCondition.condition">
                                {{condition.costType=='totalCost'?'总费用':'实付金额'}} {{condition.type}} {{condition.value}}; 
                            </template>
                        </div>
                    </div>
                </div>                    
            </div>         
        </div>
        <div class="dialog_foot">           
            <el-button type="info" size="mini" @click="cancel">取消</el-button>
            <el-button type="success" size="mini" @click="confirm">确认</el-button>
        </div>
    </div>

    <!-- 用户编辑二弹窗 -->
    <div class="dialog" v-show="user_dialog&&!city_dialog">
        <div class="dialog_head">
            {{getUserPropety()}}    
            <i class="iconfont icon-delete" @click="user_cancel"></i>
        </div>
        <div class="dialog_content">
            <template v-if="user.extra.userPropety=='city'">
                <el-form label-width="30px">                             
                    <el-form-item label="">
                        <el-radio v-model="user.city.relationship" label="include">包含</el-radio>    
                        <el-radio v-model="user.city.relationship" label="exclude">排除</el-radio> 
                    </el-form-item>
                </el-form>
                <el-form label-width="100px">   
                    <el-form-item label="城市指标">
                    <div class="user_citys">                              
                            <div class="tag slh" v-for="item in user.city.citys" :key="item.areaId">
                                {{item.areaName}}
                            <i class="iconfont icon-delete" @click="removeTag('city',item,true)"></i>
                            </div> 
                        <i class="iconfont icon-circle-add" @click="city_add"></i>
                    </div>                           
                    </el-form-item>
                </el-form>
            </template>                        
            <template v-if="user.extra.userPropety=='sex'">
                <el-form label-width="30px">                             
                    <el-form-item label="">
                        <el-radio v-model="user.sex.relationship" label="include">包含</el-radio>    
                        <el-radio v-model="user.sex.relationship" label="exclude">排除</el-radio> 
                    </el-form-item> 
                </el-form>
                <el-form label-width="100px">  
                    <el-form-item label="性别指标">
                        <el-checkbox-group v-model="user.sex.sexs">
                            <el-checkbox label="man">男性</el-checkbox>
                            <el-checkbox label="woman">女性</el-checkbox>
                            <el-checkbox label="other">其他</el-checkbox>                                       
                        </el-checkbox-group> 
                    </el-form-item>                                
                </el-form>
            </template>                      
            <template v-if="user.extra.userPropety=='device'">
                <el-form label-width="30px">                             
                    <el-form-item label="">
                        <el-radio v-model="user.device.relationship" label="include">包含</el-radio>    
                        <el-radio v-model="user.device.relationship" label="exclude">排除</el-radio> 
                    </el-form-item>
                </el-form>
                <el-form label-width="100px">   
                    <el-form-item label="设备指标">
                        <el-checkbox-group v-model="user.device.devices">
                            <el-checkbox label="ios">苹果</el-checkbox>
                            <el-checkbox label="android">安卓</el-checkbox>                                      
                            <el-checkbox label="other">其它</el-checkbox>                                        
                        </el-checkbox-group> 
                    </el-form-item>                               
                </el-form>
            </template>
            <template v-if="user.extra.userPropety=='register'">             
                <el-form label-width="100px">   
                    <el-form-item label="注册时间">
                        <el-date-picker
                        v-model="user.register.registerTime"
                        type="datetimerange" size="mini"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        value-format="timestamp">
                        </el-date-picker>                      
                    </el-form-item>                               
                </el-form>
            </template>
            <div v-if="user.extra.userPropety=='pay'" class="user_pay">
                <el-form label-width="100px">   
                    <el-form-item label="满足支付条件" class="bold"></el-form-item>                          
                    <el-form-item label="多指标关系">
                        <el-radio v-model="user.pay.payCondition.interrelation" label="and">和关系</el-radio>    
                        <el-radio v-model="user.pay.payCondition.interrelation" label="or">或关系</el-radio> 
                    </el-form-item>   
                    <el-form-item label="创建时间">
                        <el-date-picker
                            v-model="user.extra.createTime"
                            type="datetimerange" size="mini"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期">
                        </el-date-picker>
                        <span class="label-span"><i class="nbsp">空</i>总费用</span>
                        <el-select class="size-mini" v-model="user.pay.payCondition.totalCost.type" size="mini">
                            <el-option label="大于" value=">"></el-option>
                            <el-option label="小于" value="<"></el-option>
                            <el-option label="等于" value="="></el-option>
                        </el-select>
                        <el-input class="size-mini" type="number" v-model="user.pay.payCondition.totalCost.value" placeholder="金额" size="mini"></el-input>                        
                    </el-form-item>
                    <el-form-item label="付款时间">
                        <el-date-picker
                            v-model="user.extra.payTime"
                            type="datetimerange" size="mini"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期">
                        </el-date-picker>
                        <span class="label-span">实付金额</span>
                        <el-select class="size-mini" v-model="user.pay.payCondition.realCost.type" size="mini">
                            <el-option label="大于" value=">"></el-option>
                            <el-option label="小于" value="<"></el-option>
                            <el-option label="等于" value="="></el-option>
                        </el-select>
                        <el-input class="size-mini" type="number" v-model="user.pay.payCondition.realCost.value" placeholder="金额" size="mini"></el-input>
                    </el-form-item>     
                    <el-form-item label="满足汇总条件" class="bold"></el-form-item>                          
                    <el-form-item label="多指标关系">
                        <el-radio v-model="user.pay.sumCondition.interrelation" label="and">和关系</el-radio>    
                        <el-radio v-model="user.pay.sumCondition.interrelation" label="or">或关系</el-radio> 
                    </el-form-item>  
                    <el-form-item label="指标条件" v-for="(condition,index) in user.pay.sumCondition.condition" :key="index">
                        <el-select class="size-mini2" v-model="condition.costType" size="mini">
                            <el-option label="总费用" value="totalCost"></el-option>
                            <el-option label="实付金额" value="realCost"></el-option>                                      
                        </el-select>
                        <el-select class="size-mini" v-model="condition.type" size="mini">
                            <el-option label="大于" value=">"></el-option>
                            <el-option label="小于" value="<"></el-option>
                            <el-option label="等于" value="="></el-option>
                        </el-select>
                        <el-input class="size-mini" type="number" v-model="condition.value" placeholder="金额" size="mini"></el-input>
                        
                        <i v-if="index==0" class="iconfont icon-circle-add" @click="addCondition"></i>
                        <i v-else class="iconfont icon-circle-delete" @click="removeCondition(index)"></i>
                    </el-form-item>                             
                </el-form>
            </div>
            <template v-if="user.extra.userPropety=='pv'">
                <el-form label-width="100px">                             
                    <el-form-item label="浏览待开发">
                        
                    </el-form-item>  

                </el-form>
            </template>
            <template v-if="user.extra.userPropety=='click'">
                <el-form label-width="100px">                             
                    <el-form-item label="点击待开发">
                        
                    </el-form-item>                               
                </el-form>
            </template>
            <template v-if="user.extra.userPropety=='collect'">
                <el-form label-width="100px">                             
                    <el-form-item label="收藏待开发">
                        
                    </el-form-item>                                  
                </el-form>
            </template>
            <template v-if="user.extra.userPropety=='cart'">
                <el-form label-width="120px">                             
                    <el-form-item label="购物车待开发">
                        
                    </el-form-item>                                
                </el-form>
            </template>                      
            <template v-if="user.extra.userPropety=='share'">
                <el-form label-width="100px">                             
                    <el-form-item label="分享待开发">
                        
                    </el-form-item>                                
                </el-form>
            </template>
            <template v-if="user.extra.userPropety=='comment'">
                <el-form label-width="100px">                             
                    <el-form-item label="评论待开发">
                        
                    </el-form-item>                              
                </el-form>
            </template>
        </div>
        <div class="dialog_foot">            
            <el-button type="info" size="mini" @click="user_cancel">取消</el-button>
            <el-button type="success" size="mini" @click="user_confirm">确认</el-button>
        </div>
    </div>

    <!-- 用户属性:添加城市 -->
    <div class="dialog" v-show="city_dialog">
        <div class="dialog_head">
            城市指标    
            <i class="iconfont icon-delete" @click="city_cancel"></i>
        </div>
        <div class="dialog_content transfer">
            <div class="transfer_group">              
                <ul class="group_category">                    
                    <li v-for="item in cityTree" :key="item.areaId">
                    <div class="item"
                    @click="showToggle($event,true)"
                    :data-id="item.areaId">{{item.areaName}}
                    <i class="iconfont icon-downarrow" v-if="item.children&&item.children.length>0"></i>
                    </div>
                    <ul class="group_category none" v-if="item.children&&item.children.length>0">
                        <li v-for="item1 in item.children" :key="item1.areaId">
                        <div class="item"
                        :data-id="item1.areaId"
                        @click="selectToggle('city',item1)" 
                        :class="checkSelected('city',item1)?'selected':''">{{item1.areaName}}                  
                        </div>                    
                        </li>
                    </ul>
                    </li>
                </ul>
            </div>           
            <div class="transfer_operate">
                <i @click="toSelected('city')" class="iconfont icon-rightarrow"></i>
            </div>
            <div class="transfer_result">
                <div class="tag slh" v-for="(item,index) in user_rightcitys" :key="index">
                    {{item.areaName}}
                    <i class="iconfont icon-delete" @click="removeTag('city',item)"></i>
                </div>                
            </div>
        </div>
        <div class="dialog_foot">            
            <el-button type="info" size="mini" @click="city_cancel">取消</el-button>
            <el-button type="success" size="mini" @click="city_confirm">确认</el-button>
        </div>
    </div>
   
</div>
</template>

<script>
import  areatree from '@/assets/data/areatree.js';
export default {  
    props:['id','nodedata'], 
    watch:{
        'id':function(id) {
            if(id&&this.nodedata.type&&this.nodedata.type=='user'){
                this.user=JSON.parse(JSON.stringify(this.nodedata.query));
            }
        }
    },    
    beforeMount:function(){        
        //获取城市列表       
        this.cityTree=areatree;     
        this.user=JSON.parse(JSON.stringify(this.nodedata.query));
        console.log('user 节点挂载');  
    },
    data () {
        return { 
            user:{},   
            user_dialog:false,
            city_dialog:false,
            cityTree:[],   
            user_leftcitys:[],
            user_rightcitys:[]           
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
                                 
            parentData.query=JSON.parse(JSON.stringify(this.nodedata.query));                      
            parentData.name=node.name;          
            parent.editorType=null;
            parent.updateNodeName(id);                
        },        
        showToggle:function(ev,city){
            ev=ev||window.event;
            window.event?window.event.cancelBubble=true:ev.stopPropagation();
            
            let current=ev.currentTarget||ev.srcElement,
                icon=city?current.querySelector('.iconfont'):current,
                children=icon.parentNode.parentNode.querySelector('.group_category');
            
            if(children.classList.contains('none')){
                icon.classList.remove('icon-downarrow');
                icon.classList.add('icon-uparrow');
                children.classList.remove('none');
                children.classList.add('show');
            }else{
                icon.classList.remove('icon-uparrow');
                icon.classList.add('icon-downarrow');
                children.classList.remove('show');
                children.classList.add('none');
            }
        },
        selectToggle:function(type,obj) {
            let me=this,id;
            if(type=="city"){
                id=obj.areaId;     
                if(me.user_rightcitys.findIndex(item=>{return item.areaId==id})==-1){
                    let i=me.user_leftcitys.findIndex(item=>{return item.areaId==id});
                    if(i==-1){
                        me.user_leftcitys.push(obj)
                    }else{
                        me.user_leftcitys.splice(i,1)
                    }  
                }
            }
        },      
        checkSelected:function(type,obj) {
            let i,id;
            if(type=='city'){
                id=obj.areaId;
                i=this.user_rightcitys.findIndex(item=>{return item.areaId==id});
                if(i!=-1) return true;
                i=this.user_leftcitys.findIndex(item=>{return item.areaId==id})
            }
            return i==-1?false:true
        },    
        toSelected:function(type) {
            if(type=='city'){
                if(this.user_leftcitys.length>0){
                    this.user_rightcitys=this.user_rightcitys.concat(this.user_leftcitys);
                    this.user_leftcitys=[];
                }
            }            
        },    
        removeTag:function(type,obj,deep){
            let i;            
            if(type=='city'){
                let citys=deep?this.user.city.citys:this.user_rightcitys;
                i=citys.findIndex(item=>{return item.areaId==obj.areaId});
                i!=-1&&citys.splice(i,1);
            }           
        },
        userPropetySelect:function(propety){
            if(/^(city|sex|device|pay|register)$/.test(propety)){
                this.user.extra.userPropety=propety;
                this.user[propety]=JSON.parse(JSON.stringify(this.nodedata.query[propety]));
                this.user_dialog=true;
            }
        },
        user_cancel:function() {
            this.user_dialog=false;     
        },
        user_confirm:function() { 
            let me=this,
                propety=me.user.extra.userPropety;
           
            if(propety=='city'){
                if(me.user[propety].citys.length==0) return me.$message.error('请至少添加一个城市'); 
            }
            if(propety=='sex'){
                if(me.user[propety].sexs.length==0) return me.$message.error('请至少选择一个性别'); 
            }
            if(propety=='device'){
                if(me.user[propety].devices.length==0) return me.$message.error('请至少选择一个设备'); 
            }
            if(propety=='register'){
                if(me.user[propety].registerTime.length==0) return me.$message.error('注册时间不能为空'); 
            }
            if(propety=='pay'){
                if(!me.user.extra.createTime||me.user.extra.createTime.length!=2){
                    return me.$message.error('支付条件下-创建时间不能为空'); 
                }else{
                    me.user.pay.payCondition.createStartTime=this.$tool.toTimeString(me.user.extra.createTime[0]);
                    me.user.pay.payCondition.createEndTime=this.$tool.toTimeString(me.user.extra.createTime[1]);
                }
                
                if(!me.user.extra.payTime||me.user.extra.payTime.length!=2){
                    return me.$message.error('支付条件下-支付时间不能为空'); 
                }else{
                    me.user.pay.payCondition.payStartTime=this.$tool.toTimeString(me.user.extra.payTime[0]);
                    me.user.pay.payCondition.payEndTime=this.$tool.toTimeString(me.user.extra.payTime[1]);
                }

                if(!me.user.pay.payCondition.totalCost.value||me.user.pay.payCondition.totalCost.value<=0){
                    return me.$message.error('支付条件下-总费用金额不是有效值'); 
                }
                if(!me.user.pay.payCondition.realCost.value||me.user.pay.payCondition.realCost.value<=0){
                    return me.$message.error('支付条件下-实付金额不是有效值'); 
                }                

                for(let i=0;i<me.user.pay.sumCondition.condition.length;i++){
                    let condition=me.user.pay.sumCondition.condition[i],
                    cost=condition.costType=='totalCost'?'总费用':condition.contains=='realCost'?'实付':'邮费';
                    if(!condition.value||condition.value<=0){
                        return me.$message.error(`汇总条件下-${cost}金额不是有效值`); 
                    }
                }
                //额外字段添加
                me.nodedata.query.extra=JSON.parse(JSON.stringify(me.user.extra));
            }  

            this.user_dialog=false; 
            me.nodedata.query[propety]=JSON.parse(JSON.stringify(me.user[propety]));
        },
        getUserPropety:function() {
          let name='';
          switch(this.user.extra.userPropety){
            case 'city': name='用户属性-城市'; break;
            case 'sex': name='用户属性-性别'; break;
            case 'device': name='用户属性-设备'; break;
            case 'register': name='用户属性-注册'; break;
            case 'pv': name='用户行为-浏览'; break;
            case 'click': name='用户行为-点击'; break;
            case 'collect': name='用户行为-收藏'; break;
            case 'cart': name='用户行为-购物车'; break;
            case 'pay': name='用户行为-支付'; break;
            case 'share': name='用户行为-分享'; break;
            case 'comment': name='用户行为-评论'; break;
          }
          return name;  
        },
        getUserPropetyDetail:function(propety) {
            let relation=this.nodedata.query[propety].relationship=='include'?'包含':'排除',
                arrays=[];
            if(propety=='sex'){
                this.nodedata.query[propety].sexs.forEach(item=>{
                    item=='man'&&arrays.push('男性');
                    item=='woman'&&arrays.push('女性');
                    item=='other'&&arrays.push('其他');
                })
            }
            if(propety=='device'){
                this.nodedata.query[propety].devices.forEach(item=>{
                    item=='android'&&arrays.push('安卓');
                    item=='ios'&&arrays.push('苹果');
                    item=='other'&&arrays.push('其他');
                })
            }
            if(propety=='city'){
                this.nodedata.query[propety].citys.forEach(item=>{                  
                    arrays.push(item.areaName);
                })
            }           
            return `${relation}：${arrays.join('，')}`        
        },
        removeUserPropety:function(propety){
            switch(propety){
                case 'city':
                    this.nodedata.query.city.citys=[];
                break;
                
                case 'sex':
                    this.nodedata.query.sex.sexs=[];
                break;
                 
                case 'device':
                    this.nodedata.query.device.devices=[];
                break;

                case 'register':
                    this.nodedata.query.register.registerTime=[];
                break;
                
                case 'pay':
                    this.nodedata.query.pay={                 
                        payCondition:{
                            interrelation:"and",                 
                            createStartTime:"",
                            createEndTime:"",                   
                            payStartTime:"",
                            payEndTime:"",
                            totalCost:{
                                type:">",
                                value:""
                            },
                            realCost:{
                                type:">",
                                value:""
                            }
                        },                    
                        sumCondition:{
                            interrelation:"and",
                            condition:[
                                {
                                    costType:"totalCost",
                                    type:">",
                                    value:""
                                }                            
                            ]			
                        }
                    },
                    this.nodedata.query.extra={},
                    this.nodedata.query.extra.userPropety='',
                    this.nodedata.query.extra.createTime=[],
                    this.nodedata.query.extra.payTime=[];               
                break;
            }
        }, 
        city_cancel:function() {
            this.city_dialog=false;     
        },
        city_confirm:function() {
            this.user.city.citys=this.user_rightcitys.slice();
            this.city_dialog=false;     
        },
        city_add:function(){           
            this.user_rightcitys=this.user.city.citys.slice();            
            this.user_leftcitys=[];
            this.city_dialog=true;
        },  
        addCondition:function() {
            let condition=this.user.pay.sumCondition.condition;
            condition.push({
                costType:"totalCost",
                type:">",
                value:""
            });
        },
        removeCondition:function(index) {
            let condition=this.user.pay.sumCondition.condition;
            condition.splice(index,1);
        }  
    }
}
</script>

<style>
  @import url('../assets/css/nodeeditor.css');
</style>
