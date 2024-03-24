auto.waitFor();

function ocr(imgName, scrX, scrY, width, height, tgtText) {
    tgtText = tgtText || null;
    if (!requestScreenCapture()) { console.log('请求截图失败'); exit(); }
    var img = captureScreen();
    var imgClip = images.clip(img, scrX, scrY, width, height);
    var imgPath = "res/" + imgName + ".png";
    images.save(imgClip, imgPath);
    console.log("裁剪后的图片已保存至: " + imgPath);
    sleep(1000);
    var mdlPath = files.path("./paddleMoudel");
    var image = images.read(imgPath);
    var ocrRes = paddle.ocr(image, mdlPath);
    if (tgtText === null) {
        ocrRes.forEach(function(textObj, index) {
            console.log(`第 ${index + 1} 行：${textObj.text}`);
        });
        return null;
    } else {
        var tgtPos = ocrRes.find(function(textObj) { return textObj.text.includes(tgtText); });
        if (tgtPos) {
            var { left, top, right, bottom } = tgtPos.bounds;
            var centerX = (left + right) / 2 + scrX;
            var centerY = (top + bottom) / 2 + scrY;
            console.log(`${tgtText}中心坐标:(${centerX},${centerY})`);
            return { x: centerX, y: centerY };
        } else {
            console.log(`未找到文本 "${tgtText}"`);
            return null;
        }
    }
}

function clickLine(angle, cX, cY, length, nPts, tClks) {
    var angleRad = (angle % 360) * Math.PI / 180, x1 = Math.round(cX - (length / 2) * Math.cos(angleRad)),
        y1 = Math.round(cY + (length / 2) * Math.sin(angleRad)), x2 = Math.round(cX + (length / 2) * Math.cos(angleRad)),
        y2 = Math.round(cY - (length / 2) * Math.sin(angleRad)), startPoint = { x: x1, y: y1 },
        endPoint = { x: x2, y: y2 }, slope = (endPoint.x !== startPoint.x) ? (endPoint.y - startPoint.y) / (endPoint.x - startPoint.x) : Infinity,
        points = [];
    for (var i = 0; i < nPts; i++) {
        var randomX = (slope !== Infinity) ? Math.round(random(startPoint.x, endPoint.x)) : startPoint.x,
            randomY = (slope !== Infinity) ? Math.round(slope * (randomX - startPoint.x) + startPoint.y) : Math.round(random(startPoint.y, endPoint.y));
        points.push({ x: randomX, y: randomY });
    }
    for (var i = 0; i < tClks; i++) {
        var point = points[i % points.length];
        console.log(`点击坐标：(${point.x}, ${point.y})`);
        click(point.x, point.y);
        sleep(random(30, 60));
    }
}

function findImg(imgName, clkTimes, timeout) {
    if (!requestScreenCapture()) { console.log('请求截图失败'); exit(); }
    clkTimes = clkTimes || 0;timeout = timeout || 1000;
    var startTime = new Date().getTime();
    let img, tpl;
    while (new Date().getTime() - startTime < timeout) {
        img = captureScreen();sleep(200);
        tpl = images.read('res/' + imgName + '.png');
        var p = images.findImage(img, tpl, { threshold: 0.7 });
        if (p) {
            var centerX = p.x + tpl.width / 2;
            var centerY = p.y + tpl.height / 2;
            var pos = { x: centerX, y: centerY };
            console.log(`成功找到图片: ${imgName}`);
            for (let i = 0; i < clkTimes; i++) {
                click(centerX, centerY);
                console.log(`点击图片: ${imgName} ${i + 1}次`);
                sleep(random(50, 100));
            }
            img.recycle();tpl.recycle();
            return { found: true, position: pos };
        }
    }
    console.log(`超时未找到图片: ${imgName}`);
    return { found: false, position: null };
}

function swipe360(angle, x, y, radius, duration) {
    x = x || 640;y = y || 360;radius = radius || 220;
    duration = duration || 1000;
    var endX = x + radius * Math.cos(angle * Math.PI / 180), endY = y - radius * Math.sin(angle * Math.PI / 180),
        offsetX = 2 * x - endX, offsetY = 2 * y - endY;
    swipe(offsetX, offsetY, endX, endY, duration);
}

function zoom(type, angle, x, y, radius, duration) {
    x = x || 640;y = y || 360;radius = radius || 220;
    duration = duration || 1000;
    var startX = x + radius * Math.cos(angle * Math.PI / 180), startY = y - radius * Math.sin(angle * Math.PI / 180),
        endX = x - radius * Math.cos(angle * Math.PI / 180), endY = y + radius * Math.sin(angle * Math.PI / 180);
    if (type === "in") { gestures([duration, [startX, startY], [x, y]], [duration, [endX, endY], [x, y]]); }
    else if (type === "out") { gestures([duration, [x, y], [startX, startY]], [duration, [x, y], [endX, endY]]); }
    else { console.log("方向参数只能是 'in' 或 'out'"); }
}

module.exports = { ocr, clickLine, findImg, swipe360, zoom };