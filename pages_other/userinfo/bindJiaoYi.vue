<template>
	<view>
		<view class="input-content">
			<view class="input-item">
				<text class="tit">手机号码</text>
				{{mobile}}
			</view>
			<view class="input-item">
				<text class="tit">账号</text>
				{{username}}
			</view>
			<view class="input-item" v-if="userInfo.jiaoyi_account">
				<text class="tit">当前已绑定交易账号</text>
				{{userInfo.jiaoyi_account}}
			</view>

			<view class="input-item">
				<text class="tit">{{ userInfo.jiaoyi_account? '请输入换绑的交易账号' : '请输入交易账号' }}</text>
				<input type="number" v-model="jiaoyi_account" placeholder="请输入555000开头的11位交易账号" />
			</view>

			<view class="input-item">
				<text class="tit">验证码</text>
				<input type="text" v-model="captcha" placeholder="请输入验证码" placeholder-style="font-size: 22rpx; color:rgba(50,50,51,0.6)"
					data-key="captcha" />
				<view class="get_captcha" @click="getCaptcha">{{get_captcha}}</view>
			</view>
		</view>
		<view class="submit">
			<button @click="submit" class="submitBtn">{{subText}}</button>
		</view>
		<!-- <view class='tips'>
			<view>* 同一账号只能修改三次手机号</view>
		</view> -->
		<view>
			<!-- 提示信息弹窗 -->
			<uni-popup ref="message" type="message">
				<uni-popup-message :type="msgType" :message="messageText" :duration="2000"></uni-popup-message>
			</uni-popup>
		</view>
	</view>
</template>

<script>
	import {
		set
	} from 'shvl';
	import {
		mapState,
		mapMutations
	} from 'vuex';
	export default {
		data() {
			return {
				subText: '绑定交易账号',
				jiaoyi_account: '',
				get_captcha: '获取验证码',
				captcha: '',
				mobile: '',
				username: '',
				message: '',
				messageText: '',
				msgType: 'success',
				user_info: ""
			};
		},
		computed: {
			...mapState(['userInfo'])
		},
		async onLoad() {

			this.mobile = this.userInfo.mobile
			this.username = this.userInfo.username
			await this.getUserInfo()
			console.log(this.userInfo);
		},
		methods: {
			...mapMutations(["setUserInfo"]),
			// 获取验证码

			async getUserInfo() {
				let e_info = await this.$api.request('/user/getUserExtendInfo');
				this.user_info = e_info.user_info
				// this.userInfo = e_info.user_info
			},

			async getCaptcha() {
				let that = this;
				let num = 60;

				if (this.mobile == '') {
					this.$api.msg('请输入手机号码');
					return;
				}
				if (this.mobile != this.userInfo.mobile) {
					this.$api.msg('请输入正确的手机号码');
					return;
				}
				let data = await this.$api.request('/sms/send', 'POST', {
					mobile: this.mobile,
					event: 'resetpwd'
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
			// 绑定交易账户
			async submit() {
				if (this.captcha == '') {
					return uni.showToast({
						title: '请输入验证码',
						icon: 'none'
					})
				}
				// if(this.userInfo.jyaccount_sy>0){
				// 	console.log(this.userInfo.jyaccount_sy);
				// 	return this.$api.msg('每天最多只能修改三次')
				// }
				try {
					const data = await this.$api.request('/user/changeJiaoyiAccount', 'POST', {
						mobile: this.mobile,
						jiaoyi_account: this.jiaoyi_account,
						captcha: this.captcha,
					})
					if (data == 1) {
						this.messageToggle()
						let userinfo = this.userInfo
						userinfo.jiaoyi_account = this.jiaoyi_account
						// userinfo.jyaccount_sy = this.userInfo.jyaccount_sy
						console.log(this.userInfo, userinfo);
						this.setUserInfo(userinfo)
						setTimeout(() => {
							uni.reLaunch({
								url: '/pages/user/user'
							})
						}, 1000)
					}
				} catch (err) {
					console.log(err);
				} finally {

				}
			},
			messageToggle() {
				this.msgType = 'success'
				this.messageText = `修改成功`
				this.$refs.message.open()
			},
		}
	}
</script>

<style lang="scss">
	page {
		background: $page-color-base;
		padding: 24rpx;
	}

	.input-content {
		background-color: #fff;
		padding: 24rpx;
		border-radius: 16rpx;
	}

	.input-item {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		justify-content: center;
		padding: 24rpx;
		height: 132rpx;
		border-bottom: rgba(50, 50, 51, 0.1) solid 1rpx;
		position: relative;
		font-size: 24rpx;

		&:last-child {
			margin-bottom: 12rpx;
		}

		.tit {
			height: 60rpx;
			line-height: 66rpx;
			font-size: 24rpx;
			color: #323233;
			font-weight: 500;
		}

		input {
			height: 70upx;
			font-size: 24rpx;
			color: #323233;
			width: 100%;
		}

		.get_captcha {
			position: absolute;
			bottom: 12rpx;
			right: 20rpx;
			display: block;
			width: 200rpx;
			color: #FF3F01;
			text-align: center;
			line-height: 60upx;
			height: 60upx;
			z-index: 100;
			font-size: 24rpx;

			&::before {
				content: '';
				display: inline-block;
				height: 20rpx;
				width: 4rpx;
				margin-top: 4rpx;
				background: rgba(50, 50, 51, 0.3);
				margin-right: 16rpx;
			}
		}
	}


	.submit {
		width: 100%;
		height: 100rpx;
		position: absolute;
		bottom: 24rpx;
		left: 50%;
		transform: translateX(-50%);
		padding: 10rpx 30rpx;
	}


	.submitBtn {
		width: 100%;
		color: #fff;
		border-radius: 106rpx;
		height: 80rpx;
		line-height: 80rpx;
		font-size: 28rpx;
		background: linear-gradient(133deg, #FF825B 0%, #FF5B5E 100%);
		box-shadow: $box_shadow;
	}

	.tips {
		font-size: $font-base;
		font-color: $font-color-light;
		text-align: center;
		padding: 20upx;
	}
</style>