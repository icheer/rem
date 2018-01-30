<template>
	<!-- 最外层wish加abs,目的是为了多个页面切换的时候可以使用vue的transition动画 -->
	<div class="wish abs full overflow-x-hidden">
		<!-- <div class="num abs" v-if="state=='complete'">
			恭喜, 助力人数已满!
		</div> -->
		<div class="award rel">
			<div class="slide-prev abs" v-show="state=='start' && !selected" @click.stop="swiper.slidePrev()"></div>
			<div class="slide-next abs" v-show="state=='start' && !selected" @click.stop="swiper.slideNext()"></div>
			<swiper :options="swiperOption" ref="mySwiper">
				<!-- slides -->
				<swiper-slide>
					<img src="./image/award_1.jpg" alt="">
					<a href="javascript:void(0);" class="flag abs" v-if="state=='start'" :class="{isSelected:selected===1}">
					</a>
				</swiper-slide>
				<swiper-slide>
					<img src="./image/award_2.jpg" alt="">
					<a href="javascript:void(0);" class="flag abs" v-if="state=='start'" :class="{isSelected:selected===2}">
					</a>
				</swiper-slide>
				<swiper-slide>
					<img src="./image/award_3.jpg" alt="">
					<a href="javascript:void(0);" class="flag abs" v-if="state=='start'" :class="{isSelected:selected===3}">
					</a>
				</swiper-slide>
				<swiper-slide>
					<img src="./image/award_4.jpg" alt="">
					<a href="javascript:void(0);" class="flag abs" v-if="state=='start'" :class="{isSelected:selected===4}">
					</a>
				</swiper-slide>
				<swiper-slide>
					<img src="./image/award_5.jpg" alt="">
					<a href="javascript:void(0);" class="flag abs" v-if="state=='start'" :class="{isSelected:selected===5}">
					</a>
				</swiper-slide>
				<div class="swiper-button-prev swiper-button-white" slot="button-prev" v-if="0"></div>
				<div class="swiper-button-next swiper-button-white" slot="button-next" v-if="0"></div>
				<!-- Optional controls -->
				<!--<div class="swiper-pagination" slot="pagination" v-show="state=='start'"></div>-->
			</swiper>
		</div>
		<div class="avatar"><img :src="$root.user.avatarUrl" alt=""></div>
		<div class="user">
			<p>{{$root.user.nickname}}，送给爱<span>{{textInfo}}</span>的你</p>
		</div>
		<div v-show="state=='start'" v-cloak>
			<!--如果是老用户不显示input框部分-->
			<!--<div class="input">-->
			<div class="input" v-if="!$root.user.isBindMobile">
				<input type="text" placeholder="手机号码" maxlength="11" v-model="mobile">
				<input type="text" placeholder="验证码" maxlength="4" class="second" v-model="verCode">
				<button :class="{canuse :verCodeCanUse}" ref="getVerCode" :disabled='getVerificationCodeFlag' @click="getVerificationCode()">{{'获取验证码'}}</button>
			</div>
			<p class="old-mobile" v-if="$root.user.isBindMobile">{{$root.user.isBindMobile}}</p>
			<button class="adv" @click="toInvite" @touchstart="toastInfo('select')" :disabled="!$root.user.isBindMobile && (mobile.length<11 || verCode.length<4) || selected==''">邀请好友助力</button>
		</div>
		<div v-show="state=='continue'" v-cloak>
			<div class="list">
				<p class="title">
					已助力好友
				</p>
				<div class="item" v-if="helperList.length>0" v-for="item in helperList">
					<img :src="item.avatarUrl" alt="">
					<p class="user_info">
						{{item.nickName}}
					</p>
					<p class="time">
						{{item.createTime.split(' ')[0]}}
          </p>
				</div>
				<p v-if="helperList.length<1" style="color: #5b5b5b;">还没有好友助力，快继续邀请好友吧</p>
			</div>
			<button class="adv" @click="goOnInvite" v-if="notEnough">继续邀请好友助力</button>
			<button class="adv" @click="receiveAward" v-else>去领奖</button>
		</div>
		<div v-show="state=='complete'" v-cloak>
			<div class="receive">
				<div class="title">
					<p>邮寄信息</p>
					<p>请确保您提供的邮寄和身份证信息准确无误，我们将凭借有效的身份证号码进行礼品邮寄，因用户输入的错误邮寄信息导致的错误邮寄,我们将不承担重复邮寄。</p>
				</div>
				<p class="phone">{{mobile}}</p>
				<input type="text" placeholder="姓名" v-model="recipientName">
				<input type="text" placeholder="收件地址" v-model="recipientAddress">
				<input type="text" placeholder="身份证号码" v-model="idNumber">
			</div>
			<button class="adv" @click="commitInfo" :disabled="recipientName.length==0 || recipientAddress.length==0 || idNumber.length==0">提交</button>
		</div>
		<p class="rule" v-html="rule"></p>
	</div>
</template>

<script>
import Vue from 'vue'
import { swiper, swiperSlide } from 'vue-awesome-swiper'
require('swiper/dist/css/swiper.css')

export default {
	name: 'main',
	components: {
		swiper,
		swiperSlide,
	},
	data () {
		return {
			notEnough:true,
			ic:'',
			awardName:'',
			recipientName:'',
			recipientAddress:'',
			idNumber:'',
			helperList:[],
			textInfo:'陪伴',
			verCode:'',
			awardId:'',
			selected:false,
			mobile:'',
			oldUser:false,
			customerId:'',
			state:'',
			exp:'',
			token:'',
			code:'',
			getVerificationCodeFlag:false,
			rule:'活动规则：<br/>1.活动时间：2017年12月20日—2017年12月30日<br/>2. 每选择一种礼物，需邀请相应数量的好友通过注册完成助力<br/>3. 被邀请好友只能为邀请人做一次助力<br/>4. 可多次邀请好友助力，一次只能发起一个助力。在助力完成登记领取信息后，可再次发起助力  <br/>5.奖品在登记领取信息后进行发放，实际发放根据活动进程中奖品的库存情况进行调配 <br/>*本活动最终解释权归AI懂条款所有',
//			rule:'活动规则：<br/>1. 本次活动时间12月15日—30日<br/>2. 每选择一种礼物,需要邀请相应数量的好友,扫描自己的专属海报,进行注册来完成助力<br/>3. 被邀请的好友只能为邀请人做一次助力<br/>4. 可多次邀请好友助力，一次只能发起一个助力，在助力完成后，可再次发起助力 <br/>*本活动最终解释权归AI懂条款所有',
			qrcode:'',
			finalImage:'',
			swiperOption: {
				isLock:false,
				avatarUrl:'',
				helpedList:[],
				notNextTick: true,
				direction : 'horizontal',
				grabCursor : true,
				setWrapperSize :true,
				autoHeight: true,
				uniqueNavElements :true,
				pagination : '.swiper-pagination',
				paginationClickable :true,
				prevButton:'.swiper-button-prev',
				nextButton:'.swiper-button-next',
				mousewheelControl : true,
				observeParents:true,
				debugger: true,
				onTransitionEnd:(swiper)=>{
					let i = swiper.activeIndex;
					i=i%5;
					i==0?i=5:null;
					switch(i){
						case 1:
							this.textInfo='学习';
							break;
						case 2:
							this.textInfo='健康';
							break;
						case 3:
							this.textInfo='陪伴';
							break;
						case 4:
							this.textInfo='美丽';
							break;
						case 5:
							this.textInfo='美丽';
							break;
					}
				},
				autoplay: 2000,
				autoplayDisableOnInteraction: false,
				autoplayStopOnLast: false,
				loop: true,
				onTap:(swiper)=>{
					let i = swiper.activeIndex;
					i=i%5;
					i==0?i=5:null;
					this.selectAward(i);
					return;
				},
				onTouchMove:(swiper)=>{
					let i = swiper.activeIndex;
					i=i%5;
					i==0?i=5:null;
					this.toastInfo('lock');
					return;
				}
			}
		}
	},
	activated(){
		this.customerId = this.$root.user.customerId || JSON.parse(window.sessionStorage.getItem('user')).customerId
		let urlStr = window.location.href
		//发起页
		if(this.$util.getQueryString('new')){
			let userInfo = {
				customerId:this.customerId,
				code:'HELP_ACTIVITY'
			}
			//判断用户是否已发起助力
			this.$util.ajax('/customer/myHelper','post',userInfo).then((res)=>{
				if(res.code==100000){
					if(res.data.isHelped==1){
						this.state='start'
					}else if(res.data.isHelped==2){
						this.state='continue'
						this.ic=res.data.invitationCode
						this.awardId=res.data.awardId
						this.inviteTimes = res.data.inviteTimes
						this.helperList = res.data.helped
						//如果助力人数已满，切换文案信息
						if(this.judgeState(this.awardId,this.helperList.length)){
							this.notEnough = false
						}
						//锁定轮播
						this.lockCarousel(this.awardId)
					}
				}
			})
			return
		}
		//助力列表页
		if(this.$util.getQueryString('ic')){
			this.state='continue'
			this.getHelper()
			return
		}
	},
	deactivated() {
		this.selected = false
	},
	mounted(){
		window.wish=this
	},
	methods: {
		isValid(){
			var valid=this.$root.user.valid
			if(valid===false){
					this.showToast('活动已结束','')
			    return false
			}else{
			    return true
			}
		},
		//获取用户手机信息，判断用户是否已领奖
		getPhone(userInfo){
			this.$util.ajax('/customer/activity/awardRecipientsInfo','post',userInfo).then((res)=>{
				if(res.code==100000){
					this.mobile = res.data.mobile
				}else if(res.code==110000){
					this.showAlert('领奖信息早已成功提交啦', this.closePage,null);
				}
			})
		},
		//锁定轮播
		lockCarousel(awardId){
			//轮播跳转到指定礼物
			this.$refs.mySwiper.swiper.slideTo(awardId,false);
			//关闭轮播，禁止滑动
			this.swiper.stopAutoplay()
			this.swiper.lockSwipes()
			this.setTextInfo(awardId)
		},
		//去领奖
		receiveAward(){
			//获取用户手机号信息，判断用户是否已领奖
			let customerId = this.customerId
			let awardId = this.awardId
			let inviteTimes = this.inviteTimes
			let customerInfo = {
				customerId: customerId,
				awardId: awardId,
				inviteTimes: inviteTimes
			}
			// 显示领奖界面
			this.state = 'complete';
			//锁定轮播
			this.lockCarousel(this.awardId)
			//获取用户手机号判断用户是否已领奖
			this.getPhone(customerInfo)
			return
		},
		//判断用户助力人数是否已满
		judgeState(awardId,listLength){
				// //测试环境拉3人即可领奖,打包到生产环境千万要注释掉哦
				// if(listLength>=3){
				// 	return true;
				// }
		    if(awardId==1 || awardId==3){
					if(listLength >= 10){
					    return true
					}else{
					    return false
					}
				}else if(awardId==2 || awardId==4){
					if(listLength >= 15){
						return true
					}else{
						return false
					}
				}else if(awardId==5){
					if(listLength >= 20){
						return true
					}else{
						return false
					}
				}
		},
		toInviteAgain(){
			if(!this.isValid()){
				return
			}
			window.location.replace('/expert/skip.html')
		},
		//更新奖品信息(文字,达成需要的人数)
		setTextInfo(awardId){
			switch(awardId)
			{
				case 1:
					this.textInfo='学习'
					break;
				case 2:
					this.textInfo='健康'
					break;
				case 3:
					this.textInfo='陪伴'
					break;
				case 4:
					this.textInfo='美丽'
					break;
				case 5:
					this.textInfo='美丽'
					break;
			}
		},
		//奖品选中状态
		selectAward(num){
			if(this.state!='start'){
				return;
			}
			if(num===this.selected){
				this.selected=''
				this.isLock=false
				this.awardId = ''
				this.swiper.startAutoplay()
				this.swiper.unlockSwipes()
				return
			}
			this.selected = num
			this.awardId = num
			this.isLock = true
			this.setTextInfo(num)
			//奖品Id
			this.swiper.lockSwipes()
			this.swiper.stopAutoplay()
		},
		// 获取验证码
		getVerificationCode() {
			if(!this.isValid()){
			    return
			}
			if(!this.selected){
				this.showToast('您还没有选择礼物哦~','');
				return;
			}
			if(!this.verCodeCanUse){
				this.showToast('手机号不合法,请重新输入','');
				return
			}
			window._czc && window._czc.push(["_trackEvent",'■发起人获取验证码','',this.$root.user.customerId+'/'+this.$root.user.nickname]);
			let that = this
			// 读秒操作
			let second = 60;
			let getVerCode = that.$refs.getVerCode;
			var timer = setInterval(() => {
				second--;
				if (second > 0) {
					let ttext = '剩余' + second + '秒';
					getVerCode.style.color = '#ccc';
					getVerCode.innerHTML = ttext;
				} else {
					getVerCode.style.color = '';
					getVerCode.innerHTML = '获取验证码';
					that.getVerificationCodeFlag = false;
					clearInterval(timer);
				}
			}, 1000);
			//发送验证码
			let json={
				customerId:this.customerId,
				mobile:this.mobile
			}
			//禁止用户再次点击
			that.getVerificationCodeFlag = true;
			this.$util.ajax('/verifycode/sendVerifyCode','post',json).then(function(res){
				if(res.code=='100000'){
					that.exp=res.data.exp
					that.token=res.data.token
				}
			})
		},
		//提示用户先选礼物 or 取消选择礼物
		toastInfo(flag){
			if(!this.selected && flag=='select'){
				this.showToast('请先选择一种礼物哦~','');
				return;
			}
			if(this.isLock && flag=='lock'){
				this.showToast('请先取消当前选中的礼物','');
				return;
			}
		},
		//邀请好友助力
		toInvite(){
			if(!this.isValid()){
				return
			}
			let that = this
			if(this.awardId==1){
				this.awardName='2018物种日历';
			}
			if(this.awardId==2){
				this.awardName='HERMOS 膳魔师 JNL系列500毫升';
			}
			if(this.awardId==3){
				this.awardName='乐高方头仔';
			}
			if(this.awardId==4){
				this.awardName='Dior粉漾魅惑变色唇膏 #01粉色';
			}
			if(this.awardId==5){
				this.awardName='Dior烈焰蓝金唇膏 #999';
			}
			//如果是老用户直接邀请，不验证手机验证码
			if(this.$root.user.isBindMobile){
			    let oldCustomer={
						customerId: this.customerId,
						code:'HELP_ACTIVITY',
						mobile:this.$root.user.isBindMobile,
						awardId:this.awardId,
						awardName:this.awardName
					}
					this.sendInvite(oldCustomer)
					return
			}
			//新用户先验证手机和验证码再邀请
			let newCustomer={
				customerId: this.customerId,
				code:'HELP_ACTIVITY',
				mobile: this.mobile,
				awardId:this.awardId,
				awardName:this.awardName,
				verificationCode: this.verCode,
				token: this.token,
				exp: this.exp
			}
			this.sendInvite(newCustomer)
		},
		//继续邀请好友助力
		goOnInvite(){
			if(!this.isValid()){
				return
			}
		    let ic = this.$util.getQueryString('ic') || this.ic;
				//页面跳转
				this.$router.push('/card?ic='+ic+'&awardId='+this.awardId);
		},
		//发送邀请请求
		sendInvite(json){
			let that = this
			if(!json.awardId){
				this.showToast('您还没有选择礼物哦','');
				return
			}
			this.$util.ajax('/customer/invitationCode/get','post',json).then(function (res) {
				if(res.code=='100000'){
					that.ic = res.data.invitationCode
					that.$router.push('/card?ic='+that.ic+'&awardId='+res.data.awardId);
				}
			})
		},
		//获取助力列表
		getHelper(){
			let json={
				customerId:this.customerId,
				invitationCode:this.$util.getQueryString('ic'),
				code:'HELP_ACTIVITY'
			}
			this.$util.ajax('/customer/helper','post',json).then((res)=>{
				if(res.code==100000){
					this.awardId=res.data.awardId;
					this.helperList = res.data.helped
					this.inviteTimes = res.data.inviteTimes
					//判断助力人数是否已满
					if(this.judgeState(this.awardId,this.helperList.length)){
						this.num='恭喜, 助力人数已满!'
						this.notEnough = false
					}
					//锁定轮播
					this.lockCarousel(this.awardId)
				}
			})
		},
		//关闭页面
		closePage(){
			window.WeixinJSBridge && window.WeixinJSBridge.call('closeWindow');
		},
		//验证身份证号
		checkNum(idCard){
			//15位和18位身份证号码的正则表达式
			var regIdCard = /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/;

			//如果通过该验证，说明身份证格式正确，但准确性还需计算
			if (regIdCard.test(idCard)) {
				if (idCard.length == 18) {
					var idCardWi = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2); //将前17位加权因子保存在数组里
					var idCardY = new Array(1, 0, 10, 9, 8, 7, 6, 5, 4, 3, 2); //这是除以11后，可能产生的11位余数、验证码，也保存成数组
					var idCardWiSum = 0; //用来保存前17位各自乖以加权因子后的总和
					for (var i = 0; i < 17; i++) {
						idCardWiSum += idCard.substring(i, i + 1) * idCardWi[i];
					}

					var idCardMod = idCardWiSum % 11; //计算出校验码所在数组的位置
					var idCardLast = idCard.substring(17); //得到最后一位身份证号码

					//如果等于2，则说明校验码是10，身份证号码最后一位应该是X
					if (idCardMod == 2) {
						if (idCardLast == "X" || idCardLast == "x") {
							return idCard;
						} else {
							return false;
						}
					} else {
						//用计算出的验证码与最后一位身份证号码匹配，如果一致，说明通过，否则是无效的身份证号码
						if (idCardLast == idCardY[idCardMod]) {
							return idCard;
						} else {
							return false;
						}
					}
				}
			} else {
				return false;
			}
		},
		//提交收件信息
		commitInfo(){
			if(this.checkNum(this.idNumber)===false){
			    this.showToast('身份证号不合法，请重新输入','')
					return
			}
			let obj={
				customerId: this.customerId,
				inviteTimes: this.inviteTimes,
				idNumber: this.idNumber,
				recipientName: this.recipientName,
				recipientAddress: this.recipientAddress
			}
			this.$util.ajax('/activity/receiveAward','post',obj).then( (res)=> {
				if(res.code==100000){
					this.showAlert('提交成功！', this.closePage, null);
				}
			})
		}
	},
	computed: {
		swiper() {
			return this.$refs.mySwiper.swiper
		},
		// 验证手机号码格式
		verCodeCanUse(){
			var phoneReg = /^1[34578][0-9]{9}$/;
			if (phoneReg.test(this.mobile)) {
				return true
			}
		}
	}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
	.swiper-pagination{
		width: 50%;
		left: 26%;
		top: 2.6rem;
		height: 0.25rem;
	}
	.num{
		padding: 0 0.2rem;
		height: 0.76rem;
		background-color: #f89904;
		font-size: 0.36rem;
		color: #fff;
		line-height: 0.76rem;
		border-radius: 0 1rem 1rem 0;
		top:0.4rem;
		left: 0;
	}
	.flag{
		width: 0.63rem;
		height: 0.63rem;
		top:3.2rem;
		right: 0.2rem;
		/*overflow: hidden;*/
		z-index: 100;
		background: url(./image/flag_bg1.png) no-repeat;
		background-position: 100% 100%;
		background-size: 100% 100%;
	}
	.flag:before{
		content: '请勾选';
		width: 1.3rem;
		height: 0.63rem;
		line-height: 0.63rem;
		display:inline-block;
		position: absolute;
		right: 0.7rem;
		top:0;
		color: #fff;
		font-size: 0.4rem;
		z-index: 111;
	}
	.isSelected{
		background: url(./image/flag_bg2.png) no-repeat;
		background-position: 100% 100%;
		background-size: 100% 100%;
	}
	.isSelected:before{
		content: '已勾选';
		width: 1.3rem;
		height: 0.65rem;
		line-height: 0.65rem;
		display:inline-block;
		position: absolute;
		right: 0.7rem;
		top:0;
		color: #fff;
		font-size: 0.4rem;
		z-index: 111;
	}
	.wish{
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
	 background: url(image/award-bg.png);
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
	.input{
		margin: 0 auto;
		box-sizing: border-box;
		width: 6.6rem;
		height: 2.21rem;
		border-radius: 0.2rem;
		border: 0.02rem solid #f39700;
		padding: 0 0.35rem;
		text-align: left;
	}
	.input .canuse{
		color: #323232;
	}
	.old-mobile {
		width: 6.6rem;
		height: 1rem;
		line-height: 1rem;
		font-size: 0.35rem;
		margin: 0 0 0 0.45rem;
		border-radius: 0.2rem;
		border: 0.02rem solid #f39700;
		color: #666;
	}
	.list{
		margin: 0 auto;
		box-sizing: border-box;
		width: 6.6rem;
		border-radius: 0.2rem;
		border: 0.02rem solid #f39700;
		text-align: center;
	}
	.receive{
		margin: 0 auto;
		box-sizing: border-box;
		width: 6.6rem;
		/*height: 6.15rem;*/
		border-radius: 0.2rem;
		border: 0.02rem solid #f39700;
		/*padding: 0 0.35rem*/
	}
	.receive .title{
		height: 1.75rem;
		border-bottom: 0.02rem solid #f39700;
		color: #323232;
	}
	.receive .title p:first-child{
		font-size: 0.34rem;
		margin: 0.2rem 0;
	}
	.receive .title p:last-child{
		font-size: 0.24rem;
		margin: 0 0.35rem;
	}
	.receive .phone{
		padding-left: 0.1rem;
		font-size: 0.34rem;
		color: #323232;
		margin: 0 0.35rem 0 0.35rem;
		line-height: 1.1rem;
		text-align: left;
		border-bottom: 0.01rem solid #ccc;
	}
	.receive input{
		box-sizing: border-box;
		display: block;
		height: 1.1rem;
		margin: 0 0.35rem;
		width: 5.88rem;
		font-size: 0.34rem;
		color: #323232;
		border-bottom: 0.01rem solid #ccc;
	}
	.receive input:last-child{
		border-bottom: none;
	}
	.receive input::-webkit-input-placeholder {
		color: #ccc;
	}
	.list .title{
		margin: 0;
		width: 100%;
		border-bottom: 0.02rem solid #f39700;
		line-height: 0.9rem;
		font-size: 0.34rem;
		color: #323232;
	}
	.list .item{
		height: 0.8rem;
		margin: 0 0.35rem;
		text-align: left;
		border-bottom: 0.01rem solid #ccc;
	}
	.list .item:last-child{
		border-bottom: none;
	}
	.list .item img{
		vertical-align: middle;
		width: 0.46rem;
		height: 0.46rem;
		border-radius: 50%;
		margin-right: 0.3rem;

	}
	.list .item p.user_info,
	.list .item p.time
	{
		margin: 0;
		font-size: 0.28rem;
		color: #5b5b5b;
		line-height: 0.8rem;
		display: inline-block;
	}
	.list .item p.time{
		float: right;
	}
 .input input{
	 font-size: 0.34rem;
	 margin: 0;
	 padding: 0;
	 border: none;
	 height: 1.06rem;
	 color: #323232;
 }
 input{
	 outline: none;
	 border: none;
	 border-bottom: 0.01rem solid #ccc;
 }
	input:focus{
		border: none;
		outline: none;
		border-bottom: 0.01rem solid #ccc;
	}
 .input input:first-child{
	 width: 5.88rem;
	 border-bottom: 0.01rem solid #ccc;
 }
	.input input.second{
		margin-top: 0.01rem;
		outline: none;
		border: none;
		width: 4rem;
	}
	.input input.second:focus{
		border: none;
		outline: none;
	}
	.input input::-webkit-input-placeholder {
		color: #ccc;
		opacity:1;
	}
	.input button{
		font-size: 0.34rem;
		line-height: 1.06rem;
		color: #ccc;
		/*color: #323232;*/
		width: 1.8rem;
		float: right;
		height: 1.06rem;
		padding: 0;
		border: 0;
		outline: none;
		background: none;
	}
	button.adv{
		width: 6.6rem;
		height: 0.99rem;
		background-color: #f89904;
		border-radius: 0.2rem;
		font-size: 0.38rem;
		color: #fff;
		line-height: 0.99rem;
		border: 0;
		padding: 0;
		margin: 0.38rem 0 0.44rem 0;
	}
	button.adv[disabled] {
		background: #ccc;
	}
	.rule{
		text-align: left;
		margin: 0 0.56rem 0.5rem 0.56rem;
		font-size: 0.22rem;
		line-height: 0.34rem;
		color: #5b5b5b;
		max-height: 999px;
	}
	.swiper-button-prev{
		background-image: url('./image/left.png');
		margin-left: 0.2rem;
	}
	.swiper-button-next{
		background-image: url('./image/right.png');
		margin-right: 0.2rem;
	}
	.slide-prev {
		top: 1.6rem;
		left: 0;
		width: 0.28rem;
		height: 0.5rem;
		padding: 0.26rem;
		background: url(./image/left.png) center center no-repeat;
		-webkit-background-size: 0.28rem 0.5rem;
		background-size: 0.28rem 0.5rem;
		z-index: 5;
	}
	.slide-next {
		top: 1.6rem;
		right: 0;
		width: 0.28rem;
		height: 0.5rem;
		padding: 0.26rem;
		background: url(./image/right.png) center center no-repeat;
		-webkit-background-size: 0.28rem 0.5rem;
		background-size: 0.28rem 0.5rem;
		z-index: 5;
	}
</style>
