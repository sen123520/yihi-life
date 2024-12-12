<template>
	<view class="container">
		<view class="set-body">
			<view class="list-cell b-b m-t">
						<text class="cell-tit">用户名</text>
						<text class="cell-tip">{{ userInfo.username }}</text>
					</view>
					<view class="list-cell b-b m-t">
						<text class="cell-tit">级别</text>
						<text class="cell-tip">{{ extend_info.level.rebate_level_text }}</text>
					</view>
			
					<view class="list-cell b-b m-t" @click="navTo('/pages_other/userinfo/userinfo')" hover-class="cell-hover"
						:hover-stay-time="50">
						<text class="cell-tit">个人资料</text>
						<text class="cell-tip">修改头像及昵称</text>
						<text class="cell-more yticon icon-you"></text>
					</view>
					<view class="list-cell b-b m-t" @click="navTo('/pages_other/userinfo/changePassword')" hover-class="cell-hover"
						:hover-stay-time="50">
						<text class="cell-tit">修改登录密码</text>
						<text class="cell-more yticon icon-you"></text>
					</view>
					<view class="list-cell b-b m-t" @click="navTo('/pages_other/userinfo/changeSecurityPassword')"
						hover-class="cell-hover" :hover-stay-time="50">
						<text class="cell-tit">修改安全密码</text>
						<text class="cell-more yticon icon-you"></text>
					</view>
					<view class="list-cell b-b m-t" @click="navTo('/pages_other/userinfo/bindJiaoYi')" hover-class="cell-hover"
						:hover-stay-time="50">
						<text class="cell-tit">交易账号</text>
						<text class="cell-tip">{{ userInfo.jiaoyi_account != '' ? userInfo.jiaoyi_account : '暂未绑定'  }}</text>
						<text class="cell-more yticon icon-you"></text>
					</view>
					<view class="list-cell b-b m-t" @click="navTo('/pages_other/userinfo/realname')" hover-class="cell-hover"
						:hover-stay-time="50">
						<text class="cell-tit">实名认证</text>
						<text class="cell-tip">{{
			  userInfo.real_name ? userInfo.real_name : "未实名"
			}}</text>
						<text class="cell-more yticon icon-you"></text>
					</view>
					<view class="list-cell b-b m-t" @click="navTo('/pages_other/userinfo/mobile')" hover-class="cell-hover"
						:hover-stay-time="50">
						<text class="cell-tit">修改手机号</text>
						<text class="cell-tip">{{ userInfo.mobile }}</text>
						<text class="cell-more yticon icon-you"></text>
					</view>
					<!-- <view class="list-cell b-b m-t" @click="navTo('/pages/article/article?id=2', false)" hover-class="cell-hover"
						:hover-stay-time="50">
						<text class="cell-tit">用户协议</text>
						<text class="cell-tip"></text>
						<text class="cell-more yticon icon-you"></text>
					</view>
					<view class="list-cell b-b m-t" @click="navTo('/pages/article/article?id=1', false)" hover-class="cell-hover"
						:hover-stay-time="50">
						<text class="cell-tit">隐私政策</text>
						<text class="cell-tip"></text>
						<text class="cell-more yticon icon-you"></text>
					</view>
					<view class="list-cell b-b m-t" @click="navTo('/pages/article/article?id=6', false)" hover-class="cell-hover"
						:hover-stay-time="50">
						<text class="cell-tit">消费须知</text>
						<text class="cell-tip"></text>
						<text class="cell-more yticon icon-you"></text>
					</view> -->
			
					<!-- #ifdef APP-PLUS -->
					<view class="list-cell b-b m-t show" @click="version">
						<text class="cell-tit">版本号：</text>
						<text class="cell-tip">{{ version_number }}</text>
					</view>
					<!-- #endif -->
		</view>

		<view class="list-cell log-out-btn" @click="toLogout">
			<text class="cell-tit">退出登录</text>
		</view>
	</view>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from "vuex";
	export default {
		onLoad() {
			// 获取当前app的版本APP端
			const appInfo = uni.getSystemInfoSync();
			// #ifdef APP
			this.version_number = appInfo.appWgtVersion;
			this.pickUpInformation();
			// #endif
			// // 获取当前app的版本小程序端
			// // #ifdef MP-WEIXIN
			// const accountInfo = wx.getAccountInfoSync();
			// this.version_number = accountInfo.miniProgram.version
			// // #endif
		},
		data() {
			return {
				extend_info: {
					level: {
						rebate_level_name: "",
						duty_level_name: "",
						rebate_level: "",
					},
				},
				version_number: "",
				clickCount: 0,
				restart: "",
			};
		},
		computed: {
			...mapState(["hasLogin", "userInfo"]),
		},
		async onShow() {
			if (this.hasLogin) {
				await this.getUserExtendInfo();
				this.$store.commit("setuserMobile", this.extend_info.user_info.mobile);
				// this.$store.commit('setuserMobile',1111111111);
			}
		},
		methods: {
			...mapMutations(["logout"]),

			navTo(url) {
				uni.navigateTo({
					url: url,
				});
			},
			//退出登录
			toLogout() {
				uni.showModal({
					content: "确定要退出登录么",
					success: (e) => {
						if (e.confirm) {
							this.logout();
							setTimeout(() => {
								uni.navigateBack();
							}, 200);
						}
					},
				});
			},
			//switch
			switchChange(e) {
				let statusTip = e.detail.value ? "打开" : "关闭";
				this.$api.msg(`${statusTip}消息推送`);
			},
			async getUserExtendInfo() {
				let e_info = await this.$api.request("/user/getUserExtendInfo");
				// console.log(e_info);
				this.extend_info = e_info;
			},
			version() {
				this.clickCount++;
				if (this.clickCount === 5) {
					this.renew();
					this.clickCount = 0;
				}
			},
			renew() {
				// 获取当前应用版本号
				const currentVersion = this.version_number;

				const serverResponse = {
					version: this.appinfos.versionCode,
					downloadUrl: this.appinfos.wgtUrl,
				};
				// 比较版本号
				if (this.compareVersions(serverResponse.version, currentVersion) > 0) {
					// 触发更新
					this.showUpdateDialog(serverResponse.downloadUrl);
				} else {
					console.log("当前已是最新版本");
				}
			},
			// 获取APP信息
			async pickUpInformation() {
				const data = await this.$api.request("/index/appVersionTest", "POST", {
					ver: this.version_number,
				});
				this.appinfos = data;
				this.restart = data.restart;
			},
			// 比较版本号
			compareVersions(version1, version2) {
				const v1 = version1.split(".").map(Number);
				const v2 = version2.split(".").map(Number);

				for (let i = 0; i < Math.max(v1.length, v2.length); i++) {
					const diff = (v1[i] || 0) - (v2[i] || 0);
					if (diff !== 0) {
						return diff;
					}
				}

				return 0;
			},
			// 下载并安装新版本
			showUpdateDialog(downloadUrl) {
				console.log(downloadUrl);
				uni.showModal({
					title: "发现新版本",
					content: "是否立即更新？",
					success: (res) => {
						if (res.confirm) {
							uni.downloadFile({
								url: downloadUrl,
								success: (downloadResult) => {
									if (downloadResult.statusCode === 200) {
										plus.runtime.install(
											downloadResult.tempFilePath, {
												force: false,
											},
											() => {
												console.log(this.restart);
												//uni.hideLoading();
												//plus.runtime.restart();
												if (this.restart) {
													plus.runtime.restart();
												}
												// uni.showToast({
												// 	title: '有更新啦：' + result.data.data.version,
												// 	icon: 'none',
												// 	mask: false,
												// 	position: 'bottom'
												// });
											},
											function(e) {
												// uni.hideLoading();
												uni.showToast({
													title: "好像有更新：" + result.data.data
														.version,
													icon: "none",
													mask: false,
													position: "bottom",
												});
											}
										);
									} else {}
								},
							});
						}
					},
				});
			},
		},
	};
</script>

<style lang="scss">
	page {
		background:#f2f4f7;
	}
	.container{
		background:#f2f4f7;
		padding: 24rpx;
		
	}
	
	.set-body{
		border-radius: 16rpx;
		overflow: hidden;
	}
	
	.list-cell {
		display: flex;
		align-items: baseline;
		padding: 0 24rpx;
		height: 94rpx;
		line-height: 94rpx;
		position: relative;
		background: #fff;
		justify-content: center;
		&.cell-hover {
			background: #fafafa;
		}

		&.b-b:after {
			left: 30upx;
		}

		&.m-t {
			margin-top: 2rpx;
		}

		.cell-more {
			align-self: baseline;
			font-size: 24rpx;
			color: $font-color-light;
			margin-left: 10upx;
		}

		.cell-tit {
			flex: 1;
			font-size: 24rpx;
			color: $font-color-dark;
			margin-right: 10upx;
		}

		.cell-tip {
			font-size: 24rpx;
			color: $font-color-light;
		}

		switch {
			transform: translateX(16upx) scale(0.84);
		}
	}

	.log-out-btn {
			margin-top: 138rpx;
			border-radius: 16rpx;
			height: 96rpx;
			.cell-tit {
				color: #323233;
				text-align: center;
				margin-right: 0;
			}
		}
	// #ifdef H5
	.show {
		display: none;
	}

	// #endif
	// #ifdef APP
	.show {
		display: flex;
		justify-content: space-between;
	}

	// #endif
</style>