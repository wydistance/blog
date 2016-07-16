/**
 * Created by admin on 16/6/28.
 */
var MainLayer = BaseView.extend({
    ctor:function(){
        this._canTouch=false;//开启可透点击
        this._showbg=true;//开启背景
        this._showbgAcion=true;//主界面不需要弹出效果
        this._super();
        // var mainbg = new cc.Sprite(res.HelloWorld_png);
        // mainbg.attr({
        //     x:this.getContentSize().width/2,
        //     y:this.getContentSize().height/2,
        //     scale:1,
        //     ratation:0
        // });
        // mainbg.setAnchorPoint(cc.p(0.5,0.5));

        var root = ccs.load(res.MainScenejson).node;
        this.addChild(root);

        var startBtn = ccui.helper.seekWidgetByName(root ,"startGame");
        startBtn.addTouchEventListener(this.startBtnTouchEvent);
        this.startBtn = startBtn;

        var moreBtn = ccui.helper.seekWidgetByName(root,"moreGame");
        moreBtn.addTouchEventListener(this.moreBtnTouchEvent);
        this.moreBtn = moreBtn;

        return true;
    },
    startBtnTouchEvent:function (sender ,type ) {
        switch (type) {
            case ccui.Widget.TOUCH_BEGAN:
                //添加动画
                sender.setScale(0.8,0.8);
                var da = cc.scaleTo(0.5,1,1);
                da.easing(cc.easeIn(0.3));
                sender.runAction(da);
                break;
            case ccui.Widget.TOUCH_MOVED:
                break;
            case ccui.Widget.TOUCH_ENDED:
                cc.log("开始跳转");
                cc.director.runScene(new GameScene());
                break;
            case ccui.Widget.TOUCH_CANCELED:
                cc.log("loginButton Touch Canceled");
                break;
            default:
                break;
        }
    },
    moreBtnTouchEvent:function (sender,type) {
        switch (type) {
            case ccui.Widget.TOUCH_BEGAN:
                //添加动画
                sender.setScale(0.8,0.8);
                var da = cc.scaleTo(0.5,1,1);
                da.easing(cc.easeIn(0.3));
                sender.runAction(da);
                break;
            case ccui.Widget.TOUCH_MOVED:
                break;
            case ccui.Widget.TOUCH_ENDED:
                cc.log("显示更多的界面");


                break;
            case ccui.Widget.TOUCH_CANCELED:
                cc.log("loginButton Touch Canceled");
                break;
            default:
                break;
        }
    }
});


var mainScene = cc.Scene.extend({
    onEnter:function(){
        this._super();
        var layer = new MainLayer();
        this.addChild(layer);
    }
});