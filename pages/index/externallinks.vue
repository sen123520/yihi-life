<template>
	<view>
		<!-- // 外链 -->
		<web-view :src="url"></web-view>
	</view>
</template>

<script>
	export default {
		onLoad(options) {
			uni.showLoading({
				title: '加载中'
			});
			this.url = decodeURIComponent(options.url);
			setTimeout(() =>{
				uni.hideLoading();
			}, 500);
		},
		data() {
			return {
				url: ''
			};
		}
	}
</script>

<style lang="less">

</style>