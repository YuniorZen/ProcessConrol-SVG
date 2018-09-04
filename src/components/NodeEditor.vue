<template>
<div class="dialog_wraper" v-if="visiable">
    <div class="dialog" v-show="!order_dialog&&!city_dialog&&!user_dialog">
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
            <template v-if="nodedata.type=='switch'">
                <div class="msg">
                    <el-form label-width="100px">
                        <el-form-item label="分支类型">                           
                            <el-radio v-model="nodedata.query.switchType" label="login">是否登陆</el-radio>  
                            <el-radio v-model="nodedata.query.switchType" label="pay">是否支付</el-radio> 
                            <el-radio v-model="nodedata.query.switchType" label="action">是否新增行为</el-radio> 
                        </el-form-item>                        
                    </el-form>                    
                </div>            
            </template>

            <template v-if="nodedata.type=='time'">
                <div class="time">
                    <el-form label-width="80px">
                        <el-form-item label="周期执行">
                            <el-radio v-model="nodedata.query.cyclename" label="minutes">
                                按分钟，每
                                <el-input type="number" 
                                :disabled="nodedata.query.cyclename!='minutes'" size="mini" 
                                v-model="nodedata.query.minutes" placeholder="分钟"></el-input> 分钟    
                            </el-radio><br/>
                            <el-radio v-model="nodedata.query.cyclename" label="days">
                                按天数，每
                                <el-input type="number" 
                                :disabled="nodedata.query.cyclename!='days'" size="mini" 
                                v-model="nodedata.query.days" placeholder="天数"></el-input> 天    
                            </el-radio><br/>
                            <el-radio v-model="nodedata.query.cyclename" label="weeks">
                                按周数，每
                                <el-input type="number" 
                                :disabled="nodedata.query.cyclename!='weeks'" size="mini" 
                                v-model="nodedata.query.weeks" placeholder="周数"></el-input> 周   
                            </el-radio>
                        </el-form-item> 
                    </el-form>
                </div>            
            </template>

            <template v-if="nodedata.type=='msg'">
                <div class="msg">
                    <el-form label-width="100px">
                        <el-form-item label="模板类型">                           
                            <el-radio v-model="nodedata.query.msgType" label="type1">小程序</el-radio>  
                            <el-radio v-model="nodedata.query.msgType" label="type2">短信</el-radio> 
                        </el-form-item>
                        <el-form-item label="触达消息" v-if="msgList[nodedata.query.msgType].length>0">
                        <el-select v-model="nodedata.query.type1templateId" 
                        placeholder="请选择" size="mini" v-if="nodedata.query.msgType=='type1'">
                            <el-option
                            v-for="msg in msgList.type1"
                            :key="msg.id"
                            :label="msg.title"
                            :value="msg.id">
                            </el-option>
                        </el-select> 
                        <el-select v-model="nodedata.query.type2templateId" 
                            placeholder="请选择" size="mini" v-if="nodedata.query.msgType=='type2'">
                            <el-option
                            v-for="msg in msgList.type2"
                            :key="msg.id"
                            :label="msg.title"
                            :value="msg.id">
                            </el-option>
                        </el-select> 
                        </el-form-item> 
                    </el-form>                    
                </div>            
            </template>
            
            <template v-if="nodedata.type=='waiting'">
                <div class="waiting">
                    <el-radio v-model="nodedata.query.isabsolute" :label="true">绝对时间</el-radio>
                    <el-radio v-model="nodedata.query.isabsolute" :label="false">相对时间</el-radio>
                    <div class="waiting_absolute_input" v-if="nodedata.query.isabsolute">
                        等待至：
                        <el-date-picker
                            size="mini" 
                            v-model="nodedata.query.absolutedatetime"
                            type="datetime"                          
                            :picker-options="pickerOptions"
                            placeholder="选择日期时间">
                        </el-date-picker>
                    </div> 
                    <div class="waiting_relative_input" v-if="!nodedata.query.isabsolute">
                        <el-radio v-model="nodedata.query.relativeType" label="day"> 
                            <el-input type="number" 
                            :disabled="nodedata.query.relativeType!='day'" size="mini"  class="size-mini"
                            v-model="nodedata.query.days" placeholder="天数"></el-input> 天后    
                        </el-radio>                            
                        <el-radio v-model="nodedata.query.relativeType" label="hour">
                            <el-input type="number" 
                            :disabled="nodedata.query.relativeType!='hour'" size="mini" class="size-mini"
                            v-model="nodedata.query.hours" placeholder="小时"></el-input> 小时后 
                        </el-radio>
                        <el-radio v-model="nodedata.query.relativeType" label="minute">
                            <el-input type="number" 
                            :disabled="nodedata.query.relativeType!='minute'" size="mini" class="size-mini"
                            v-model="nodedata.query.minutes" placeholder="分钟"></el-input> 分钟后 
                        </el-radio>                                              
                    </div>
                </div>            
            </template>   

            <template v-if="nodedata.type=='order'">
                <div class="order" v-show="!order_dialog">
                    <el-form label-width="100px">
                        <el-form-item label="指标关系">
                            <el-radio v-model="nodedata.query.interrelation" label="and">和关系</el-radio>    
                            <el-radio v-model="nodedata.query.interrelation" label="or">或关系</el-radio>                             
                        </el-form-item>  
                        <el-form-item label="订单状态">
                            <el-radio v-model="nodedata.query.orderstatus" label="all">全部</el-radio>    
                            <el-radio v-model="nodedata.query.orderstatus" label="wait_pay">待付款</el-radio> 
                            <el-radio v-model="nodedata.query.orderstatus" label="wait_receive">待收货</el-radio> 
                            <el-radio v-model="nodedata.query.orderstatus" label="success">已完成</el-radio> 
                        </el-form-item>
                        <el-form-item label="目标商品关系">
                            <el-radio v-model="nodedata.query.relationship" label="include">包含</el-radio>    
                            <el-radio v-model="nodedata.query.relationship" label="exclude">排除</el-radio> 
                        </el-form-item>
                        <el-form-item label="目标商品">
                           <div class="order_goods">                              
                                <div class="tag slh" v-for="(item,index) in orderTags" :key="index">
                                    {{item.productName?item.productName:item.categoryName}}
                                    <i class="iconfont icon-delete" @click="removeTag('order',item,true)"></i>
                                </div> 
                               <i class="iconfont icon-circle-add" @click="order_add"></i>
                           </div>                           
                        </el-form-item>
                    </el-form>
                </div>            
            </template>

            <template v-if="nodedata.type=='user'">
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
                        <div class="right_item" v-if="nodedata.query.pay.payCondition.createTime.length>0">
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
                                创建时间：{{nodedata.query.pay.payCondition.createTime[0]|parseToDateTime}}-{{nodedata.query.pay.payCondition.createTime[1]|parseToDateTime}}，<br>
                                付款时间：{{nodedata.query.pay.payCondition.payTime[0]|parseToDateTime}}-{{nodedata.query.pay.payCondition.payTime[1]|parseToDateTime}}，<br>
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
            </template>  
        </div>
        <div class="dialog_foot">           
            <el-button type="info" size="mini" @click="cancel">取消</el-button>
            <el-button type="success" size="mini" @click="confirm">确认</el-button>
        </div>
    </div>

    <!-- 订单节点编辑，添加目标商品模块 -->
    <div class="dialog" v-if="order_dialog">
        <div class="dialog_head">
            目标商品    
            <i class="iconfont icon-delete" @click="order_cancel"></i>
        </div>
        <div class="dialog_content transfer">
            <div class="transfer_group">
                <!-- <div class="group_head">所有分类</div> -->
                <ul class="group_category">                    
                    <li v-for="item in order_categoryList" :key="item.categoryId">
                    <div class="item"
                    :data-id="item.categoryId"
                    @click="selectToggle('category',item)" 
                    :class="checkSelected('category',item)?'selected':''">{{item.categoryName}}
                    <i class="iconfont icon-downarrow" @click="showToggle" v-if="item.children&&item.children.length>0"></i>
                    </div>
                    <ul class="group_category none" v-if="item.children&&item.children.length>0">
                        <li v-for="item1 in item.children" :key="item1.categoryId">
                        <div class="item"
                        :data-id="item1.categoryId"
                        @click="selectToggle('category',item1)" 
                        :class="checkSelected('category',item1)?'selected':''">{{item1.categoryName}}
                        <i class="iconfont icon-downarrow" @click="showToggle" v-if="item1.children&&item1.children.length>0"></i>
                        </div>
                        <ul class="group_category none" v-if="item1.children&&item1.children.length>0">
                            <li v-for="item2 in item1.children" :key="item2.categoryId">
                            <div class="item"
                            :data-id="item2.categoryId"
                            @click="selectToggle('category',item2)" 
                            :class="checkSelected('category',item2)?'selected':''">{{item2.categoryName}}</div>
                            </li>
                        </ul>
                        </li>
                    </ul>
                    </li>
                </ul>
            </div>
            <div class="transfer_group">
                <!-- <div class="group_head">所有商品</div> -->
                <ul class="group_product">
                    <li class="item" v-for="item in currentProducts" :key="item.productId" 
                    :data-id="item.productId"
                    @click="selectToggle('product',item)" 
                    :class="checkSelected('product',item)?'selected':''" 
                    >{{item.productName}}</li>
                </ul>
            </div>
            <div class="transfer_operate">
                <i @click="toSelected('order')" class="iconfont icon-rightarrow"></i>
            </div>
            <div class="transfer_result">
                <div class="tag slh" v-for="(item,index) in order_rightTags" :key="index">
                    {{item.productName?item.productName:item.categoryName}}
                    <i class="iconfont icon-delete" @click="removeTag('order',item)"></i>
                </div>                
            </div>
        </div>
        <div class="dialog_foot">            
            <el-button type="info" size="mini" @click="order_cancel">取消</el-button>
            <el-button type="success" size="mini" @click="order_confirm">确认</el-button>
        </div>
    </div>

    <!-- 用户属性:添加城市 -->
    <div class="dialog" v-if="city_dialog">
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

     <!-- 用户编辑二弹窗 -->
    <div class="dialog" v-if="user_dialog&&!city_dialog">
        <div class="dialog_head">
            {{getUserPropety()}}    
            <i class="iconfont icon-delete" @click="city_cancel"></i>
        </div>
        <div class="dialog_content">
            <template v-if="user.userPropety=='city'">
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
            <template v-if="user.userPropety=='sex'">
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
            <template v-if="user.userPropety=='device'">
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
            <div v-if="user.userPropety=='pay'" class="user_pay">
                <el-form label-width="100px">   
                    <el-form-item label="满足支付条件" class="bold"></el-form-item>                          
                    <el-form-item label="多指标关系">
                        <el-radio v-model="user.pay.payCondition.interrelation" label="and">和关系</el-radio>    
                        <el-radio v-model="user.pay.payCondition.interrelation" label="or">或关系</el-radio> 
                    </el-form-item>   
                    <el-form-item label="创建时间">
                        <el-date-picker
                            v-model="user.pay.payCondition.createTime"
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
                            v-model="user.pay.payCondition.payTime"
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
            <template v-if="user.userPropety=='pv'">
                <el-form label-width="100px">                             
                    <el-form-item label="浏览待开发">
                        
                    </el-form-item>  

                </el-form>
            </template>
            <template v-if="user.userPropety=='click'">
                <el-form label-width="100px">                             
                    <el-form-item label="点击待开发">
                        
                    </el-form-item>                               
                </el-form>
            </template>
            <template v-if="user.userPropety=='collect'">
                <el-form label-width="100px">                             
                    <el-form-item label="收藏待开发">
                        
                    </el-form-item>                                  
                </el-form>
            </template>
            <template v-if="user.userPropety=='cart'">
                <el-form label-width="120px">                             
                    <el-form-item label="购物车待开发">
                        
                    </el-form-item>                                
                </el-form>
            </template>                      
            <template v-if="user.userPropety=='share'">
                <el-form label-width="100px">                             
                    <el-form-item label="分享待开发">
                        
                    </el-form-item>                                
                </el-form>
            </template>
            <template v-if="user.userPropety=='comment'">
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
</div>
</template>

<script>
import categoryList from '../assets/data/category.js';
import {msgtype1,msgtype2} from '../assets/data/msglist.js';
import areatree from '../assets/data/areatree.js';
export default {  
    props:['visiable','id','nodedata'], 
    watch:{
        'id':function(id) {
            if(id&&this.nodedata.type&&this.nodedata.type=='user'){
                this.user=JSON.parse(JSON.stringify(this.nodedata.query));
            }
        },
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
    computed:{
        order_rightTags:function(){           
            return this.order_rightcategoryids.concat(this.order_rightproductids);
        },
        orderTags:function() {
            return this.nodedata.query.categoryids.concat(this.nodedata.query.productids);
        }
    },
    data () {
        return { 
            user:{},   
            user_dialog:false,
            city_dialog:false,
            cityTree:[],   
            user_leftcitys:[],
            user_rightcitys:[],                         
            msgList:{
                "type1":[],
                "type2":[]
            },           
            pickerOptions:{
                disabledDate(time) {                    
                    return time.getTime() <(Date.now()-24*60*60*1000);
                }
            },
            order_dialog:false,
            order_leftcategoryids:[],
            order_rightcategoryids:[],
            order_categoryList:[],
            order_productList:{},
            order_leftproductids:[],
            order_rightproductids:[],
            currentProducts:[]
        }
    },   
    beforeMount:function(){ 
        let me=this;

        //分类数据获取       
        me.order_categoryList=categoryList          

        //模板消息列表       
        me.msgList.type1=msgtype1; 
        me.msgList.type2=msgtype2;  

        //获取城市列表      
        me.cityTree=areatree;  
    },
    mounted:function(){
        console.log('NodeEditor挂载完成');
    },
    methods:{      
        cancel:function(){
            this.$parent.isEditor=false;
        },
        confirm:function(){
            let me=this,
                id=me.id,
                node=me.nodedata,
                type=node.type,              
                parent=me.$parent,
                parentData=me.$parent.vnodes[id];
           
            if(node.name.trim()){
                node.name!=parentData.name&&(parentData.name=node.name);
            }else{
                return me.$message.error('节点名称不能为空');
            }
            
            //分支节点数据处理
            if(type=='switch'){                
                parentData.query=JSON.parse(JSON.stringify(node.query));   
                node.query.switchType&&parent.switchConfirm(node);         
                return  parent.isEditor=false,parent.editorConfirm(id);                     
            }

            //时间节点数据处理
            if(type=='time'){
                switch(node.query.cyclename){
                    case 'minutes':
                        if(node.query.minutes<=0) return me.$message.error('请输入有效的分钟数值');  
                        node.query.cycle=node.query.minutes*60*1e3;
                    break;

                    case 'days':
                        if(node.query.days<=0) return me.$message.error('请输入有效的天数值'); 
                        node.query.cycle=node.query.days*24*60*60*1e3; 
                    break;

                    case 'weeks':
                        if(node.query.weeks<=0) return me.$message.error('请输入有效的周数值'); 
                        node.query.cycle=node.query.weeks*7*24*60*60*1e3; 
                    break;
                }
                parentData.query=JSON.parse(JSON.stringify(node.query));            
                return  parent.isEditor=false,parent.editorConfirm(id);                     
            }

            //消息节点数据处理
            if(type=='msg'){  
                if(node.query.msgType=='type1'&&!node.query.type1templateId) 
                    return me.$message.error('请选择小程序触达消息'); 
                if(node.query.msgType=='type2'&&!node.query.type2templateId) 
                    return me.$message.error('请选择短信触达消息'); 
                me.msgList[node.query.msgType].forEach(tmp => {
                    if(node.query[node.query.msgType+'templateId']==tmp.id){
                        return node.query.noticeType=tmp.noticeType
                    }
                });
                parentData.query=JSON.parse(JSON.stringify(node.query));            
                return  parent.isEditor=false,parent.editorConfirm(id);                     
            }

            //等待节点请求数据处理                
            if(type=='waiting'){               
                if(node.query.isabsolute){
                    let absoluteTime;
                    if(!node.query.absolutedatetime) return me.$message.error('绝对时间值不能为空');  
                    if(typeof node.query.absolutedatetime=='string'){
                        absoluteTime=new Date(node.query.absolutedatetime).getTime(); 
                    }else{
                        absoluteTime=node.query.absolutedatetime.getTime(); 
                    }   
                    if(absoluteTime<Date.now()) return me.$message.error('绝对时间值不能小于当前时间');      
                    node.query.absoluteTime=absoluteTime;
                    node.query.relativeTime=null;
                }else{
                    if(node.query.relativeType=='day'){
                        if(!node.query.days||node.query.days<=0) return me.$message.error('请输入有效的天数值');
                        node.query.relativeTime=node.query.days*24*3600*1e3;
                    }else if(node.query.relativeType=='hour'){
                        if(!node.query.hours||node.query.hours<=0) return me.$message.error('请输入有效的小时数值');
                        node.query.relativeTime=node.query.hours*3600*1e3;
                    }else if(node.query.relativeType=='minute'){
                        if(!node.query.minutes||node.query.minutes<=0) return me.$message.error('请输入有效的分钟数值');
                        node.query.relativeTime=node.query.minutes*60*1e3;
                    }                   
                    node.query.absoluteTime=null;
                }
                parentData.query=JSON.parse(JSON.stringify(node.query));
                return  parent.isEditor=false,parent.editorConfirm(id);
            }          
            
            //订单节点请求数据处理
            if(type=='order'){ 
                parentData.query=JSON.parse(JSON.stringify(node.query));               
                return  parent.isEditor=false,parent.editorConfirm(id);
            }

            //用户节点请求数据处理
            if(type=='user'){               
                parentData.query=JSON.parse(JSON.stringify(this.nodedata.query));                      
                return  parent.isEditor=false,parent.editorConfirm(id);
            }       
        },
        order_add:function(){
            this.order_dialog=true;
            this.order_rightcategoryids=this.nodedata.query.categoryids.slice();
            this.order_rightproductids=this.nodedata.query.productids.slice();

            this.order_leftcategoryids=[];
            this.order_leftproductids=[];
        },
        order_confirm:function(){
            this.nodedata.query.categoryids=this.order_rightcategoryids.slice(); 
            this.nodedata.query.productids=this.order_rightproductids.slice();             
            
            this.order_dialog=false;
        },
        order_cancel:function() {
            this.order_dialog=false;           
        },
        showToggle:function(ev,city) {
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
            if(type=='category'){  
                id=obj.categoryId;
                //类状态            
                if(me.order_rightcategoryids.findIndex(item=>{return item.categoryId==id})==-1){
                    let i=me.order_leftcategoryids.findIndex(item=>{return item.categoryId==id});
                    if(i==-1){
                        me.order_leftcategoryids.push(obj)
                    }else{
                        me.order_leftcategoryids.splice(i,1)
                    }  
                }
                //下级商品
                if(me.order_productList[id]){
                    me.currentProducts=me.order_productList[id];
                }else{
                    me.order_productList[id]=[];
                    me.currentProducts=[];
                    if(data.length==0){
                        me.$message('该分类下没有商品数据');
                    }
                }
            }else if(type=="product"){          
                id=obj.productId;     
                if(me.order_rightproductids.findIndex(item=>{return item.productId==id})==-1){
                    let i=me.order_leftproductids.findIndex(item=>{return item.productId==id});
                    if(i==-1){
                        me.order_leftproductids.push(obj)
                    }else{
                        me.order_leftproductids.splice(i,1)
                    }  
                }
            }else if(type=="city"){
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
            if(type=='category'){
                id=obj.categoryId;
                i=this.order_rightcategoryids.findIndex(item=>{return item.categoryId==id});
                if(i!=-1) return true;
                i=this.order_leftcategoryids.findIndex(item=>{return item.categoryId==id})
            }else if(type=='product'){
                id=obj.productId;
                i=this.order_rightproductids.findIndex(item=>{return item.productId==id});
                if(i!=-1) return true;
                i=this.order_leftproductids.findIndex(item=>{return item.productId==id})
            }else if(type=='city'){
                id=obj.areaId;
                i=this.user_rightcitys.findIndex(item=>{return item.areaId==id});
                if(i!=-1) return true;
                i=this.user_leftcitys.findIndex(item=>{return item.areaId==id})
            }
            return i==-1?false:true
        },    
        toSelected:function(type) {
            if(type=='order'){
                if(this.order_leftcategoryids.length>0){
                    this.order_rightcategoryids=this.order_rightcategoryids.concat(this.order_leftcategoryids);
                    this.order_leftcategoryids=[];
                }
                if(this.order_leftproductids.length>0){
                    this.order_rightproductids=this.order_rightproductids.concat(this.order_leftproductids);
                    this.order_leftproductids=[];
                }
            }else if(type=='city'){
                if(this.user_leftcitys.length>0){
                    this.user_rightcitys=this.user_rightcitys.concat(this.user_leftcitys);
                    this.user_leftcitys=[];
                }
            }            
        },    
        removeTag:function(type,obj,deep){
            let i;            
            if(type=='order'){
                let categoryids=deep?this.nodedata.query.categoryids:this.order_rightcategoryids,
                    productids=deep?this.nodedata.query.productids:this.order_rightproductids;

                if(obj.categoryId){
                    i=categoryids.findIndex(item=>{return item.categoryId==obj.categoryId});
                    i!=-1&&categoryids.splice(i,1);
                }else{
                    i=productids.findIndex(item=>{return item.productId==obj.productId});
                    i!=-1&&productids.splice(i,1);
                }
            }else if(type=='city'){
                let citys=deep?this.user.city.citys:this.user_rightcitys;
                i=citys.findIndex(item=>{return item.areaId==obj.areaId});
                i!=-1&&citys.splice(i,1);
            }           
        },
        userPropetySelect:function(propety){
            if(/^(city|sex|device|pay)$/.test(propety)){
                this.user.userPropety=propety;
                this.user[propety]=JSON.parse(JSON.stringify(this.nodedata.query[propety]));
                this.user_dialog=true;
            }
        },
        user_cancel:function() {
            this.user_dialog=false;     
        },
        user_confirm:function() { 
            let me=this,
                propety=me.user.userPropety;
           
            if(propety=='city'){
                if(me.user[propety].citys.length==0) return me.$message.error('请至少添加一个城市'); 
            }
            if(propety=='sex'){
                if(me.user[propety].sexs.length==0) return me.$message.error('请至少选择一个性别'); 
            }
            if(propety=='device'){
                if(me.user[propety].devices.length==0) return me.$message.error('请至少选择一个设备'); 
            }
            if(propety=='pay'){
                if(!me.user.pay.payCondition.createTime||me.user.pay.payCondition.createTime.length==0){
                    return me.$message.error('支付条件下-创建时间不能为空'); 
                }else{
                    me.user.pay.payCondition.createStartTime=this.$tool.toTimeString(me.user.pay.payCondition.createTime[0]);
                    me.user.pay.payCondition.createEndTime=this.$tool.toTimeString(me.user.pay.payCondition.createTime[1]);
                }
                
                if(!me.user.pay.payCondition.payTime||me.user.pay.payCondition.payTime.length==0){
                    return me.$message.error('支付条件下-支付时间不能为空'); 
                }else{
                    me.user.pay.payCondition.payStartTime=this.$tool.toTimeString(me.user.pay.payCondition.payTime[0]);
                    me.user.pay.payCondition.payEndTime=this.$tool.toTimeString(me.user.pay.payCondition.payTime[1]);
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
            }  

            this.user_dialog=false; 
            me.nodedata.query[propety]=JSON.parse(JSON.stringify(me.user[propety]));
        },
        getUserPropety:function() {
          let name='';
          switch(this.user.userPropety){
            case 'city': name='用户属性-城市'; break;
            case 'sex': name='用户属性-性别'; break;
            case 'device': name='用户属性-设备'; break;
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
                
                case 'pay':
                    this.nodedata.query.pay={                 
                        payCondition:{
                            interrelation:"and",
                            createTime:[],
                            createStartTime:"",
                            createEndTime:"",
                            payTime:[],
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
                    };                    
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
    },
    components:{

    }
}
</script>

<style>
  @import url('../assets/css/nodeeditor.css');
</style>
