<template>
	<transition name="fade">
		<div class="toast-wrap" :class="$root.UI.toast.bottom?'bottom':''" v-if="$root.UI.toast.show">
			<div class="rel">
				<div class="toast-image">
					<img src="./image/success.png" class="toast-img" v-if="$root.UI.toast.icon=='success'">
					<img src="./image/error.png" class="toast-img" v-if="$root.UI.toast.icon=='error'">
					<img src="./image/warning.png" class="toast-img" v-if="$root.UI.toast.icon=='warning'">
				</div>
				<div class="toast-message" :class="{'with-icon':$root.UI.toast.icon, 'red':$root.UI.toast.icon=='warning'}">
					<span class="content break" v-text="$root.UI.toast.text"></span>
				</div>
			</div>
		</div>
	</transition>
</template>

<script>
export default {
	name: 'Toast',
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
div.toast-wrap {
	position: fixed;
	width: 5rem;
	height: 2.9rem;
	top: 0;
	bottom: 2rem;
	left: 0;
	right: 0;
	margin: auto auto;
	z-index: 999;
}
div.toast-wrap.bottom {
	top:auto;
	bottom: -0.8rem;
	margin: 0 auto;
}
div.rel {
	position: relative;
	width: 5rem;
	height: 2.9rem;
	overflow: visible;
	text-align: center;
}
div.toast-image {
	position: absolute;
	width: 2.5rem;
	height: 2.3rem;
	left: 0;
	right: 0;
	margin: 0 auto;
}
img.toast-img {
	display: block;
	position: absolute;
	width: 1.8rem;
	height: 1.8rem;
	left: 0;
	right: 0;
	margin: 0.3rem auto 0;
	z-index: 996;
}
div.toast-message {
	display: inline-block;
	margin: 0 auto;
	min-width: 2.5rem;
	line-height: 0.5rem;
	font-size: 0.32rem;
	color: #fff;
	text-align: center;
	background: rgba(0,0,0,0.6);
	border-radius: 0.2rem;
	/*padding: 0.2rem;*/
}
div.toast-message.with-icon {
	top: 0;
	padding-top: 2.25rem;
	padding-bottom: 0.15rem;
}
div.toast-message.with-icon .content {
	padding: 0rem 0.3rem;
}
div.toast-message .content {
	display: block;
	padding: 0.2rem 0.3rem;
}
div.toast-message.red {
	color: #f00;
	font-weight: bold;
}
</style>
