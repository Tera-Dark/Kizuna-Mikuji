@echo off
echo 正在启动缘结良缘占卜应用...
echo 请稍候，服务器启动中...

:: 启动npm开发服务器
start cmd /k "npm run dev"

:: 等待几秒钟确保服务器启动
timeout /t 5 /nobreak

:: 使用默认浏览器打开应用
start http://localhost:5173

echo 应用已启动！请在浏览器中查看。 