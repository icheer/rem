import Vue from 'vue'
// import './transition/transition.css'

Vue.mixin({
	data(){
		return {
			UI:{
				loading:{
					show:false,
					text:'',
					filter:false,
					timeout:null
				},
				loading2:{
					show:false,
					color1:'',
					color2:'',
					timeout:null
				},
				toast:{
					show:false,
					text:'',
					icon:'',
					bottom:false,
					timeout:null
				},
				alert:{
					show:false,
					text:'',
					callback1:null,
					callback2:null,
					btn:''
				},
				modal:{
					show:false,
					text:'',
					desc:'',
					callback1:null,
					callback2:null,
					btn1:'',
					btn2:''
				},
				qrcode:{
					show:false
				}
			}
		}
	}
})

Vue.prototype.showLoading=function(text='正在加载',filter=false){
	let loading=this.$root.UI.loading;
	loading.show=true;
	loading.text=text;
	loading.filter=filter;
	clearTimeout(loading.timeout);
	loading.timeout=setTimeout(()=>{
		if(loading.show==true){
			this.hideLoading();
			this.showToast(' 网络不给力哦~ ','');
		}
	},20000)
}
Vue.prototype.hideLoading=function(){
	let loading=this.$root.UI.loading;
	loading.show=false;
}
Vue.prototype.showLoading2=function(color1='#11D4C5', color2=color1){
	let loading=this.$root.UI.loading2;
	loading.show=true;
	loading.color1=color1;
	loading.color2=color2;
	window.clearTimeout(loading.timeout);
	loading.timeout=setTimeout(()=>{
		if(loading.show==true){
			this.hideLoading2();
			// this.showToast(' 网络不给力哦~ ','');
		}
	},20000)
}
Vue.prototype.hideLoading2=function(){
	let loading=this.$root.UI.loading2;
	loading.show=false;
}
Vue.prototype.showToast=function(text='成功',icon='success',bottom=false){
	let toast=this.$root.UI.toast;
	toast.show=true;
	toast.text=text;
	toast.icon=icon;
	toast.bottom=bottom;
	clearTimeout(toast.timeout);
	toast.timeout=setTimeout(()=>{
		this.hideToast();
	},1500)
}
Vue.prototype.hideToast=function(){
	let toast=this.$root.UI.toast;
	toast.show=false;
}
Vue.prototype.showAlert=function(text='提示',callback1=function(){},callback2=null,btn='确定'){
	let alert=this.$root.UI.alert;
	alert.show=true;
	alert.text=text;
	alert.callback1=callback1;
	alert.callback2=callback2;
	alert.btn=btn;
}
Vue.prototype.hideAlert=function(){
	let alert=this.$root.UI.alert;
	alert.show=false;
}
Vue.prototype.showModal=function(obj=null){
	if(obj==null){
		return;
	}
	let defaultObj={
		show: true,
		text: '这是模态框的正文部分-text',
		desc: '这是模态框的描述部分-desc',
		callback1: function(){},
		callback2: function(){},
		btn1: '按钮1-btn1',
		btn2: '按钮2-btn2'
	}
	obj = Object.assign(defaultObj,obj);
	let modal=this.$root.UI.modal;
	for(let i in modal){
		modal[i]=obj[i];
	}
}
Vue.prototype.hideModal=function(){
	let modal=this.$root.UI.modal;
	modal.show=false;
}
Vue.prototype.showQrcode=function(){
	let qrcode=this.$root.UI.qrcode;
	qrcode.show=true;
}
Vue.prototype.hideQrcode=function(){
	let qrcode=this.$root.UI.qrcode;
	qrcode.show=false;
}
