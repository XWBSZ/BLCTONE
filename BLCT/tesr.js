// 创建一个悬浮窗用于显示日志
var logWindow = floaty.window(
    <frame>
        <text id="logText" w="match_parent" h="match_parent" textSize="12sp" textColor="#FF444444"/>
    </frame>
);

// 设置悬浮窗的位置
logWindow.setPosition(100, 100);
// 设置悬浮窗可拖动
logWindow.setAdjustEnabled(true);
// 添加日志的函数
function addLog(message) {
    // 获取当前时间
    var currentTime = new Date().toLocaleTimeString();
    // 在 UI 线程上更新视图
    ui.run(function() {
        // 将新的日志信息添加到悬浮窗的文本视图中
        logWindow.logText.setText(currentTime + ": " + message + "\n" + logWindow.logText.getText());
    });
}

// 测试用例：每隔1秒添加一条日志
setInterval(function() {
    addLog("这是一条测试日志");
}, 1000);
