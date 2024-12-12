<template>
	<view>
		<view class="topBox">
			<view class="scoreBox">
				<view class="t1">{{extend_info.wallet.been}}</view>
				<view class="t2">可提现</view>
			</view>
		</view>


		<view class="main_content">

			<view class="tabBox">
				<v-tabs v-model="current" :tabs="tabs" :scroll="false" activeColor="#323232" height="100upx"
					fontSize="30upx" :lineAnimation="false" :bold="false" color="#ccc" lineColor="#323232"
					lineHeight="5rpx"></v-tabs>
			</view>


			<view class="bank-card" v-if="!current">
				<view class="cash-content-top">
					<view class="cash-place">
						<view class="lef">提现到 :</view>
						<view class="rig">
							<view class="uni-input">{{bank_array[bank_index]}}</view>
							<!-- <picker @change="bindPickerChange" :value="index" :range="array">
								<view class="uni-input">{{array[index]}}</view>
							</picker> -->
						</view>
					</view>

					<view class="cash-place" style="margin-top: 20rpx;">
						<view class="lef">银行卡号 :</view>
						<view class="rig">
							<view class="uni-input">{{bank_num}}</view>
						</view>
					</view>

					<view class="cash-place" style="margin-top: 20rpx;">
						<view class="lef">真实姓名 :</view>
						<view class="rig">
							<text class="wallet">{{ real_name }}</text>
						</view>
					</view>

					<view class="cash-place" style="margin-top: 20rpx;">
						<view class="lef">身份证号 :</view>
						<view class="rig">
							<text class="wallet">{{ real_idcard }}</text>
						</view>
					</view>

					<view class="cash-place" style="margin-top: 20rpx;">
						<view class="lef">手机号 :</view>
						<view class="rig">
							<text class="wallet">{{ userInfo.real_mobile }}</text>
						</view>
					</view>
					<view class="cash-place" style="margin-top: 20rpx;">
						<view class="lef">安全密码 :</view>
						<view class="rig">
							<input type="text" v-model="safe_password" placeholder="" />
						</view>
						<!-- <view class="get_captcha" @click="getCaptcha">
							获取验证码
						</view> -->
					</view>

					<view class="cash-number">
						<view>提现金额 :</view>
						<input type="number" v-model="getMoney" placeholder="请输入提现金额" class="number" />
					</view>

				</view>
				<!-- tips -->
				<view class="cash-content-mid">
					<view class="title">银行卡提现说明：</view>
					<view>1.银行卡<text style="color: #ff0000;">归属人必须与真实姓名</text>一致，提现人员年龄需小于等于<text
							style="color: #ff0000;">60</text>岁</view>
					<view>2.提现前需在[我的]页面中，进行[实名认证]</view>
					<view>3.银行卡提现手续费为<text style="color: #ff0000;">8%</text></view>
					<view>4.单次提现金额为<text style="color: #ff0000;">100元以上</text></view>
					<view>5.每月<text style="color: #ff0000;">3号、18号</text>（节假日或特殊情况顺延）统一处理提现请求，三个工作日内到账</view>

				</view>
				<view class="cash-content-bot" @click="useBank()">
					<view>申请提现</view>
				</view>
			</view>

			<!-- 微信钱包  -->
			<view v-else>
				<view class="cash-content-top">
					<view class="cash-place">
						<view class="lef">提现到 :</view>
						<view class="rig"><text class="wallet">微信钱包</text></view>
					</view>
					<view class="cash-place" style="margin-top: 20rpx;">
						<view class="lef">手机号 :</view>
						<view class="rig">
							<text class="wallet">{{ userInfo.real_mobile }}</text>
						</view>
					</view>
					<view class="cash-place" style="margin-top: 20rpx;">
						<view class="lef">安全密码 :</view>
						<view class="rig">
							<input type="text" v-model="safe_password" placeholder="" />
						</view>
						<!-- <view class="get_captcha" @click="getCaptcha">
							{{get_captcha}}
						</view> -->
					</view>
					<view class="cash-number">
						<view>提现金额 :</view>
						<input type="number" v-model="getMoney" placeholder="请输入提现金额" class="number" />
					</view>
				</view>
				<!-- tips -->
				<view class="cash-content-mid">
					<view class="title">注意事项</view>
					<view>1.申请成功后，资金会转入您的微信钱包余额</view>
					<view>2.每次可提现100-200元,一天最多提5次</view>
					<view>3.每日0:00至8:00为系统维护时间，无法提现</view>
				</view>
				<view class="cash-content-bot" @click="useWechat()">
					<view>申请提现</view>
				</view>
			</view>
			<view class="tips">* 只提现整数金额</view>
			<view class="tips withdrawalRecords" 
			@click="navto('/pages_other/userinfo/wallet_log?type=withdrawalRecords&name=提现记录')">
				提现记录
			</view>
		</view>
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex';
	export default {
		data() {
			return {
				extend_info: {
					level: {
						rebate_level_name: '',
					},
					wallet: {
						been: 0,
					}
				},
				current: 0,
				tabs: ['银行卡提现'],
				real_name: '',
				real_idcard: '',
				bank_num: '',
				bank_array: ['请选择', '工商银行', '建设银行', '农业银行', '交通银行', '中国银行', '招商银行', '浦发银行', '邮政储蓄银行', '兴业银行', '民生银行',
					'光大银行', '广发银行', '华夏银行', '平安银行', '浙商银行'
				],
				bank_index: 0,
				getMoney: null,
				safe_password: '',
				get_captcha: '获取验证码',
				title: 'picker',
				array: [],
				index: 0,
				throttleTime: 2000, // 节流时间
				lastClickTime: 0 // 上次点击时间
			};
		},
		computed: {
			...mapState(['userInfo'])
		},
		onLoad() {
			this.checkRealname();
			this.loadData();
			// this.getBankInformation()
		},
		methods: {
			bindPickerChange: function(e) {
				this.index = e.detail.value
			},
			checkRealname() {
				if (Boolean(this.userInfo.real_name) == false ||
					Boolean(this.userInfo.real_idcard) == false ||
					Boolean(this.userInfo.bank_name) == false ||
					Boolean(this.userInfo.bank_num) == false
				) {
					let that = this;
					uni.showModal({
						title: '需要填写实名信息',
						content: '实名后才可提现，现在去填写实名信息？',
						success: function(res) {
							if (res.confirm) {
								that.$api.navTo('/pages_other/userinfo/realname')
							} else if (res.cancel) {
								uni.navigateBack();
							}
						}
					});
				}
			},
			async loadData() {
				let e_info = await this.$api.request("/user/getUserExtendInfo");
				this.extend_info = e_info;

				if (Boolean(this.userInfo.real_name) == true) {
					this.real_name = this.userInfo.real_name;
				}

				if (Boolean(this.userInfo.real_idcard) == true) {
					this.real_idcard = this.userInfo.real_idcard;
				}

				if (Boolean(this.userInfo.bank_name) == true) {
					this.bank_index = this.bank_array.indexOf(this.userInfo.bank_name);
				}
				this.bank_num = this.userInfo.bank_num;
			},
			async useBank() {
				const currentTime = Date.now();
				
				this.checkRealname();

				if (Boolean(this.userInfo.real_name) == false ||
					Boolean(this.userInfo.real_idcard) == false ||
					Boolean(this.userInfo.bank_name) == false ||
					Boolean(this.userInfo.bank_num) == false
				) {
					return;
				}

				if (this.getMoney > this.extend_info.wallet.been) {
					this.$api.msg('奖励积分不够');
				}
				if (this.getMoney < 100) {
					this.$api.msg('最少提现100');
				}
				
				//if (currentTime - this.lastClickTime >= this.throttleTime) {
				  let data = await this.$api.request('/user/withdrawBank', 'POST', {
				  	getMoney: this.getMoney,
				  	safe_password: this.safe_password,
				  });
				  //this.lastClickTime = currentTime;
				//}
				let that = this;
				if (data) {
					setTimeout(function() {
						that.$api.navTo('/pages_other/userinfo/wallet')
					}, 1000);
				}


			},
			async useWechat() {
				this.checkRealname();

				if (Boolean(this.userInfo.real_name) == false ||
					Boolean(this.userInfo.real_idcard) == false ||
					Boolean(this.userInfo.bank_name) == false ||
					Boolean(this.userInfo.bank_num) == false
				) {
					return;
				}

				if (this.getMoney > this.extend_info.wallet.been) {
					this.$api.msg('奖励积分不够');
				}

				let data = await this.$api.request('/user/withdrawWechat', 'POST', {
					getMoney: this.getMoney,
					safe_password: this.safe_password,
				});
				let that = this;
				if (data) {
					setTimeout(function() {
						that.$api.navTo('/pages_other/userinfo/wallet')
					}, 1000);
				}
			},
			async getCaptcha() {
				let that = this;
				let num = 60;

				if (this.userInfo.mobile == '') {
					this.$api.msg('请输入手机号码');
					return;
				}
				let data = await this.$api.request('/sms/send', 'POST', {
					mobile: this.userInfo.mobile,
					event: 'withdraw'
				});
				if (data) {
					that.get_captcha = num + ' S';
					let intervalId = setInterval(function() {
						num--;
						that.get_captcha = num + ' S';
						if (num == 0) {
							that.get_captcha = '获取验证码'
							clearInterval(intervalId);
						}
					}, 1000);
				}

			},
			// 获取银行信息
			async getBankInformation() {
				try {
					const data = await this.$api.request('/user/getBankList', 'POST')
					this.array = data
				} catch (err) {
					console.log(err);
				}
			},
			navto(e) {
				this.$api.navTo(`${e}`)
			},
		}
	}
</script>

<style lang="scss">
	.topBox {
		background-image: url("data:image/png;base64,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");
		background-color: $uni-color-success;
		padding: 40upx 0 80upx;

		.scoreBox {
			text-align: center;
			color: #fff;

			.t1 {
				font-size: $font-xlg + 6upx;
			}

			.t2 {
				font-size: $font-base;
			}
		}
	}

	.main_content {
		position: relative;
		overflow: hidden;
		top: -45upx;
		width: 100%;
		border-top-right-radius: 30upx;
		border-top-left-radius: 30upx;
		background: #fff;
	}

	.cash-content-top {
		margin: 63upx 80upx 0 80upx;

		.cash-place,
		.cash-number {
			display: flex;
			justify-content: space-between;
			align-items: center;
			width: 100%;
			padding: 0 40upx;
			box-sizing: border-box;
			height: 100upx;
			background: #f8f8f8;
			border-radius: 10upx;

			image {
				width: 60upx;
				margin-right: 10upx;
			}

			view {
				font-size: 32upx;
				line-height: 100upx;

				&.lef {
					font-weight: 700;
				}

				&.rig {
					display: flex;
					align-items: center;

					.iconfont {
						color: #ff5555;
						font-size: 40upx;
						font-weight: normal;
					}

					.wallet {
						margin-left: 5upx;
						color: #808080;

					}

					.wallet-input {
						width: 350rpx;
						text-align: right;
					}
				}
			}
		}

		.cash-number {
			margin-top: 25upx;

			view {
				font-size: 32upx;
				font-weight: 700;
			}

			input {
				flex: 1;
				display: inline-block;
				font-size: 32upx;
				color: $uni-color-warning;
				font-weight: 5;
				margin-left: 10upx;
				text-align: right;
			}

			.input-placeholder {
				font-size: 20upx;
			}
		}

		.get_captcha {
			position: absolute;
			right: 90upx;
			display: block;
			width: 30%;
			background: $uni-color-success;
			color: #fff;
			text-align: center;
			line-height: 50upx !important;
			height: 50upx;
			border-radius: 40upx;
			z-index: 100;
			font-size: 16upx;
		}
	}

	.cash-content-mid {
		font-size: $font-base;
		padding: 65upx;

		view {
			color: #b4b6c1;
			line-height: 1.5em;
		}

		.title {
			line-height: 2em;
		}
	}

	.cash-content-bot {
		view {
			margin: 0 auto;
			line-height: 100upx;
			width: 580upx;
			height: 100upx;
			text-align: center;
			color: #fff;
			background-image: linear-gradient(335deg, $uni-color-success 0%, $uni-color-error 50%, $uni-color-success 99%);
			border-radius: 50upx;
			font-size: 30upx;
			font-weight: 700;
		}
	}

	.tips {
		font-size: $font-base;
		font-color: $font-color-light;
		text-align: center;
		padding: 20upx;
	}

	.withdrawalRecords {
		padding: 0;
		text-decoration: underline;
	}
</style>