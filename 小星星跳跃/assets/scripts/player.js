cc.Class({
    extends: cc.Component,

    properties: {
        
        jumpHeight: 0,
        jumpDuration: 0,
        maxMoveSpeed: 0,
        accel:0,
    },

    // use this for initialization
    onLoad: function () {
        this.jumpAction = this.setJumpAction();
        this.node.runAction(this.jumpAction);
        
        this.accLeft = false;
        this.accRight = false;
        
        this.xSpeed = 0;
        this.setInputControl()
    },
    
    setJumpAction:function(){
        var jumpUp = cc.moveBy(this.jumpDuration, cc.p(0,this.jumpHeight)).easing(cc.easeCubicActionOut());
        
        var jumpDown = cc.moveBy(this.jumpDuration,cc.p(0,-this.jumpHeight)).easing(cc.easeCubicActionIn());
    
        return cc.repeatForever(cc.sequence(jumpUp,jumpDown));
    },
    setInputControl:function(){
        var self = this;
        cc.eventManager.addListener({
            event:cc.EventListener.KEYBOARD,
            onKeyPressed:function(keyCode,event){
                switch(keyCode){
                    case cc.KEY.a:
                        self.accLeft = true;
                        self.accRight = false;
                        break;
                    case cc.KEY.d:
                        self.accLeft = false;
                        self.accRight = true;
                        break;
                }
            },
            
            onKeyReleased:function(keyCode,event){
                switch(keyCode){
                    case cc.KEY.a:
                        self.accLeft = false;
                        break;
                    case cc.KEY.d:
                        self.accRight = false;
                        break;
                }
            }
            
        },self.node);
    },
    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        if(this.accLeft){
            this.xSpeed -= this.accel * dt;
        } else if (this.accRight){
            this.xSpeed += this.accel * dt;
        }
        
        if (Math.abs(this.Xspeed) > this.maxMoveSpeed){
            this.xSpeed = this.maxMoveSpeed * this.xSpeed / Math.abs(this.xSpeed)
        }
        
        this.node.x += this.xSpeed * dt;
    },
});
