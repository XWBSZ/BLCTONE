// 导入所需的基础函数
var bF = require('./baseFunctions');
// 封装启动游戏函数
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
// 封装收集资源函数
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
    startGame();
        
    // collectResource();
upgradeBuilding(39);

}
runGame();

// 函数：升级建筑
function upgradeBuilding(initialY) {
    let yIncrement = initialY; // Y坐标增量
    let gemNeededCount = 0; // 需要宝石的计数

    // 尝试升级建筑最多3次
    for (let attempt = 0; attempt < 3; attempt++) {
        // 点击建筑按钮以打开建筑界面
        click(580, 45);
        sleep(1000);

        // 识别建筑文本位置
        let textPosition = bF.ocr("building", 490, 100, 150, 300, "建议升级");
        sleep(3000);

        // 如果找到建议升级文本
        if (textPosition !== null) {
            // 点击第一个建筑以进行升级
            click(textPosition.x, textPosition.y + yIncrement);
            sleep(1000);

            // 查找并点击升级按钮
            bF.findImg('upgrade', 1);
            sleep(1000);
            click(900, 630); // 确认升级
            sleep(1000);

            // 检查是否需要宝石
            if (bF.findImg('needGem')) {
                console.log("此建筑需要宝石才能升级");
                gemNeededCount++; // 增加需要宝石的计数
                if (gemNeededCount === 3) {
                    console.log("连续三次都需要宝石，退出循环");
                    break; // 连续3次都需要宝石，退出循环
                }
                yIncrement += initialY; // 增加Y坐标增量
            } else {
                console.log("升级成功，继续下一个建筑");
                gemNeededCount = 0; // 重置需要宝石的计数
                yIncrement = initialY; // 重置Y坐标增量
            }
        } else {
            break; // 未找到建议升级文本，退出循环
        }

        // 返回建筑界面
        for (let i = 0; i < 2; i++) {
            click(0, 0);
            sleep(1000);
        }
    }

    // 退出循环后要返回3次
    for (let i = 0; i < 3; i++) {
        click(0, 0);
        sleep(1000);
    }
}



