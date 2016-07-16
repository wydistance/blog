/**
 * Created by admin on 16/6/29.
 * 里面存放的是相关的全局静态信息 
 */

var CARD_TYPE = {
    SINGLE_CARD :1,		                //单牌- 1
    DOUBLE_CARD:2,			            //对子- 2
    THREE_CARD:3,				        //3不带- 3
    BOMB_CARD:4,				        //炸弹   2
    THREE_ONE_CARD:5,			        //3带1- 4
    THREE_TWO_CARD:6,			        //3带2- 5
    BOMB_TWO_CARD:7,			        //四个带2张单牌    6        3种情况   四个在左,四个在右,四个在中间
    BOMB_TWOOO_CARD:8,		            //四个带2对            8   3种情况    四个在左,四个在右,四个在中间
    CONNECT_CARD:9,			            //连牌-                5---12
    COMPANY_CARD:10,			        //连队-             6-20
    AIRCRAFT_CARD:11,			//飞机不带-         6--
    AIRCRAFT_SINGLE_CARD:12,	//飞机带单牌-       8--
    AIRCRAFT_DOBULE_CARD:13,	//飞机带对子-       10--
    ERROR_CARD:-1				//错误的牌型
}
//分析牌型的时候使用 
var card_index = {
    single_index :[], //存放单张 数值
    duble_index:[],   //两张 数值
    three_index:[],   //三张 数值
    four_index:[]     //四张 数值 
}

var PaiXing = function () {
    this.cardtype =0,
    this.vec = []
}




var PaiUtils = {
    IsLianPai :function (player) {
        var length = player.getCount();
        for(var i=0;i<length-1;i++){
            if(player.getIndexOfPai(i).getNum() <= 104 ) return false;
        }
        for(var i=0;i<length-1;i++){
            var pk = player.getIndexOfPai(i);
            var pk1 = player.getIndexOfPai(i+1);

            if(pk.getPValue()+1 != pk1.getPValue() ) return false;
        }
        return true;
    },
    IsLianDui :function (player) {
        var length = player.getCount();
        for(var i=0;i<length-1;i++){
            if(player.getIndexOfPai(i).getNum() <= 104 ) return false;
        }
        if(length < 6 && length%2 != 0) return false;

        for(var i=0; i<length-2;i+=2){
            var pk = player.getIndexOfPai(i);

            var pk1 = player.getIndexOfPai(i+2);
            if(pk.getPValue()+1 != pk1.getPValue()) return false ;
        }

        return true;
    },
    fenxiPai:function (player) {
        var length = player.getCount();
        card_index.single_index.splice(0,card_index.single_index.length);
        card_index.duble_index.splice(0,card_index.duble_index.length);
        card_index.three_index.splice(0,card_index.three_index.length);
        card_index.four_index.splice(0,card_index.four_index.length);

        for(var i=0;i<length;){
            var time =0;
            var pk = player.getIndexOfPai(i)
            for(var j=i;j<length;++j){
                var pk1 = player.getIndexOfPai(j);
                if(pk.getPValue() == pk1.getPValue()){
                    ++time;
                    ++i;
                }else if(pk.getNum() <3 && pk1.getNum()<3){
                    ++time;
                    ++i;
                }
            }

            if(time ==1){
                card_index.single_index.push(pk.getPValue());
            }
            else if (time ==2 ){
                card_index.duble_index.push(pk.getPValue());
            }
            else if (time ==3){
                card_index.three_index.push(pk.getPValue());
            }
            else if (time == 4){
                card_index.four_index.push(pk.getPValue());
            }
        }

        cc.log(card_index);
    },
    isFeiJI:function (arr) {
        for(var i=0;i<arr.length-1;i++){
            if(arr[i]+1 != arr[i+1] || arr[i+1] <= 1){
                return false;
            }
        }
        return true;
    },
    isOtherPai:function (player) {
        var length = player.getCount();
        this.fenxiPai(player);

        if(card_index.three_index.length*3+card_index.duble_index.length*2 == length
                && card_index.three_index.length==1 && card_index.duble_index.length == 1
        ){
            cc.log("三带一对儿");
            return CARD_TYPE.THREE_ONE_CARD;
        }

        //判断飞机
        if(card_index.three_index.length>1 && card_index.four_index.length == 0 && this.isFeiJI(card_index.three_index)
        ){

            if(card_index.three_index.length*3 == length ){
                cc.log("飞机,不带")
                return CARD_TYPE.AIRCRAFT_CARD;
            }
            if(card_index.three_index.length*3+card_index.single_index.length == length){
                cc.log("飞机带单")
                return CARD_TYPE.AIRCRAFT_SINGLE_CARD;
            }
            if(card_index.three_index.length*3+card_index.duble_index.length*2 == length){
                cc.log("飞机带对儿")
                return CARD_TYPE.AIRCRAFT_DOBULE_CARD;
            }

        }
        //判断四带
        if(card_index.three_index.length == 0 && card_index.four_index.length == 1 && length%2 == 0){
            if(card_index.four_index.length*4 + card_index.single_index.length == length
                    && card_index.four_index.length==1 && card_index.single_index.length==2)
            {
                    cc.log("四带单")
                return CARD_TYPE.BOMB_TWO_CARD;
            }
            if(card_index.four_index.length *4 + card_index.duble_index.length*2 == length && card_index.four_index.length==1 && card_index.duble_index.length==2 ){
                cc.log("四带对儿");
                return CARD_TYPE.BOMB_TWOOO_CARD;
            }
        }
        cc.log("牌型错误")
        return CARD_TYPE.ERROR_CARD;
    },
    PanDuanPaiXing :function (player) {
        var length = player.getCount();
        if(length < 5 && length >0 ){
            var poke1 = player.getIndexOfPai(0);
            var poke2 = player.getIndexOfPai(length -1);
            if(poke1.getPValue() == poke2.getPValue()){
                switch (length) {
                    case 1:
                        cc.log("单");
                        break;
                    case 2:
                        cc.log("对")
                        break;
                    case 3:
                        cc.log("三不带")
                        break;
                    case 4:
                        cc.log("炸弹");
                        break;
                }

                return length;
            }

            poke2 = player.getIndexOfPai(length-2);
            var pk2 = player.getIndexOfPai(1);
            var pk4 = player.getIndexOfPai(length-1);
            if ( ( pk2.getPValue() == pk4.getPValue() || poke1.getPValue() == poke2.getPValue())
                        && length == 4 ){
                cc.log("三带一")
                return CARD_TYPE.THREE_ONE_CARD;
            }
            if(poke1.getHuaSe() == 0 && poke2.getHuaSe() == 0){
                cc.log("王炸")
                return CARD_TYPE.BOMB_CARD;
            }
            cc.log("paixing cuo wu ")
            return CARD_TYPE.ERROR_CARD;
        }else if(length >=5){
            // var pk0 = player.getIndexOfPai(0);
            // var pk1 = player.getIndexOfPai(1);
            // var pk2 = player.getIndexOfPai(2);
            // var pk3 = player.getIndexOfPai(3);
            // var pk4 = player.getIndexOfPai(4);
            // var pk5 = player.getIndexOfPai(5);
            // var pk6 = player.getIndexOfPai(6);
            // var pk7 = player.getIndexOfPai(7);
            //
            // if ( (pk0.getPValue() == pk2.getPValue() && pk3.getPValue() == pk4.getPValue())||
            //     (pk2.getPValue() == pk4.getPValue() && pk1.getPValue() == pk0.getPValue() ) && length == 5){
            //     cc.log("三带一对儿")
            //     return CARD_TYPE.THREE_ONE_CARD;
            // }
            //
            // //四个带两
            // if(length == 6 &&(pk0.getPValue() ==pk3.getPValue() || pk1.getPValue() ==pk4.getPValue()  || pk5.getPValue() ==pk2.getPValue())){
            //     cc.log("四带二")
            //     return CARD_TYPE.BOMB_TWO_CARD;
            // }
            // //四个带两对儿
            // if( length == 8 &&((pk0.getPValue() ==pk3.getPValue() && pk4.getPValue() == pk5.getPValue() && pk6.getPValue() == pk7.getPValue()) ||
            //     (pk2.getPValue() ==pk5.getPValue() && pk0.getPValue() == pk1.getPValue() && pk6.getPValue() == pk7.getPValue())||
            //     (pk0.getPValue() ==pk1.getPValue() && pk2.getPValue() == pk3.getPValue() && pk4.getPValue() == pk7.getPValue())) ){
            //     cc.log("四带两对儿")
            //     return CARD_TYPE.BOMB_TWOOO_CARD;
            // }
            if(PaiUtils.IsLianPai(player)){
                cc.log("顺子")
                return CARD_TYPE.CONNECT_CARD;
            }
            if(PaiUtils.IsLianDui(player)){
                cc.log("连对儿");
                return CARD_TYPE.COMPANY_CARD;
            }

            return PaiUtils.isOtherPai(player);
        }

    },
    zhengliPlayerPai:function (player) {
        //该方法对玩家的牌进行整理 分成五个数组
        /*
            player._pai0 :存放 大小王 2 1
            player._pai1: 存放玩家手中第一次出现的牌
            player._pai2: 2次出现的
            player._pai3: 3次出现的
            player._pai4: 第四次出现的
         */
        var paiArr0 = []; //放 大小王,2,1 
        var paiArr1 = [];
        var paiArr2 = [];
        var paiArr3 = [];
        var paiArr4 = [];
        var arr = player.getAllPai().concat();
        arr.reverse();//让arr 逆序 排列

        for(var i=0;i<arr.length-3;){
            if(arr[i].getPValue() >2 ){
                if(arr[i].getPValue() == arr[i+1].getPValue()){
                    if(arr[i+1].getPValue() == arr[i+2].getPValue()){
                        if(arr[i+2].getPValue() == arr[i+3].getPValue()){
                            paiArr1.push(arr[i]);
                            paiArr2.push(arr[i+1]);
                            paiArr3.push(arr[i+2]);
                            paiArr4.push(arr[i]+3);
                            i = i+4;
                        }else{
                            paiArr1.push(arr[i]);
                            paiArr2.push(arr[i+1]);
                            paiArr3.push(arr[i+2]);
                            i= i+3;
                        }

                    }else{
                        paiArr1.push(arr[i]);
                        paiArr2.push(arr[i+1]);
                        i= i+2;
                    }
                }
                else{
                    paiArr1.push(arr[i]);
                    i=i+1;
                }
            }
            else{
                paiArr0.push(arr[i]);
                i++;
            }
        }

        cc.log(paiArr1,paiArr2,paiArr3,paiArr4)
        //找火箭  第四个数组 > 一定有炸弹
        if(paiArr4.length > 0){
            for(var i=paiArr4.length-1;i>=0;i--){
                var pai4 = paiArr4[i];
                var pai2 ,pai3,pai1;
                paiArr4.splice(i,1);
                for(var j =paiArr3.length-1; j >= 0; j--){
                    if(pai4.getPValue() == paiArr3[j].getPValue()){
                        pai3 = paiArr3[j];
                        paiArr3.splice(j,1);
                        break;
                    }
                }

                for(var j = paiArr2.length-1 ;j >= 0 ;j-- ){
                    if(pai4.getPValue() == paiArr2[j].getPValue()){
                        pai2 = paiArr2[j];
                        paiArr2.splice(j,1);
                        break ;
                    }
                }

                for(var j =paiArr1.length-1 ;j >= 0;j--){
                    if(pai4.getPValue() == paiArr1[j].getPValue()){
                        pai1 = paiArr1[j];
                        paiArr1.splice(j,1);
                        break ;
                    }
                }
                //得到4,3,2,1 这四张牌 把他放到炸弹的数组里面
                player._si.splice(0,0,[pai1,pai2,pai3,pai4]);

            }
        }else if (paiArr3.length > 0){
            for(var i= paiArr3.length-1; i >= 0; i--){
                var pai3 = paiArr3[i];
                paiArr3.splice(i,1);
                var pai2 ,pai1;


                for(var j= paiArr2.length-1; j >= 0; j--){
                    if(pai3.getPValue() == paiArr2[j].getPValue()){
                        pai2 = paiArr2[j];
                        paiArr2.splice(j,1);
                        break ;
                    }
                }

                for(var j= paiArr1.length-1; j >= 0; j--){
                    if(pai3.getPValue() == paiArr1[j].getPValue()){
                        pai1 = paiArr1[j];
                        paiArr1.splice(j,1);
                        break ;
                    }
                }
                //得到3,2,1 这三张牌 把他放到炸弹的数组里面
                player._san.splice(0,0,[pai1,pai2,pai3]);
            }
        }else if(paiArr2.length > 0){  //判断是否有对子
            for(var i= paiArr2.length-1; i >= 0; i--){
                var pai2 = paiArr2[i];
                paiArr2.splice(i,1);
                var pai1;

                for(var j= paiArr1.length-1; j >= 0; j--){
                    if(pai2.getPValue() == paiArr1[j].getPValue()){
                        pai1 = paiArr1[j];
                        paiArr1.splice(j,1);
                        break ;
                    }
                }
                //得到3,2,1 这三张牌 把他放到炸弹的数组里面
                player._er.splice(0,0,[pai1,pai2]);
            }
        } else if (paiArr1.length > 0){  //剩余的都是单
            // var arr = paiArr1.concat()
            // player._yi =arr;
            for(var i=0; i<paiArr1.length;i++ ){
                player._yi.push(paiArr1[i]);
            }
        }

        cc.log(player._yi,1);
        cc.log(player._er,2);
        cc.log(player._san,3);
        cc.log(player._si,4);
        //到此为止 所有的 炸弹,三不带,对,单 的基本牌型 都放入了相应的数组中   基本牌型归位
        //后面就写专门的组牌方法,进行 三带一,三代二,连对,顺子的组牌

    },
    /*
     CARD_TYPE = {
     SINGLE_CARD :1,		                //单牌- 1
     DOUBLE_CARD:2,			            //对子- 2
     THREE_CARD:3,				        //3不带- 3
     BOMB_CARD:4,				        //炸弹   2
     THREE_ONE_CARD:5,			        //3带1- 4
     THREE_TWO_CARD:6,			        //3带2- 5
     BOMB_TWO_CARD:7,			        //四个带2张单牌    6        3种情况   四个在左,四个在右,四个在中间
     BOMB_TWOOO_CARD:8,		            //四个带2对            8   3种情况    四个在左,四个在右,四个在中间
     CONNECT_CARD:9,			            //连牌-                5---12
     COMPANY_CARD:10,			        //连队-             6-20
     AIRCRAFT_CARD:11,			//飞机不带-         6--
     AIRCRAFT_SINGLE_CARD:12,	//飞机带单牌-       8--
     AIRCRAFT_DOBULE_CARD:13
     */
    panduan:function (type) {
        switch (type){
            case CARD_TYPE.SINGLE_CARD:
                
                break;
            case CARD_TYPE.DOUBLE_CARD:
                break;
            case CARD_TYPE.THREE_CARD:
                break;
            case CARD_TYPE.BOMB_CARD:
                break;
            
        }
    },
    chuPai :function (player) {
      // 这里写相关的出牌算法
        var dan = player._yi;
        var duizi = player._er;
        var santiao = player._san;
        var zhadan = player._si;

        if(santiao.length <= dan.length + duizi.length -2 ){
            //出单条
            var pai = dan[0];
            dan.splice(0,1);
            return [pai];
        }else{
            var paiArr = santiao[0];
            santiao.splice(0,1);
            paiArr.splice(2,0,dan[1]);
            return paiArr;
        }

        if(santiao.length <= dan.length + duizi.length -2 ){
            //出对子
            var dui = duizi[0];
            duizi.splice(0,1);
            return dui;
        }else{
            var paiArr = santiao[0];
        }

    },
     // 不算大牌 大小王 ,1,2
    funchaiPai:function (player,type) {
        //该方法对玩家的牌进行拆牌 ,
        switch (type){
            case CARD_TYPE.SINGLE_CARD: //单   每次返回玩家手中拥有的该牌型的最大的值
                if(player._pai1.length >0){
                    var arr = [player._pai1[player._pai1.length-1]];
                    return pai;
                }
                break;
            case CARD_TYPE.DOUBLE_CARD: //对儿
                var len1 = player._pai1.length;
                var len2 = player._pai2.length;


                for(var i=len2-1;i>=0 ;i--){
                    for(var j=len1-1;j>=0;j--){
                        if(player._pai2[i].getPValue() == player._pai1[j].getPValue()){
                            var arr = [player._pai2[i],player._pai1[j]];
                            return arr;
                        }
                    }

                }
                break;
            case CARD_TYPE.THREE_CARD:  //三不带
                var len1 = player._pai1.length;
                var len2 = player._pai2.length;
                var len3 = player._pai3.length;


                for(var i = len3-1;i>=0;i--){
                    for(var j=len2-1;j>=0;j-- ){
                        for(var k =len1-1;k>=0;k--){
                            if(player._pai2[j].getPValue() == player._pai1[k].getPValue()
                                && player._pai2[j].getPValue() == player._pai3[i].getPValue()){
                                var arr = [player._pai2[j],player._pai1[k],player._pai3[i]];
                                return arr;
                            }
                        }
                    }
                }


                break;
            case CARD_TYPE.BOMB_CARD:   //炸弹
                var len1 = player._pai1.length;
                var len2 = player._pai2.length;
                var len3 = player._pai3.length;
                var len4 = player._pai4.length;
                for(var l=len4 -1;l>=0;l--) {
                    for (var i = len3 - 1; i >= 0; i--) {
                        for (var j = len2 - 1; j >= 0; j--) {
                            for (var k = len1 - 1; k >= 0; k--) {

                                if (player._pai2[j].getPValue() == player._pai1[k].getPValue()
                                    && player._pai2[j].getPValue() == player._pai3[i].getPValue()
                                    && player._pai2[j].getPValue() == player._pai4[l].getPValue()) {

                                    var arr = [player._pai2[j], player._pai1[k], player._pai3[i], player._pai4[l]];
                                    return arr;
                                }
                            }
                        }
                    }
                }
                break;

            case CARD_TYPE.THREE_ONE_CARD: //三带一
                var len1 = player._pai1.length;
                var len2 = player._pai2.length;
                var len3 = player._pai3.length;
                for(var i = len3-1;i>=0;i--){
                    for(var j=len2-1;j>=0;j-- ){
                        for(var k =len1-1;k>=0;k--){
                            if(player._pai2[j].getPValue() == player._pai1[k].getPValue()
                                && player._pai2[j].getPValue() == player._pai3[i].getPValue()
                                && k != 0 ){

                                var arr = [player._pai2[j],player._pai1[k],player._pai3[i],player._pai1[0]];
                                return arr;
                            }
                        }
                    }
                }

                break;
            case CARD_TYPE.THREE_TWO_CARD: //三代二
                break;
            case CARD_TYPE.BOMB_TWO_CARD:  //四带一
                var len1 = player._pai1.length;
                var len2 = player._pai2.length;
                var len3 = player._pai3.length;
                var len4 = player._pai4.length;
                for(var l=len4 -1;l>=0;l--) {
                    for (var i = len3 - 1; i >= 0; i--) {
                        for (var j = len2 - 1; j >= 0; j--) {
                            for (var k = len1 - 1; k >= 0; k--) {

                                if (player._pai2[j].getPValue() == player._pai1[k].getPValue()
                                    && player._pai2[j].getPValue() == player._pai3[i].getPValue()
                                    && player._pai2[j].getPValue() == player._pai4[l].getPValue()
                                    && k != 0) {

                                    var arr = [player._pai2[j], player._pai1[k], player._pai3[i], player._pai4[l],player._pai1[0]];
                                    return arr;
                                }
                            }
                        }
                    }
                }
                break;
            case CARD_TYPE.BOMB_TWOOO_CARD: //四带二
                break;
            case CARD_TYPE.CONNECT_CARD:    //顺子
                break;
            case CARD_TYPE.COMPANY_CARD:    //连队儿
                break;
            case CARD_TYPE.AIRCRAFT_CARD:   //飞机
                break;
            case CARD_TYPE.AIRCRAFT_SINGLE_CARD: //飞机带单
                break;
            case CARD_TYPE.AIRCRAFT_DOBULE_CARD: //飞机带对儿
                break;


        }

    },
    TiQuFeiJi:function(player,type,vec){
       var pk = null;
        var xing = new PaiXing();
        for(var i=0;i<vec.length;i++){

            if( pk == null  && i+1 == vec.length ){
                break;
            }
            if(pk == null && vec[i].type == type && vec[i+1].type == type){
                var p1 = vec[i].vec[0];
                var p2 = vec[i+1].vec[0];
                if(p1.getPValue()+1==p2.getPValue()){
                    pk = p2;
                    xing.type = CARD_TYPE.AIRCRAFT_CARD;
                    xing.vec.splice(0,xing.vec.length); //清空xing.vec
                    xing.vec = vec[i].vec;
                    vec.splice(i,1); //删除当前元素

                }

            }

            if(pk != null){
                if(i == vec.length -1){
                    player._paiXing.push(xing);
                    break;
                }

                var pk1 = vec[i].vec[0];
                if(vec[i].type == type && pk.getPValue()+1 == pk1.getPValue()){

                }

            }else{

            }
        }

    },
    //提取连对
    TiQuLianDui:function(player,vec){

    },

    TiQuLianPai:function(player,vec){

    },
    FenChaiNpcPai:function (player) {
        var arr = []; // 存放所有的牌 算是临时的数组
        var vec = []; //存放的是带有牌型的牌的数组  [ [type=1,vec=[1,2,3,4]]]
        var xing = new PaiXing();
        for(var i =0;i<player.getCount();i++){
            arr.push(player.getIndexOfPai(i));
        }
        var p1 = arr[0];
        var p2 = arr[1];
        if(p1.getHuaSe() ==0 && p2.getHuaSe() == 0){
            xing.type = CARD_TYPE.BOMB_CARD;
            xing.vec.push(p1);
            xing.vec.push(p2);
            arr.splice(0,2);
            vec.push(xing);
        }

        //分析牌型
        for(var i=0;i<arr.length;){
            p1 = arr[i];
            xing.vec.splice(0,xing.vec.length);
            for(var j =1;j<arr.length;++j){
                p2 = arr[j];
                if(p1.getNum() == p2.getNum()){
                    ++i;
                    xing.vec.push(p1);
                }else{
                    break;
                }
            }
            if(xing.vec.length ==4){
                xing.type = CARD_TYPE.BOMB_CARD;
            }
            if(xing.vec.length ==3){
                xing.type = CARD_TYPE.THREE_CARD;
            }
            if(xing.vec.length ==2){
                xing.type = CARD_TYPE.DOUBLE_CARD;
            }if(xing.vec.length ==1){
                xing.type = CARD_TYPE.SINGLE_CARD;
            }
            vec.push(xing)
        }
        // 按优先级 先分析炸弹 飞机 连对,顺子,三带,对,单提取
        // 提取炸弹
        for(var i =0 ;i<vec.length;i++){
            var temp = vec[i];
            if(temp.type == CARD_TYPE.BOMB_CARD){
                xing.type = CARD_TYPE.BOMB_CARD;
                xing.vec.splice(0,xing.vec.length);
                xing.vec = temp.vec;
                player._paiXing.push(xing);//保存到用户数组中
                vec.splice(i,1);
            }else{
                i++;
            }
        }
        //提取飞机
        TiQuFeiJi(player,CARD_TYPE.THREE_CARD,vec);
        //提取连对
        TiQuLianDui(player,vec);
        //提取连牌
        TiQuLianPai(player,vec);
        //剩余的是三带,对子,单张 全部加入npc牌型中

        for(var i =0;i<vec.length;i++){
            player._paiXing.push(vec[i]);
            vec.splice(i,1);
        }
    }
};
