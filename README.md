# hkjc - xxxx


这是一个基于YEOMAN搭建的系统，集成了grunt-proxy、requirejs及rev等打包特性。
通过下面简单的几步你就可以搭建起整个前端开发系统。

##1.  下载项目

选择1个本地文件夹,在此路径下打开命令行

	git init
	git clone https://github.com/simplewei/hkjc.git

	cd hkjc

##2.  安装依赖

	npm install
	bower install

> 如果本地没有安装过bower，请参看 [yeoman中文官网](http://yeomanjs.org/) 

> 通过 `npm install bower -g` 安装依赖，并且依赖本地git（已经安装过git忽略）

> 内网环境git、npm代理推荐 Proxifier 软件

##3.  自定义zepto模块，并编译出目标文件

找到bower_components/zeptojs/make文件 第42行, 增加touch、deferred特性，替换为下面代码：

	modules = (env['MODULES'] || 'zepto event ajax form ie callbacks deferred ie touch').split(' ')

然后在此目录下运行

	npm install
	npm run-script dist


##4. 运行demo

		grunt serve
		
>  注意清除本地80端口占用，如apache、nginx，请关闭他们
>  
>  最好再加个 host  `127.0.0.1	hkjc.qq.com`  免得无法跳登陆


#Tips

- 本demo使用zepto tap，为规避点透bug，全局不使用click事件
