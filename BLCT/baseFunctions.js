auto.waitFor();
function ocr(imageName, x, y, width, height) {
    try {
        if (!requestScreenCapture()) {console.log('请求截图识别');exit();}
        var img = captureScreen();
        var imgclip = images.clip(img, x, y, width, height);
        var imagePath = "res/" + imageName + ".png";
        images.save(imgclip, imagePath);
        console.log("裁剪后的图片已保存至: " + imagePath);
        sleep(1000);
        var mPath = files.path("./paddleMoudel");
        var image = images.read(imagePath);
        const stringList = paddle.ocrText(image, mPath);
        stringList.forEach((line, index) => console.log(`第 ${index + 1} 行：${line}`));
        return stringList;
    } catch (e) {
        console.log("识别出现异常: " + e);
    }
}

function clickLine(angle, cX, cY, length, nPoints, tClicks) {
    var angleRad = (angle % 360) * Math.PI / 180,
        x1 = Math.round(cX - (length / 2) * Math.cos(angleRad)),
        y1 = Math.round(cY + (length / 2) * Math.sin(angleRad)),
        x2 = Math.round(cX + (length / 2) * Math.cos(angleRad)),
        y2 = Math.round(cY - (length / 2) * Math.sin(angleRad)),
        startPoint = { x: x1, y: y1 },
        endPoint = { x: x2, y: y2 },
        slope = (endPoint.x !== startPoint.x) ? (endPoint.y - startPoint.y) / (endPoint.x - startPoint.x) : Infinity,
        points = [];
    for (var i = 0; i < nPoints; i++) {
        var randomX = (slope !== Infinity) ? Math.round(random(startPoint.x, endPoint.x)) : startPoint.x,
            randomY = (slope !== Infinity) ? Math.round(slope * (randomX - startPoint.x) + startPoint.y) : Math.round(random(startPoint.y, endPoint.y));
        points.push({ x: randomX, y: randomY });
    }
    for (var i = 0; i < tClicks; i++) {
        var point = points[i % points.length];
        console.log(`点击坐标：(${point.x}, ${point.y})`);
        click(point.x, point.y);
        sleep(random(30, 60));
    }
}

function findImg(imageName, cTimes, timeout) {
    if (!requestScreenCapture()) {console.log('请求截图识别');exit();}
    cTimes = cTimes || 0;timeout = timeout || 1000;
    var startTime = new Date().getTime(),
        img, template;
    while (new Date().getTime() - startTime < timeout) {
        img = captureScreen();
        template = images.read('res/' + imageName + '.png');
        var p = images.findImage(img, template, { threshold: 0.7 });
        if (p) {
            var pos = { x: p.x + template.width / 2, y: p.y + template.height / 2 };
            console.log(`成功找到图片: ${imageName}`);
            for (var i = 0; i < cTimes; i++) {
                click(pos.x, pos.y);
                console.log(`点击图片: ${imageName} ${i + 1}次`);
                sleep(random(50, 100));
            }
            img.recycle();
            template.recycle();
            return true;
        }
        sleep(100);
    }
    console.log(`超时未找到图片: ${imageName}`);
    return false;
}

function swipe360(angle, x, y, radius, duration) {
    x = x || 640;radius = radius || 220;
    y = y || 360;duration = duration || 1000;
    var endX = x + radius * Math.cos(angle * Math.PI / 180),
        endY = y - radius * Math.sin(angle * Math.PI / 180),
        offsetX = 2 * x - endX,
        offsetY = 2 * y - endY;
    sleep(500);
    swipe(offsetX, offsetY, endX, endY, duration);
}

function zoom(type, angle, x, y, radius, duration) {
    x = x || 640;radius = radius || 220;
    y = y || 360;duration = duration || 1000;
    var startX = x + radius * Math.cos(angle * Math.PI / 180),
        startY = y - radius * Math.sin(angle * Math.PI / 180),
        endX = x - radius * Math.cos(angle * Math.PI / 180),
        endY = y + radius * Math.sin(angle * Math.PI / 180);
    if (type === "in") {
        gestures([duration, [startX, startY], [x, y]],
            [duration, [endX, endY], [x, y]]);
    } else if (type === "out") {
        gestures([duration, [x, y], [startX, startY]],
            [duration, [x, y], [endX, endY]]);
    } else {
        console.log("方向参数只能是 'in' 或 'out'");
    }
}

module.exports = { ocr, clickLine, findImg, swipe360, zoom };
