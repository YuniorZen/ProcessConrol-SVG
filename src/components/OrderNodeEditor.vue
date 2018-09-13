<template>
<div class="dialog_wraper">
    <div class="dialog" v-show="!order_dialog">
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
            <div class="order">
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
        </div>
        <div class="dialog_foot">           
            <el-button type="info" size="mini" @click="cancel">取消</el-button>
            <el-button type="success" size="mini" @click="confirm">确认</el-button>
        </div>
    </div>

    <!-- 添加目标商品模块 -->
    <div class="dialog" v-show="order_dialog">
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
            <!-- <div class="transfer_group">              
                <ul class="group_product">
                    <li class="item" v-for="item in currentProducts" :key="item.productId" 
                    :data-id="item.productId"
                    @click="selectToggle('product',item)" 
                    :class="checkSelected('product',item)?'selected':''" 
                    >{{item.productName}}</li>
                </ul>
            </div> -->
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
</div>
</template>

<script>
import category from '@/assets/data/category';
export default {  
    props:['id','nodedata'], 
    computed:{
        order_rightTags:function(){           
            return this.order_rightcategoryids.concat(this.order_rightproductids);
        },
        orderTags:function() {
            return this.nodedata.query.categoryids.concat(this.nodedata.query.productids);
        }
    },
    beforeMount:function(){       
        //分类数据获取      
        this.order_categoryList=category; 
    },
    data () {
        return { 
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
          
            parentData.query=JSON.parse(JSON.stringify(node.query));                 
            parentData.name=node.name;          
            parent.editorType=null;
            parent.updateNodeName(id);
           
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
        selectToggle:function(type,obj){
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
                    // me.$post(me.$API.queryProductList,{categoryId:id})
                    // .then(result=>{
                    //     let data=result.data||[];                        
                    //     me.order_productList[id]=data;
                    //     me.currentProducts=data;
                    //     if(data.length==0){
                    //         me.$message('该分类下没有商品数据');
                    //     }
                    // },err=>{
                    //     me.$message.error(err.message)
                    // })
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
            }
            return i==-1?false:true
        },    
        toSelected:function(type){
            if(type=='order'){
                if(this.order_leftcategoryids.length>0){
                    this.order_rightcategoryids=this.order_rightcategoryids.concat(this.order_leftcategoryids);
                    this.order_leftcategoryids=[];
                }
                if(this.order_leftproductids.length>0){
                    this.order_rightproductids=this.order_rightproductids.concat(this.order_leftproductids);
                    this.order_leftproductids=[];
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
            }    
        }
    }
}
</script>

<style>
  @import url('../assets/css/nodeeditor.css');
</style>
