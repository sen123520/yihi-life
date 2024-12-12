<template>
	<view>
		<block v-if="next === false">
			<view class="input-content">
				<view class="input-item">
					<text class="tit">原手机号码</text>
					<input type="number" v-model="mobile" placeholder="请输入原手机号码" />
				</view>
				<view class="input-item">
					<text class="tit">验证码</text>
					<input type="text" v-model="captcha" placeholder="请输入验证码" data-key="captcha" />
					<view class="get_captcha" @click="getCaptcha">{{ get_captcha }}</view>
				</view>
			</view>
			<view class="submit">
				<button @click="submit" class="submitBtn">下一步</button>
			</view>
			<!-- <view class="tips">
        <view>* 同一账号只能修改三次手机号</view>
      </view> -->
		</block>

		<block v-else>
			<view class="input-content">
				<view class="input-item">
					<text class="tit">新手机号码</text>
					<input type="number" v-model="changeMobile" placeholder="请输入新手机号码" />
				</view>
				<view class="input-item">
					<text class="tit">验证码</text>
					<input type="text" v-model="changeCaptcha" placeholder="请输入验证码" data-key="captcha" />
					<view class="get_captcha" @click="getCaptcha">{{ get_captcha }}</view>
				</view>
			</view>
			<view class="tips">
				<view>* 同一账号只能修改三次手机号</view>
			</view>
			<view class="submit">
				<button @click="submitChange" class="submitBtn">提交</button>
			</view>
		</block>
	</view>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from "vuex";
	let num = 60;
	let intervalId = null;
	export default {
		data() {
			return {
				mobile: "", //原手机号
				get_captcha: "获取验证码",
				captcha: "",
				next: false,
				changeMobile: "",
				changeCaptcha: "",
			};
		},
		computed: {
			...mapState(["userInfo"]),
		},
		onLoad() {
			this.mobile = this.userInfo.mobile;
		},
		methods: {
			...mapMutations(["setUserInfo"]),
			// 原手机号验证
			async getCaptcha() {
				let that = this;
				let data = null;
				num = 60;
				if (this.next === false) {
					if (this.mobile == "") {
						return this.$api.msg("请输入手机号码");
					} else if (this.mobile != this.userInfo.mobile) {
						return this.$api.msg("手机号错误");
					}
					data = await this.$api.request("/sms/send", "POST", {
						mobile: this.mobile,
						event: "oldmobile",
					});
					console.log("false", data);
				}
				if (this.next === true) {
					if (this.changeMobile === "") {
						return this.$api.msg("请输入手机号码");
					}
					data = await this.$api.request("/sms/send", "POST", {
						mobile: this.changeMobile,
						event: "changemobile",
					});
					console.log("true", data);

				}
				if (data == 1) {
					that.get_captcha = num + " S";
					intervalId = setInterval(function() {
						num--;
						that.get_captcha = num + " S";
						if (num == 0) {
							that.get_captcha = "获取验证码";
							clearInterval(intervalId);
						}
					}, 1000);
				}
			},

			async submitChange() {
				if (this.changeCaptcha === '') {
					return this.$api.msg('请输入验证码')
				}
				let data = await this.$api.request("/user/edit", "POST", {
					mobile: this.changeMobile,
					captcha: this.changeCaptcha,
				});
				console.log("newTrue", data);
				if (data == 1) {
					let userInfo = this.userInfo;
					userInfo.mobile = this.changeMobile;
					this.setUserInfo(userInfo);
					setTimeout(function() {
						uni.switchTab({
							url: "/pages/user/user",
						});
					}, 2000);
				}
			},
			//
			async submit() {
				if (this.captcha === '') {
					return this.$api.msg('请输入验证码')
				}
				let data = await this.$api.request("/user/checkMobile", "POST", {
					mobile: this.mobile,
					captcha: this.captcha,
				});
				console.log("newFalse", data);
				if (data == 1) {
					this.next = true;
					clearInterval(intervalId);
					num = 60;
					this.get_captcha = "获取验证码";
				}
			},
		},
	};
</script>

<style lang="scss">
	page {
		background: $page-color-base;
		padding: 24rpx;
	}

	.input-content {
		background-color: #fff;
		border-radius: 16rpx;
		overflow: hidden;
	}

	.input-item {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		justify-content: center;
		padding:24rpx;
		height: 130rpx;
		position: relative;
		border-bottom: #f2f4f7 solid 1rpx;
		.tit {
			height: 60upx;
			line-height: 60upx;
			font-size: 24rpx;
			font-weight: 500;
			color: $font-color-base;
		}

		input {
			height: 78rpx;
			font-size: 24rpx;
			color: $font-color-dark;
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
		margin-top: 24rpx;
		// transform: translateX(-50%);
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
		font-size: 24rpx;
		color: rgba(50, 50, 51, 0.6);
		text-align: left;
		padding: 20upx;
	}
</style>