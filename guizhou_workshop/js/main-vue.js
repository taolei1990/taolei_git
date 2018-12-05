var basePath = 'http://hk.demo.yunjy.com.cn';//测试
// var basePath = 'http://hk.demo.yunjy.com.cn/api';//线下
// var project = 'https://ceshi.yunjy.com.cn/project/detail/';//测试项目
var project = 'https://youshiyun.yx.yunjy.com.cn/project/detail/';//正式项目
var activit ='https://dev.yunjy.com.cn/activityhtml/activity_home.html';//测试活动


var app=new Vue({
    el:'#app',
    data:function () {
        return {
            http:basePath,
            articleid:'',
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
            getproject:[],
            getactivity:[]
        }
    },
    //可以在这加个loading事件
    beforecreate:function(){
        showData();
    },
    //html加载完成之前，loading结束 执行。执行顺序：父组件-子组件
    created: function () {

    },
    //html加载完成后执行。执行顺序：子组件-父组件
    mounted:function(){
        this.getGzlook('/api/master/studio/gzlook');
        //工作室列表
        this.getworkshop_list('/api/master/studio/index',{
            province:'520000',
            start:'0',
            limit:'10'
        });
        //项目
        this.getProject({
            module:'project'
        });
        //活动
        this.getActivity({
            module:'activity'
        });
        //课程
        this.getThinKresults({
            module:'course'
        });
        //课题
        this.getEvent({
            module:'event'
        });
        //成果
        this.getDiscussion({
            module:'discussion'
        });
    },
    //事件方法执行
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
        //智库看台
        itemsArticle: function (id){
            window.location.href =basePath+'/article/'+id
        },
        gzLook: function (){
            window.location.href =basePath+'/article/category/gz_look'
        },
        //工作室
        clickHref: function (id){
            window.location.href =basePath+'/mobile/studio/home/page/'+id
        },
        //工作室更多
        evenMore: function (){
            window.location.href =basePath+'/mobile/studio/list?province_id=520000'
        },
        //查看项目
        itemsProject: function (id){
            window.location.href =project+id
        },
        //查看活动
        itemsactivit: function (activityId,studioId){
            window.location.href =activit+'?activityId='+activityId+'&studioId='+studioId
        },
        //查看课程
        itemsCourse_set: function (id){
            window.location.href =basePath+'/course_set/'+id
        },
        //查看课题
        itemsSubject: function (studio_id,id){
            window.location.href =basePath+'/mobile/studio/'+studio_id+'/subject/'+id
        },
        //查看成果
        itemsResults: function (studio_id,id){
            window.location.href =basePath+'/mobile/studio/'+studio_id+'/results/'+id
        },
        getGzlook:function(url){
            var _this=this;
            axios.get(basePath+url,'')
                .then(function (response) {
                    if(response.status==200){
                        _this.portrait=response.data.cover;
                        _this.name=response.data.creator;
                        _this.time=response.data.createTime;
                        _this.title=response.data.title;
                        _this.picture=response.data.avatar;
                        _this.articleid=response.data.id;
                    }
                })
                .catch(function (error) {
                    console.log(error);
                });
        },
        getworkshop_list:function(url,data) {
            var _this=this;
            axios.get(basePath+url,{params:data})
                .then(function (response) {
                    var workshop=[];
                    var list=response.data.resources;
                    if(response.status==200){
                        list.forEach(function(value, index,array){
                            workshop.push({
                                id:list[index].id,
                                text:list[index].studio_name,
                                picture:list[index].largeCover,
                                headportrait:list[index].cover,
                                membership:list[index].user_num,
                                pageviews:list[index].hit_num,
                                describe:list[index].about,
                            });
                        });
                    }
                    _this.groceryList=workshop

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
                    if(response.status==200){
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
                                studio_id:list[index].studio_id,
                                id:list[index].id,
                                title:list[index].title,
                                titleing:list[index].title.substring(0,2),
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
                                studio_id:list[index].studio_id,
                                id:list[index].id,
                                title:list[index].title,
                                titleing:list[index].title.substring(0,2),
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
        getProject:function(data){
            var _this=this;
            axios.get(basePath+'/api/master/studio/module',{params:data})
                .then(function (response) {

                    var project=[];
                    var list=response.data.resources;
                    if(response.status==200){
                        list.forEach(function(value, index,array){
                            var status,statuscss
                            if (list[index].status==0) {
                                status='未开始'
                                statuscss='gz-wks'
                            }else if (list[index].status==1) {
                                status='进行中'
                                statuscss='gz-jxz'
                            }else if (list[index].status==2) {
                                status='已结束'
                                statuscss='gz-ywj'
                            }
                            project.push({
                                projectId:list[index].projectId,
                                title:list[index].title,
                                titleing:list[index].title.replace(/\“/g,'').substring(0,2),
                                status:status,
                                statuscss:statuscss,
                                createTime:list[index].createTime,
                                startTime:list[index].startTime,
                                studioName:list[index].studioName,
                                createUser:list[index].createUser,
                            })
                        });
                        _this.getproject=project;

                    }
                })
                .catch(function (error) {
                    console.log(error);
                });
        },
        getActivity:function(data){
            var _this=this;
            axios.get(basePath+'/api/master/studio/module',{params:data})
                .then(function (response) {
                    var activity=[];
                    var list=response.data.resources;
                    if(response.status==200){
                        console.log(list)
                        list.forEach(function(value, index,array){
                            var status,statuscss
                            if (list[index].status==1) {
                                status='未开始'
                                statuscss='gz-wks'
                            }else if (list[index].status==2) {
                                status='进行中'
                                statuscss='gz-jxz'
                            }else if (list[index].status==3) {
                                status='已结束'
                                statuscss='gz-ywj'
                            }
                            activity.push({
                                studioId:list[index].studioId,
                                activityId:list[index].activityId,
                                img:list[index].img,
                                status:status,
                                statuscss:statuscss,
                                title:list[index].title,
                                type:list[index].type,
                                createUser:list[index].createUser,
                                createDate:list[index].createDate,
                                memberNum:list[index].memberNum,
                            })
                        });
                        _this.getactivity=activity;
                        console.log(activity)
                    }
                })
                .catch(function (error) {
                    console.log(error);
                });
        },


    },
    //计算属性
    computed: {
        // 计算属性的 getter
        reversedMessage: function () {
            // `this` 指向 vm 实例
            return '计算属性'
        }
    },
});

