<template>
	<view class="bg">
		<view class="header">
			<image class="image" :src="image"></image>
			<view class="right">
				<view class="title">{{title}}</view>
				<view class="spec">规格：{{spec}}</view>
			</view>
		</view>

		<view class="comment">
			<textarea @input="input" maxlength="300" placeholder="亲,收到的宝贝满意吗？说说您对商品的评价~"
				placeholder-class="placeholder"></textarea>
		</view>
		<view class="rate">
			<view class="dec">商品评价</view>
			<!-- 自定义星星大小 -->
			<view class="rate-main">
				<uni-rate class="start" active-color="#FFD653" margin="10" size="30" :value="rate"
					@change="start"></uni-rate>
				<label @click="clickRadio">
					<radio class="radio" color="#e64340" :checked='radio' />
					</radio><text>匿名</text>
				</label>
			</view>
		</view>
		<view class="bottom">
			<!-- <view class="dec">公开头像昵称,大家可以看到我</view> -->
		</view>
		<button class="button" @click="submit">提交评价</button>
	</view>
</template>

<script>
	import uniRate from '@/components/uni-rate/uni-rate.vue'

	export default {
		computed: {

		},
		components: {
			uniRate
		},
		data() {
			return {
				order_id: 0,
				product_id: 0,
				title: '',
				image: '',
				spec: '',
				rate: 5,
				radio: false,
				textarea: ''
			}
		},
		onLoad(options) {
			this.title = options.title;
			this.image = options.image;
			this.spec = options.spec || '默认规格';
			this.order_id = options.order_id;
			this.product_id = options.product_id;
		},
		methods: {
			// 星星
			start(e) {
				this.rate = e.value;
				// switch (this.rate) {
				// 	case 3:
				// 		this.radio = false;
				// 		break;
				// 	case 5:
				// 		this.radio = true;
				// 		break;
				// }
			},
			// 单选
			clickRadio(e) {
				this.radio = !this.radio;
			},
			// 输入事件
			input(e) {
				this.textarea = e.detail.value;
			},
			// 提交
			async submit() {
				let data = this.$api.request('/order/comment', 'POST', {
					order_id: this.order_id,
					product_id: this.product_id,
					rate: this.rate,
					anonymous: !this.radio ? 1 : 0,
					comment: this.textarea,
				});
				if (data) {
					let prePage = this.$api.prePage()
					if (prePage.tabCurrentIndex) {
						prePage.tabCurrentIndex = 0;
					}
					let that = this;
					setTimeout(function() {
						prePage.pullDownRefresh();
						uni.navigateBack();
					}, 2000)
				}
			}
		}
	}
</script>

<style lang="scss">
	page {
		background: #F2F4F7;
	}

	.bg {
		margin: 20rpx;
		border-radius: 20rpx;
		background-color: #ffffff;
		padding-bottom: 10rpx;
	}

	.header {
		display: flex;
		padding: 20rpx;

		.image {
			width: 140rpx;
			height: 140rpx;
			border-radius: 16rpx;
		}

		.right {

			display: inline-block;
			line-height: 45rpx;
			font-size: 28rpx;
			vertical-align: text-bottom;
			padding-bottom: 10rpx;
			width: 500rpx;
			padding-left: 20rpx;

			.title {
				color: #323233;

				text-overflow: ellipsis;
				white-space: nowrap;
				overflow: hidden;
			}

			.spec {
				color: #91949a;
				font-size: 24rpx;
			}
		}
	}

	.rate {
		padding: 24rpx;

		.dec {
			font-size: 28rpx;
			color: #323233;
			margin-bottom: 24rpx;
		}

		.rate-main {
			display: flex;
			align-items: center;
			font-size: 28rpx;

			// justify-content: space-between;
			.start {
				width: 400rpx;
				margin-right: 120rpx;
				margin-top: 24rpx;
			}

			.radio {

				height: 40rpx;
				line-height: 40rpx;
				vertical-align: baseline;
				// width: 300rpx;
				transform: scale(0.8);

			}
		}

	}

	.comment {
		padding: 20rpx;

		textarea {
			padding: 30rpx;
			background-color: #F2F4F7;
			width: 100%;
		}
	}

	.bottom {
		padding: 20rpx 20rpx 40rpx;

		.dec {
			color: #91949a;
			float: right;
		}
	}

	.button {
		margin: 20rpx;
		color: #ffffff;
		font-size: 28rpx;
		background: linear-gradient(133deg, #FF825B 0%, #FF5B5E 100%);
	}
</style>