const electron = require('electron');
const app = electron.app;

const path = require('path');
const url = require('url');

const BrowserWindow = electron.BrowserWindow;
const Menu = electron.Menu;

// 初始化并准备创建主窗口
app.on('ready', ()=>{
	// 创建一个宽800px 高600px的窗口
	Menu.setApplicationMenu(null);
	
	mainWindow = new BrowserWindow({
		width: 1600,
		height: 1200,
		minimizable: true,//最小化
		maximizable: true,//最大化
		closable: true,
		movable: true,
		frame: true,//边框
		fullscreen: false,//全屏
		webPreferences:{nodeIntegration:true}
	});

	// mainWindow.loadFile('index.html');
	// 载入应用的index.html
	mainWindow.loadURL(url.format({
		pathname: path.join(__dirname, './build/index.html'),
		protocol: 'file:',
		slashes: true
	}));
	// 窗口关闭时触发
	mainWindow.on('closed',()=>{
		// 想要取消窗口对象的引用， 如果你的应用支持多窗口，你需要将所有的窗口对象存储到一个数组中，然后在这里删除想对应的元素
		mainWindow = null
	});
});
