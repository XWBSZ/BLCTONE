// 导入所需的基础函数
var bF = require('./baseFunctions');
// 启动游戏函数
function startGame() {
    home(); // 返回桌面
    sleep(1000); // 等待1秒
    // 尝试启动游戏最多3次
    for (let attempt = 1; attempt <= 3; attempt++) {
        console.log(`尝试启动游戏，第 ${attempt} 次`);
        // 启动游戏应用
        app.launch('com.supercell.clashofclans');
        // 等待游戏启动
        console.log("正在启动游戏");
        sleep(2000); // 等待2秒
        // 尝试找到游戏图标
        if (!bF.findImg('set', 0, 10000)==false) {
            // 如果找到图标，则点击并返回
            console.log("成功找到图标");
            click(0, 0);
            sleep(1000); // 等待1秒
            return true; // 返回 true 表示成功进入游戏
        } else {
            console.log("未找到图标");
        }
    }
    // 如果尝试了最大次数仍然未成功，则输出失败信息
    console.log("启动游戏失败");
    home(); // 返回桌面
    engines.stopAllAndToast(); // 停止所有引擎并提示用户
    return false; // 返回 false 表示启动游戏失败
}
// 收集资源函数
function collectResource() {
    console.log("先查看是否有资源车可以收集");
    bF.zoom("in", 323);
    sleep(1000);
    bF.swipe360(323);
    sleep(1000);
    if (!bF.findImg('resourceCar', 1) == false) {
        sleep(1000);
        click(640, 560);
        sleep(1000);
        click(0,0);
    }
    bF.findImg('tombstone', 1);
    bF.findImg('gold', 1);
    bF.findImg('water', 1);
    console.log("资源收集完毕");

}
//从上到下读取资源
function read () {
    //
}
startGame();
collectResource();