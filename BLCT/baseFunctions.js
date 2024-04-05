const autoWaitFor = () => { if (!requestScreenCapture()) { console.log('请求截图失败'); exit(); } };

const ocr = (imgName, screenX, screenY, width, height, targetText) => {
    targetText = targetText || null;
    autoWaitFor(); const imagePath = `res/${imgName}.png`;
    const modelPath = files.path("./paddleModel");
    const screenImg = captureScreen();
    const clippedImg = images.clip(screenImg, screenX, screenY, width, height);
    images.save(clippedImg, imagePath);
    const ocrResult = paddle.ocr(images.read(imagePath), modelPath);
    if (!targetText) { if (ocrResult.length === 1) return null; return ocrResult.map(text => text.text); }
    const targetPosition = ocrResult.find(txt => txt.text.includes(targetText));
    return targetPosition ? { x: (targetPosition.bounds.left + targetPosition.bounds.right) / 2 + screenX, y: (targetPosition.bounds.top + targetPosition.bounds.bottom) / 2 + screenY } : null;
};

const findImage = (imageName, clickTimes, timeout, searchArea) => {
    clickTimes = clickTimes || 0;
    timeout = timeout || 1000;
    searchArea = searchArea || { x: 0, y: 0, width: 1280, height: 720 };
    autoWaitFor();
    const startTime = new Date().getTime();
    while (new Date().getTime() - startTime < timeout) {
        const screenImg = images.clip(captureScreen(), searchArea.x, searchArea.y, searchArea.width, searchArea.height);
        sleep(200);
        const templateImg = images.read(`res/${imageName}.png`);
        const position = images.findImage(screenImg, templateImg, { threshold: 0.7 });
        if (position) {
            const offsetX = searchArea.x + position.x + templateImg.width / 2;
            const offsetY = searchArea.y + position.y + templateImg.height / 2;
            if (clickTimes > 0) {
                click(offsetX, offsetY);
                for (let i = 0; i < clickTimes - 1; i++) {
                    console.log(`点击坐标：(${offsetX}, ${offsetY})`);
                    click(offsetX, offsetY);
                    console.log(`点击图片: ${imageName} ${i + 1}次`);
                    sleep(random(50, 100));
                }
            }
            return { x: offsetX, y: offsetY };
        }
    }
    console.log(`超时未在指定区域找到图片: ${imageName}`);
    return null;
};

const clickLine = (angle, centerX, centerY, length, numPoints, timeClicks) => {
    const angleRad = (angle % 360) * Math.PI / 180;
    const x1 = Math.round(centerX - (length / 2) * Math.cos(angleRad));
    const y1 = Math.round(centerY + (length / 2) * Math.sin(angleRad));
    const x2 = Math.round(centerX + (length / 2) * Math.cos(angleRad));
    const y2 = Math.round(centerY - (length / 2) * Math.sin(angleRad));
    const startPoint = { x: x1, y: y1 };
    const endPoint = { x: x2, y: y2 };
    const slope = (endPoint.x !== startPoint.x) ? (endPoint.y - startPoint.y) / (endPoint.x - startPoint.x) : Infinity;
    const points = [];
    for (let i = 0; i < numPoints; i++) {
        const randomX = (slope !== Infinity) ? Math.round(random(startPoint.x, endPoint.x)) : startPoint.x;
        const randomY = (slope !== Infinity) ? Math.round(slope * (randomX - startPoint.x) + startPoint.y) : Math.round(random(startPoint.y, endPoint.y));
        points.push({ x: randomX, y: randomY });
    }
    for (let i = 0; i < timeClicks; i++) {
        const point = points[i % points.length];
        console.log(`点击坐标：(${point.x}, ${point.y})`);
        click(point.x, point.y);
        sleep(random(30, 60));
    }
};

const swipe360 = (angle, x, y, radius, duration) => {
    x = x || 640;
    y = y || 360;
    radius = radius || 220;
    duration = duration || 1000;
    const endX = x + radius * Math.cos(angle * Math.PI / 180);
    const endY = y - radius * Math.sin(angle * Math.PI / 180);
    const offsetX = 2 * x - endX;
    const offsetY = 2 * y - endY;
    swipe(offsetX, offsetY, endX, endY, duration);
};

const zoom = (type, angle, x, y, radius, duration) => {
    x = x || 640;
    y = y || 360;
    radius = radius || 220;
    duration = duration || 1000;
    const startX = x + radius * Math.cos(angle * Math.PI / 180);
    const startY = y - radius * Math.sin(angle * Math.PI / 180);
    const endX = x - radius * Math.cos(angle * Math.PI / 180);
    const endY = y + radius * Math.sin(angle * Math.PI / 180);
    if (type === "in") {
        gestures([duration, [startX, startY], [x, y]], [duration, [endX, endY], [x, y]]);
    } else if (type === "out") {
        gestures([duration, [x, y], [startX, startY]], [duration, [x, y], [endX, endY]]);
    } else {
        console.log("方向参数只能是 'in' 或 'out'");
    }
};

module.exports = { ocr, findImage, clickLine, swipe360, zoom };
