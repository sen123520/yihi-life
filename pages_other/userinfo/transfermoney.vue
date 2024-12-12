<template>
	<view class="main">
		<!-- <uni-section class="mb-10" :title="name" :sub-title="exchange_ratio" type="line">
			
		</uni-section> -->
		<view class="main-ipt">
			<text>用户名：</text><input type="text" v-model="name" placeholder="请输入转账的用户名" />
		</view>
		<view class="main-ipt">
			<text>转账类型：</text><uni-data-select v-model="value" :localdata="range" @change="change"></uni-data-select>
		</view>
		<view class="main-ipt">
			<text>当前还剩：{{currentQuantity}}</text>
		</view>
		<view class="main-ipt">
			<text>转账数：</text><input type="text" v-model="num" placeholder="请输入转账数" />
		</view>
		<view class="input-item">
			<text class="tit">请输入安全密码</text>
			<input type="password" v-model="password" placeholder="请输入密码" />
		</view>
		<button @click="changeBeen" class="btn">转账</button>
		<view class="transferHistory"
		@click="navto('/pages_other/userinfo/wallet_log?type=transferMoneyLog&name=转账历史')">
			转账历史
		</view>
		<uni-popup ref="message" type="message">
			<uni-popup-message :type="msgType" :message="messageText" :duration="2000"></uni-popup-message>
		</uni-popup>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				num: '',
				name: '',
				msgType: '',
				messageText: '',
				value: '',
				range: [{
						value: 'been',
						text: "奖励积分"
					},
					{
						value: 'been_benefit',
						text: "消费奖励积分"
					},
					{
						value: 'greenscore',
						text: "购物券"
					},
					{
						value: 'greenscore_benefit',
						text: "福利购物券"
					},
					{
						value: 'real_money',
						text: "余额"
					},
					{
						value: 'rebuyscore',
						text: "复消积分"
					},
				],
				type: {
					'been': '奖励积分',
					'been_benefit': '消费奖励积分',
					'greenscore': '购物券',
					'greenscore_benefit': '福利购物券',
					'real_money': '余额',
					'rebuyscore':'复消积分'
				},
				currentQuantity:'',
				password: '',
				infos:'',
				throttleTime: 2000, // 节流时间
				lastClickTime: 0 // 上次点击时间
			};
		},
		onLoad(e) {
			this.value = e.type
			
			this.currentQuantity = e.value
		},
		computed: {

		},
		methods: {
			// 转账
			changeBeen() {
				const currentTime = Date.now();
				if (this.name == '') {
					this.messageToggle('warn', '请输入用户名')
				} else if (this.value == '') {
					this.messageToggle('warn', '请选择转账类型')
				} else if (this.num == '') {
					this.messageToggle('warn', '请输入转账数')
				} else if (this.password == '') {
					this.messageToggle('warn', '请输入安全密码')
				} else {
					//if (currentTime - this.lastClickTime >= this.throttleTime) {
					  uni.showModal({
					  	title: '提示',
					  	content: '是否给用户' + this.name + '转账' + this.num + this.type[this.value],
					  	success: async (res) => {
					  		if (res.confirm) {
					  			let data = await this.$api.request('/user/transferMoney', 'POST', {
									to_username: this.name,
									to_score: this.num,
									type: this.value,
									password: this.password,
								})

								if(data !== false){
									this.msgType = 'success'
									this.messageText = `转账成功`
									this.$refs.message.open()
									// console.log(this.infos);
									// setTimeout(() => {
									// 	uni.redirectTo({
									// 		url: '/pages_other/userinfo/wallet'
									// 	});
									// }, 800);
								}
					  		} else if (res.cancel) {
					  			console.log('无事发生');
					  		}
					  	}
					  });
					  this.lastClickTime = currentTime;
					//}
					
				}
			},
			change(e) {
				// console.log("e:", e);
			},
			messageToggle(type, text) {
				this.msgType = type
				this.messageText = text
				this.$refs.message.open()
			},
			navto(e) {
				this.$api.navTo(`${e}`)
			},
		}
	}
</script>

<style lang="less">
	.main {


		height: calc(100vh - 88rpx);
		background-color: #f8f8f8;
		padding-top: 20rpx;

		.main-ipt {
			background-color: white;
			display: flex;
			align-items: center;
			padding: 20rpx 40rpx;
			margin: 20rpx 0;
			height: 100rpx;

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
			.uni-section-header__decoration {
				background-color: #d34d68;
			}
		}
	}

	.input-item {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		justify-content: center;
		padding: 30upx;
		background: #fff;
		height: 130upx;
		border-radius: 4px;
		margin-bottom: 50upx;
		position: relative;

		&:last-child {
			margin-bottom: 0;
		}

		.tit {
			height: 60upx;
			line-height: 66upx;
			font-size: 15px;
			// color: #ccc;
		}

		input {
			height: 70upx;
			font-size: 12px;
			// color: #fff;
			width: 100%;
		}

		.get_captcha {
			position: absolute;
			right: 20upx;
			display: block;
			width: 30%;
			background: #f8f8f8;
			color: #fff;
			text-align: center;
			line-height: 60upx;
			height: 60upx;
			border-radius: 40upx;
			z-index: 100;
			font-size: 22upx;
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