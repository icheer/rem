//生产环境
window.myDomain = 'http://ai.aiknowsclauses.com/';
const baseURL = 'https://back.aiknowsclauses.com/';
const appId = 'wx2e03c5129c077bde';
const umengId = 1268531919;

//测试环境
// window.myDomain = 'https://ai.aijkang.com/';
// const baseURL = 'https://aikcback.aijkang.com/';
// const appId = 'wx923490c114577ba3';
// const umengId = 1268512783;

import Vue from 'vue'
import axios from 'axios'
import '@/assets/lib/sha1.js'

let util = {};

// 友盟统计埋点
{
	let cnzz_s_tag = document.createElement('script');
	cnzz_s_tag.type = 'text/javascript';
	cnzz_s_tag.async = true;
	cnzz_s_tag.charset = 'utf-8';
	cnzz_s_tag.src = 'https://s22.cnzz.com/z_stat.php?id='+umengId+'&web_id='+umengId+'&async=1';
	let root_s = document.getElementsByTagName('script')[0];
	root_s.parentNode.insertBefore(cnzz_s_tag, root_s);
}

// 以下为工具函数及Vue自定义过滤器
// 马尧 2017-06-14
util.isNumber = function(input) {
	return (typeof input === "number") && Number.isFinite(input);
}
util.isString = function(input) {
	return (typeof input === "string") && (input.__proto__ === String.prototype);
}
util.isArray = function(input) {
	// return !!input && (typeof input === "object") && (input.__proto__ === Array.prototype);
	// 以上代码在原型判别时出现问题(Vue把data下的数组做了改造)
	return !!input && (typeof input === "object") && (!!input.__proto__.push);
}
util.isObject = function(input) {
	return !!input && (typeof input === "object") && (input.__proto__ === Object.prototype);
}
util.isFunction = function(input) {
	return !!input && (typeof input === "function") && (input.__proto__ === Function.prototype);
}
// 判断传入的参数是否为空对象
util.isEmptyObject = function(obj) {
	if (!util.isObject(obj)) {
		return null
	}
	for (var i in obj) {
		return false;
	}
	return true;
}
// 获取url中的指定参数值
util.getQueryString = function(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
	var split = window.location.href.split('?');
	var len = split.length;
	if (len == 1) {
		return null
	}
	var r = split[len - 1].match(reg);
	if (r != null) {
		return decodeURIComponent(r[2]).split('#')[0];
	}
	return null;
}
// 将传入的对象深复制一份(而不是指针引用)
util.copy = function(obj) {
	if (!util.isObject(obj) && !util.isArray(obj)) {
		return null
	}
	return JSON.parse(JSON.stringify(obj));
}
// 根据时间戳计算距离现在相差多久{flag,year,month,day,hour,minute,second}
util.getOffsetTime = function(time) {
	let output = {
		status: null,
		year: null,
		month: null,
		day: null,
		hour: null,
		minute: null,
		second: null
	}
	let thisTime = +new Date();
	let thatTime = +new Date(time);
	let offsetTime = thatTime - thisTime;
	if (offsetTime < 0) {
		output.status = 'past';
	} else {
		output.status = 'future';
	}
	offsetTime = Math.abs(offsetTime);
	output.second = ~~(offsetTime / 1000) % 60;
	output.minute = ~~(offsetTime / 1000 / 60) % 60;
	output.hour = ~~(offsetTime / 1000 / 60 / 60) % 24;
	output.day = ~~(offsetTime / 1000 / 60 / 60 / 24) % 30;
	output.month = ~~(offsetTime / 1000 / 60 / 60 / 24 / 30) % 12;
	output.year = ~~(offsetTime / 1000 / 60 / 60 / 24 / 30 / 12);
	return output;
}
// 根据剩余时间的时间戳计算还剩多少天/时/分/秒
util.getLeftTime = function(time) {
	let output = {
		day: 0,
		hour: 0,
		minute: 0,
		second: 0
	}
	if (!(time > 0)) {
		return output;
	}
	output.second = ~~(time / 1000) % 60;
	output.minute = ~~(time / 1000 / 60) % 60;
	output.hour = ~~(time / 1000 / 60 / 60) % 24;
	output.day = ~~(time / 1000 / 60 / 60 / 24);
	return output;
}

/**
 * 禁止微信浏览器下拉回弹
 */
util.stopDrag = function() {
	window.lastY = 0; //最后一次y坐标点
	document.body.ontouchstart = function(event) {
		window.lastY = event.originalEvent.changedTouches[0].clientY; //点击屏幕时记录最后一次Y度坐标。
	};
	document.body.ontouchmove = function(event) {
		var el = document.getElementsByClassName('scroll');
		if (el.length == 0) {
			return;
		}
		var y = event.originalEvent.changedTouches[0].clientY;
		var st = el[0].scrollTop; //滚动条高度
		if (y >= window.lastY && st <= 10) { //如果滚动条高度小于0，可以理解为到顶了，且是下拉情况下，阻止touchmove事件。
			window.lastY = y;
			event.preventDefault();
		}
		window.lastY = y;
	};
}

/**
 * 禁止微信浏览器下拉回弹
 */
util.overscroll = function() {
	var el = document.querySelector('.scroll');
	el.addEventListener('touchstart', function(evt) {
		window.lastY = evt.targetTouches[0].clientY; //点击屏幕时记录最后一次Y度坐标。
		var top = el.scrollTop;
		var totalScroll = el.scrollHeight;
		var currentScroll = top + el.offsetHeight;
		if (top === 0) {
			el.scrollTop = 1;
		} else if (currentScroll === totalScroll) {
			el.scrollTop = top - 1;
		}
	});
	el.addEventListener('touchmove', function(evt) {
		var y = evt.targetTouches[0].clientY;
		if (el.offsetHeight < el.scrollHeight) {
			evt._isScroller = true;
		}
		if (el.scrollTop <= 10 && y > window.lastY) {
			evt._isScroller = false;
		}
	});
	// 禁止微信浏览器下拉"露底"
	document.body.ontouchstart = function(evt) {
		evt.preventDefault();
		if (!evt._isScroller) {
			evt.preventDefault();
		}
	};
}


// 获取jssdk签名的方法
util.getJssdkSign = function() {
	// 获取当前时间戳(以s为单位)
	var timestamp = Date.parse(new Date()) / 1000;
	var jsapi_ticket = window.jsapi_ticket;
	var nonceStr = createNonceStr();

	function createNonceStr() {
		var chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
		var str = "";
		for (var i = 0; i < 16; i++) {
			var randomNum = parseInt(Math.random() * chars.length, 10);
			str += chars.substr(randomNum, 1);
		}
		return str;
	}

	// 如获取不到ticket则提前结束函数
	if (!jsapi_ticket) {
		return false;
	}
	// 这里参数的顺序要按照 key 值 ASCII 码升序排序
	var string = "jsapi_ticket=" + jsapi_ticket + "&noncestr=" + nonceStr + "&timestamp=" + timestamp + "&url=" + window.location.href.split('#')[0];
	var data = new Uint8Array(encodeUTF8(string));
	var result = sha1(data);
	var signature = Array.prototype.map.call(result, function(e) {
		return (e < 16 ? "0" : "") + e.toString(16);
	}).join("");

	// return出去
	var json = {}
	json.timestamp = timestamp;
	json.nonceStr = nonceStr;
	json.signature = signature;
	return json;
}

// 禁止微信分享
util.shareDeny = function() {
	//禁止分享配置
	wx.config({
		debug: false,
		appId: 'wx0cad77c43b1d74ce',
		timestamp: 123123213,
		nonceStr: '123123123',
		signature: '123123123',
		jsApiList: [
			'hideOptionMenu',
		]
	});
	wx.ready(function() {
		wx.checkJsApi({
			jsApiList: [
				'hideOptionMenu',
			]
		});
		wx.hideOptionMenu();
	});
	window.weixinShare.status = 'deny';
}

// 综合评价分享出去
util.shareEvaluation = function(name) {
	var json = util.getJssdkSign();
	if (json == false) {
		return;
	}

	// 获取保险id
	var insuranceId = util.getQueryString('id');

	wx.showOptionMenu();

	//配置微信分享
	wx.config({
		debug: false,
		appId: appId,
		timestamp: json.timestamp,
		nonceStr: json.nonceStr,
		signature: json.signature,
		jsApiList: [
			'checkJsApi',
			'onMenuShareAppMessage',
			'onMenuShareTimeline',
		]
	});

	wx.ready(function() {
		wx.checkJsApi({
			jsApiList: [
				'onMenuShareAppMessage',
				'onMenuShareTimeline',
			]
		});

		// 2.1 监听“分享给朋友”，按钮点击、自定义分享内容及分享结果接口
		wx.onMenuShareAppMessage({
			title: name + '，人工智能大揭秘',
			desc: name + '，人工智能大揭秘',
			link: window.location.origin + '/expert/?route=detail&id=' + insuranceId,
			imgUrl: window.location.origin + '/expert/logo.jpg',
			trigger: function(res) {
				//alert('用户点击发送给朋友');
			},
			success: function(res) {
				//alert('已分享');
			},
			cancel: function(res) {
				//alert('已取消');
			},
			fail: function(res) {
				//alert(JSON.stringify(res));
			}
		});
		// 2.2 监听“分享到朋友圈”按钮点击、自定义分享内容及分享结果接口
		wx.onMenuShareTimeline({
			title: name + '，人工智能大揭秘',
			link: window.location.origin + '/expert/?route=detail&id=' + insuranceId,
			imgUrl: window.location.origin + '/expert/logo.jpg',
			trigger: function(res) {
				//alert('用户点击分享到朋友圈');
			},
			success: function(res) {
				//alert('已分享');
			},
			cancel: function(res) {
				//alert('已取消');
			},
			fail: function(res) {
				//alert(JSON.stringify(res));
			}
		});
	});
	window.weixinShare.status = 'evaluation';
}

// 报告分享出去
util.shareReport = function(name, code) {
	var json = util.getJssdkSign();
	if (json == false) {
		return;
	}

	wx.showOptionMenu();

	//配置微信分享
	wx.config({
		debug: false,
		appId: appId,
		timestamp: json.timestamp,
		nonceStr: json.nonceStr,
		signature: json.signature,
		jsApiList: [
			'checkJsApi',
			'onMenuShareAppMessage',
			'onMenuShareTimeline',
		]
	});

	wx.ready(function() {
		wx.checkJsApi({
			jsApiList: [
				'onMenuShareAppMessage',
				'onMenuShareTimeline',
			]
		});

		// 2.1 监听“分享给朋友”，按钮点击、自定义分享内容及分享结果接口
		wx.onMenuShareAppMessage({
			title: name + '，这个报告很棒哦，分享给你~',
			desc: name + '，这个报告很棒哦，分享给你~',
			link: window.location.origin + '/expert/?route=report&invitationCode=' + encodeURIComponent(code),
			imgUrl: window.location.origin + '/expert/logo.jpg',
			trigger: function(res) {
				//alert('用户点击发送给朋友');
			},
			success: function(res) {
				//alert('已分享');
				util.ajax('/report/generateLink', 'post', {
					invitationCode: encodeURIComponent(code)
				}).then(function(res) {
					if (res.code == '100000') {
						// window.ui.showToast('已分享','',true);
					}
				});
			},
			cancel: function(res) {
				//alert('已取消');
			},
			fail: function(res) {
				//alert(JSON.stringify(res));
			}
		});
		// 2.2 监听“分享到朋友圈”按钮点击、自定义分享内容及分享结果接口
		wx.onMenuShareTimeline({
			title: name + '，这个报告很棒哦，分享给你~',
			link: window.location.origin + '/expert/?route=report&invitationCode=' + encodeURIComponent(code),
			imgUrl: window.location.origin + '/expert/logo.jpg',
			trigger: function(res) {
				//alert('用户点击分享到朋友圈');
			},
			success: function(res) {
				//alert('已分享');
				util.ajax('/report/generateLink', 'post', {
					invitationCode: encodeURIComponent(code)
				}).then(function(res) {
					if (res.code == '100000') {
						// window.ui.showToast('已分享','',true);
					}
				})
			},
			cancel: function(res) {
				//alert('已取消');
			},
			fail: function(res) {
				//alert(JSON.stringify(res));
			}
		});
	});
	window.weixinShare.status = 'report';
}

window.weixinShare = {
	status: 'init',
	shareDeny: util.shareDeny,
	shareEvaluation: util.shareEvaluation,
	shareReport: util.shareReport
};

util.filter = {};
// 限制数组数量, num:输出数组的成员数量
util.filter.limitBy = function(input, num) {
	if (util.isArray(input) == false || util.isNumber(num) == false || num < 0) {
		return [];
	}
	return _.take(input, num);
}
// 对数组成员排序, param:排序依据,是成员的一个属性名; flag:小于0时逆序,其他情况正序排列
util.filter.orderBy = function(input, param, flag = 1) {
	if (util.isArray(input) == false || util.isString(param) == false || !input[0].hasOwnProperty(param)) {
		return input;
	}
	flag = flag < 0 ? 'desc' : 'asc';
	return _.orderBy(input, param, flag);
}
// 对数组进行"关键词包含检查",只显示包含keyword的条目, keyword:关键词
util.filter.filterBy = function(input, keyword) {
	if (util.isArray(input) == false || util.isString(keyword) == false) {
		return input;
	}
	var output = [];
	_.each(input, function(item) {
		if (util.isString(item) && item.toString().toLowerCase().indexOf(keyword.toLowerCase()) > -1) {
			output.push(item);
		}
	});
	return output;
}

// 检查localStorage里是否存有customerId, 如没有,弹层展示二维码; 如有,返回customerId
util.getCustomerId = function() {
	let customerId = window.localStorage.getItem('customerId');
	if (!customerId) {
		window.ui.showQrcode();
		return false;
	} else {
		return customerId;
	}
}


// 以下是对axios的封装

//baseURL和appId放在代码第一行位置了

window.isSendingAjax = false;
util.axios = axios;
// axios的封装
// 调用示例
// GET请求: this.$util.ajax('/login','get').then(function(res){...}).catch(function(err){...})
// POST请求: this.$util.ajax('/login','post',this.obj).then(function(res){...}).catch(function(err){...})

/**
 * [axios封装通用函数]
 * @param  {String} url    [将要请求的接口路径]
 * @param  {String} method [请求方式 'post' or 'get']
 * @param  {Object} data   [json对象]
 * @param  {String} misc   [杂项, 传入'loading'的时候页面显示Loading浮层,阻止用户与页面的任何交互,直到请求完成; 传入'protect'用于防止用户重复提交,会判断window.isSendingAjax的状态,决定是否阻止此次请求;]
 * @return {Function}        [返回axios的实例的.post或.get方法并执行,用户自行定义.then()回调函数]
 * GET请求示例: this.$util.ajax('/login','get').then((res)=>{...}).catch((err)=>{...})
 * POST请求示例: this.$util.ajax('/login','post',this.obj).then((res)=>{...}).catch((err)=>{...})
 */
util.ajax = function(url, method, data = {}, misc = null) {
	let AISessionToken = window.sessionStorage.getItem('AISessionToken');
	if (AISessionToken == null) {
		AISessionToken = '';
		// window.ui && window.ui.showQrcode();
		// return; // 无token时阻止此次ajax请求
	}
	let config = {
		baseURL: baseURL,
		timeout: 20000,
		responseType: "json",
		crossDomain: true,
		headers: {
			// 'Content-Type': 'application/x-www-form-urlencoded',
			'Content-Type': 'application/x-www-form-urlencoded'
			// 'AISessionToken': AISessionToken
		}
	}
	config.url = url;
	if (data) {
		config.data = data;
	}
	let ajax = util.axios.create(config);

	if (misc == 'loading') {
		// 为axios添加请求拦截器
		ajax.interceptors.request.use(function(config) {
			// 在发送请求之前做些什么
			window.ui && window.ui.showLoading();
			return config;
		}, function(error) {
			// 对请求错误做些什么
			window.ui && window.ui.showLoading();
			return Promise.reject(error);
		});

		// 为axios添加响应拦截器
		ajax.interceptors.response.use(function(response) {
			// 对响应数据做点什么
			window.ui && window.ui.hideLoading();
			if (
				response.data.code != '100000'
				 && response.data.code != '110000'
				 && response.data.code != '200005'
				 && response.data.code != '200021'
				 && window.location.href.indexOf('/score2')==-1
				) {
				window.ui && window.ui.showToast(response.data.message, '');
			}
			return response.data;
		}, function(error) {
			// 对响应错误做点什么
			window.ui && window.ui.hideLoading();
			return Promise.reject(error);
		});
	}

	if (misc == 'filter') {
		// 为axios添加请求拦截器
		ajax.interceptors.request.use(function(config) {
			// 在发送请求之前做些什么
			window.ui && window.ui.showLoading('', true);
			return config;
		}, function(error) {
			// 对请求错误做些什么
			window.ui && window.ui.showLoading('', true);
			return Promise.reject(error);
		});

		// 为axios添加响应拦截器
		ajax.interceptors.response.use(function(response) {
			// 对响应数据做点什么
			window.ui && window.ui.hideLoading();
			if (
				response.data.code != '100000'
				 && response.data.code != '110000'
				 && response.data.code != '200005'
				 && response.data.code != '200021'
				 && window.location.href.indexOf('/score2')==-1
				) {
				window.ui && window.ui.showToast(response.data.message, '');
			}
			return response.data;
		}, function(error) {
			// 对响应错误做点什么
			window.ui && window.ui.hideLoading();
			return Promise.reject(error);
		});
	}

	if (misc == 'protect') {
		// 为axios添加请求拦截器
		ajax.interceptors.request.use(function(config) {
			// 在发送请求之前做些什么
			if (window.isSendingAjax == false) {
				window.isSendingAjax = true;
			} else {
				config.baseURL = 'http://127.0.0.1'
			}
			return config;
		}, function(error) {
			// 对请求错误做些什么
			window.isSendingAjax = false;
			return Promise.reject(error);
		});

		// 为axios添加响应拦截器
		ajax.interceptors.response.use(function(response) {
			// 对响应数据做点什么
			window.isSendingAjax = false;
			if (
				response.data.code != '100000'
				 && response.data.code != '110000'
				 && response.data.code != '200005'
				 && response.data.code != '200021'
				 && window.location.href.indexOf('/score2')==-1
				) {
				window.ui && window.ui.showToast(response.data.message, '');
			}
			return response.data;
		}, function(error) {
			// 对响应错误做点什么
			window.isSendingAjax = false;
			return Promise.reject(error);
		});
	}

	if (misc == null) {
		// 为axios添加请求拦截器
		ajax.interceptors.request.use(function(config) {
			// 在发送请求之前做些什么
			return config;
		}, function(error) {
			// 对请求错误做些什么
			return Promise.reject(error);
		});

		// 为axios添加响应拦截器
		ajax.interceptors.response.use(function(response) {
			// 对响应数据做点什么
			if (
				response.data.code != '100000'
				 && response.data.code != '110000'
				 && response.data.code != '200005'
				 && response.data.code != '200021'
				 && window.location.href.indexOf('/score2')==-1
				) {
				window.ui && window.ui.showToast(response.data.message, '');
			}
			return response.data;
		}, function(error) {
			// 对响应错误做点什么
			return Promise.reject(error);
		});
	}

	if (window.isSendingAjax === true) {
		return false;
	}
	if (method.toLowerCase() == 'get') { // 如果是GET请求,则直接发送
		return ajax.get(url);
	} else if (method.toLowerCase() == 'post') { // 如果是POST请求,先计算signature,再发送
		data = util.appendSignature(data);
		return ajax.post(url, data);
	} else {
		return false;
	}
}

// 将json对象转换成url格式(键名a-z方式顺序排列),计算签名再放入json中
util.appendSignature = function(obj) {
	const seed = "420E496DCF9D9CEC4FD231AC3C258820";
	if (util.isEmptyObject(obj)) {
		return {
			"signature": b64_hmac_sha1(seed, '') + '='
		}
	}
	let string = util.a2z(obj).param;
	let string2 = util.a2z(obj).encodedParam;
	let signature = b64_hmac_sha1(seed, string) + '=';
	string = string2 + '&signature=' + encodeURIComponent(signature);
	return string;
	// obj2.signature=signature;
	// return obj2;
}

// json转为ASCII码升序的url字符串
util.a2z = function(obj) {
	let arr = [];
	// 将obj中的键名依次存入空数组
	for (let i in obj) {
		arr[arr.length] = i;
	}
	// 将数组内的元素按字母顺序正序排列
	arr.sort();
	let arr2=arr.slice(0);
	// 将键值对内部用等号连接,在外部用&连接
	for (let i = 0; i < arr.length; i++) {
		let key=arr[i];
		arr[i] = key + '=' + obj[key];
	}
	for (let j = 0; j < arr2.length; j++) {
		let key=arr2[j];
		arr2[j] = key + '=' + encodeURIComponent(obj[key]);
	}
	let output={
		param: arr.join('&'),
		encodedParam: arr2.join('&')
	}
	return output;
}

Vue.prototype.$util = util;

// 延迟执行指定方法 
// this.debounce(方法名,延迟毫秒数,参数1,参数2...)
Vue.mixin({
	data(){
		return {
			debounceTimer:null
		}
	},
	methods:{
		debounce(func,time,...args){
			if(!this.$util.isFunction(func) || !(time>=0)){
				return;
			}
			window.clearTimeout(this.debounceTimer);
			this.debounceTimer = window.setTimeout(()=>{
				func(...args);
			},time)
		}
	}
})


// Vue自定义过滤器,将长于指定位数的字符串截断,末尾显示省略号
Vue.filter('more', function(input, num = 5) {
	if (!util.isString(input)) {
		return input;
	}
	if (input.length > num) {
		return input.slice(0, num) + '...';
	} else {
		return input;
	}
})

// Vue自定义过滤器,将长于指定位数的字符串截断,中间显示省略号
Vue.filter('more2', function(input, num = 16) {
	if (!util.isString(input) || input.length<=num || num<6) {
		return input;
	}
	if (input.length > num) {
		return input.slice(0, num-4) + '...' + input.slice(-4);
	} else {
		return input;
	}
})

// Vue自定义过滤器,将文本中的'2个全角空格'或'4个半角空格'过滤掉
Vue.filter('nospace', function(input) {
	if (!util.isString(input)) {
		return input;
	}
	let output=input.replace(/　　/g,'').replace(/    /g,'');
	return output;
})

Vue.prototype.$store = {
}

// 向浏览历史堆栈中追加一个空锚点,用于防止浏览器回退关闭
Vue.prototype.pushHistory = function() {
	let state = {
		title: 'title',
		url: '#'
	}
	window.history.pushState(state, "title", "#");
	util.shareDeny();
}

window.ajaxRetryTimes=20;
// 判断当前是否取到了token,执行or延迟200ms重试执行,最多重试20次
Vue.prototype.doAndRetry = function(func) {
	let that = this;
	let token = window.sessionStorage.getItem('AISessionToken');
	if (token) {
		func();
		window.ajaxRetryTimes = 0;
		return;
	}
	if (window.ajaxRetryTimes > 0) {
		window.ajaxRetryTimes--;
		setTimeout(function() {
			that.doAndRetry(func);
		}, 200);
	}
}
