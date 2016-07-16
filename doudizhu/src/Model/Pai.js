/**
 * Created by zhaoyang on 16/6/29.
 */
//定义每一张的牌,保存花色和数值信息
//花色 : 1-4 分别表示 ♠️,♣️,❤️,♦️ ,大小王没有花色 用0表示
//数值: 1-13 表示从到3 ,1:大王,2:小王

var Pai = cc.Class.extend({
    ctor:function(huase,num){
        this.huase = huase ;
        this.value = num;
        this._chuStatus = false;
    },
    setHuase:function (huase) {
        this.huase = huase;
    },
    getHuaSe:function () {
        return this.huase;
    },
    setPValue:function (num) {
        this.value = num;
    },
    getPValue:function () {
        return this.value;
    },
    getNum:function () {
        if(this.huase != 0){
            return 100+(this.value-1)*4+this.huase;
        }else{
            return this.value;
        }
    },
    getChu :function () {
        return this._chuStatus;
    },
    setChu:function (stu) {
        this._chuStatus = stu;
    }
});

Pai.create = function (huase,num) {
    return new Pai(huase,num);
}

Pai.isPai=function (pai) {
    if(!isNaN(pai.huase) && !isNaN(pai.value)  ){
        if(pai.huase >=0 && pai.huase <=4 && pai.value >=1 && pai.value <= 15 ){
            return true;
        }
    }
    return false ;
}
Pai.show = function (pai) {
    Mlog.c("当前的牌是:"+pai.getNum());
}

