<template>
	<transition name="fade-quickly">
		<div class="filter" v-if="$root.UI.modal.show">
				<div class="modal-wrap">
					<div class="rel overflow-hidden">
						<div class="abs close" @click="cancel()"></div>
						<div class="modal-message pre-wrap" v-text="$root.UI.modal.text"></div>
						<div class="modal-desc break" v-if="$root.UI.modal.desc" v-text="$root.UI.modal.desc"></div>
						<div class="abs btns">
							<div class="btn btn1" v-text="$root.UI.modal.btn1" @click="clickBtn1"></div>
							<div class="btn btn2" v-text="$root.UI.modal.btn2" @click="clickBtn2"></div>
						</div>
					</div>
				</div>
		</div>
	</transition>
</template>

<script>
export default {
	name: 'Modal',
	methods: {
		clickBtn1: function(){
			this.hideModal();
			let callback1=this.$root.UI.modal.callback1;
			this.$util.isFunction(callback1) && callback1();
		},
		clickBtn2: function(){
			this.hideModal();
			let callback2=this.$root.UI.modal.callback2;
			this.$util.isFunction(callback2) && callback2();
		},
		cancel: function(){
			this.hideModal();
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
	background: rgba(0,0,0,0.6);
	z-index: 996;
}
div.modal-wrap {
	position: absolute;
	width: 6.3rem;
	height: 3.9rem;
	background: #284473;
	top: 0;
	bottom: 1rem;
	left: 0;
	right: 0;
	margin: auto auto;
	z-index: 997;
	border-radius: 0.2rem;
	font-size: 0.3rem;
}
div.modal-wrap .rel {
	box-sizing: border-box;
	width: 6.3rem;
	height: 3.9rem;
	padding: 0.7rem 0.2rem 0 0.3rem;
}
.close {
	top: 0.06rem;
	right: 0.08rem;
	width: 0.63rem;
	height: 0.63rem;
	background: url(./image/close.png) center center no-repeat;
}
.modal-message {
	line-height: 1.47;
	color: #fcfcfc;
	font-size: 0.28rem;
}
.modal-desc {
	line-height: 1.47;
	color: #79aaef;
	font-size: 0.24rem;
	margin-top: 0.24rem;
}
.btns {
	bottom: 0;
	left: 0;
	width: 100%;
	height: 1rem;
	font-size: 0;
	border-top: 0.01rem solid #111;
}
.btn {
	box-sizing: border-box;
	display: inline-block;
	width: 50%;
	height: 1rem;
	font-size: 0.28rem;
	color: #7efd95;
	line-height: 1rem;
	text-align: center;
}
.btn1 {
	border-right: 0.01rem solid #111;
}
</style>
