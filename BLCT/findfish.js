// 导入所需的基础函数
const bF = require('./baseFunctions');
const cfg = require('./config.json');
// 文本清理函数
function cleanText(txt) {
    if (typeof txt !== 'string') throw new TypeError('文本类型错误');
    const replacementMap = { i: '1', l: '1', a: '4', s: '5', t: '7', e: '13', k: '15' };
    const regex = /[ilAstekx]|[^a-z0-9\s]|×/gi; // 使用安全的正则表达式
    return txt.replace(regex, match => replacementMap[match.toLowerCase()] || '');
}
function next() {
    // 点击下一个图标
    click(1080, 520);
    let attempt = 0;
    
    // 最多循环3次
    while (attempt < 3) {
        console.log("等待下一个图标出现...");
        sleep(2000);
        
        // 尝试找到下一个图标
        if (bF.findAndClick('next')) {
            console.log("下一个图标出现了！开始识别对面的奖杯数...");
            findCup();
            attempt = 0; // 重置尝试次数
            return true;
        } else {
            console.log("未找到图标");
            attempt++; // 尝试次数加一
        }
        
        // 如果尝试次数达到3次，结束搜索
        if (attempt >= 3) {
            console.log("连续3次未找到图标,结束搜索");
            click(100, 540); // 点击结束
            break;
        }
    }
    return false;
}

function findCup() {
    // 放大
    bF.zoom("out", 323);

    // 多次滑动
    for (let i = 0; i < 4; i++) {
        sleep(900);
        bF.swipe360(323, 640, 320, 400, 600);
    }

    // 查找奖杯并进行OCR识别
    const cupPos = bF.findAndClick('cup', 0, 15, 180, 60, 90);
    const cupNum = bF.ocr('cupnum', cupPos.x + 16, cupPos.y - 80, 100, 100);
    console.log(cupNum);
    const cleanedCupNum = cleanText(cupNum[1]);
    console.log("cup:" + cleanedCupNum);
    
    // 判断奖杯数值是否大于配置文件中的值
    if (parseInt(cleanedCupNum, 10) > cfg.target_resources.tar_cup) {
        console.log("对面太屌，打不过");
        next();
    } else {
        console.log("对面够菜，不过还要看看资源多不多");
        findResource();
    }
}

function findResource() {
    const tgtRes = bF.ocr('tgtresources', 64, 100, 120, 98);
    console.log(tgtRes);
    
    // 资源名称数组和阈值数组
    const resNames = ['gold', 'water', 'oil'];
    const thresholds = [cfg.target_resources.tar_gold, cfg.target_resources.tar_water, cfg.target_resources.tar_oil];
    const cleanedRes = tgtRes.map(cleanText);
    let allAboveThresholds = true;
    
    // 判断资源值是否大于相应阈值
    for (let i = 0; i < resNames.length; i++) {
        const val = cleanedRes[i] || 0;
        console.log(resNames[i] + ": " + val);
        
        // 如果小于阈值，标志变量设为假
        if (val < thresholds[i]) {
            allAboveThresholds = false;
            break;
        }
    }

    // 如果所有资源值都大于相应阈值结束循环
    if (allAboveThresholds) {
        console.log("我靠，资源真多，就打你了");
        // 退出循环开始战斗
    } else {
        console.log("资源真少,下一个");
        next();
    }
}
next();