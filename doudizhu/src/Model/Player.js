/**
 * Created by admin on 16/6/29.
 */
var Player;
Player = cc.Class.extend({
    ctor: function () {
        //判断数据是否更新了
        this._paiArr = [];
        this._si = [];
        this._san = [];
        this._er = [];
        this._yi = [];
        this._da = [];
        this._isDiZhu = false;
        this._call = false;
        this._callNum = 0;
        this._outPk = true;
        this.type = 0;  // 表示玩家的类型
    },
    getIndexOfPai: function (index) {
        return this._paiArr[index];
    },
    getAllPai: function () {
        return this._paiArr;
    },
    //添加牌的方法
    addPai: function (pai) {
        if (Pai.isPai(pai)) {

            this._paiArr.push(pai);
        } else {
            cc.log("无效的牌,添加失败")
        }
    },
    addPaiArr: function (arr) {

        for (var i = 0; i < arr.length; i++) {
            if (Pai.isPai(arr[i])) {
                this._paiArr.push(arr[i]);
            }
        }

    },
    delPai: function (pai) {
        var index = this._paiArr.indexOf(pai);
        this._paiArr.splice(index, 1);
        this._dataCache = true;
    },
    delAllPai: function () {
        this._paiArr.splice(0, this._paiArr.length);
    },
    sortPai: function () {
        this._paiArr.sort(function (p1, p2) {
            return p1.getNum() - p2.getNum();
        });
    },
    getCount: function () {
        return this._paiArr.length;
    },
    showAllPai: function () {
        if (this._paiArr.length != 0) {
            for (var i in this._paiArr) {
                Pai.show(this._paiArr[i])
            }
        } else {
            Mlog.c("玩家手中没有牌")
        }
    },
    //是否为地主
    getDiZhu: function () {
        return this._isDiZhu;
    },
    setDiZhu: function (dizhu) {
        this._isDiZhu = dizhu;
    },
    //是否叫地主
    setCall: function (call) {
        this._call = call;
    },
    getCall: function () {
        return this._call;
    },
    //叫地主的分数
    setCallNum: function (callnum) {
        this._callNum = callnum;
    },
    getCallNum: function () {
        return this._callNum;
    },
    //是否出牌
    setOutPk: function (out) {
        this._outPk = out;
    },
    getOutPk: function () {
        return this._outPk;
    },
    // type 是基本类型值 1,2,3,4 ,num 是最小的一张牌的PValue
    getCanChu: function (type, num) {
        switch (type) {
            case 1: //单的 最少5个连续
                for (var i = 0; i < this._yi.length; i++) {
                    if(this._yi[i].getPValue() > num ){
                        var arr = [this._yi[i]];
                        cc.log(arr)
                        return arr;
                    }
                }
                break;
            case 2: // 双的 最少3个连续
                for (var i = 0; i < this._er.length; i++) {
                    if(this._er[i][0].getPValue() > num ){
                        return this._er[i];
                    }
                }
                break;
            case 3: // 三条  最少2个连续
                for (var i = 0; i < this._san.length; i++) {
                    if(this._san[i][0].getPValue() > num ){
                        return this._san[i];
                    }
                }

                break;
        }

    }


});
Player.create = function () {
    return new Player();
}

