    var http = require('http')
    var fs = require('fs')
    var path = require('path')
    var url = require('url')

    http.createServer(function(req,res){
      var pathObj = url.parse(req.url,true)
      console.log(pathObj)
      console.log(pathObj.pathname)
      switch (pathObj.pathname){
        case '/getNews':
          var news = [
            "这是第一条消息，获取了消息一",
            "这是第二条消息，获取了消息二",
            "这是第三条消息，获取了消息三"
          ]
          // res.setHeader('Access-Control-Allow-Origin','127.0.0.1:8080')
          res.setHeader('Access-Control-Allow-Origin','*')
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
