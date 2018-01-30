<template>
	<div class="member abs full overflow-x-hidden">
		<div>
			<div style="font-size: 0;">&nbsp;</div>
			<div class="title">会员资格激活</div>
			<ul class="notice">
				<li>您将获得“AI懂条款”<span class="orange">7天使用资格</span></li>
				<li>现在注册参加抽奖，<span class="orange">100%</span>获奖资格</li>
			</ul>
			<div class="subtitle">会员资格激活</div>
			<input class="mobile-num" type="number" maxlength="11" />
			<div class="rel">
				<input class="valid-code" type="number" maxlength="4" />
				<button class="send abs">获取验证码</button>
			</div>
			<div class="center">
				<button class="activate-btn">激活</button>
			</div>
			<ul class="desc">
				<li>活动时间：2017年11月23日18点——2017年11月26日20点</li>
				<li>请提供准确电话号码注册，以便获奖后工作人员及时与您取得联系</li>
				<li>任何虚假注册，一经核实，将被取消获奖资格</li>
			</ul>
			<div class="footer"></div>
		</div>
	</div>
</template>

<script>
export default {
	name: 'member',
	data () {
		return {
		}
	},
	methods: {

	},
	mounted(){
		window.p=this;
		document.title='感恩送温暖';
		// document.writeLine('<scr'+'ipt src="/expert/php/reguser.php"><scr'+'ipt>')
	},
	activated(){
	}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
	.member:after {
		content: '';
		display: block;
		position: fixed;
		top: 0;
		z-index: -1;
		width: 7.5rem;
		height: 100%;
		background: url(./image/bg.jpg);
		-webkit-background-size: 100% 100%;
		background-size: 100% 100%;
	}
	.title {
		margin-top: 0.52rem;
		width: 7.5rem;
		height: 1.95rem;
		background: url(./image/title-bg.png) center center no-repeat;
		-webkit-background-size: contain;
		background-size: contain;
		font-size: 0.36rem;
		color: #7cffcc;
		line-height: 1.95rem;
	}
	.notice {
		margin: 0.3rem 0 0 0.4rem;
		display: block;
		box-sizing: border-box;
		width: 6.7rem;
		height: 1.8rem;
		background: url(./image/notice-bg.png);
		-webkit-background-size: 100% 100%;
		background-size: 100% 100%;
		color: #75f6e4;
		font-size: 0.3rem;
		text-align: left;
		padding-top: 0.32rem;
		padding-left: 0.8rem;
	}
	.notice li {
		line-height: 0.55rem;
	}
	.notice .orange {
		color: #ecc439;
	}
	.subtitle {
		margin-top: 0.4rem;
		width: 100%;
		height: 0.73rem;
		line-height: 0.73rem;
		font-size: 0.32rem;
		color: #7cffcc;
		background: url(./image/subtitle-bg.png) center 0 no-repeat;
		-webkit-background-size: contain;
		background-size: contain;
	}
	input {
		left: 0.8rem;
		width: 5.9rem;
		height: 0.75rem;
		line-height: 0.75rem;
		font-size: 0.4rem;
		box-sizing: border-box;
		padding-left: 0.2rem;
		color: #555;
		border: 0.01rem solid #ccc;
		outline: none;
		border-radius: 0.1rem;
	}
	input.mobile-num {
		margin-top: 0.3rem;
	}
	input.valid-code {
		margin-top: 0.3rem;
	}
	.send {
		top: 0.3rem;
		right: 0.8rem;
		width: 2.1rem;
		height: 0.75rem;
		background: none;
		border: none;
		font-size: 0.3rem;
		line-height: 0.75rem;
		padding: 0 0.2rem;
		color: #437cc8;
	}
	.send:after {
		position: absolute;
		display: block;
		content: '';
		width: 0.02rem;
		height: 0.4rem;
		background: #437cc8;
		z-index: 1;
		margin-top: -0.56rem;
		margin-left: -0.2rem;
	}
	.activate-btn {
		margin-top: 0.3rem;
		width: 5.91rem;
		height: 0.95rem;
		line-height: 0.95rem;
		background: url(./image/btn.png);
		-webkit-background-size: 100% 100%;
		background-size: 100% 100%;
		border: none;
		font-size: 0.34rem;
		color: #fff;
	}
	.desc {
		margin: 1rem 0 1rem 0.4rem;
		display: block;
		box-sizing: border-box;
		width: 6.6rem;
		color: #75f6e4;
		font-size: 0.26rem;
		line-height: 0.36rem;
		text-align: left;
		padding-top: 0.32rem;
		padding-left: 0.4rem;
	}
	.footer	{
		margin-bottom: 0.2rem;
		width: 7.5rem;
		height: 0.22rem;
		background: url(./image/footer.png) center center no-repeat;
		-webkit-background-size: contain;
		background-size: contain;
	}
</style>
