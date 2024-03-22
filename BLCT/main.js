// 导入所需的基础函数
var bF = require('./baseFunctions');

// 封装启动游戏函数
function startGame() {
    app.launch('com.supercell.clashofclans');
    sleep(2000);
    if (!bF.findImg('set', 0, 3000)) {
        console.log("正在重新尝试识别图标");
        sleep(1000);
        if (!bF.findImg('set', 0, 20000)) {
            console.log("启动游戏失败");
            home();
            engines.stopAllAndToast();
            return false; // 返回 false 表示启动游戏失败
        }
    }
    console.log("成功进入游戏");
    click(0, 0);
    sleep(1000);
    return true; // 返回 true 表示成功进入游戏
}

// 封装收集资源函数
function collectResource() {
    console.log("开始收集资源");
    bF.zoom("in", 323);
    sleep(1000);
    bF.swipe360(323);
    bF.findImg('gold', 1);
    bF.findImg('water', 1);
    if (bF.findImg('resourcecar', 1) == true) {
        sleep(1000);
        click(640, 560);
        sleep(1000);
        click(0, 0);
    } else {
        console.log("资源收集完毕");
    }
}
//训练部队函数
// function trainTroop() {
//     console.log("开始训练部队");
//     click(50, 525);//打开训练界面
//     sleep(1000);
//     click(400, 55);//点击训练部队
//     sleep(1000);
//     //
//     longclick(170,440);//长按训练部队
//     //在特定区域里查找是否有训练尚未完成的图标
//     sleep(1000);
//     if (bF.findImg('time', 1) == true) {
//         console.log("有部队正在训练中");
//         return;
//     }
//     bF.swipe360(323


// 封装运行游戏函数
function runGame() {
    if (!startGame()) {
        return; // 如果启动游戏失败，直接返回
    }
    collectResource();

    bF.clickLine(37,930,580,200,5,10);
}
runGame();

toast(bF.ocr("resource",1120, 30, 100, 100));