// 封装悬浮窗功能
function createFloatyWindow() {
    // 创建悬浮窗数组
    var windows = [];
    
    // 不同图标的路径数组
    var iconPaths = ["file://res/run.png", "file://res/stop.png", "file://res/config.png", "file://res/close.png"];

    // 让悬浮窗一直保持运行的必要代码
    setInterval(() => {}, 1000);

    // 创建主悬浮窗
    var window = floaty.window(
        <frame>
            <img id="icon" src="file://res/X.png" w="20" h="20"/>
        </frame>
    );
    
    // 设置悬浮窗的初始位置
    window.setPosition(0, 400);

    // 按钮点击事件
    window.icon.click(() => {
        console.log("悬浮窗被点击了");
        if (windows.length === 0) {
            // 创建4个新的悬浮窗
            for (let i = 0; i < 4; i++) {
                let newWindow = floaty.window(
                    <frame>
                        <img id="icon" src={iconPaths[i]} w="20" h="20"/>
                    </frame>
                );
                // 计算偏移量为原始宽度的1.2倍
                let offsetX = (i + 1) * window.getWidth() ;
                // 设置新悬浮窗的位置
                newWindow.setPosition(window.getX() + offsetX, window.getY());
                // 绑定不同的点击事件
                bindClickEvent(newWindow, i);
                // 将新悬浮窗添加到数组中
                windows.push(newWindow);
            }
        } else {
            // 收回悬浮窗
            for (let i = 0; i < windows.length; i++) {
                windows[i].close();
            }
            // 清空悬浮窗数组
            windows = [];
        }
    });

    // 绑定点击事件的内部函数
    function bindClickEvent(window, index) {
        window.icon.click(() => {
            switch (index) {
                case 0:
                    // 执行启动逻辑
                    console.log("启动");
                    engines.execScriptFile("./main.js");
                    break;
                case 1:
                    // 执行停止逻辑
                    console.log("停止");
                    // 停止所有除了当前脚本之外的线程
                    engines.all().forEach(engine => {
                        if (engine !== engines.myEngine()) {
                            engine.forceStop();
                        }
                    });
                    break;
                case 2:
                    // 执行设置逻辑
                    console.log("设置");
                    // 在这里添加设置逻辑
                    break;
                case 3:
                    // 停止包括当前在内的所有脚本
                    engines.stopAll();
                    exit();
                    break;    
                default:
                    break;
            }
        });
    }
}

createFloatyWindow();