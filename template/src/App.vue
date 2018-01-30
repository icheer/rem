<template>
	<div id="app" class="rel full">
		<keep-alive>
			<router-view/>
		</keep-alive>
		<loading></loading>
		<loading2></loading2>
		<toast></toast>
		<alert></alert>
		<modal></modal>
		<qrcode></qrcode>
	</div>
</template>

<script>
import FastClick from 'fastclick';
FastClick.attach(document.body);
import './assets/style.css'
import Loading from './ui/loading/loading.vue';
import Loading2 from './ui/loading2/loading2.vue';
import Toast from './ui/toast/toast.vue';
import Alert from './ui/alert/alert.vue';
import Modal from './ui/modal/modal.vue';
import Qrcode from './ui/qrcode/qrcode.vue';
export default {
	name: 'app',
	components: {
		Loading,
		Loading2,
		Toast,
		Alert,
		Modal,
		Qrcode
	},
	watch: {
		$route(to,from){
			window.weixinShare && window.weixinShare.shareDeny();

			// 路由跳转埋点
			{
				let str1='';
				let str2='◆';
				if(!from.name){
					// 什么都不做...
				} else {
					str1+=from.name
					if(from.path != from.fullPath){
						let query=from.fullPath.split('?')[1];
						str1+=('?'+query);
					}
				}
				if(!to.name || to.path=='/'){
					// 什么都不做...
				} else {
					str2+=to.name
					if(to.path != to.fullPath){
						let query=to.fullPath.split('?')[1];
						str2+=('?'+query);
					}
				}
				if(str2==''){
					str2='离开';
				}
				window._czc && window._czc.push(["_trackEvent",str2,str1,this.$root.user.customerId+'/'+this.$root.user.nickname]);
			}

			if( (from.path=='/wish' || from.path=='/help') && to.path=='/' ){
				window.WeixinJSBridge && window.WeixinJSBridge.call('closeWindow');
			}
		}
	}
}
</script>

<style>
#app {
	width: 100%;
	height: 100%;
	overflow: hidden;
	font-family: 'Avenir', Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: center;
	color: #ccc;
	font-size: 0.3rem;
}
</style>
