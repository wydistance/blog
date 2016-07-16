 /**
 * Created by admin on 16/6/29.
 */

 var OPENLOGFLAG = true;

 var Mlog = function () {
     this.flag = 0;
 }

 //正常输出
 Mlog.c = function(){
     var bakLog = cc._cocosplayerLog || cc.log || log;
     if(OPENLOGFLAG==true)
     {
         bakLog.call(this,"gamelog:" + cc.formatStr.apply(cc, arguments));
     }
 };
 //错误输出
 Mlog.e = function(){
     var bakLog = cc._cocosplayerLog || cc.log || log;
     if(OPENLOGFLAG==true)
     {
         bakLog.call(this, "gamelog_ERROR:" + cc.formatStr.apply(cc, arguments));
     }
 };
 