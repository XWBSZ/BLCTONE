// 导入所需的基础函数
var bF = require('./baseFunctions');
// 启动游戏函数
function startGame() {
    home(); // 返回桌面
    sleep(2000); // 等待1秒
    // 尝试启动游戏最多3次
    for (let attempt = 1; attempt <= 10; attempt++) {
        console.log(`尝试启动游戏，第 ${attempt} 次`);
        // 启动游戏应用
        app.launch('com.supercell.clashofclans');
        // 等待游戏启动
        console.log("正在启动游戏");
        sleep(2000); // 等待2秒
        // 尝试找到游戏图标
        if (bF.findImage('set', 0, 3000)) {
            // 如果找到图标，则点击并返回
            console.log("成功找到图标");
            // 点击空白
            click(0, 0);
            return true; // 返回 true 表示成功进入游戏
        } else {
            console.log("未找到图标");
        }
    }
    // 如果尝试了最大次数仍然未成功，则输出失败信息
    console.log("启动游戏失败");
    home(); // 返回桌面
    engines.stopAllAndToast(); // 停止所有引擎并提示用户
    return null; // 返回 null 表示启动游戏失败
}
// 收集资源函数
function collectResource() {
    console.log("先查看是否有资源车可以收集");
    sleep(1000);
    bF.zoom("in", 323);
    sleep(1000);
    bF.swipe360(323);
    sleep(1000);
    var resourceCarPos = bF.findImage('resourceCar');
    if (resourceCarPos) {
        console.log("有资源车可以收集");
        sleep(1000);
        click(resourceCarPos.x, resourceCarPos.y);
        sleep(1000);
        click(640,560);//确认收集
        sleep(1000);
        click(0, 0);
    }
    bF.findImage('tombstone', 1);
    bF.findImage('gold', 1);
    bF.findImage('water', 1);
    console.log("资源收集完毕");
}
startGame();
collectResource();
//找鱼函数
function findFish() {
}
findFish();

