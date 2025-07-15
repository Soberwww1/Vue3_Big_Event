<h2>02_Vue3-big-event</h2>
    <div>
        <p>
            本项目是一个简易的后台管理系统，使用了Vue3+Vite+Pinia+VueRouter技术，
            实现了头像上传、昵称更改、文章发布、文章编辑等功能。后端接口由黑马提供。
        </p>
        <p>
            本程序使用步骤：
            <ol>
                <li>先拉去本仓库所有程序 --- git clone 仓库地址</li>
                <li>执行 npm i 下载所有依赖</li>
                <li>如果你想将程序打包 --- 使用pnpm build 或者 npm run build</li>
                <li>不过存在问题，浏览器会报cors错误😓😓😓</li>
                <ol>
                    <h3>解决方法一:禁用Chrome CORS（测试）</h3>
                    <li>
                        在控制台以管理员运行CMD执行chrome.exe --disable-web-security --user-data-dir="C:/temp"
                    </li>
                    <li>将打包后的index.html文件拖入打开的chrome页面中即可预览</li>
                </ol>
                <ol>
                    <h3>解决方法二:使用 Vite 内置预览命令</h3>
                    <li>
                        打包后启动本地服务器：npm run preview
                    </li>
                    <li>此时访问 http://localhost:4173（或其他端口），资源会正确加载！</li>
                </ol>
                <ol>
                    <h3>解决方法三:使用 http-server</h3>
                    <li>npm install -g http-server  # 全局安装（若未安装）</li>
                    <li> cd dist                     # 进入打包后的目录</li>
                    <li> http-server -p 8080         # 启动服务器</li>
                    <li>访问 http://localhost:8080 即可。</li>
                </ol>
            </ul>
        </p>
    </div>