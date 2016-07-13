cc.Class({
    extends: cc.Component,

    properties: {
        // 引用了星星的预制资源
        starPrefab: {
            default:null,
            type : cc.Prefab
        },
        //星星的消失时间范围
        maxStarDuration:0,
        minStarDuration:0,
        // 地面节点 
        ground:{
            default: null,
            type: cc.Node 
        },
        //player 节点 用于获取猪脚弹跳高度 ，和控制猪脚行动开关
        player: {
            default: null,
            type: cc.Node 
        },
        scoreDisplay: {
            default: null,
            type: cc.Label 
        }
    },

    // use this for initialization
    onLoad: function () {
        this.groundY = this.ground.y + this.ground.height /2;
        this.score = 0;
        this.timer = 0;
        this.starDuration = 0;
        
        this.spwanNewStar();
        
        
        
    },
    spwanNewStar: function(){
        var newStar = cc.instantiate(this.starPrefab);
        
        this.node.addChild(newStar);
        
        newStar.setPosition(this.getNewStartPosition());
        newStar.getComponent("star").game = this;
        
        this.starDuration = this.minStarDuration + cc.random0To1()*(this.maxStarDuration - this.minStarDuration);
        this.timer =0;
    },
    getNewStartPosition: function(){
        var randX = 0;
        
        var randY = this.groundY + Math.random() * this.player.getComponent('player').jumpHeight +50;
        // var randY = 100;
        var maxX = this.node.width/2;
        
        randX = cc.randomMinus1To1()*maxX;
        return cc.p(randX,randY);
    },

    
    update: function (dt) {
        if(this.timer > this.starDuration){
            this.gameOver();
            return ;
        }
        this.timer += dt;
    },
    
    gainScore: function(){
        this.score +=1;
        this.scoreDisplay.string = "Score: " + this.score.toString();
    },
    gameOver: function(){
        this.player.stopAllActions();
        cc.director.loadScene("game");
    }
});
