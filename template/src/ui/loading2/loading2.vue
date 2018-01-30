<template>
	<transition name="fade-out">
		<div class="filter" v-if="$root.UI.loading2.show">
			<div class="loading-wrap">
				<div class="loading-image">
					<div class="stripe stripe1" :style="'background-color:'+$root.UI.loading2.color1"></div>
					<div class="stripe stripe2" :style="'background-color:'+$root.UI.loading2.color2"></div>
					<div class="stripe stripe3" :style="'background-color:'+$root.UI.loading2.color1"></div>
					<div class="stripe stripe2" :style="'background-color:'+$root.UI.loading2.color2"></div>
					<div class="stripe stripe1" :style="'background-color:'+$root.UI.loading2.color1"></div>
				</div>
				<div class="loading-message" v-text="$root.UI.loading2.text">
					
				</div>
			</div>
		</div>
	</transition>
</template>

<script>
export default {
	name: 'Loading2',
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
div.filter {
	position: absolute;
	width: 100%;
	height: 100%;
	z-index: 998;
	background: #fff;
}
div.loading-wrap {
	position: absolute;
	width: 1.5rem;
	height: 2.9rem;
	background: none;
	top: 0;
	bottom: 2rem;
	left: 0;
	right: 0;
	margin: auto auto;
	z-index: 999;
	border-radius: 0.2rem;
}
div.loading-image {
	position: relative;
	width: 1.5rem;
	height: 2.3rem;
	/*background: red;*/
	font-size: 0;
}
div.stripe {
	display: inline-block;
	width: 0.1rem;
	height: 0.8rem;
	border-radius: 0.04rem;
}
div.stripe + div.stripe {
	margin-left: 0.25rem;
}
div.stripe1 {
	animation: jump 1.6s infinite cubic-bezier(0.85, 0.25, 0.37, 0.85);
}
div.stripe2 {
	animation: jump 1.6s 0.45s infinite cubic-bezier(0.85, 0.25, 0.37, 0.85);
}
div.stripe3 {
	animation: jump3 1.6s infinite cubic-bezier(0.85, 0.25, 0.37, 0.85);
}

@keyframes jump {
	from, to {
		transform: scaleY(1);
	}
	50% {
		transform: scaleY(0.4);
	}
}
@keyframes jump3 {
	from, to {
		transform: scaleY(0.4);
	}
	50% {
		transform: scaleY(1);
	}
}


div.loading-message {
	height: 0.4rem;
	line-height: 0.4rem;
	font-size: 0.32rem;
	color: #fff;
	text-align: center;
}
img.loading {
	display: block;
	position: absolute;
	width: 1.7rem;
	height: 1.7rem;
	left: 0;
	right: 0;
	margin: 0.25rem auto 0;
	animation: rotate 2s infinite linear;
}
@keyframes rotate {
	from {
		transform: rotate(0deg);
	}
	to {
		transform: rotate(360deg);
	}
}
</style>
