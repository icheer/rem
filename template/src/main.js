// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import VueAwesomeSwiper from 'vue-awesome-swiper'
Vue.use(VueAwesomeSwiper)
import './ui/ui-init.js'
import './util/tool'

Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
	el: '#app',
	router,
	template: '<App/>',
	components: { App },
	data(){
		return {
			user:{
				customerId: null,
				isBindMobile: null,
				nickname: null,
				avatarUrl: null,
				valid: null
			},
			innerWidth: '',
			innerHeight: ''
		}
	},
	methods:{
		// 把显示or隐藏加载框/吐司框的方法暴露到window对象上,而不把Vue的实例暴露出去
		bindUI: function(){
			let ui={
				showLoading: this.showLoading.bind(this),
				hideLoading: this.hideLoading.bind(this),
				showLoading2: this.showLoading2.bind(this),
				hideLoading2: this.hideLoading2.bind(this),
				showToast: this.showToast.bind(this),
				hideToast: this.hideToast.bind(this),
				showAlert: this.showAlert.bind(this),
				hideAlert: this.hideAlert.bind(this),
				showQrcode: this.showQrcode.bind(this),
				hideQrcode: this.hideQrcode.bind(this),
				showModal: this.showModal.bind(this),
				hideModal: this.hideModal.bind(this)
			}
			window.ui=ui;
		},
		// 调用登录接口,获取用户id和token
		login: function(){
			let json={};
			let openId=window.localStorage.getItem('openid');
			if(openId){
				json.openId=openId;
			} else {
				this.showQrcode();
				return;
			}
			let that=this;
			this.$util.ajax('/customer/login','POST',json).then(function(res){
				if(res.code=='100000'){
					window.localStorage.setItem('customerId',res.data.customerId);
					window.sessionStorage.setItem('AISessionToken',res.data.token);
				} else if(res.code=='200001') {
					that.showQrcode();
					window.localStorage.removeItem('customerId');
					window.sessionStorage.removeItem('AISessionToken');
				}
			});
		},
		// 获取活动状态
		getActivityDetail: function(){
			// this.$router.replace('/');
			this.$util.ajax('/activity/detail','POST',{
				activityCode: 'HELP_ACTIVITY'
			}).then((res)=>{
				if(res.code=='100000'){
					this.user.valid=true;
					this.regUser();
				} else {
					this.user.valid=false;
					let f=()=>{
						window.WeixinJSBridge && window.WeixinJSBridge.call('closeWindow');
					}
					this.showAlert(res.message,f);
				}
			});
		},
		// 登录(针对老用户)注册(针对新用户)--方法
		regUser: function(){
			if(window.sessionStorage.getItem('user')){
				let user=JSON.parse(window.sessionStorage.getItem('user'));
				this.user.customerId=user.customerId;
				this.user.isBindMobile=user.isBindMobile;
				this.user.avatarUrl=user.avatarUrl;
				this.user.nickname=user.nickname;
				this.user.valid=user.valid;
			}
			let code=this.$util.getQueryString('code');
			let ic=this.$util.getQueryString('ic') || '';
			let json={
				"code":code,
				"ic":ic
			};
			this.$util.axios.post(window.myDomain+'expert/php/reguser201712.php',json,{
				transformRequest: [function (json) {
					// 这里可以在发送请求之前对请求数据做处理,比如form-data格式化等
					json = JSON.stringify(json);
					return json;
				}],
			}).then((res)=>{
				if(res.data.code!='100000'){
					// this.showToast(decodeURIComponent(res.data.message),'');
					if(!this.$util.getQueryString('dev')){
						return;
					}
				}
				this.user.customerId=res.data.data.customerId;
				this.user.isBindMobile=res.data.data.isBindMobile;
				this.user.avatarUrl=res.data.data.headimgurl;
				this.user.nickname=res.data.data.nickname;

				let o=window.location.origin;
				if(o.indexOf('ai.')==-1){
					if(o.indexOf('10.6.2.64')>-1 || o.indexOf('127.0.0.1')>-1){
						this.user.customerId='400000052';
						this.user.isBindMobile=false;
						this.user.avatarUrl='http:\/\/wx.qlogo.cn\/mmopen\/vi_32\/PiajxSqBRaELiaaNjUr6U6MGOUicRWziakRB6l2XubgPBkv6QeibFFibUj83Zalby9AuNyQ2Tiao1p95RyjGgctY4YlMQ\/0';
						this.user.nickname='icheer';
					} else {
						this.user.customerId='400000087';
						this.user.isBindMobile=false;
						this.user.avatarUrl='http://wx.qlogo.cn/mmopen/VkXRuXTZibugqx05l66yy2J95CYfOibicS6cOhND31dSQmiaYXfpkl1qSTJQYfwTnZCoprHnxJIfTkNHzyVQhsm5XbDjuA0oNdow/0';
						this.user.nickname='💅🏻💋';
					}
				}

				let str=JSON.stringify(this.user);
				window.sessionStorage.setItem('user',str);

				// 如果登录正常,跳到领奖页面去
				this.redirect();
			})
		},
		// 跳转到发起页面(ic里的customerId是自己)
		// 跳转到助力页面(ic里的customerId是别人)
		// 跳转到领奖页面(如果url里携带了正确的参数)
		redirect: function(){
			let ic = this.$util.getQueryString('ic');
			let newFlag = this.$util.getQueryString('new');
			if (newFlag) {
				this.$router.push('/wish');
			} else if (ic && ic.split('|')[1]==this.user.customerId) {
				this.$router.push('/wish');
			} else if (ic && ic.split('|')[1]!=this.user.customerId) {
				this.$router.push('/help');
			}
		}
	},
	mounted: function(){
		{
			this.innerWidth=window.innerWidth;
			this.innerHeight=window.innerHeight;
			window.onresize=()=>{
				let w=window.innerWidth;
				let h=window.innerHeight;
				let app_container=document.getElementById('webapp_container');
				if(window.isPC){
					app_container.className='pc';
					app_container.style.width = h*9/16+'px';
					window.html.style.fontSize = h*9/16/7.5+'px';
				} else {
					if(h>0.5*w){
						app_container.className='';
						app_container.removeAttribute('style');
						window.html.style.fontSize = w/7.5+'px';
					} else {
						app_container.className='pc';
						app_container.style.width = h*9/16+'px';
						window.html.style.fontSize = h*9/16/7.5+'px';
					}
				}
				this.innerWidth=w;
				this.innerHeight=h;
			}
		}
		window.vm_=this;
		this.bindUI();
		// this.login();
		this.getActivityDetail();
		this.$util.shareDeny();
	}
})
