var basePath = 'http://hk.demo.yunjy.com.cn/api';

var app=new Vue({
    el:'#app',
    data:function () {
        return {
            http:basePath,
            mysrc:'',
            headline:'',
            presentation:'',
            portrait:'',
            name:'',
            time:'',
            title:'',
            picture:'',
            groceryList:[],
            current:0,
            tapid:'',
            tablink:[],
            facebookCard:[],
            asterastrstar:[1,2,3,4,5],//星星的颗数
            getevent:[],
            discussion:[],
        }
    },
    methods:{
        addClass:function(index,e){
            let target = e.target;
            var rec=this;
            rec.current=index;
            var tapid= target.getAttribute("data-id");
            rec.tapid=tapid;
            rec.$options.methods.getThinKresults({
                role:'001',
                tapid:tapid,
            },rec);
        },
        getbanner:function(url,data) {
           var _this=this;
            axios.get(url,{params:data})
                .then(function (response) {
                    if (response.data.code==200){

                        _this.mysrc=response.data.bannerimg
                    }
                })
                .catch(function (error) {
                    console.log(error);
                });
        },
        getsynopsis:function(url,data) {
            var _this=this;
            axios.get(url,{params:data})
                .then(function (response) {
                        _this.headline=response.data.headline;
                        _this.presentation=response.data.presentation
                })
                .catch(function (error) {
                    console.log(error);
                });
        },
        getthinktank:function(url,data) {
            var _this=this;
            axios.get(url,{params:data})
                .then(function (response) {
                    _this.portrait=response.data.data[0].portrait;
                    _this.name=response.data.data[0].name;
                    _this.time=response.data.data[0].time;
                    _this.title=response.data.data[0].title;
                    _this.picture=response.data.data[0].picture;
                })
                .catch(function (error) {
                    console.log(error);
                });
        },
        getworkshop_list:function(url,data) {
            var _this=this;
            axios.get(url,{params:data})
                .then(function (response) {
                    var workshop=[];
                    var list=response.data.data
                    list.forEach(function(value, index,array){
                            workshop.push({
                                id :index,
                                text:list[index].workshop_name+index,
                                picture:list[index].picture,
                                headportrait:list[index].headportrait,
                                membership:list[index].membership,
                                pageviews:list[index].pageviews,
                                describe:list[index].describe,
                            });
                    });
                    _this.groceryList=workshop
                })
                .catch(function (error) {
                    console.log(error);
                });
        },
        getThinkType:function(url,data) {
            var _this=this;
            axios.get(url,{params:data})
                .then(function (response) {
                    var lick=[];
                    var typeid='';
                    var text='';
                    var isActive='';
                    var list=response.data.data;
                    if(response.data.read==200){
                        list.forEach(function(value, index,array){
                            ilcc(list[index])
                        });
                    }
                    function ilcc(data) {
                        typeid=data.typeid;
                        text=data.type;
                        lick.push({id :typeid,text:text,isActive:isActive});
                    }
                    _this.tablink=lick
                })
                .catch(function (error) {
                    console.log(error);
                });
        },
        getThinKresults:function(data) {
            var _this=this;
            axios.get(basePath+'/api/master/studio/module',{params:data})
                .then(function (response) {
                    var thinkresults=[];
                    var list=response.data.resources;
                    var statetext='',gzstate='';
                    if(response.status==200){
                        // $.each(list, function (i, v) {
                        list.forEach(function(value, index,array){
                            thinkresults.push({
                                id:list[index].id,
                                cover:list[index].cover,
                                price:list[index].price,
                                rating:list[index].rating,
                                studentNum:list[index].studentNum,
                                studio_name:list[index].studio_name,
                                taskNum:list[index].taskNum,
                                task_title:list[index].task_title,
                                title:list[index].title,
                                hitNum:list[index].hitNum,
                            })
                        });
                    }
                    _this.facebookCard=thinkresults;

                })
                .catch(function (error) {
                    console.log(error);
                });
        },
        getEvent:function(data) {
            var _this=this;
            axios.get(basePath+'/api/master/studio/module',{params:data})
                .then(function (response) {
                    var event=[];
                    var list=response.data.resources;
                    if(response.status==200){
                        list.forEach(function(value, index,array){
                            event.push({
                                id:list[index].id,
                                title:list[index].title,
                                username:list[index].username,
                                postNum:list[index].postNum,
                                hitNum:list[index].hitNum,
                                studio_id:list[index].studio_id,
                                studio_name:list[index].studio_name,
                                createdTime:list[index].createdTime,
                            })
                        });
                        _this.getevent=event;
                    }

                })
                .catch(function (error) {
                    console.log(error);
                });
        },
        getDiscussion:function(data) {
            var _this=this;
            axios.get(basePath+'/api/master/studio/module',{params:data})
                .then(function (response) {
                    var discussion=[];
                    var list=response.data.resources;
                    if(response.status==200){
                        list.forEach(function(value, index,array){
                            discussion.push({
                                id:list[index].id,
                                title:list[index].title,
                                username:list[index].username,
                                postNum:list[index].postNum,
                                hitNum:list[index].hitNum,
                                studio_id:list[index].studio_id,
                                studio_name:list[index].studio_name,
                                createdTime:list[index].createdTime,
                            })
                        });
                        _this.discussion=discussion;
                    }
                })
                .catch(function (error) {
                    console.log(error);
                });
        },
        getD:function(data) {
            var _this='';
            axios.get(basePath+'/api/master/studio/module?module=event',{params:data})
                .then(function (response) {
                    console.log(response.data.resources)
                    var tapid= data.tapid
                    if(tapid==''||tapid==null){
                        tapid='001'
                    }
                    var thinkresults=[];
                    var list=response.data.resultslist;
                    var statetext='',gzstate='';
                    if(response.data.read==200){
                        // $.each(list, function (i, v) {
                        list.forEach(function(value, index,array){
                            // if(list[index].state==1){
                            //     statetext='已完结',
                            //         gzstate='gz-ywj'
                            // }else if(list[index].state==2){
                            //     statetext='进行中',
                            //         gzstate='gz-jxz'
                            // }else if(list[index].state==3){
                            //     statetext='未开始',
                            //         gzstate='gz-wks'
                            // }
                            thinkresults.push({
                                id:list[index].id,
                                cover:list[index].cover,
                                task_title:list[index].task_title,
                                price:list[index].price,
                                rating:list[index].rating,
                                studentNum:list[index].studentNum,
                                studio_name:list[index].studio_name,
                                taskNum:list[index].taskNum,
                                task_title:list[index].task_title,
                                title:list[index].title,
                            })
                        });
                    }
                    _this.facebookCard=thinkresults;
                    _this.tapid=tapid;
                })
                .catch(function (error) {
                    console.log(error);
                });
        },
    },
    mounted:function(){
        this.getbanner('http://rap2api.taobao.org/app/mock/83971/banner',{
            role:'001',
        });
        this.getsynopsis('http://rap2api.taobao.org/app/mock/83971/synopsis',{
            role:'001',
        });
        this.getthinktank('http://rap2api.taobao.org/app/mock/83971/thinktank',{
            role:'001',
        });
        this.getworkshop_list('http://rap2api.taobao.org/app/mock/83971/workshop_list',{
            role:'001',
        });
        this.getThinkType('http://rap2api.taobao.org/app/mock/83971/think_tank_type',{
            role:'001',
        });
        this.getThinKresults({
            module:'course'
        });
        this.getEvent({
            module:'event'
        });
       this.getDiscussion({
           module:'discussion'
       });
        this.getThinkType('http://rap2api.taobao.org/app/mock/83971/think_tank_type',{
            role:'001',
        });
    },


});






