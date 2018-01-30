<template>
	<div class="blank abs full overflow-hidden">
		<textarea  v-model="text"></textarea><br>
		<button @click="speak(text)">说话</button>
	</div>
</template>

<script>
export default {
	name: 'blank',
	data () {
		return {
			text:''
		}
	},
	methods: {
		speak: message => {
		  const msg = new SpeechSynthesisUtterance(message);
			msg.voice = window.speechSynthesis.getVoices()[0];
			window.speechSynthesis.speak(msg);
		}
	},
	mounted(){
	},
	activated(){
		this.showLoading2('#f39800');
	},
	deactivated(){
		this.hideLoading2();
	}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
	.blank{
		width: 100%;
		height: 100%;
		padding-top: 1rem;
		box-sizing: border-box;
	}
	textarea {
		width: 6rem;
		height: 2rem;
		font-size: 0.5rem;
	}
	button {
		margin-top: 0.3rem;
		width: 2rem;
		height: 0.8rem;
		font-size: 0.5rem;
	}
</style>
