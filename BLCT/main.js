var bF = require('./baseFunctions');
//启动游戏
function startGame(){
    app.launch('com.supercell.clashofclans');sleep(2000);
    if(!bF.findPicture('set',0,10000)){
        //如果set没找到就回到手机桌面
        home();console.log("未能成功进入游戏,返回桌面"); 
        engines.stopAll();
    }else{
        console.log("成功进入游戏");
        click(0,0);sleep(1000);//点击屏幕左上角返回主界面
    }
}
//收集资源
function collectResource(){
    console.log("开始收集资源");
    bF.zoom("in",323);sleep(1000);bF.swipe360(323);
    bF.findPicture('gold',1);//收集金币
    bF.findPicture('water',1);//收集圣水
    //采集可能存在的资源车
    if(bF.findPicture('resourcecar',1)==true){
        sleep(1000);
        click(640,560);
        sleep(1000);//收集车里资源
        click(0,0)//点击返回
    }else{console.log("资源收集完毕");}
        
}

// 主函数
function RUN() {
startGame();
collectResource();
}
RUN(); // 执行运行函数

toast(bF.paddleOCR("resource"))