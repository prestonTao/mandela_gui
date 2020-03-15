const { app, BrowserWindow, ipcMain, dialog } = require('electron')
// const { ipcMain } = require('electron')
const path = require('path')
var fs= require("fs")
const { exec, spawn } = require('child_process');
// var shell = require('shelljs');
var http = require('http');

// var Shell = require("./shell.js")
// var ipc = require("./ipc.js")


let win = null;
// let child = null
let childProcess="";
let peer = null;
let showWindow = false;
let walletConfig = null;
let haveWalletdb = false;



function createWindow () {

    var data = fs.readFileSync(path.join(__dirname, 'conf', "config.json"),'utf-8');
    walletConfig = JSON.parse(data);


    fs.exists(path.join(__dirname, 'wallet',"data", "LOCK"), function(exists) {
        // console.log(exists ? "创建成功" : "创建失败");
        console.log("wallet is have "+exists);
        haveWalletdb = exists ? true : false;
    });



    // var firstPage = "";
    // fs.exists(path.join(__dirname,"conf","keystore.key"), function(exists) {
    //   firstPage = exists ? "login.html" : "register.html";
    //   console.log(exists ? "yes" : "no");
    // });
    // console.log(firstPage);

    // 创建浏览器窗口
    win = new BrowserWindow({
        show: false,
        width: 890,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true
        }
    })

     // win.webContents.openDevTools()

    //子窗口
    // let child = new BrowserWindow({
    //   parent: win,
    //   width: 500,
    //   height: 300,
    //   webPreferences: {
    //     nodeIntegration: true
    //   }
    // })
    // child.show()

    // child = new BrowserWindow({ parent: win, modal: true, show: false })
    // child.loadURL(`file://${__dirname}/html/`+firstPage)//path.join(__dirname,"conf","keystore.key")

    // child.webContents.openDevTools()

    // console.log(path.join(__dirname,"html",firstPage));
    fs.exists(path.join(__dirname,"conf","keystore.key"), function(exists) {
        var firstPage = exists ? "login.html" : "register.html";
        win.loadURL(path.join(__dirname,"html",firstPage))//
        // console.log(exists ? "yes" : "no");
    });

    win.show()

   
    // child.once('ready-to-show', () => {
    //   child.show()
    // })
    // child.on('closed', () => {
    //   // win.close()
    //   if(!showWindow){
    //     process.exit(0)
    //   }
    // })


    // 加载index.html文件
    // win.loadFile('index.html')
   

    // win.once('ready-to-show', () => {
    //   win.show()
    // })
}

app.on('ready', createWindow);


function loadPage(){

}

/*
    获取钱包数据库是否存在
*/
ipcMain.on('get_wallet_db_exists', (event, arg) => {
    event.returnValue = haveWalletdb;
})

/*
    传递输入的密码，并使用密码启动服务器端
*/
ipcMain.on('send_password', (event, arg) => {
    console.log(arg) // prints "ping"
    // event.reply('asynchronous-reply', 'pong')

    // Shell.start(arg)
    childProcess = startPeer(arg);
    // showWindow = true;
    // child.close()
    win.setBounds({ width: 1200,height: 800 });
    win.center();
    win.loadURL(`file://${__dirname}/html/index.html`);

})

/*
  判断打开登录页面还是注册页面
*/
ipcMain.on('show_first_page', (event, arg) => {
    fs.exists(path.join(__dirname,"conf","keystore.key"), function(exists) {
        var firstPage = exists ? "login.html" : "register.html";
        win.loadURL(path.join(__dirname,"html",firstPage))//
        // console.log(exists ? "yes" : "no");
    });
})

/*
    获取配置信息
*/
ipcMain.on('send_config', (event, arg) => {
    // ipcMain.send("recv_config", walletConfig);
    // event.sender.send('recv_config', walletConfig);
    event.returnValue = walletConfig;
})

/*
    连接远程节点
*/
ipcMain.on('connect_remote_node', (event, arg) => {
    walletConfig = arg;
    win.setBounds({ width: 1200,height: 800 });
    win.center();
    win.loadURL(`file://${__dirname}/html/index.html`);
})






/*
    打开文件夹选择对话框
*/
ipcMain.on('open_directory_dialog', (event, arg) => {
    dialog.showOpenDialog(win, {
        properties: ['openDirectory']
    }).then(result => {
        console.log(result.canceled)
        console.log(result.filePaths)
        if(result.canceled){
            event.returnValue = "";
        }else{
            event.returnValue = result.filePaths[0];
        }
    }).catch(err => {
        console.log(err)
        event.returnValue = "";
    })
})


//登录窗口最小化
ipcMain.on('window_min',function(){
    win.minimize();
})
//登录窗口最大化
ipcMain.on('window_max',function(){
    if(win.isMaximized()){
        win.restore();  
    }else{
        win.maximize(); 
    }
})
ipcMain.on('window_close',function(){
    win.close();
})

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    // 在 macOS 上，除非用户用 Cmd + Q 确定地退出，
    // 否则绝大部分应用及其菜单栏会保持激活。
    if (process.platform !== 'darwin') {
        app.quit();
        console.log("close window");

        if(peer != null){
            closePeer();
            peer.kill();
        }
        process.exit(0)
    }
})

app.on('activate', () => {
    // 在macOS上，当单击dock图标并且没有其他窗口打开时，
    // 通常在应用程序中重新创建一个窗口。
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
    }
})




// In this file you can include the rest of your app's specific main process
// code. 也可以拆分成几个文件，然后用 require 导入。

let pluginName
switch (process.platform) {
    case 'win32':
        pluginName = 'pepflashplayer.dll'
        break
    case 'darwin':
        pluginName = 'PepperFlashPlayer.plugin'
        break
    case 'linux':
        pluginName = 'libpepflashplayer.so'
        break
}



async function startPeer(arg){
    var cmd = "peer_root.exe";
    if(arg.init){
        cmd = cmd + " init"
    }
    cmd = cmd + " -walletpwd="+arg.pwd
    console.log(cmd);
    peer = exec(cmd, (err, stdout, stderr) => {
    if (err) {
        console.error(err);
        return;
    }
    console.log(stdout);
    });
}



function closePeer(){
    var data = `{"method":"stopservice"}`;

    var opt = {  
        method: "POST",  
        host: "127.0.0.1",  
        port: 2080,  
        path: "/rpc",  
        headers: {
        "user":"test",
        "password":"testp",
            "Content-Type": 'application/json',  
            "Content-Length": data.length  
        }  
    }; 

var req = http.request(opt, function (res) {  
    console.log('STATUS: ' + res.statusCode);  
    console.log('HEADERS: ' + JSON.stringify(res.headers));  
    res.setEncoding('utf8');  
    res.on('data', function (chunk) {  
        console.log('BODY: ' + chunk);  
    });  
}); 
req.on('error', function (e) {  
    console.log('problem with request: ' + e.message);  
}); 

//    var req = http.request(opt, function (serverFeedback) {  
//       console.log(serverFeedback.statusCode);
//         if (serverFeedback.statusCode == 200) {  
//             var body = "";  
//             serverFeedback.on('data', function (data) { body += data; })  
//                           .on('end', function () { });  
//         }else {  
// //             res.send(500, "error");  
//         }  
//     });  
    req.write(data + "\n");  
    req.end(); 


}