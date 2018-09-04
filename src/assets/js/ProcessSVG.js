import snap from 'snapsvg';

function NodeData(){
    /**
     * lines:[{id:id, from:from.id, to:data.to, path:path}]
     * nodes:[{
     *      id:id,       
            type:tempnode.attr('data-type'),   
            name:tempnode.attr('data-name'),    
            position:{
                left:xy.left,
                top:xy.top,
                cx:xy.cx,
                cy:xy.cy
            },      
            prev:'',           
            children:[]          
        }]
     */
    this.nodes={};
    this.lines=[];
    this.count=0;   
    this.arrowWidth=6;   
}
NodeData.prototype.update=function(node){
    if(this.nodes[node.id]){
        Object.keys(node).forEach(name=>{
            this.nodes[node.id][name]=node[name];
        })
        console.log(`更新旧元素：${node.id}`);
    }else{
        this.nodes[node.id]=node;     
        this.count++; 
        console.log(`添加新入元素：${this.count} #${node.id}`);
    }     
},
NodeData.prototype.check=function(node,x,y){
    let me=this,     
        bound=node.getBoundingClientRect(),  
        nodeHeight=bound.height,
        nodeWidth=bound.width,
        min=nodeWidth*3,
        temp,
        id=node.getAttribute('id');
    
    if(node.getAttribute('data-type')=='start') return;


    Object.keys(me.nodes).forEach(name=>{       
        let cx=me.nodes[name].position.cx,
            cy=me.nodes[name].position.cy,
            type=me.nodes[name].type,
            disx=x-cx,
            disy=y-cy,
            dis=Math.sqrt(disx*disx+disy*disy),
            foreign=document.querySelector(`#${name}`);            

        if(dis<min&&name!=id&&type!='end'&&type!='switch'){ 
            min=dis; 
            temp={
                id:name,   
                disx:disx,
                disy:disy   
            };                    
        } 
        foreign.classList.remove('crash_effect');        
    });     
   
    return temp&&temp.id
},
NodeData.prototype.delete=function(id){   
    document.querySelector(`#${id}`).remove();    
    delete this.nodes[id];
    this.count--;

    for(let i=0;i<this.lines.length;i++){
        let line=this.lines[i];       
        if(line.from==id||line.to==id){ 
            document.querySelector(`#${line.id}`).remove();
            this.lines.splice(i,1), i--;
            if(line.to==id){
                let j=this.nodes[line.from].children.findIndex((val)=>{return val==id})
                j!=-1&&this.nodes[line.from].children.splice(j,1);
                if(this.nodes[line.from].type=='switch'){
                    let swit=this.nodes[line.from];
                    swit.query.yes==id&&(swit.query.yes=null);
                    swit.query.no==id&&(swit.query.no=null);
                }   
            }
            if(line.from==id){
                this.nodes[line.to].prev=null; 
                if(/switch-(yes|no)/.test(this.nodes[line.to].type)){
                    document.querySelector(`#${line.to}`).remove();
                    delete this.nodes[line.to]
                }              
            }            
        }
    }
},
NodeData.prototype.createPath=function(data){
    let me=this,
        path,
        line,
        nodeWidth=data.current.getBoundingClientRect().width,
        from=me.nodes[data.from],       
        id=`path_${Math.random().toString(32).slice(2)}`,
        pxy=(from=>{
            let fcx=from.position.left+nodeWidth/2,
                fcy=from.position.top+nodeWidth/2,
                tcx=data.xy.left+nodeWidth/2,
                tcy=data.xy.top+nodeWidth/2,               
                disx=tcx-fcx,
                disy=tcy-fcy,
                flag=disx>0?(disy<0?1:0):(disy>0?1:0);            
           
            return {rx:Math.abs(disx),ry:Math.abs(disy),flag:flag,fcx:fcx,fcy:fcy,tcx:tcx,tcy:tcy}
        })(from); 
    
    path=`M${pxy.fcx} ${pxy.fcy} 
        A${pxy.rx},${pxy.ry},0,0,${pxy.flag},${pxy.tcx} ${pxy.tcy}`;
      
    line={id:id, from:from.id, to:data.to, path:path}
    this.lines.push(line);

    return line;
};
NodeData.prototype.repaintPath=function(data,svg){
    let me=this,
        path,      
        pxy,
        nodeWidth=data.current.getBoundingClientRect().width,    
        id=data.id,
        calcuPath=(from,to)=>{           
            let fcx=from.left+nodeWidth/2,
                fcy=from.top+nodeWidth/2,
                tcx=to.left+nodeWidth/2,
                tcy=to.top+nodeWidth/2,               
                disx=tcx-fcx,
                disy=tcy-fcy,
                flag=disx>0?(disy<0?1:0):(disy>0?1:0);            
           
            return {rx:Math.abs(disx),ry:Math.abs(disy),flag:flag,fcx:fcx,fcy:fcy,tcx:tcx,tcy:tcy}
        }; 
    
    me.lines.forEach(line=>{
        if(line.to==id){
            pxy=calcuPath(me.nodes[line.from].position, data.xy);
            path=`M${pxy.fcx} ${pxy.fcy} 
                A${pxy.rx},${pxy.ry},0,0,${pxy.flag},${pxy.tcx} ${pxy.tcy}`;
            
            svg.select(`#${line.id}`).attr({d:path});
        }        
        if(line.from==id){
            pxy=calcuPath(data.xy, me.nodes[line.to].position);
            path=`M${pxy.fcx} ${pxy.fcy} 
                A${pxy.rx},${pxy.ry},0,0,${pxy.flag},${pxy.tcx} ${pxy.tcy}`;
            
            svg.select(`#${line.id}`).attr({d:path});
        }    
    })    
};

function ProcessSVG(){
    this.create_market,
    this.market_module,
    this.market_main,  
    this.svg,
    this.current,
    this.mdisx,
    this.mdisy,   
    this.nodeHeight,
    this.nodeWidth,  
    this.leftDis=0,
    this.topDis=0, 
    this.rightSpace=150,
    this.topSpace=45,
    this.isChild=false,
    this.isMove=false,
    this.leftNodes=[],
    this.NodeData=new NodeData();
}

ProcessSVG.prototype.init=function(id){
    let me=this;
    //初始化元素和绘图区域坐标
    me.create_market=document.querySelector(`#${id}`);
    me.market_module=me.create_market.querySelector('.market_module');
    me.market_main=me.create_market.querySelector('#rightSVG');  
    me.svg=snap('#rightSVG');   
    me.arrow=me.svg.path("M0,0 L0,4 L4,2 L0,0").attr({fill: "#8bd0bb"}).marker(0, 0, 4, 4, 0, 2);
    me.leftNodes=me.market_module.querySelectorAll('.node_wraper');
    me.nodeHeight=me.leftNodes[0].offsetHeight;
    me.nodeWidth=me.leftNodes[0].offsetWidth; 

    //右侧拖拽节点事件处理
    me.leftNodes.forEach(element => {
        element.setAttribute('draggable',true);  
        element.addEventListener('mousedown',function(ev){           
            this.isChild=false;
            this.dragstart(ev);
        }.bind(me),false);          
    }); 
    
    //左侧拖拽事件处理
    me.market_main.addEventListener('dragenter',me.preventDefault,false); 
    me.market_main.addEventListener('dragleave',me.preventDefault,false);
   
    me.market_main.addEventListener('dragover',function(ev){
        this.preventDefault(ev);
        this.dragover(ev);
    }.bind(me),false); 

    me.market_main.addEventListener('drop',function(ev){
        this.preventDefault(ev);
        this.drop(ev,false);
    }.bind(me),false);  
},
ProcessSVG.prototype.dragstart=function(ev){
    ev=ev||window.event;
    this.mdisx=ev.offsetX;
    this.mdisy=ev.offsetY;
    this.current=ev.currentTarget||ev.srcElement;        
},
ProcessSVG.prototype.dragover=function(ev){
    let me=this,
        crash,
        id=me.isChild&&me.current.getAttribute('id'),
        xy=me.calcuXY(ev);
    /**
     * 1.新元素可检测碰撞
     * 2.旧元素如果没有父节点且没有子节点可检测碰撞
     * 3.旧元素如果已经有父节点或子节点则不检测碰撞，更新位置或者path重绘
    */
    if(!me.isChild||me.isChild&&!me.NodeData.nodes[id].prev&&me.NodeData.nodes[id].children.length==0){
        crash=me.NodeData.count>0&&me.NodeData.check(me.current,xy.cx,xy.cy);
        if(crash){
            document.querySelector(`#${crash}`).classList.add('crash_effect');
        }
    }else{
        //情况3：旧元素如果已经有父节点或子节点则不检测碰撞，拖拽后更新path
        me.NodeData.repaintPath({current:me.current, xy:xy, id:id},me.svg)
    }
    this.isChild&&(me.current.setAttribute('x',xy.left),me.current.setAttribute('y',xy.top));          
},
ProcessSVG.prototype.drop=function(ev){
    ev=ev||window.event;  
    if(!this.current) return;  

    let me=this,   
        xy=me.calcuXY(ev), 
        vnode,
        crash,
        tempnode=me.isChild?me.current:me.parseToSVG(me.current),
        id=me.isChild?tempnode.getAttribute('id'):tempnode.attr('id');
    /**
     * 1.新元素可检测碰撞，并判断父节点绘制path
     * 2.旧元素如果没有父节点且没有子节点可检测碰撞,并判断父节点绘制path
     * 3.旧元素如果已经有父节点或子节点则不检测碰撞，更新位置或者path重绘
    */
    if(!me.isChild||me.isChild&&!me.NodeData.nodes[id].prev&&me.NodeData.nodes[id].children.length==0){
        crash=me.NodeData.count>0&&me.NodeData.check(me.current,xy.cx,xy.cy);
        if(crash){
            if(/switch-(yes|no)/.test(me.NodeData.nodes[crash].type)){
                //分支子节点确认
                let prev=me.NodeData.nodes[crash],
                    type=prev.type=='switch-yes'?'yes':'no',
                    swit=me.NodeData.nodes[prev.prev],
                    lineIndex=me.NodeData.lines.findIndex(line=>{return line.to==crash});
                xy=prev.position;
                swit.query[type]=id;
                delete me.NodeData.nodes[crash];
                document.querySelector(`#${crash}`).remove();
                me.NodeData.lines[lineIndex].to=id;
                crash=swit.id;
            }else{
                let data={from:crash,to:id,current:me.current,xy:xy},
                    line=me.NodeData.createPath(data),
                    path;  

                path=me.svg.paper.path(line.path).attr({
                    id:line.id,
                    stroke: "#8bd0bb",
                    strokeWidth:2,
                    markerEnd:me.arrow,
                    markerMid:me.arrow,
                    fill:'none'
                });
                me.svg.prepend(path); 
            }
        }    
    }else{
        //情况3：旧元素如果已经有父节点或子节点则不检测碰撞，拖拽后更新path
        me.NodeData.repaintPath({current:me.current, xy:xy, id:id},me.svg)
    }
    
    if(me.isChild){ 
        tempnode.setAttribute('x',xy.left);
        tempnode.setAttribute('y',xy.top);
        //虚拟dom更新
        vnode={  
            id:id,          
            position:{
                left:xy.left,
                top:xy.top,
                cx:xy.cx,
                cy:xy.cy
            }  
        };   
        if(crash){
            let prev=me.NodeData.nodes[crash];
            vnode.prev=crash;
            prev.type=='switch'?(prev.children=[prev.query.yes,prev.query.no]):prev.children.push(id);
        }
      
        me.NodeData.update(vnode);
    }else{   
        //设置坐标并添加
        tempnode.attr('x',xy.left);   
        tempnode.attr('y',xy.top); 
        me.svg.add(tempnode);
        
        //虚拟dom创建
        vnode={  
            id:id,       
            type:tempnode.attr('data-type'),   
            name:tempnode.attr('data-name'),    
            position:{
                left:xy.left,
                top:xy.top,
                cx:xy.cx,
                cy:xy.cy
            },      
            prev:'',           
            children:[]     
        };   
        vnode.query={}, me.initQuery(vnode.type,vnode.query);
        if(crash){
            let prev=me.NodeData.nodes[crash];
            vnode.prev=crash;
            prev.type=='switch'?(prev.children=[prev.query.yes,prev.query.no]):prev.children.push(id);
        }
        me.NodeData.update(vnode);
        //me.observe(vnode);      
       
        //svg子元素拖拽
        tempnode.drag(
            function(dx,dy,x,y,ev){
                this.isMove=true;
                this.dragover(ev);               
            },
            function(x,y,ev){               
                this.isChild=true;
                this.dragstart(ev);
            },        
            function(ev){              
                this.isMove&&this.drop(ev);
                this.isMove=false;
            },
            me,me,me
        ); 
        //子节点编辑
        tempnode.dblclick(function(ev){
            this.isMove=false;         
            ev=ev||window.event;
            let node=ev.currentTarget||ev.srcElement,
                id=node.getAttribute('id'),
                type=node.getAttribute('data-type');
            if(type=='start'||type=='end')return;

            me.$vue.isEditor=true; 
            me.$vue.editorID=id;
            me.$vue.vnode=JSON.parse(JSON.stringify(me.$vue.vnodes[id]));
        });       
    }      
    this.current=null;
},
ProcessSVG.prototype.calcuXY=function(ev){
    ev=ev||window.event;  
    let me=this,
        maxleft=this.market_main.getBoundingClientRect().width-this.nodeWidth,               
        maxtop=this.market_main.getBoundingClientRect().height-this.nodeHeight,
        left=(this.isChild?(ev.clientX-this.leftDis):ev.offsetX)-this.mdisx,
        top=(this.isChild?(ev.clientY-this.topDis+3):ev.offsetY)-this.mdisy,//3px:bug
        cx=left+this.nodeWidth/2,
        cy=top+this.nodeHeight/2;      
        
    //console.log(`mdisx:${me.mdisx},mdisy:${me.mdisy},cx:${cx},cy:${cy}}`)

    if(left>maxleft)left=maxleft-5;
    if(left<me.rightSpace)left=me.rightSpace+5;
    if(top>maxtop)top=maxtop-5;
    if(top<me.topSpace)top=me.topSpace+10;
        
    return {left,top,cx,cy};  
},
ProcessSVG.prototype.parseToSVG=function (node) {
    let me=this,
        id=`node_${Math.random().toString(32).slice(2)}`,
        svgns='http://www.w3.org/2000/svg',
        htmlns='http://www.w3.org/1999/xhtml',
        type=node.getAttribute('data-type'),
        name=node.getAttribute('data-name'),     
        foreign,      
        inner=node.cloneNode(true);

    foreign=me.svg.el('foreignObject',{
        'height':me.nodeHeight,
        'width':me.nodeWidth,
        'class':'foreignObject',
        'data-type':type,
        'data-name':name,
        'id':id,
    });  

    inner.removeAttribute('draggable');  
    inner.setAttribute('xmlns',htmlns);  

    //删除图标添加和事件处理
    let icon=document.createElement('i');
    icon.className='iconfont icon-delete';
    icon.addEventListener('click',function(ev){          
        me.NodeData.delete(id,true);
        this.isMove=false;
        window.event?window.event.cancelBubble=true:ev.stopPropagation();  
    },false);
    inner.appendChild(icon);
    foreign.append(inner);

  return  foreign;
},
ProcessSVG.prototype.createSwitch=function(node) {
    if(node.query.yes||node.query.no)return;
    let me=this,
        nodeWidth=me.nodeWidth,
        current=document.querySelector(`#${node.id}`),
        yesnode={  
            id:`node_${Math.random().toString(32).slice(2)}`,       
            type:'switch-yes', 
            position:{
                left:node.position.left+nodeWidth*3,
                top:node.position.top-nodeWidth,
                cx:node.position.left+nodeWidth*3+nodeWidth/2,
                cy:node.position.top-nodeWidth+nodeWidth/2
            },      
            prev:node.id,
            children:[] 
        },
        nonode={  
            id:`node_${Math.random().toString(32).slice(2)}`,       
            type:'switch-no', 
            position:{
                left:node.position.left+nodeWidth*3,
                top:node.position.top+nodeWidth,
                cx:node.position.left+nodeWidth*3+nodeWidth/2,
                cy:node.position.top+nodeWidth+nodeWidth/2
            },      
            prev:node.id,
            children:[] 
        },
        yesline=me.NodeData.createPath({from:node.id, to:yesnode.id, xy:yesnode.position, current:current}),
        noline=me.NodeData.createPath({from:node.id, to:nonode.id, xy:nonode.position, current:current}),
        path,text;  

    //放置虚线框
    me.svg.paper.rect(yesnode.position.left,yesnode.position.top,nodeWidth,nodeWidth).attr({
        stroke:'#fff',
        strokeDasharray:'5 3',
        fill:'#3b3f48',
        id:yesnode.id,
        dataType:yesnode.type,
        class:'borderFade'
    });
    me.svg.paper.rect(nonode.position.left,nonode.position.top,nodeWidth,nodeWidth).attr({
        stroke:'#fff',
        strokeDasharray:'5 3',
        fill:'#3b3f48',
        id:nonode.id,
        dataType:nonode.type,
        class:'borderFade'
    });
    me.NodeData.update(yesnode);
    me.NodeData.update(nonode);
    me.NodeData.nodes[node.id].children=[yesnode.id,nonode.id];

    //连线虚线框
    path=me.svg.paper.path(yesline.path).attr({
        id:yesline.id,
        stroke: "#8bd0bb",
        strokeWidth:2,
        markerEnd:me.arrow,
        markerMid:me.arrow,
        fill:'none'
    });
    me.svg.prepend(path);
    //添加文字标记：是
    text=me.svg.paper.text(0,0,'是');
    text.attr({ 'textpath': path, 'fill':'#fff' }).textPath.attr({'startOffset':'49%'});

    path=me.svg.paper.path(noline.path).attr({
        id:noline.id,
        stroke: "#8bd0bb",
        strokeWidth:2,
        markerEnd:me.arrow,
        markerMid:me.arrow,
        fill:'none'
    });
    me.svg.prepend(path);
    //添加文字标记：否
    text=me.svg.paper.text(0,0,'否');
    text.attr({ 'textpath': path, 'fill':'#fff' }).textPath.attr({'startOffset':'49%'})
},
ProcessSVG.prototype.preventDefault=function(event){                
    event=event||window.event;
    event.preventDefault?event.preventDefault():event.returnValue=false;
},
ProcessSVG.prototype.observe=function(data){
    let that=this;
    Object.keys(data).forEach(key=>{
        let val=data[key];
        Object.defineProperty(data,key,{
            enumerable:true,
            configurable:true,                             
            set:function(newValue){
                if(newValue==val){
                    console.log(`${key} 数据未更新`)
                }else{                    
                    console.log(`${key} 数据更新`)
                    val=newValue;
                }               
            },
            get:function(){
                return val
            }        
        });
    });
},
ProcessSVG.prototype.initQuery=function(type,query){ 
    switch(type){
        case 'switch':
            query.switchType='',         
            query.yes='',
            query.no='';   
        break;

        case 'time':
            query.cyclename='minutes',
            query.cycle='',
            query.minutes='',
            query.days='',
            query.weeks='';           
        break;

        case 'msg':
            query.msgType='type1', 
            query.noticeType=null,
            query.type1templateId=null,    
            query.type2templateId=null;
        break;

        case 'waiting':
            query.isabsolute=true,
            query.relativeType='day',          
            query.relativeTime='',
            query.absoluteTime='', 
            query.absolutedatetime='',              
            query.days='',
            query.hours='',
            query.minutes='';              
        break;

        case 'order':
            query.relationship='include',
            query.interrelation='and',
            query.orderstatus='all',
            query.categoryids=[],
            query.productids=[];      
        break;       

        case 'user':
            query.userPropety='',
            query.relationship='include',
            query.interrelation="and",
            query.city={	
                relationship:"include",
                citys:[]
            },
            query.sex={
                relationship:"include",
                sexs:[]
            },
            query.device={
                relationship:"include",
                devices:[]
            },
            query.pay={                 
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
};


export default ProcessSVG;
