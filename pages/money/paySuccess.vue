<template>
	<view class="content">
		<image src="../../static/success.png" mode="aspectFill"></image>
		<text class="tit">支付成功</text>
		<view class="btn-group ">
			<view class="other-btn mix-btn" @click="toOther" v-if="this.url">
				支付铁青订单
			</view>
			<navigator url="/pages_other/order/order?state=0" open-type="redirect" class="mix-btn">查看订单</navigator>
			<navigator url="/pages/index/index" open-type="switchTab" class="mix-btn hollow">返回首页</navigator>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				url: ''
			}
		},
		onLoad(option) {
			this.url = option.url
		},
		methods: {

			async toOther() {
				console.log('5455556413');
				//app时跳转到浏览器打开this.url
				//h5 时跳转到指定this.url页面
				// #ifdef H5
				// 在H5环境下执行的操作
				window.location.href = this.url;
				// #endif
				
				// #ifdef APP
				// 在APP或其他非H5环境下执行的操作
				plus.runtime.openURL(this.url).catch(() => {
					// 如果uni.openURL调用失败（例如在不支持直接打开URL的小程序中）
					uni.showToast({
						title: '无法直接打开链接，请手动复制并访问:',
						duration: 2000
					});
					uni.setClipboardData({
						data: this.url,
					});
				});
				// #endif
			}
		}
	}
</script>

<style lang='scss'>
	.content {
		height: 80vh;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		image{
			width: 120rpx;
			height: 120rpx;
		}
	}


	.tit {
		font-size: 32rpx;
		color: #323233;
		margin-top: 12rpx;
	}

	.btn-group {
		padding-top: 96rpx;
	}

	.mix-btn {
		width: 300rpx;
		height: 80rpx;
		margin-top: 24rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size:28rpx;
		border-radius: 106rpx;
		color: #fff;
		background: linear-gradient( 270deg, #FF7A00 0%, #FF3D00 100%);

		&.hollow {
			background: #fff;
			color: #323233;
			border: 1px solid rgba(50, 50, 51, 0.6);
		}
	}
</style>