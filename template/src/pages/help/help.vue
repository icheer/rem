<template>
	<div class="help abs full overflow-x-hidden">
		<div class="award rel" v-show="hostName">
			<swiper :options="swiperOption" ref="mySwiper">
				<!-- slides -->
				<swiper-slide class="swiper-no-swiping">
					<img src="../wish/image/award_1.jpg" alt="">
				</swiper-slide>
				<swiper-slide class="swiper-no-swiping">
					<img src="../wish/image/award_2.jpg" alt="">
				</swiper-slide>
				<swiper-slide class="swiper-no-swiping">
					<img src="../wish/image/award_3.jpg" alt="">
				</swiper-slide>
				<swiper-slide class="swiper-no-swiping">
					<img src="../wish/image/award_4.jpg" alt="">
				</swiper-slide>
				<swiper-slide class="swiper-no-swiping">
					<img src="../wish/image/award_5.jpg" alt="">
				</swiper-slide>
			</swiper>
		</div>
		<div class="avatar" v-show="hostName">
			<img :src="hostAvatarUrl" alt="">
		</div>
		<div class="user" v-show="hostName">
			<p>{{hostName}}发起的助力</p>
		</div>
		<div v-if="canHelp===true" style="margin-top: 0.35rem;">
			<div class="input" v-if="!$root.user.isBindMobile">
				<input type="text" class="mobile" placeholder="手机号码" maxlength="11" v-model="mobile">
				<input type="text" class="veri-code" placeholder="验证码" maxlength="4" v-model="veriCode">
				<button :disabled="countdownSMS>0" v-text="countdownSMS>0?countdownSMS+'秒':'获取验证码'" @click="getVeriCode()"></button>
			</div>
			<button class="adv" :disabled="mobile.length<11 || veriCode.length<4 || !hasSentSMS" @click="helpFriend()">为好友助力</button>
		</div>
		<div v-else-if="alreadyHelped===true" class="slogan"></div>
		<div v-else-if="alreadyHelped===false" class="sorry"></div>
		<div class="friends" v-if="(canHelp===true || alreadyHelped===true) && helped.length">
			<div class="title">已助力好友</div>
			<!-- <div class="no-one" v-if="helped && helped.length==0">还没有好友助力，快继续邀请好友吧</div> -->
			<div class="friend" v-for="help in helped">
				<img class="icon" :src="help.avatarUrl" />
				<span class="name">{{ help.nickName }}</span>
				<span class="date">{{ help.createTime.slice(0,10).replace(/-/g, ".") }}</span>
			</div>
		</div>
		<p class="rule" v-html="rule" v-show="hostName"></p>
		<div class="join abs" @click="goToNewWish()" v-show="hostName && $root.user.valid"></div>
	</div>
</template>

<script>
import { swiper, swiperSlide } from 'vue-awesome-swiper'
require('swiper/dist/css/swiper.css')

export default {
	name: 'main',
	data () {
		return {
			rule:'活动规则：<br/>1.活动时间：2017年12月20日—2017年12月30日<br/>2. 每选择一种礼物，需邀请相应数量的好友通过注册完成助力<br/>3. 被邀请好友只能为邀请人做一次助力<br/>4. 可多次邀请好友助力，一次只能发起一个助力。在助力完成登记领取信息后，可再次发起助力  <br/>5.奖品在登记领取信息后进行发放，实际发放根据活动进程中奖品的库存情况进行调配 <br/>*本活动最终解释权归AI懂条款所有',
			swiperOption: {
				notNextTick: true,
				autoplay: false,
				direction : 'horizontal',
				grabCursor : true,
				setWrapperSize :true,
				autoHeight: true,
				// pagination : '.swiper-pagination',
				paginationClickable :true,
				// prevButton:'.swiper-button-prev',
				// nextButton:'.swiper-button-next',
				// scrollbar:'.swiper-scrollbar',
				mousewheelControl : true,
				observeParents:true,
				debugger: true,
				// onTransitionStart(swiper){
				// 	console.log(swiper)
				// },
			},
			hostName:'',
			hostAvatarUrl: '',
			awardId:'',
			awardName:'',
			canHelp: null,
			alreadyHelped: null,
			mobile: '',
			veriCode: '',
			exp:'',
			token:'',
			hasSentSMS: false,
			countdownSMS: 0,
			countdownTask: null,
			helped:[]
		}
	},
	computed: {
		swiper() {
			return this.$refs.mySwiper.swiper
		}
	},
	methods: {
		// 判断活动是否已结束
		isValid(){
			let valid = this.$root.user.valid;
			if(valid===false){
				this.showToast('活动已结束','');
				return false;
			} else {
				return true;
			}
		},
		getVeriCode(){
			if(this.isValid()===false){
				return;
			}
			let customerId=window.sessionStorage.getItem('customerId');
			let mobile=this.mobile;
			let reg=/^1[3-9][0-9]\d{8}$/;
			if(!reg.test(mobile)){
				this.showToast('手机号不合法,请重新输入','');
				return;
			}
			window._czc && window._czc.push(["_trackEvent",'■受邀人获取验证码','',this.$root.user.customerId+'/'+this.$root.user.nickname]);
			this.countdownSMS=60;
			this.countdown();
			this.$util.ajax('/verifycode/sendVerifyCode','POST',{
				customerId: customerId,
				mobile: this.mobile
			}).then((res)=>{
				if(res.code=='100000'){
					this.hasSentSMS=true;
					this.token=res.data.token;
					this.exp=res.data.exp;
				}
			});
		},
		countdown(){
			if(this.countdownSMS<=0){
				this.countdownSMS=0;
				window.clearTimeout(this.countdownTask);
				return;
			}
			this.countdownSMS--;
			this.countdownTask=setTimeout(()=>{
				this.countdown();
			},1000);
		},
		// 获取能否帮助的信息
		getHelpInfo(){
			let customerId=this.$root.user.customerId || JSON.parse(window.sessionStorage.getItem('user')).customerId;
			let ic=this.$util.getQueryString('ic');
			this.$util.ajax('/customer/helper','POST',{
				customerId: customerId,
				invitationCode: ic,
				code: 'HELP_ACTIVITY'
			}).then((res)=>{
				if(res.code=='100000'){
					let helpFlag=res.data.isHelped;
					if(helpFlag==2){
						this.canHelp=false;
						this.alreadyHelped=false;
					} else if(helpFlag==3){
						this.canHelp=true;
						this.alreadyHelped=false;
					} else if(helpFlag==4){
						this.canHelp=false;
						this.alreadyHelped=true;
					}
					this.helped=res.data.helped;
					this.hostAvatarUrl=res.data.avatarUrl;
					this.hostName=res.data.nickName;
					this.awardId=res.data.awardId;
					this.inviteTimes=res.data.inviteTimes;
					let awardId=res.data.awardId;
					if(awardId==1){
						this.swiper.slideTo(0,false);
					}
					if(awardId==2){
						this.swiper.slideTo(1,false);
					}
					if(awardId==3){
						this.swiper.slideTo(2,false);
					}
					if(awardId==4){
						this.swiper.slideTo(3,false);
					}
					if(awardId==5){
						this.swiper.slideTo(4,false);
					}
					let flag=res.data.isHelped;
					if(flag=='2'){
						this.canHelp=false;
						this.alreadyHelped=false;
						return;
					}
					if(flag=='3'){
						this.canHelp=true;
						this.alreadyHelped=false;
						return;
					}
					if(flag=='4'){
						this.canHelp=false;
						this.alreadyHelped=true;
						return;
					}
				}
			});
		},
		helpFriend(){
			if(this.isValid()===false){
				return;
			}
			window._czc && window._czc.push(["_trackEvent",'■受邀人绑定手机号','',this.$root.user.customerId+'/'+this.$root.user.nickname]);
			let customerId=this.$root.user.customerId;
			let ic=this.$util.getQueryString('ic');
			this.$util.ajax('/activity/mobile/bind','POST',{
				activityCode: 'HELP_ACTIVITY',
				awardId: this.awardId,
				mobile: this.mobile,
				customerId: customerId,
				inviteCode: ic,
				verificationCode: this.veriCode,
				exp: this.exp,
				token: this.token,
				inviteTimes: this.inviteTimes
			}).then((res)=>{
				if(res.code=='100000'){
					this.getHelpInfo();
				} else if(res.code=='110001') {
					this.getHelpInfo();
				}
			});
		},
		goToNewWish(){
			window.location.replace('/expert/skip.html');
		}
	},
	mounted(){
		window.help=this;
	},
	activated(){
		// this.doAndRetry(this.getActivityCost);
		// this.swiper.slideTo(3, 1000, false);
		this.getHelpInfo();
	}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
	.help{
		width: 100%;
		height: 100%;
	}
	.award{
		width: 100%;
		height: 4.82rem;
		z-index: -10;
		/*z-index: 100;*/
	}
	.award img{
		width: 7.5rem;
		height: 4.82rem;
		display: block;
	}
	.swiper-slide{
		overflow: hidden;
		width: 7.5rem;
		height: 4.82rem;
	}
	.swiper-container{
		height: 4.82rem;
	}
	.award:before{
		content: '';
		width: 100%;
		height: 1.01rem;
		display: block;
		position: absolute;
		z-index: 10;
		bottom:-0.03rem;
		left: 0;
		background: url(../wish/image/award-bg.png);
		-webkit-background-size: 100% 100%;
		background-size: 100% 100%;
	}
	.avatar{
		display: block;
		margin: -1.34rem auto 0.15rem;
		width: 1.4rem;
		height: 1.4rem;
		border-radius: 50%;
		position: relative;
		overflow: hidden;
		z-index: 20;
		border: 0.12rem solid #fff;
	}
	.avatar img{
		width: 1.4rem;
		height: 1.4rem;
		top:0;
		left: 0;
		position: absolute;
		z-index: 200;
	}
	.user{
		padding-bottom: 0.25rem;
	}
	.user p{
		margin: 0;
		color: #5b5b5b;
	}
	.slogan {
		width: 7.5rem;
		height: 0.27rem;
		background: url(./image/slogan.png) center 0 no-repeat;
		-webkit-background-size: 5.45rem 0.27rem;
		background-size: 5.45rem 0.27rem;
		margin-top: 0.24rem;
	}
	.sorry {
		width: 6.6rem;
		height: 1.64rem;
		margin-top: 0.35rem;
		margin-left: 0.45rem;
		border: 0.02rem solid #f39800;
		border-radius: 0.2rem;
		background: url(./image/sorry.png) center center no-repeat;
		-webkit-background-size: 5.68rem 0.87rem;
		background-size: 5.68rem 0.87rem;
	}
	.input{
		box-sizing: border-box;
		width: 6.6rem;
		height: 2.2rem;
		border: 0.02rem solid #f39800;
		border-radius: 0.2rem;
		margin-left: 0.45rem;
		text-align: left;
		font-size: 0;
	}
	input::-webkit-input-placeholder{
		color: #ccc;
		opacity:1;
	}
	.input input{
		display: block; 
		width: 4.1rem;
		height: 1.06rem;
		box-sizing: border-box;
		margin-left: 0.34rem;
		font-size: 0.34rem;
		padding-left: 0.06rem;
		border: none;
		outline: none;
		color: #323232;
	}
	.input input:focus{
		border: none;
	}
	.input input.mobile{
		width: 5.88rem;
		border-bottom: 0.01rem solid #ccc;
	}
	.input input.veri-code {
		display: inline-block;
	}
	.input button {
		display: inline-block;
		font-size: 0.34rem;
		line-height: 1.06rem;
		color: #323232;
		width: 1.9rem;
		height: 1.06rem;
		padding: 0;
		border: 0;
		background: none;
	}
	button.adv {
		width: 6.6rem;
		height: 1rem;
		background-color: #f89904;
		border-radius: 0.2rem;
		font-size: 0.38rem;
		color: #fff;
		line-height: 1rem;
		border: 0;
		padding: 0;
		margin: 0.38rem 0 0 0;
	}
	button.adv[disabled] {
		background: #ccc;
	}
	.friends {
		width: 6.6rem;
		margin-left: 0.45rem;
		box-sizing: border-box;
		border: 0.02rem solid #f39800;
		border-radius: 0.2rem;
		margin-top: 0.35rem;
	}
	.friends .title {
		height: 0.9rem;
		line-height: 0.9rem;
		font-size: 0.34rem;
		color: #333;
		border-bottom: 0.02rem solid #f39800;
	}
	.friends .no-one {
		height: 0.8rem;
		line-height: 0.8rem;
		font-size: 0.28rem;
		color: #5b5b5b;
	}
	.friend + .friend {
		border-top: 0.01rem solid #ccc;
	}
	.friends .friend {
		width: 5.8rem;
		margin-left: 0.4rem;
		font-size: 0;
		color: #5b5b5b;
		text-align: left;
		padding-top: 0.16rem;
		padding-bottom: 0.16rem;
		box-sizing: border-box;
		white-space: nowrap;
	}
	.friends .friend span {
		display: inline-block;
		font-size: 0.28rem;
		vertical-align: top;
		line-height: 0.45rem;
		overflow: hidden;
	}
	.friends .icon {
		display: inline-block;
		width: 0.48rem;
		height: 0.48rem;
		border-radius: 0.24rem;
		line-height: 0.8rem;
		margin-right: 0.3rem;
	}
	.friends .name {
		width: 3.6rem;
	}
	.rule {
		text-align: left;
		margin: 0.35rem 0.56rem 0.56rem 0.56rem;
		font-size: 0.22rem;
		color: #5b5b5b;
		max-height: 999px;
		line-height: 0.34rem;
	}
	.join {
		top: 4.1rem;
		right: 0.1rem;
		width: 1.21rem;
		height: 1.25rem;
		background: url(./image/present.png);
		-webkit-background-size: 100% 100%;
		background-size: 100% 100%;
		/*animation: up-down 4s infinite ease-in-out;*/
	}
	@keyframes up-down {
		from, to {
			transform: translateY(0);
		}
		50% {
			transform: translateY(-0.15rem);
		}
	}
</style>
