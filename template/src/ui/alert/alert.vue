<template>
	<transition name="fade-quickly">
		<div class="filter" v-if="$root.UI.alert.show">
				<div class="alert-wrap">
					<div class="rel overflow-hidden">
						<div class="alert-message break" v-text="$root.UI.alert.text" style="text-align: left;"></div>
						<a href="javascript:void(0);" class="btn confirm" @click="confirm()" v-text="$root.UI.alert.btn"></a>
						<a href="javascript:void(0);" class="btn cancel" @click="cancel()" v-show="$root.UI.alert.callback2">取消</a>
					</div>
				</div>
		</div>
	</transition>
</template>

<script>
export default {
	name: 'Alert',
	methods: {
		confirm: function(){
			this.hideAlert();
			let callback1=this.$root.UI.alert.callback1;
			this.$util.isFunction(callback1) && callback1();
		},
		cancel: function(){
			this.hideAlert();
			let callback2=this.$root.UI.alert.callback2;
			this.$util.isFunction(callback2) && callback2();
		}
	}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
div.filter {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background: rgba(0,0,0,0.6);
	z-index: 998;
}
div.alert-wrap {
	position: absolute;
	width: 5.8rem;
	height: 3.2rem;
	background: #fff;
	top: 0;
	bottom: 1rem;
	left: 0;
	right: 0;
	margin: auto auto;
	z-index: 999;
	border-radius: 0.08rem;
	font-size: 0.3rem;
}
div.alert-wrap .rel {
	box-sizing: border-box;
	width: 5.8rem;
	height: 3.2rem;
	padding: 0.9rem 0.4rem 0 0.4rem;
}
div.alert-message {
	line-height: 0.5rem;
	color: #161616;
}
a.btn {
	position: absolute;
	bottom: 0.36rem;
	display: inline-block;
	width: 1.2rem;
	height: 0.6rem;
	line-height: 0.6rem;
	text-align: center;
	text-decoration: none;
}
a.confirm {
	right: 0.3rem;
	color: #009c00;
}
a.cancel {
	right: 1.7rem;
	color: #777;
}
</style>
