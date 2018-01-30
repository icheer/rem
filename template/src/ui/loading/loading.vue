<template>
	<transition name="fade">
		<div class="filter" v-if="$root.UI.loading.show">
			<div class="loading-wrap" v-if="!$root.UI.loading.filter">
				<div class="loading-image">
					<img src="./image/loading.png" class="loading">
				</div>
				<div class="loading-message" v-text="$root.UI.loading.text">
					
				</div>
			</div>
		</div>
	</transition>
</template>

<script>
export default {
	name: 'Loading',
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
	background: rgba(0,0,0,0.25);
}
div.loading-wrap {
	position: absolute;
	width: 2.5rem;
	height: 2.9rem;
	background: rgba(0,0,0,0.6);
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
	width: 2.5rem;
	height: 2.3rem;
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
