// 导入包
importClass(com.googlecode.tesseract.android.TessBaseAPI);

// 定义OCR识别函数并导出
function tessocr(imageName) {
    try {
        var tessocr = new TessBaseAPI(); // 新建OCR实例
        var img = images.read('./res/' + imageName + '.png'); // 读取图片
        var dataPath = files.path("./"); // 获取文件路径
        var ok = tessocr.init(dataPath, "eng"); // 初始化OCR实例
        if (ok) {
            toastLog("初始化成功: " + tessocr.getInitLanguagesAsString()); // 打印初始化成功信息
        } else {
            toastLog("初始化失败"); // 打印初始化失败信息
            return;
        }
        tessocr.setImage(img.getBitmap()); // 设置图片
        var text = tessocr.getUTF8Text(); // 获取文本结果
        var lines = text.split("\n"); // 将文本按行分割为数组
        lines.forEach(function (line, index) { // 遍历每一行文本并打印
            console.log(`第 ${index + 1} 行：${line}`);
        });
        return text; // 返回识别的文本结果
    } catch (e) {
        console.log("识别出现异常: " + e); // 打印异常信息
    }
}


function clickImageWithTimeout(imageName, clickTimes, timeout) { // 在给定的时间内查找并点击指定图片
    clickTimes = clickTimes || 0; // 如果未提供点击次数，默认为0
    timeout = timeout || 2000; // 如果未提供超时时间，默认为2000毫秒
    let startTime = new Date().getTime();
    let img, template;
    while (new Date().getTime() - startTime < timeout) { // 在指定时间内进行查找
        if (!requestScreenCapture(true)) return false; // 请求屏幕截图权限，如果失败则返回false
        img = captureScreen(); // 截取当前屏幕
        template = images.read('./res/'+ imageName +'.png'); // 读取指定图片
        let p = images.findImage(img, template, { threshold: 0.8 }); // 查找图片位置
        if (p) { // 如果找到图片
            let pos = { x: p.x + template.width / 2, y: p.y + template.height / 2 }; // 计算图片中心位置
            console.log(`成功找到图片: ${imageName}`);
            for (let i = 0; i < clickTimes; i++) { // 进行指定次数的点击操作
                click(pos.x, pos.y);
                console.log(`点击图片: ${imageName} ${i + 1}次`);
                sleep(random(50, 100)); // 随机等待一段时间
            }
            img.recycle(); // 释放img对象占用的内存
            template.recycle(); // 释放template对象占用的内存
            return true;
        }
        sleep(100); // 没有找到图片则等待一段时间后重试
    }
    console.log(`超时未找到图片: ${imageName}`);
    return false; // 超时未找到图片则返回false
}

function swipe360(angle, x, y, radius, duration) { // 在屏幕上进行360度滑动
    x = x || 640; // 如果未提供x坐标，默认为屏幕中心x坐标
    y = y || 360; // 如果未提供y坐标，默认为屏幕中心y坐标
    radius = radius || 220; // 如果未提供半径，默认为220
    duration = duration || 1000; // 如果未提供持续时间，默认为1000毫秒
    let endX = x + radius * Math.cos(angle * Math.PI / 180),
        endY = y - radius * Math.sin(angle * Math.PI / 180),
        offsetX = 2 * x - endX,
        offsetY = 2 * y - endY;
    sleep(500);
    swipe(offsetX, offsetY, endX, endY, duration); // 执行滑动操作
}

function zoom(type, angle, x, y, radius, duration) { // 在屏幕上进行缩放
    x = x || 640; // 如果未提供x坐标，默认为屏幕中心x坐标
    y = y || 360; // 如果未提供y坐标，默认为屏幕中心y坐标
    radius = radius || 220; // 如果未提供半径，默认为220
    duration = duration || 1000; // 如果未提供持续时间，默认为1000毫秒
    let startX = x + radius * Math.cos(angle * Math.PI / 180),
        startY = y - radius * Math.sin(angle * Math.PI / 180),
        endX = x - radius * Math.cos(angle * Math.PI / 180),
        endY = y + radius * Math.sin(angle * Math.PI / 180);
    if (type === "in") { // 缩小操作
        gestures([duration, [startX, startY], [x, y]],
            [duration, [endX, endY], [x, y]]);
    } else if (type === "out") { // 放大操作
        gestures([duration, [x, y], [startX, startY]],
            [duration, [x, y], [endX, endY]]);
    } else {
        console.log("方向参数只能是 'in' 或 'out'"); // 提示参数错误
    }
}

// 定义函数，根据中心坐标、角度和总长度在直线上随机点击指定数量的点
function clickOnLine(centerX, centerY, angle, length, numberOfPoints, totalClicks) {
    // 角度转换为弧度
    var angleRad = (angle % 360) * Math.PI / 180;
    // 计算直线的两个端点坐标
    var x1 = Math.round(centerX - (length / 2) * Math.cos(angleRad));
    var y1 = Math.round(centerY + (length / 2) * Math.sin(angleRad));
    var x2 = Math.round(centerX + (length / 2) * Math.cos(angleRad));
    var y2 = Math.round(centerY - (length / 2) * Math.sin(angleRad));
    var startPoint = { x: x1, y: y1 };
    var endPoint = { x: x2, y: y2 };

    // 计算斜率
    var slope = (endPoint.x !== startPoint.x) ? (endPoint.y - startPoint.y) / (endPoint.x - startPoint.x) : Infinity;

    // 随机生成指定数量的点
    var points = [];
    for (var i = 0; i < numberOfPoints; i++) {
        var randomX = (slope !== Infinity) ? Math.round(random(startPoint.x, endPoint.x)) : startPoint.x;
        var randomY = (slope !== Infinity) ? Math.round(slope * (randomX - startPoint.x) + startPoint.y) : Math.round(random(startPoint.y, endPoint.y));
        points.push({ x: randomX, y: randomY });
    }

    // 点击坐标
    for (var i = 0; i < totalClicks; i++) {
        var point = points[i % points.length];
        console.log("点击坐标：(" + point.x + ", " + point.y + ")");
        click(point.x, point.y);
        sleep(random(30, 60));
    }
}

module.exports = { // 导出函数
    clickImageWithTimeout,
    swipe360,
    zoom,
    tessocr,
    clickOnLine
};
