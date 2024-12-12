<template>
	<view class="main">
		<uni-section class="mb-10" :title="name" :sub-title="exchange_ratio" type="line">
			<view class="main-ipt">
				<view>当前还剩：{{datas.value}}</view>
				<view class="">
					<text>兑换数：</text><input type="text" v-model="num" />
				</view>
			</view>
		</uni-section>
		<button @click="changeBeen" class="btn">兑换</button>
		<view class="transferHistory"
		@click="navto('/pages_other/userinfo/wallet_log?type=changeBeenLog&name=兑换历史')">
			兑换历史
		</view>
		<uni-popup ref="message" type="message">
			<uni-popup-message :type="msgType" :message="messageText" :duration="2000"></uni-popup-message>
		</uni-popup>
	</view>
</template>

<script>
	export default {
		onLoad(data) {
			this.datas = data
		},
		data() {
			return {
				datas: {},
				num: '',
				msgType: '',
				messageText: '',
			};
		},
		computed: {
			name() {
				return this.datas.name + '兑换奖励积分'
			},
			exchange_ratio() {
				return '奖励积分兑换比是1比' + this.datas.exchange_ratio
			},
		},
		methods: {
			// 兑换奖励积分
			changeBeen() {
				uni.showModal({
					title: '提示',
					content: '是否使用' + this.num + this.datas.name + '兑换奖励积分',
					success: (res) => {
						if (res.confirm) {
							if(Number(this.datas.value) >= this.num && this.num > 0){
								this.$api.request('/user/changeBeen', 'POST', {
									type: this.datas.type,
									num: this.num,
								}).then().catch((err) => console.log(err)).finally(() => {
									this.msgType = 'success'
									this.messageText = `兑换成功`
									this.$refs.message.open()
								
									// setTimeout(() => {
									// 	this.$router.go(0)
									// }, 800);
								})
							}else{
								uni.showToast({
									title: `${this.datas.name}不足或者输入有误`,
									duration: 3000,
									icon:'error'
								});
							}
						} else if (res.cancel) {
							console.log('无事发生');
						}
					}
				});
			},
			navto(e) {
				this.$api.navTo(`${e}`)
			},
		}
	}
</script>

<style lang="less" scoped>
	.main {


		height: calc(100vh - 88rpx);
		background-color: #f8f8f8;
		padding-top: 20rpx;

		.main-ipt {
			// display: flex;
			padding: 20rpx 40rpx;

			text {
				font-size: 28rpx;
			}

			input {
				width: 80%;
				font-size: 28rpx;
			}
		}

		.btn {
			width: 50%;
			color: #fff;
			padding: 0 19px;
			margin: 0 auto;
			border-radius: 100px;
			height: 39px;
			line-height: 39px;
			font-size: 15px;
			background: #d34d68;
			box-shadow: 1px 2px 5px rgba(244, 67, 54, 0.4);
		}
	}

	.uni-section .uni-section-header__decoration.line {
		background-color: #d34d68;
	}

	.button-text {
		color: #fff;
		font-size: 12px;
	}

	.success-text {
		color: #09bb07;
	}

	.uni-section {
		margin-bottom: 40rpx;

		::v-deep .uni-section-header {
			.uni-section-header__decoration{
				background-color: #d34d68;
			}
		}
	}
	.transferHistory{
		text-align: center;
		margin-top: 40px;
		font-size: 16px;
		text-decoration: underline;
		color: #d34d68;
	}
</style>