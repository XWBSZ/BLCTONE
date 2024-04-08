// 导入所需的基础函数
const bF = require('./baseFunctions');
const cfg = require('./config.json');

function cleanText(txt) {
    if (typeof txt !== 'string') {
        return ''; // 替换为返回空字符串
    }
    const replacementMap = { i: '1', l: '1', a: '4', s: '5', t: '7', e: '13', k: '15', F: '19' };
    const regex = /[ilAstekx]|[^a-z0-9\s]|×/gi;
    const cleanedTxt = txt.replace(regex, match => replacementMap[match.toLowerCase()] || '');
    return cleanedTxt.toString(); // 明确将清理后的文本转换为字符串类型
}

// 点击下一个图标的函数
function next() {
    // 点击下一个图标
    click(1080, 520);
    let attempt = 0;
    
    // 最多循环3次
    while (attempt < 3) {
        sleep(3000);
        // 尝试找到下一个图标
        if (bF.findAndClick('next')) {
            console.log("开始识别对面的奖杯数...");
            findCup();
            attempt = 0; // 重置尝试次数
            return true;
        } else {
            console.log("未找到下一个图标");
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

// 查找奖杯的函数
function findCup() {
    // 放大
    bF.zoom("out", 323);

    // 多次滑动到偏僻位置
    for (let i = 0; i < 4; i++) {
        sleep(1000);
        console.log("正在滑向大海以提高识别精度...");
        bF.swipe360(37, 640, 320, 420, 500);
    }

    // 查找奖杯并进行OCR识别
    sleep(1000);
    const cupPos = bF.findAndClick('cup', 0, 15, 180, 60, 90);
    const cupNum = bF.ocr('cupnum', cupPos.x + 16, cupPos.y - 80, 100, 100);
    const cleanedCupNum = cleanText(cupNum[1])||0;
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

// 查找资源的函数
function findResource() {
    // 调用OCR函数获取资源信息
    var tgtResource = bF.ocr('tgtresources', 64, 100, 120, 98);
    //清洗出三行识别结果

    var cleanedResource = cleanText(tgtResource[0] + " " + tgtResource[1] + " " + tgtResource[2]);
    // 解析资源信息
    var resource = cleanedResource.split(" ");
    var Gold = parseInt(resource[0]) || 0; // 金币数量
    var Water = parseInt(resource[1]) || 0; // 水数量
    var Oil = parseInt(resource[2]) || 0; // 油数量
    console.log("Gold:" + Gold + " Water:" + Water + " Oil:" + Oil);

    // 判断资源值是否大于等于配置文件中的值
    if (Gold >= cfg.target_resources.tar_gold && Water >= cfg.target_resources.tar_water && Oil >= cfg.target_resources.tar_oil) {
        console.log("资源够多，开始战斗");
        // 开始战斗
    } else {
        console.log("资源不够，下一个");
        next();
    }
}

// 开始搜索
next();