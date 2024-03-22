function ClipScreenshot(x, y, width, height, imageName) {
    // 请求截图权限
    if (!requestScreenCapture()) {
        toast("请求截图失败");
        exit();
    }
    var img = captureScreen();
    var imgclip = images.clip(img, x, y, width, height);
    // 构建图片路径
    var imagePath = "./res/" + imageName + ".jpg";
    images.save(imgclip, imagePath);
    toast("裁剪后的图片已保存至: " + imagePath);
    sleep(1000);
}
ClipScreenshot(0, 0, 100, 100, "screenshot");
