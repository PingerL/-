在了解跨域之前，我们先了解下什么是**同源策略**
#### 1.什么是同源策略?
同源策略/SOP（Same origin policy）是一种约定，由Netscape公司1995年引入浏览器，它是浏览器最核心也最基本的安全功能，如果缺少了同源策略，浏览器很容易受到XSS、CSFR等攻击。所谓同源是指"协议+域名+端口"三者相同，即便两个不同的域名指向同一个ip地址，也非同源。

**同源**： 
- http://jirengu.com/a/b.js 和 http://jirengu.com/index.php (同源)

**不同源**：
-  [http://jirengu.com/main.js](http://jirengu.com/main.js) 和 [https://jirengu.com/a.php](https://jirengu.com/a.php) (协议不同)
- [http://jirengu.com/main.js](http://jirengu.com/main.js) 和 [http://bbs.jirengu.com/a.php](http://bbs.jirengu.com/a.php) (域名不同，域名必须完全相同才可以)
- [http://jiengu.com/main.js](http://jiengu.com/main.js) 和 [http://jirengu.com:8080/a.php](http://jirengu.com:8080/a.php) (端口不同,第一个是80)

**需要注意的是: 对于当前页面来说页面存放的 JS 文件的域不重要，重要的是加载该 JS 页面所在什么域**

#### 2.什么是跨域？
浏览器从一个域名的网页去请求另一个域名的资源时，域名、端口、协议任一不同，都是跨域
#### 3.跨域的几种解决方式
1.  **使用JSONP方式实现跨域**：
     原理：JSONP是通过`script`标签加载数据的方式去获取数据当做JS代码来执行。具体操作方法：提前在页面上声明一个函数(这个函数用来处理后端返回的数据)，函数名通过接口的方式传递给后台；后台解析到函数名后在原始数据上[包裹]这个函数名(即相当于将后台返回来的数据作为函数的参数，执行该函数)，发送给前端。换句话说，JSONP 需要对应接口的后端的配合才能实现。
    ```
      1. 定义数据处理函数_fun
      2. 创建script标签，src的地址执行后端接口，最后加个参数  callback=_fun
      3. 服务端在收到请求后，解析参数，计算返还数据，输出 fun(data) 字符串。
      4. fun(data)会放到script标签做为js执行。此时会调用fun函数，将data做为参数。
    ```
2. **CORS** 
CORS 全称是跨域资源共享（Cross-Origin Resource Sharing），是一种 ajax 跨域请求资源的方式，支持现代浏览器，IE支持10以上。
实现方式：当你使用 XMLHttpRequest 发送请求时，浏览器发现该请求不符合同源策略，会给该请求加一个请求头：Origin，后台进行一系列处理，如果确定接受请求则在返回结果中加入一个响应头：Access-Control-Allow-Origin; 浏览器判断该相应头中是否包含 Origin 的值，如果有则浏览器会处理响应，我们就可以拿到响应数据，如果不包含浏览器直接驳回，这时我们无法拿到响应数据。所以 CORS 的表象是让你觉得它与同源的 ajax 请求没啥区别，代码完全一样。
3. **降域**
此方案仅限主域相同，子域不同的跨域应用场景。
实现原理：两个页面都通过js强制设置document.domain为基础主域，就实现了同域。
    ```
       <script>
            document.domain = 'xxx.com'
       </script>
    ```
4.  **postMessage**
      window.postMessage() 方法可以安全地实现跨源通信
      从广义上讲，一个窗口可以获得对另一个窗口的引用（比如 `targetWindow = window.opener`），然后在窗口上调用 `targetWindow.postMessage()` 方法分发一个  `MessageEvent`, MessageEvent  是接口代表一段被目标对象接收的消息。")消息。接收消息的窗口可以根据需要自由处理此事件。传递给 window.postMessage() 的参数（比如 message ）将通过消息事件对象暴露给接收消息的窗口
 - 用法：postMessage(data,origin,[transfer])方法接受两个参数，第三个参数可选。
- data： html5规范支持任意基本类型或可复制的对象
- origin： 协议+主机+端口号，也可以设置为`*`，表示可以传递给任意窗口，如果要指定和当前窗口同源的话设置为`/`
    ```
    <div class="ct">
	<h1>使用postMessage实现跨域</h1>
	<div class="main">
		<input type="text" placeholder="http://a.jrg.com:8080/a.html">
	</div>
	<iframe src="http://localhost:8080/b.html" frameborder="0" ></iframe>
    </div>
     //a.html里的js代码
    <script>
      $('.main input').addEventListener('input', function(){
	        console.log(this.value);
	        window.frames[0].postMessage(this.value,'*');//向b.html传送跨域数据

        })
      // 接收b.html返回回来的数据
      window.addEventListener('message',function(e) {
	          $('.main input').value = e.data  
                console.log(e.data);
      });
    </script>
    //b.html里的js代码
    <script>
    //接收a.html的数据
  window.addEventListener('message',function(e) {
	    $('#input').value = e.data
            console.log(e.data);
    });   
    //返回数据给a.html
     $('#input').addEventListener('input', function(){
	  window.parent.postMessage(this.value, '*');
    })
   </script>
     ```
 #### 4. CORS具体的实现代码
- 使用`XMLHttpRequest`发送请求，浏览器发现该请求不符合同源策略，会给该请求加一个请求头：`Origin`；后台进行处理，在返回结果中加入一个响应头：`Access-Control-Allow-Origin`；浏览器判断该相应头中是否包含 `Origin `的值，有则处理响应，无则直接驳回
- `res.setHeader('Access-Control-Allow-Origin','127.0.0.1:8080')`
- `res.setHeader('Access-Control-Allow-Origin','*')`
- index.html页面
  ```
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta http-equiv="X-UA-Compatible" content="ie=edge">
      <title>Document</title>
    </head>
    <body>
      <div class="container">
        <ul class="news"></ul>
        <button class="show">show news</button>
      </div>

      <script>
        function $(selector){
          return document.querySelector(selector)
        }
        function appendHtml(news){
          var html = ''
          for (var i=0; i<news.length; i++){
            html += '<li>'+ news[i] + '</li>'
          }
          $('.news').innerHTML = html
        }
        $('.show').addEventListener('click', function(){
          var xhr = new XMLHttpRequest()
          xhr.open('GET', 'http://127.0.0.1:8080/getNews', true)
          
          xhr.onload = function(){
            appendHtml(JSON.parse(xhr.responseText))
          }
          xhr.send()
        })
      </script>
    </body>
    </html>
  ```
 - server.js
    ```
    var http = require('http')
    var fs = require('fs')
    var path = require('path')
    var url = require('url')

    http.createServer(function(req,res){
      var pathObj = url.parse(req.url,true)
      switch (pathObj.pathname){
        case '/getNews':
          var news = [
            "这是第一条消息，获取了消息一",
            "这是第二条消息，获取了消息二",
            "这是第三条消息，获取了消息三"
          ]
          res.setHeader('Access-Control-Allow-Origin','127.0.0.1:8080')
          res.end(JSON.stringify(news))
          break;
        
          default:
            fs.readFile(path.join(__dirname,pathObj.pathname),function(e,data){
              if(e){
                res.writeHead(404,'not found')
                res.end('<h1>404 Not Found</h1>')
              } else {
                res.end(data)
              }
            })
          } 
      }).listen(8080)
    ```
    - 启动终端，执行 node server.js              
![启动服务器.PNG](https://upload-images.jianshu.io/upload_images/14422192-7cd736c68ff40530.PNG?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
- 浏览器打开[http://localhost:8080/index.html](http://localhost:8080/index.html) ,查看效果和网络请求
  ![localhost.PNG](https://upload-images.jianshu.io/upload_images/14422192-3f1307096458d4ad.PNG?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
- 点击[show news]按钮 ，会出现下图报错，因为后端设置的`Access-Control-Allow-Origin`是`127.0.0.1:8080`   ![wrong1.PNG](https://upload-images.jianshu.io/upload_images/14422192-6d2b80f0186ad1a2.PNG?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
- 浏览器打开[http://127.0.0.1:8080/index.html](http://127.0.0.1:8080/index.html) ,点击[show news]按钮 ，此时网页能正常响应
![ok1.PNG](https://upload-images.jianshu.io/upload_images/14422192-10fcc4cde708c553.PNG?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
- 若将 `res.setHeader('Access-Control-Allow-Origin','127.0.0.1:8080')`
改成 `res.setHeader('Access-Control-Allow-Origin','*')`，打开服务器，浏览器打开[http://localhost:8080/index.html](http://localhost:8080/index.html),浏览器页能正常响应。`*`表示匹配所有的窗口
 ![ok2.PNG](https://upload-images.jianshu.io/upload_images/14422192-0a17caf43ecbd312.PNG?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


以上为简单为跨域简单总结








