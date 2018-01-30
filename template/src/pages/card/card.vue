<template>
	<div class="card abs full overflow-x-hidden">
		<div class="bg abs"></div>
		<img class="final-image abs" :class="finalImage?'shrink':''" :src="finalImage" v-show="finalImage" />
		<div class="rel" ref="container" v-show="!finalImage">
			<img :src="root+'/static/poster1.jpg'" class="poster" v-if="awardId==1 && !finalImage">
			<img :src="root+'/static/poster2.jpg'" class="poster" v-if="awardId==2 && !finalImage">
			<img :src="root+'/static/poster3.jpg'" class="poster" v-if="awardId==3 && !finalImage">
			<img :src="root+'/static/poster4.jpg'" class="poster" v-if="awardId==4 && !finalImage">
			<img :src="root+'/static/poster5.jpg'" class="poster" v-if="awardId==5 && !finalImage">
			<img class="qrcode abs" :src="qrcode" v-if="qrcode && !finalImage" />
		</div>
		<transition name="enter-fade">
			<div class="cloud abs" v-if="finalImage"></div>
		</transition>
		<transition name="enter-fade">
			<div v-if="finalImage">
				<img :src="root+'/static/poster1.jpg'" class="fake abs" v-if="awardId==1">
				<img :src="root+'/static/poster2.jpg'" class="fake abs" v-if="awardId==2">
				<img :src="root+'/static/poster3.jpg'" class="fake abs" v-if="awardId==3">
				<img :src="root+'/static/poster4.jpg'" class="fake abs" v-if="awardId==4">
				<img :src="root+'/static/poster5.jpg'" class="fake abs" v-if="awardId==5">
			</div>
		</transition>
		<transition name="enter-fade">
			<div class="long-touch abs" v-if="finalImage"></div>
		</transition>
		<transition name="enter-fade">
			<img src="./image/weixin-qr.jpg" class="tips abs" v-if="finalImage" />
		</transition>
		<!-- <transition name="enter-fade">
			<div class="close abs" v-if="finalImage" @click="close()">×</div>
		</transition> -->
		<!-- <div class="container rel" id="container">
			<div class="abs" style="color: #000; bottom: 1.04rem; right: 0.1rem;">{{ awardName }}</div>
			<img class="final-image abs" :src="finalImage" v-show="finalImage" />
			<img class="qrcode abs" :src="qrcode" v-if="qrcode" />
		</div> -->
	</div>
</template>

<script>
const qr = require('qr-image');
// const html2canvas = require('html2canvas');
export default {
	name: 'card',
	data () {
		return {
			awardId:0,
			avatar:'',
			qrcode:'',
			finalImage:'',
			isGenerating:false
		}
	},
	computed: {
		root(){
			if(window.location.origin.indexOf('ai.')>-1){
				return '/expert/activity/wish-list';
			} else {
				return '';
			}
		},
		style(){
			let str='#fff';
			if(this.awardId==1){
				str='background-color: #7ab2a5'; //日历
			}
			if(this.awardId==2){
				str='background-color: #e1dac8'; //保温杯
			}
			if(this.awardId==3){
				str='background-color: #b4dee2'; //乐高
			}
			if(this.awardId==4){
				str='background-color: #fde8e7'; //口红
			}
			if(this.awardId==5){
				str='background-color: #fde8e7'; //口红
			}
			return str;
		}
	},
	methods: {
		// 预加载2张图片
		newImage(){
			this.awardId=this.$route.query.awardId;
			let img=new Image();
			img.src=this.root+'/static/poster'+this.awardId+'.jpg';
			if(img.complete){
				window.setTimeout(()=>{
					this.generateQr();
				},50);
			}
			img.onload=()=>{
				window.setTimeout(()=>{
					this.generateQr();
				},50);
			}
		},
		// 生成二维码
		generateQr(){
			if(this.isGenerating){
				return;
			}
			this.isGenerating=true;
			let ic=this.$route.query.ic;
			ic=decodeURIComponent(ic);
			if(ic==null){
				this.showToast('邀请码为空','error');
				this.$router.go(-1);
				return;
			}
			let words = window.myDomain+'expert/skip.html?ic='+ic; 
			let png = qr.imageSync(words, {type: 'png', margin: 2});
			let base64 = png.toString('base64');
			this.qrcode = 'data:image/png;base64,'+base64;
			this.$nextTick(this.printScreen);
			// let svg = qr.imageSync(words, {type: 'svg', margin: 2});
			// this.qrcode = svg;
		},
		// 截屏
		printScreen(){
			window.html2canvas(this.$refs.container).then((canvas)=>{
				let src=canvas.toDataURL();
				this.finalImage=src;
			});
			// let that=this;
			// html2canvas(document.getElementById('container'), {onrendered: function(canvas){
			// 	let src=canvas.toDataURL();
			// 	that.finalImage=src;
			// },useCORS:true})
		},
		// 点击右上角的叉子
		close(){
			window.history.go(-1);
		}
	},
	mounted(){
		// window.card=this;
	},
	activated(){
		this.newImage();
	},
	deactivated(){
		this.finalImage='';
		this.isGenerating=false;
	}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
	.card {
		font-size: 0;
		text-align: center;
	}
	.card .bg {
		display: block;
		width: 100%;
		height: 100%;
		z-index: 1;
		background: #282729;
	}
	.card .cloud {
		width: 7.5rem;
		height: 3.5rem;
		bottom: 0;
		left: 0;
		background: url(./image/cloud.png);
		-webkit-background-size: 100% 100%;
		background-size: 100% 100%;
	}
	.card>.rel {
		display: inline-block;
		text-align: center;
		background: #fff;
		z-index: 2;
		/*width: 7.5rem;*/
		height: 85%;
	}
	.poster {
		height: 100%;
		width: auto;
	}
	.avatar {
		width: 1.6rem;
		height: 1.6rem;
		border-radius: 0.8rem;
		top: 3.32rem;
		left: 2.94rem;
	}
	.qrcode {
		bottom: 0.18rem;
		/*top: 11.4rem;*/
		right: 0.1rem;
		width: 1.4rem;
		height: 1.4rem;
		background: #fff;
	}
	.final-image {
		display: block;
		position: absolute;
		left: 0;
		right: 0;
		margin-left: auto;
		margin-right: auto;
		transform: translate(-0.1rem -0.1rem);
		z-index: 8;
		-webkit-user-select:none;
		user-select:none;
		opacity: 0;
	}
	.fake {
		width: 3.8rem;
		height: auto;
		top: 0.85rem;
		left: 0;
		right: 0;
		margin: 0 auto;
		transform: rotate(-5deg);
		box-shadow: #282729 0 0 0.3rem;
	}
	.long-touch {
		width: 7.5rem;
		height: 1.59rem;
		top: 3.5rem;
		left: 0;
		background: url(./image/long-touch.png);
		-webkit-background-size: 100% 100%;
		background-size: 100% 100%;
		z-index: 2;
	}
	.tips {
		width: 4.7rem;
		height: 1.87rem;
		bottom: 0.5rem;
		left: 0;
		right: 0;
		margin: 0 auto;
		z-index: 9;
	}
	.close {
		top: 3%;
		right: 20%;
		width: 0.7rem;
		height: 0.7rem;
		line-height: 0.7rem;
		text-align: center;
		font-size: 0.6rem;
		color: #fff;
		background: #d77;
		z-index: 5;
		border-radius: 0.35rem;
	}
	.shrink {
		transform-origin: 50% 20%;
		/*animation: shrink 2.5s;*/
		/*-webkit-animation-fill-mode: forwards;*/
		/*animation-fill-mode: forwards;*/
		box-sizing: border-box;

		transform: scale(0.85);
	}
	@keyframes shrink {
		from {
			transform: scale(1);
			border: 0.1rem solid transparent;
		}
		to {
			transform: scale(0.7);
			border: 0.1rem solid #fff;
		}
	}
</style>
