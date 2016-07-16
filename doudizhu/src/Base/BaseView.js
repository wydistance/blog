/**
 * Created by admin on 16/6/28.
 * 定义一个基类，该类是所有layer的父类
 */

var BaseView = cc.Layer.extend({
    _bgFrame:null,
    _canTouch:false,
    _showbg:false,
    _showbgAcion:false,
    ctor: function (resPath) {
        var size = cc.winSize;
        this._super();
        if(this._showbg == true){
            var bgFrame = new cc.LayerColor(cc.color(0,0,0,200),size.width,size.height)
            this.addChild(bgFrame,0,"bgFrame");
            this._bgFrame = bgFrame;
            this.setAnchorPoint(cc.p(0.5,0.5));
            this.ignoreAnchorPointForPosition(false);
            this.setContentSize(size);
            this.setPosition(cc.p(size.width/2,size.height/2));
        }
        if(this._canTouch == true ){
            cc.eventManager.addListener({
                event:cc.EventListener.TOUCH_ONE_BY_ONE,
                swallowTouches:true,
                onTouchBegan : function(){
                    return true;
                },
                onTouchMoved : function(){
                    cc.log("moved ... ")
                },onTouchEnded : function(){
                    cc.log("ended .. ")
                }

            },this)
        }
        //开启窗口打开特效
        if(this._showbgAcion == true){
            var obj = this ;
            obj.setScale(0.8);
            if(obj != null  ){

                var sl2 = new cc.ScaleTo(0.15,1);
                sl2.easing(cc.easeIn(1.5))
                obj.runAction(sl2);
            }
        }


    },
    setBgColor :function(color){
        this._bgFrame.setColor(color);
    },
    onEnter: function () {
        this._super();
    },
    onExit: function () {
        this._super();
    },
    getNodeByName:function(name){
        if(this._root != null ){
            return ccui.helper.seekWidgetByName(this._root,name);
        }else{
            Mlog.e("根节点没有" + name +"的节点");
            return null;
        }
    },
    loadCocos:function (path) {

        return ccs.load(res.MainScenejson).node;
    }
    
});
BaseView.create = function (resPath) {
    return new BaseView(resPath);
}

