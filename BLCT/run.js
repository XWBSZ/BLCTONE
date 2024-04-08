// 导入所需的基础函数
var bF = require('./baseFunctions');
// 启动游戏函数
function startGame() {
    home(); // 返回桌面
    sleep(3000); // 等待3秒
    // 尝试启动游戏最多10次
    for (let attempt = 1; attempt <= 10; attempt++) {
        console.log(`尝试启动游戏，第 ${attempt} 次`);
        // 启动游戏应用
        app.launch('com.supercell.clashofclans');
        // 等待游戏启动
        console.log("正在启动游戏");
        sleep(3000); // 等待3秒
        // 尝试找到游戏图标
        if (bF.findAndClick('set')) {
            // 如果找到图标，则点击并返回
            console.log("成功启动游戏");
            // 点击空白
            click(0, 0);
            return true; // 返回 true 表示成功进入游戏
        } else {
            console.log("游戏启动失败");
        }
    }
    // 如果尝试了最大次数仍然未成功，则输出失败信息
    console.log("启动游戏失败");
    home(); // 返回桌面
    engines.stopAllAndToast(); // 停止所有引擎并提示用户
    return null; // 返回 null 表示启动游戏失败
}
// 收集主世界资源函数
function collectResource() {
    bF.zoom("in", 323);
    sleep(1000);
    bF.swipe360(323);
    sleep(1000);
    click(200,340);//点击资源车的位置
    sleep(1000);
    click(640,560);//点击收集
    sleep(1000);
    click(0,0);//点击空白
    sleep(1000);
    bF.findAndClick('tombstone', 1);
    bF.findAndClick('gold', 1);
    bF.findAndClick('water', 1);
    bF.findAndClick('oil', 1);
    console.log("资源收集完毕");
}
collectResource ();
