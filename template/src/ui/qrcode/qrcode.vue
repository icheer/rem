<template>
	<transition name="fade-quickly">
		<div class="filter" v-if="$root.UI.qrcode.show">
			<div class="abs attention1"></div>
			<div class="abs finger"></div>
			<img src="./image/qrcode.png" alt="" class="abs qrcode">
			<!-- <div class="abs qrcode"></div> -->
			<div class="abs attention2"></div>
			<div class="abs text">
				<p class="title">无法识别二维码？</p>
				<p class="line">1. 打开微信，点击“通讯录-公众号”</p>
				<p class="line">2. 点击右上角的“+”</p>
				<p class="line">3. 搜索微信号：AI懂条款</p>
				<p class="line">4. 点击“关注”，完成</p>
			</div>
			<div class="abs close" @click="hide()"></div>
		</div>
	</transition>
</template>

<script>
export default {
	name: 'qrcode',
	methods:{
		hide(){
			this.hideQrcode();
			// this.$root.login();
		}
	}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
div.filter {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	z-index: 998;
	background: rgba(0,0,0,0.85);
	font-size: 0.3rem;
	color: #fff;
}
div.attention1 {
	width: 5.14rem;
	height: 0.38rem;
	background: url(./image/attention1.png);
	-webkit-background-size: 100% 100%;
	background-size: 100% 100%;
	left: 0;
	right: 0;
	margin: 0 auto;
	top: 0.8rem;
}
div.finger {
	width: 0.62rem;
	height: 1.12rem;
	background: url(./image/finger.png);
	-webkit-background-size: 100% 100%;
	background-size: 100% 100%;
	left: 0;
	right: 0;
	margin: 0 auto;
	top: 1.3rem;
	animation: up-down 1.5s infinite linear;
}
@keyframes up-down {
	from, to {
		transform: translateY(0) scale(0.8);
	}
	50% {
		transform: translateY(0.2rem) scale(0.8);
	}
}
.qrcode {
	display: block;
	width: 2.8rem;
	height: 2.8rem;
	left: 0;
	right: 0;
	margin: 0 auto;
	top: 2.5rem;
}
div.attention2 {
	width: 5.41rem;
	height: 0.64rem;
	background: url(./image/attention2.png);
	-webkit-background-size: 100% 100%;
	background-size: 100% 100%;
	left: 0;
	right: 0;
	margin: 0 auto;
	top: 5.6rem;
}
div.text {
	width: 100%;
	text-align: center;
	top: 6.4rem;
}
div.text p {
	margin-top: 0.7em;
	margin-bottom: 0.7em;
}
p.title {
	width: 5.2rem;
	margin-left: auto;
	margin-right: auto;
	padding-bottom: 0.16rem;
	border-bottom: 0.01rem solid #fff;
}
p.line {
	text-align: left;
	padding-left: 1.4rem;
}
div.close {
	width: 0.31rem;
	height: 0.31rem;
	background: url(./image/close.png) center center no-repeat;
	left: 0;
	right: 0;
	margin: 0 auto;
	top: 10rem;
	padding: 0.2rem;
	border-radius: 50%;
	border: 0.02rem solid #fff;
}
</style>
