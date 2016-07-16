var res = {
    HelloWorld_png : "res/HelloWorld.png",
    CloseNormal_png : "res/CloseNormal.png",
    CloseSelected_png : "res/CloseSelected.png",
    Button_Disable_png:"res/Default/Button_Disable.png",
    //mainScene的资源
    MainScenejson:"res/MainScene.json",
    gameStart:"res/assert/gameStart/gameStart0.png",
    gameStartplist:"res/assert/gameStart/gameStart0.plist",
    mainBg:"res/assert/gameStart/mainBg.png",
    //gameScene的资源
    GameScenejson:"res/GameScene.json",
    GameScene_cardListpt:"res/assert/cardList.plist",
    GameScene_cardListpg:"res/assert/cardList.png",
    GameScene_spr0pt:"res/assert/game_scene_spr/game_scene_spr0.plist",
    GameScene_spr0pg:"res/assert/game_scene_spr/game_scene_spr0.png",
    GameScene_btnpt:"res/assert/game_scene_btn/game_scene_btn0.plist",
    GameScene_btnpg:"res/assert/game_scene_btn/game_scene_btn0.png",
    GameScene_ttf0pt:"res/assert/game_scene_ttf/game_scene_ttf0.plist",
    GameScene_ttf0pg:"res/assert/game_scene_ttf/game_scene_ttf0.png",






};

var g_resources = [];
for (var i in res) {
    g_resources.push(res[i]);
}