<template>
	<view class="empty-content">
		<image class="empty-content-image" :src="setSrc" mode="aspectFit"></image>
	</view>
</template>

<script>
	export default {
		props: {
			src: {
				type: String,
				default: 'empty'
			},
		},

		data() {
			return {
				typeSrc: {
					empty: '../../static/Empty.png'
				},
			}
		},

		computed: {
			setSrc() {
				return this.typeSrc[this.src];
			},
		}
	}
</script>

<style lang="scss">
	.empty-content {
		// display: flex;
		// align-items: center;
		// justify-content: center;
		// flex-direction: column;
		
		position: fixed;
		left: 0;
		top:0;
		height: 100%;
		width: 750rpx;
		background: #f2f4f7;		
		display: flex;
		justify-content: center;
		&-image {
			width: 526rpx;
			height: 352rpx;
			margin-top: 174rpx;
		}
	}
</style>
