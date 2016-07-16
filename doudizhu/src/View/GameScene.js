/**
 * Created by admin on 16/6/30.
 */
var PLAYER = {
    bplayer: 1,
    rPlayer: 2,
    lPlayer: 3
}
var GameView = BaseView.extend({
    ctor: function () {
        var self = this;
        this._canTouch = false;//开启可透点击
        this._showbg = true;//开启背景
        this._showbgAcion = true;//主界面不需要弹出效果
        this._chupaiArr = new Player();//保存玩家准备出的牌  所有的玩家共用
                                      //也就是说每一个玩家用完之后必须清空相应的信息
        this._nextPaiArr = new Player(); // 保存上一个玩家出的牌 所有玩家共用
        this._super();
        var root = ccs.load(res.GameScenejson).node;
        this.addChild(root);
        this._root = root;
        this.initView(this._root)
        this._iCallTime = 0;
        cc.spriteFrameCache.addSpriteFrames(res.GameScene_ttf0pt, res.GameScene_ttf0pg);
        cc.spriteFrameCache.addSpriteFrames(res.GameScene_cardListpt, res.GameScene_cardListpg);
        return true;
    },
    initView: function (node) {

        var self = this;
        this._startChu = false;
        var head_dz_l = ccui.helper.seekWidgetByName(this._root, "head_dz_l");
        var head_dz_r = ccui.helper.seekWidgetByName(this._root, "head_dz_r");
        var head_dz_b = ccui.helper.seekWidgetByName(this._root, "head_dz_b");
        head_dz_l.setVisible(false);
        head_dz_r.setVisible(false);
        head_dz_b.setVisible(false);

        var fenshu_l = this.getNodeByName("fenshu_l");
        fenshu_l.setString("1000");
        var fenshu_r = this.getNodeByName("fenshu_r");
        fenshu_r.setString("1000");
        var fenshu_b = this.getNodeByName("fenshu_b");
        fenshu_b.setString("1000");
        this._fenBtn = [];
        var yifenBtn = this.getNodeByName("yifenBtn");
        var erfenBtn = this.getNodeByName("erfenBtn");
        var sanfenBtn = this.getNodeByName("sanfenBtn");
        var bujiaoBtn = this.getNodeByName("bujiaoBtn");
        // bujiaoBtn.setVisible(false);
        this._fenBtn.push(yifenBtn, erfenBtn, sanfenBtn, bujiaoBtn);
        for (var i in this._fenBtn) {
            this._fenBtn[i].setVisible(false);
        }
        var paiCount_l = this.getNodeByName("paiCount_l");
        var paiCount_r = this.getNodeByName("paiCount_r");
        this._paiCount_r = paiCount_r;
        this._paiCount_l = paiCount_l;
        paiCount_l.setString("");
        paiCount_r.setString("");
        var paiPanle_b = this.getNodeByName("paiPanle_b");
        var chosePanle = this.getNodeByName("chosePanle");
        chosePanle.setVisible(false);
        this._chosePanle = chosePanle;
        this._paiPanle_b = paiPanle_b;
        //获取默认牌的坐标
        var backbig_d = this.getNodeByName("backbig_d");
        backbig_d.setVisible(false);

        this._leftPanle = this.getNodeByName("leftPanel");
        this._rightPanle = this.getNodeByName("rightPanel");
        this._bottomPanel = this.getNodeByName("bottomPanel");
        //给准备按钮添加点击事件
        var zhunbeiBtn = this.getNodeByName("zhunbeiBtn");
        zhunbeiBtn.addClickEventListener(function (sender) {
            zhunbeiBtn.setVisible(false);
            //创造牌并洗牌
            self.createAllPai();
            // 开始发牌
            Mlog.c("GameScene: 开始发牌");
            self.fapai();
            self.createDizhu()
        })
        // cc.SpriteFrameCache.getInstance().addSpriteFrames(res.GameScene_ttf0pt);

        //给出牌的几个按钮添加点击事件
        this.registerClickPai();
        this.scheduleUpdate();
    },
    registerClickPai: function () {
        var self = this;
        var buchu = this.getNodeByName("buchu");
        var chongxuan = this.getNodeByName("chongxuan");
        var tishi = this.getNodeByName("tishi");
        var chupai = this.getNodeByName("chupai");
        this._buchu = buchu;
        this._chongxuan = chongxuan;
        this._tishi = tishi;
        this._chupai = chupai;
        this._tishi.removeFromParent()
        buchu.addClickEventListener(function (sender) {
            var sp = new cc.Sprite("#ttf_pass_card.png");
            var tipPanle = self.getNodeByName("tipPanle");
            tipPanle.addChild(sp);
            self.tipPanle = tipPanle;
            var callc = new cc.callFunc(function () {
                self.tipPanle.removeAllChildren();
                self.tipPanle.setVisible(false);
                self._rightPlayer.setOutPk(false);
                self._chosePanle.setVisible(false);
                self._bPlayer.setOutPk(true);
            }, self);
            var delay = new cc.DelayTime(2)
            var seq = cc.sequence(delay, callc);
            tipPanle.runAction(seq);
            cc.log("不出")
        });
        chongxuan.addClickEventListener(function (sender) {
            cc.log("重选");
            self._chupaiArr.sortPai();
            for (var i = 0; i < self._chupaiArr.getCount(); i++) {
                var pai = self._chupaiArr.getIndexOfPai(i);
                pai.setChu(false);
                var node = self._paiPanle_b.getChildByTag(pai.getNum());
                node.setPositionY(node.getPositionY() - 20);
            }
            self._chupaiArr.delAllPai();

        });
        tishi.addClickEventListener(function (sender) {
            cc.log("提示");
        });
        chupai.addClickEventListener(function (sender) {
            cc.log("出牌");
            self._chupaiArr.sortPai();
            var paixing = PaiUtils.PanDuanPaiXing(self._chupaiArr);
            if (paixing != CARD_TYPE.ERROR_CARD) {
                if (self._nextPaiArr.getCount() == 0) { // 如果上家没有出牌 说明玩家是地主还是第一次出牌,可以出任何类型的牌
                   cc.log("上家没有出牌")
                    for (var i = 0; i < self._chupaiArr.getCount(); i++) {
                        var pai = self._chupaiArr.getIndexOfPai(i);
                        self._bPlayer.delPai(pai);
                        //把玩家手中的牌 放入出牌区域
                        var node = self._paiPanle_b.getChildByTag(pai.getNum());
                        node.retain();
                        self._paiPanle_b.removeChildByTag(pai.getNum());
                        // -- 3秒后删除出的牌
                        var hide = cc.hide();
                        var seq = cc.sequence(cc.delayTime(3), hide);
                        node.runAction(seq);
                        self.addChild(node, i, pai.getNum());
                        node.setPosition(cc.p(cc.winSize.width / 2 - 200 + 30 * i, cc.winSize.height / 2 - 80));
                        cc.log("出牌..")
                    }
                    // 更新 ui
                    var startPosX;
                    if (self._bPlayer.getCount() < 17) {
                        self._resetoffX = self._paiPanle_b.getContentSize().width / 18;
                        startPosX = self._paiPanle_b.getContentSize().width / 2 - (self._resetoffX * self._bPlayer.getCount()) / 2;
                    } else {
                        self._resetoffX = self._paiPanle_b.getContentSize().width / 21;
                        startPosX = 0;
                    }

                    for (var i = 0; i < self._bPlayer.getCount(); i++) {
                        var pai = self._bPlayer.getIndexOfPai(i);
                        var node = self._paiPanle_b.getChildByTag(pai.getNum());
                        node.setPositionX(startPosX + self._resetoffX * i);
                    }
                    //此时玩家已经完成了出牌动作,
                    // -- 成为了上家,把玩家出的牌付给上家数组
                    // -- 清空自己的出牌数组,供后面出牌
                    self._nextPaiArr.addPaiArr(self._chupaiArr._paiArr.concat());
                    self._nextPlayer = PLAYER.bplayer;
                    self._chupaiArr.delAllPai();

                    self._bPlayer.setOutPk(true);
                    self._rightPlayer.setOutPk(false);

                    return;
                } else {



                    //玩家的上家出了牌 ,就根据上家的牌,判断牌型
                    //1 判断出的牌是否大于上家的牌  大于 出牌 , 小于或者等于就重置
                    var nextXing = PaiUtils.PanDuanPaiXing(self._nextPaiArr);
                    var m_paixing = PaiUtils.PanDuanPaiXing(self._chupaiArr);
                    //如果其他两家都不要 就自己出任何牌型 不用判断
                    if (self._nextPlayer == PLAYER.bplayer) {
                        //
                        cc.log("上家是自己");
                        for (var i = 0; i < self._chupaiArr.getCount(); i++) {
                            var pai = self._chupaiArr.getIndexOfPai(i);
                            self._bPlayer.delPai(pai);
                            //把玩家手中的牌 放入出牌区域
                            var node = self._paiPanle_b.getChildByTag(pai.getNum());
                            node.retain();
                            self._paiPanle_b.removeChildByTag(pai.getNum());
                            // -- 3秒后删除出的牌
                            var hide = cc.hide();
                            var seq = cc.sequence(cc.delayTime(3), hide);
                            node.runAction(seq);
                            self.addChild(node, i, pai.getNum());
                            node.setPosition(cc.p(cc.winSize.width / 2 - 200 + 30 * i, cc.winSize.height / 2 - 80));
                            cc.log("出牌..")
                        }
                        // 更新 ui
                        var startPosX;
                        if (self._bPlayer.getCount() < 17) {
                            self._resetoffX = self._paiPanle_b.getContentSize().width / 18;
                            startPosX = self._paiPanle_b.getContentSize().width / 2 - (self._resetoffX * self._bPlayer.getCount()) / 2;
                        } else {
                            self._resetoffX = self._paiPanle_b.getContentSize().width / 21;
                            startPosX = 0;
                        }

                        for (var i = 0; i < self._bPlayer.getCount(); i++) {
                            var pai = self._bPlayer.getIndexOfPai(i);
                            var node = self._paiPanle_b.getChildByTag(pai.getNum());
                            node.setPositionX(startPosX + self._resetoffX * i);
                        }
                        //设置 数据信息
                        self._nextPaiArr.delAllPai();
                        self._nextPaiArr.addPaiArr(self._chupaiArr._paiArr.concat());
                        self._nextPlayer = PLAYER.bplayer;
                        self._chupaiArr.delAllPai();

                        self._bPlayer.setOutPk(true);
                        self._rightPlayer.setOutPk(false);
                        return;

                    } else if (nextXing == m_paixing) {
                        cc.log("上家不是自己")
                        // 此处应该实现  判断大小的功能
                        var isBig = PaiUtils.panduan(m_paixing, self._chupaiArr, self._nextPaiArr);
                        if (isBig) {

                            for (var i = 0; i < self._chupaiArr.getCount(); i++) {
                                var pai = self._chupaiArr.getIndexOfPai(i);
                                self._bPlayer.delPai(pai);
                                //把玩家手中的牌 放入出牌区域
                                var node = self._paiPanle_b.getChildByTag(pai.getNum());
                                node.retain();
                                self._paiPanle_b.removeChildByTag(pai.getNum());
                                // -- 3秒后删除出的牌
                                var hide = cc.hide();
                                var seq = cc.sequence(cc.delayTime(3), hide);
                                node.runAction(seq);
                                self.addChild(node, i, pai.getNum());
                                node.setPosition(cc.p(cc.winSize.width / 2 - 200 + 30 * i, cc.winSize.height / 2 - 80));
                                cc.log("出牌..")
                            }
                            // 更新 ui
                            var startPosX;
                            if (self._bPlayer.getCount() < 17) {
                                self._resetoffX = self._paiPanle_b.getContentSize().width / 18;
                                startPosX = self._paiPanle_b.getContentSize().width / 2 - (self._resetoffX * self._bPlayer.getCount()) / 2;
                            } else {
                                self._resetoffX = self._paiPanle_b.getContentSize().width / 21;
                                startPosX = 0;
                            }

                            for (var i = 0; i < self._bPlayer.getCount(); i++) {
                                var pai = self._bPlayer.getIndexOfPai(i);
                                var node = self._paiPanle_b.getChildByTag(pai.getNum());
                                node.setPositionX(startPosX + self._resetoffX * i);
                            }
                            self._nextPlayer.delAllPai();
                            self._nextPaiArr.addPaiArr(self._chupaiArr._paiArr.concat());
                            self._nextPlayer = PLAYER.bplayer;
                            self._chupaiArr.delAllPai();

                            self._bPlayer.setOutPk(true);
                            self._rightPlayer.setOutPk(false);
                        }
                    }

                }

            }
        })
    },
    updatePlayerUI: function () {

    },
    createAllPai: function () {
        //创建一副牌 并返回
        var allPai = [];
        for (var i = 1; i < 5; i++) {
            for (var j = 1; j < 14; j++) {
                var pai = new Pai(i, j);
                allPai.splice(allPai.length, 0, pai)
            }
        }
        var p1 = new Pai(0, 1);
        var p2 = new Pai(0, 2);
        allPai.splice(allPai.length, 0, p1);
        allPai.splice(allPai.length, 0, p2);
        this._allPai = allPai;
        this.xiPai();

    },
    xiPai: function () {
        for (var i = 0; i < this._allPai.length; i++) {
            var random = Math.floor(Math.random() * 54)
            //对牌进行交换位置
            var temp = this._allPai[i];
            this._allPai[i] = this._allPai[random];
            this._allPai[random] = temp;
        }
        // Mlog.c(this._allPai);

    },
    fapai: function () {
        /*
         * 1、创建三个玩家
         * 2、把洗好的牌放入每一个玩家的数组里面
         */

        var leftPlayer = new Player();
        var rightPlayer = new Player();
        var bPlayer = new Player();

        for (var i = 0; i < this._allPai.length - 3; i++) {
            if (i % 3 == 0) {
                leftPlayer.addPai(this._allPai[i]);
            } else if (i % 3 == 1) {
                rightPlayer.addPai(this._allPai[i]);
            } else if (i % 3 == 2) {
                bPlayer.addPai(this._allPai[i]);
            }
        }
        leftPlayer.sortPai()
        rightPlayer.sortPai()
        bPlayer.sortPai()
        this._leftPlayer = leftPlayer;
        this._rightPlayer = rightPlayer;
        this._bPlayer = bPlayer;

        // PaiUtils.zhengliPlayerPai(this._leftPlayer);
        // PaiUtils.zhengliPlayerPai(this._rightPlayer);

        //根据model 更新ui
        // 添加顶部的三张牌

        this._fapaiNum = 0;
        this._dizhu = -1; //表示地主是谁 0: leftPlayer 1:bPlayer,2 rightPlayer
        this._dzNumArr = [false, false, false]; // 1,2,3 表示 一分,2分,三分,是否被叫过
        this.schedule(this.updatePlayerUI, 0.1, 16, 0);
        this.schedule(this.createDizhu)
    },
    updatePlayerUI: function () {
        //更新玩家的ui
        var self = this;
        var paiPanle_b = this.getNodeByName("paiPanle_b");
        this._paiPanle_b = paiPanle_b;
        var panleSize = this._paiPanle_b.getContentSize();
        this._paiPanleSize = panleSize;
        var xoff = panleSize.width / 18;
        //牌的偏移量
        this._resetoffX = xoff;
        this._paiCount_l.setString(this._fapaiNum + 1);
        this._paiCount_r.setString(this._fapaiNum + 1);
        var pai = this._bPlayer.getIndexOfPai(this._fapaiNum);
        var sp = this.getNodeByName("poke_" + pai.getNum());

        sp.setTag(pai.getNum());
        sp.setName(pai.getNum());
        sp.retain()
        sp.removeFromParent()
        sp.setAnchorPoint(cc.p(0, 0));
        sp.setPosition(cc.p(0 + this._fapaiNum * xoff, 0));
        this._paiPanle_b.addChild(sp, this._fapaiNum, pai.getNum().toString());
        sp.release()

        // cc.eventManager.addListener({
        //     event:cc.EventListener.TOUCH_ONE_BY_ONE,
        //         swallowTouches:true,
        //         onTouchBegan : function(touch ,event){
        //             var target = event.getCurrentTarget();
        //             var posInNode = target.convertToNodeSpace(touch.getLocation());
        //             var size = target.getContentSize();
        //             var rect = cc.rect(0,0,size.width,size.height);
        //             if(!(cc.rectContainsPoint(rect,posInNode)))
        //                 return false ;
        //
        //             // var pai = self._bPlayer.getIndexOfPai(self._fapaiNum);
        //             cc.log(pai.getNum(),sp.getTag())
        //             // var node = self._paiPanle_b.getChildByName(pai.getNum());
        //             if(pai.getChu()){
        //                 sp.setPositionY(sp.getPositionY()-20);
        //                 self._chupaiArr.delPai(pai);
        //                 pai.setChu(false)
        //             }else {
        //                 sp.setPositionY(sp.getPositionY()+20);
        //                 //向数组里面添加
        //                 self._chupaiArr.addPai(pai);
        //                 self._chupaiArr.showAllPai();
        //                 pai.setChu(true);
        //             }
        //
        //
        //             return true;
        //         },
        //         onTouchMoved : function(){
        //             //拖动选牌
        //         },onTouchEnded : function(){
        //
        //         }
        //
        // },sp)
        this._fapaiNum++;
    },
    createDizhu: function () {
        //如果牌发完了就产生地主,停止调度
        if (this._fapaiNum == 17) {
            this.unschedule(this.createDizhu)
            this.schedule(this.jiaoDizhu, 0.5)
            //停止调度
        }
        // this._bPlayer.sortPai();
    },
    jiaoDizhu: function () {
        var self = this;
        self.leftSize = self._leftPanle.getContentSize();

        self._iCallTime %= 3;
        // 0 :玩家 1:右 2: 左  [0 1 2 ] or [1 2 0 ] or [2 0 1]
        //没有地主就进行判断


        if (!self._bPlayer.getCall() || !self._rightPlayer.getCall() || !self._leftPlayer.getCall()) {
            switch (self._iCallTime) {
                case 0://玩家选择地主
                    var yifenBtn = self.getNodeByName("yifenBtn");
                    var erfenBtn = self.getNodeByName("erfenBtn");
                    var sanfenBtn = self.getNodeByName("sanfenBtn");
                    var bujiaoBtn = self.getNodeByName("bujiaoBtn");
                    if (self._bPlayer.getCall() == false) {
                        yifenBtn.setVisible(true);
                        erfenBtn.setVisible(true);
                        sanfenBtn.setVisible(true);
                        bujiaoBtn.setVisible(true);
                    }

                    yifenBtn.addClickEventListener(function () {
                        self._bPlayer.setCall(true);
                        self._bPlayer.setCallNum(1);
                        var sp = new cc.Sprite("#ttf_call_score_" + 1 + ".png");
                        sp.setTag(5);
                        var tipPanle = self.getNodeByName("tipPanle");
                        var size = tipPanle.getContentSize();
                        cc.log(size.width, size.height);
                        sp.setPosition(cc.p(size.width / 2, size.height / 2));
                        tipPanle.addChild(sp, 5, "call_score");
                        yifenBtn.setVisible(false);
                        erfenBtn.setVisible(false);
                        sanfenBtn.setVisible(false);
                        bujiaoBtn.setVisible(false);
                        self._iCallTime++;
                        self._dzNumArr[1] = true;
                    });
                    erfenBtn.addClickEventListener(function () {
                        self._bPlayer.setCall(true);
                        self._bPlayer.setCallNum(2);
                        var sp = new cc.Sprite("#ttf_call_score_" + 2 + ".png");
                        sp.setTag(5);
                        var tipPanle = self.getNodeByName("tipPanle");
                        var size = tipPanle.getContentSize();
                        cc.log(size.width, size.height);
                        sp.setPosition(cc.p(size.width / 2, size.height / 2));
                        tipPanle.addChild(sp, 5, "call_score");
                        yifenBtn.setVisible(false);
                        erfenBtn.setVisible(false);
                        sanfenBtn.setVisible(false);
                        bujiaoBtn.setVisible(false);
                        self._iCallTime++;
                        self._dzNumArr[1] = true;
                        self._dzNumArr[2] = true;
                    });
                    sanfenBtn.addClickEventListener(function () {
                        self._bPlayer.setCall(true);
                        self._bPlayer.setCallNum(3);
                        var sp = new cc.Sprite("#ttf_call_score_" + 3 + ".png");
                        sp.setTag(5);
                        var tipPanle = self.getNodeByName("tipPanle");
                        var size = tipPanle.getContentSize();
                        cc.log(size.width, size.height);
                        sp.setPosition(cc.p(size.width / 2, size.height / 2));
                        tipPanle.addChild(sp, 5, "call_score");
                        yifenBtn.setVisible(false);
                        erfenBtn.setVisible(false);
                        sanfenBtn.setVisible(false);
                        bujiaoBtn.setVisible(false);
                        self._dzNumArr = [true];
                        // 玩家是地主
                        self._dizhu = 0;
                        self._iCallTime++;
                        self._rightPlayer.setCall(true);
                        self._leftPlayer.setCall(true);
                    });
                    bujiaoBtn.addClickEventListener(function () {
                        self._bPlayer.setCall(true);
                        self._bPlayer.setCallNum(0);
                        var sp = new cc.Sprite("#ttf_call_score_" + 0 + ".png");
                        sp.setTag(5);
                        var tipPanle = self.getNodeByName("tipPanle");
                        var size = tipPanle.getContentSize();
                        cc.log(size.width, size.height);
                        sp.setPosition(cc.p(size.width / 2, size.height / 2));
                        tipPanle.addChild(sp, 5, "call_score");
                        yifenBtn.setVisible(false);
                        erfenBtn.setVisible(false);
                        sanfenBtn.setVisible(false);
                        bujiaoBtn.setVisible(false);
                        self._iCallTime++;
                    })
                    break;
                case 1:
                    //right  叫地主

                    var i = Math.floor(Math.random() * 4);
                    if (i == 0) {
                        var sp = new cc.Sprite("#ttf_call_score_" + 0 + ".png");
                        sp.setTag(5);
                        sp.setPosition(cc.p(60, 30));
                        self._rightPanle.addChild(sp, 5, "call_score");

                    } else {
                        while (self._dzNumArr[i] == true) {
                            i = Math.floor(Math.random() * 4 + 1);
                        }
                        if (i >= 3) {
                            i = 3;
                            self._dizhu = 1;
                            self._bPlayer.setCall(true);
                            self._leftPlayer.setCall(true);
                        }
                        var sp = new cc.Sprite("#ttf_call_score_" + i + ".png");
                        sp.setTag(5);
                        sp.setPosition(cc.p(60, 30));
                        self._rightPanle.addChild(sp, 5, "call_score");
                    }
                    self._dzNumArr[i] = true;
                    self._rightPlayer.setCall(true);
                    self._rightPlayer.setCallNum(i);
                    self._iCallTime++;
                    break;
                case 2:
                    // left 叫地主
                    var i = Math.floor(Math.random() * 4);
                    if (i == 0) {
                        var sp = new cc.Sprite("#ttf_call_score_" + i + ".png");
                        sp.setPosition(cc.p(self.leftSize.width - 60, 30));
                        sp.setTag(5);
                        self._leftPanle.addChild(sp, 5, "call_score");

                    } else {
                        while (self._dzNumArr[i] == true) {
                            i = Math.floor(Math.random() * 4 + 1);
                        }
                        if (i >= 3) {
                            i = 3;
                            self._bPlayer.setCall(true);
                            self._rightPlayer.setCall(true);
                            this._dizhu = 2;
                        }
                        var sp = new cc.Sprite("#ttf_call_score_" + i + ".png");
                        sp.setPosition(cc.p(self.leftSize.width - 60, 30));
                        sp.setTag(5);
                        self._leftPanle.addChild(sp, 5, "call_score");
                    }
                    self._dzNumArr[i] = true;
                    self._leftPlayer.setCall(true);
                    self._leftPlayer.setCallNum(i);
                    self._iCallTime++;

                    break;
            }
        } else {
            //已经产生了地主
            self._iCallTime = Math.floor(Math.random() * 3);

            this.unschedule(this.jiaoDizhu)

            var max = this._bPlayer.getCallNum();
            var index = 0;
            if (max < this._leftPlayer.getCallNum()) {
                max = this._leftPlayer.getCallNum();
                index = 2
            }
            if (max < this._rightPlayer.getCallNum()) {
                max = this._rightPlayer.getCallNum();
                index = 1
            }

            var head_dz_r = ccui.helper.seekWidgetByName(this._root, "head_dz_r");
            var head_dz_b = ccui.helper.seekWidgetByName(this._root, "head_dz_b");
            switch (index) {
                case 0:
                    //玩家
                    this.getNodeByName("head_nm_b").setVisible(false);
                    this.getNodeByName("head_dz_b").setVisible(true);
                    this._bPlayer.setDiZhu(true);
                    this.addPaiForDiZhu();

                    break;
                case 1:
                    //右
                    this.getNodeByName("head_nm_r").setVisible(false);
                    this.getNodeByName("head_dz_r").setVisible(true);
                    this._rightPlayer.setDiZhu(true);
                    this.addPaiForDiZhu();
                    break;
                case 2: //左
                    this.getNodeByName("head_nm_l").setVisible(false);
                    this.getNodeByName("head_dz_l").setVisible(true);
                    this.addPaiForDiZhu();
                    this._leftPlayer.setDiZhu(true);
                    break;
            }

        }

    },
    addPaiForDiZhu: function () {
        var player, text;
        if (this._dizhu == 0) {

            player = this._bPlayer;
            // player.setChu(false);
            text = null;
            player.addPai(this._allPai[51]);
            player.addPai(this._allPai[52]);
            player.addPai(this._allPai[53]);
            player.sortPai();
            player.showAllPai();
            player.setOutPk(false);
            var p1 = this._allPai[53].getNum();
            var p2 = this._allPai[52].getNum();
            var p3 = this._allPai[51].getNum();
            var panleSize = this._paiPanle_b.getContentSize();
            var Xoff = panleSize.width / 21;
            this._paiPianYi = Xoff;

            for (var i = 0; i < player.getCount(); i++) {
                var sp4;
                var paiNum = this._bPlayer.getIndexOfPai(i).getNum();
                if (paiNum != p1 && paiNum != p2 && paiNum != p3) {
                    sp4 = this._paiPanle_b.getChildByName(paiNum);
                    sp4.setLocalZOrder(i);
                    sp4.setPosition(cc.p(0 + i * Xoff, 0))
                    sp4.setName(paiNum);
                    sp4.setTag(paiNum);
                } else {
                    sp4 = this.getNodeByName("poke_" + paiNum);
                    sp4.retain();
                    sp4.removeFromParent();
                    sp4.setName(paiNum);
                    sp4.setTag(paiNum);
                    sp4.setAnchorPoint(cc.p(0, 0));
                    sp4.setPosition(cc.p(0 + i * Xoff, 0));
                    sp4.setScale(0.7)
                    sp4.setVisible(true)
                    this._paiPanle_b.addChild(sp4, i, paiNum);
                    sp4.setLocalZOrder(i)
                    sp4.release()
                }

            }
        }
        if (this._dizhu == 1) {
            player = this._rightPlayer;
            text = this._paiCount_r;
        }
        if (this._dizhu == 2) {
            player = this._leftPlayer;
            text = this._paiCount_l;
        }

        if (player && this._dizhu != 0) {
            player.addPai(this._allPai[51]);
            player.addPai(this._allPai[52]);
            player.addPai(this._allPai[53]);
            player.sortPai();
            player.setOutPk(false);
        }
        if (text)
            text.setString(20);
        var top1 = this.getNodeByName("top_pai1");
        var top2 = this.getNodeByName("top_pai2");
        var top3 = this.getNodeByName("top_pai3");
        var topPos1 = top1.getPosition();
        var topPos2 = top2.getPosition();
        var topPos3 = top3.getPosition();
        var parent = top1.getParent();
        top1.removeFromParent()
        top2.removeFromParent()
        top3.removeFromParent()

        var self = this;
        //删除 所叫的分数精灵
        var i = 0;
        this.schedule(function () {
            var pai = this._bPlayer.getIndexOfPai(i);
            var sp = this._paiPanle_b.getChildByTag(pai.getNum())
            cc.eventManager.addListener({
                event: cc.EventListener.TOUCH_ONE_BY_ONE,
                swallowTouches: true,
                onTouchBegan: function (touch, event) {
                    var target = event.getCurrentTarget();
                    var posInNode = target.convertToNodeSpace(touch.getLocation());
                    var size = target.getContentSize();
                    var rect = cc.rect(0, 0, size.width, size.height);
                    if (!(cc.rectContainsPoint(rect, posInNode)))
                        return false;
                    // var pai = self._bPlayer.getIndexOfPai(self._fapaiNum);
                    cc.log(pai.getNum(), sp.getTag())
                    // var node = self._paiPanle_b.getChildByName(pai.getNum());
                    if (pai.getChu()) {
                        sp.setPositionY(sp.getPositionY() - 20);
                        self._chupaiArr.delPai(pai);
                        pai.setChu(false)
                    } else {
                        sp.setPositionY(sp.getPositionY() + 20);
                        //向数组里面添加
                        self._chupaiArr.addPai(pai);
                        self._chupaiArr.showAllPai();
                        pai.setChu(true);
                    }
                    return true;
                },
                onTouchMoved: function () {
                    //拖动选牌
                }, onTouchEnded: function () {

                }

            }, sp)
            i++;
        }, 1 / 60, 19);
        this.scheduleOnce(function () {
            var tipPanle = self.getNodeByName("tipPanle");
            tipPanle.removeChildByTag(5);
            self._leftPanle.removeChildByTag(5);
            self._rightPanle.removeChildByTag(5);
            // this._chosePanle.setVisible(true);
            this._startChu = true; // 可以开始出牌了
            self._paiPanle_b.setLocalZOrder(0);


            // cc.eventManager.addListener({
            //     event:cc.EventListener.TOUCH_ONE_BY_ONE,
            //     swallowTouches:false,
            //     onTouchBegan : function(touch ,event){
            //         var target = event.getCurrentTarget();
            //         var posInNode = target.convertToNodeSpace(touch.getLocation());
            //         var size = target.getContentSize();
            //         var rect = cc.rect(0,0,size.width,size.height);
            //         if(!(cc.rectContainsPoint(rect,posInNode)))
            //             return false ;
            //
            //         var pai  = self.paiOfIndex(posInNode);
            //         var node = self._paiPanle_b.getChildByName(pai.getNum());
            //         if(pai.getChu()){
            //             node.setPositionY(node.getPositionY()-20);
            //             self._chupaiArr.delPai(pai);
            //             pai.setChu(false)
            //         }else {
            //             node.setPositionY(node.getPositionY()+20);
            //             //向数组里面添加
            //             self._chupaiArr.addPai(pai);
            //             self._chupaiArr.showAllPai();
            //             pai.setChu(true);
            //         }
            //
            //
            //         return true;
            //     },
            //     onTouchMoved : function(){
            //         //拖动选牌
            //     },onTouchEnded : function(){
            //
            //     }
            //
            // },self._paiPanle_b);
        }, 2)


    },
    paiOfIndex: function (point) {
        var widthPanle = this._paiPanle_b.getContentSize().width
        var paiWidth = widthPanle / (this._bPlayer.getCount() + 1)
        var index = Math.floor(point.x / paiWidth);
        if (this._dizhu == 0) {
            index = index > 19 ? 19 : index;
        } else {
            index = index > 16 ? 16 : index;
        }

        this._bPlayer.sortPai()
        return this._bPlayer.getIndexOfPai(index);
    },
    update: function () {
        if (this._startChu) {
            var npc1 = this._rightPlayer;
            var npc2 = this._leftPlayer;
            var player = this._bPlayer;

            // 判断是否胜利
            if (player.getCount() == 0 || npc1.getCount() == 0 || npc2.getCount() == 0) {

                this.unscheduleUpdate();
                if (player.getCount() == 0) {
                    cc.log("玩家获得胜利");
                } else {
                    cc.log("电脑获得胜利");
                }

            } else {
                if (!player.getOutPk()) {

                    this._chosePanle.setVisible(true)
                    cc.log("玩家出牌");
                    // this._bPlayer.setOutPk(true);
                    // this._rightPlayer.setOutPk(false);
                    // npc1.setOutPk(true);
                    // npc2.setOutPk(true);
                }
                if (!npc1.getOutPk()) {
                    //此处填写右边玩家的逻辑
                    cc.log("右边电脑出牌")
                    this._rightPlayer.type = 1;
                    // this.NPCOutPoke(1);
                    this._rightPlayer.setOutPk(true);
                    this._leftPlayer.setOutPk(false);

                }
                if (!npc2.getOutPk()) {
                    //此处填写右边玩家的逻辑
                    cc.log("左电脑出牌")
                    // npc2.setOutPk(true);
                    this._leftPlayer.type=0;
                    // this.NPCOutPoke(0);

                    this._leftPlayer.setOutPk(true);
                    this._bPlayer.setOutPk(false);

                }
            }


        }

    },
    NPCOutPoke: function (name) {
        var NPC= [this._leftPlayer,this._rightPlayer];
        var player = NPC[name];
        // this._chupaiArr = new Player();//保存玩家准备出的牌  所有的玩家共用
        // //也就是说每一个玩家用完之后必须清空相应的信息
        // this._nextPaiArr = new Player(); // 保存上一个玩家出的牌 所有玩家共用
        var preCount = this._nextPaiArr.getCount();
        if(preCount == 0){ // 说明第一个出牌
            //生成一手牌 放到chupaiArr 的player里面
            //根据random 出牌
            var random = Math.floor(Math.random()* 3 +1);
            if(random ==1){
                if(player._yi.length == 0){ // 没有单牌
                    random = 2;
                }else { // 有就找最小的出
                    this._chupaiArr.addPai(player._yi[0]);
                }
            }else if (random ==2){
                if(player._er.length == 0){ // 没有对子
                    random = 3;
                }else { // 有就找最小的出
                    this._chupaiArr.addPaiArr(player._er[0]);
                }
            }else if (random == 3){
                if(player._san.length == 0){ // 没有三个
                    //出大牌
                    // cc.log()
                    random =1 ;
                }else { // 有就找最小的出
                    this._chupaiArr.addPaiArr(player._san[0]);
                }
            }

            var xing = PaiUtils.PanDuanPaiXing(this._chupaiArr);
            if(xing != CARD_TYPE.ERROR_CARD){
                //出牌
                cc.log("chupai ")
            }

        }else{ // 上家有牌
             var paixing = PaiUtils.PanDuanPaiXing(this._nextPaiArr);

             if(paixing <=4 ){ // 可以要
                 if(paixing == 1){
                     var num = this._nextPaiArr.getIndexOfPai(0).getPValue();
                     var arr = player.getCanChu(1,num);
                     cc.log(player);
                     this._chupaiArr.addPaiArr(arr);
                 }else if(paixing == 2){
                     var num = this._nextPaiArr.getIndexOfPai(0).getPValue();
                     var arr = player.getCanChu(2,num);
                     this._chupaiArr.addPaiArr(arr);
                 }else if (paixing =3 ){
                     var num = this._nextPaiArr.getIndexOfPai(0).getPValue();
                     var arr = player.getCanChu(3,num);
                     cc.log(arr);
                     this._chupaiArr.addPaiArr(arr);
                 }

             }   else { // 不要

             }
        }
        
        //  进行处理所有的 出牌数据
        this._chupaiArr.showAllPai();

    },
    // 返回固定类型的一个牌
    getPaiArr: function ( type ) {
        var random = Math.floor(Math.random()* 3 +1);
        var paiNum = type == 0 ? random : type ;
        switch (type ){
            case 1:
                cc.log("单")
                
                break;
            case 2:
                // 先看看有连对儿,没有就出最小的对子
                cc.log("对子")
                break;
            case 3:
                // 先看看有没有飞机,没有就出最小的一个
                cc.log("三带")
                break;
        }
    }


});

var GameScene = cc.Scene.extend({
    onEnter: function () {
        this._super();
        var layer = new GameView();
        this.addChild(layer);
    }
})