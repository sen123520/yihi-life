<template>
	<view class="app">
		<view class="price-box">
			<text>支付金额</text>
			<text class="price">{{total}}</text>
		</view>

		<view class="pay-type-list" v-if="total>0">
			<view class="type-item b-b" @click="changePayType(1)" v-if="payTypeList.wxpay && total > 0">
				<view class="">
					余额不足，请充值！
				</view>
			</view>
			<view class="type-item b-b" @click="changePayType(2)" v-if="payTypeList.alipay && total > 0">
				<text class="icon yticon icon-alipay"></text>
				<view class="con">
					<text class="tit">支付宝支付</text>
				</view>
				<label class="radio">
					<radio value="" color="#fa436a" :checked='payType == 2' />
				</label>
				<view class="">
					余额不足，请充值！
				</view>
			</view>
			<view class="type-item b-b" @click="changePayType(3)" v-if="payTypeList.offline">
				<!-- <text class="icon yticon icon-pay"></text>
				<view class="con">
					<text class="tit">货到付款</text>
				</view>
				<label class="radio">
					<radio value="" color="#fa436a" :checked='payType == 3' />
					</radio>
				</label> -->
				<view class="">
					余额不足，请充值！
				</view>
			</view>
		</view>

		<view class="happy">
			恭喜你，本次订单无需额外支付！
		</view>

		<view id="bottom" v-if="total == 0">

			<view class="notice">
				<uni-data-checkbox class="userNotice" multiple v-model="checkbox1"
					:localdata="hobby"></uni-data-checkbox>
				<text :class="checkbox1[0] === 1 ? 'text active' : 'text'" @click="notice">我已阅读并同意益嗨生活消费须知</text>
			</view>
			<text class="mix-btn" @click="happyConfirm('success')">点此直接下单</text>
		</view>



		<!-- <view>
			↓ 因还未对接商户，故直接点【模拟确认支付】按钮直接完成订单
		</view>
		
		<text class="mix-btn" @click="happyConfirm">模拟确认支付</text> -->

		<view>
			<uni-popup ref="alertDialog" type="dialog">
				<uni-popup-dialog :type="msgType" cancelText="关闭" confirmText="确认" title="提示"
					content="请勾选我已阅读并同意益嗨生活消费须知." @confirm="dialogConfirm" @close="dialogClose"></uni-popup-dialog>
			</uni-popup>
		</view>

		<view>
			<!-- 输入框示例 -->
			<uni-popup ref="inputDialog" type="dialog">
				<uni-popup-dialog ref="inputClose" mode="input" title="输入安全密码" value="" placeholder="请输入内容"
					@confirm="dialogInputConfirm"></uni-popup-dialog>
			</uni-popup>
		</view>

	</view>
</template>

<script>
	// #ifdef H5
	var jweixin = require('jweixin-module');
	// #endif

	export default {
		data() {
			return {
				payType: 1,
				orderInfo: {},
				orderId: '',
				payTypeList: {
					wxpay: true,
					alipay: true
				},
				total: 0.00,
				checkbox1: [],
				hobby: [{
					text: '',
					value: 1
				}],
				msgType: 'success',
				submit: false
			};
		},
		async onLoad(options) {
			this.total = options.total;
			this.orderId = options.order_id;
			await this.getPayType();
			// 如果传这个参数就直接支付了，（默认第一个是微信支付）
			if (options.pay) {
				//this.confirm()
			}
			// #ifdef H5
			this.getOpenid()
			// #endif
		},
		methods: {

			async getOpenid() {
				let data = await this.$api.request('/pay/getUserOpenid', {
					order_id: this.orderId
				});
				if (data.is_new_user == true) {
					location.href = data.url;
				}
			},

			// 获取支付方式
			async getPayType() {
				let type = await this.$api.request('/pay/getPayType');
				if (type) {
					this.payTypeList = type;
				}
			},
			//选择支付方式
			changePayType(type) {
				this.payType = type;
				switch (type) {
					case 1: // 微信支付

						break;
					case 2: // 支付宝支付

						break;
					case 3: // 货到付款
						break;
				}
			},
			//确认支付
			async confirm() {
				uni.showLoading({
					title: '正在付款中.....',
					mask: true
				});
				if (this.payType == 1) {
					// #ifdef H5 || APP-PLUS || MP-WEIXIN
					this.weixinPay();
					// #endif
				} else if (this.payType == 2) {
					// 支付宝支付
					this.alipay();
				} else if (this.payType == 3) {
					// 货到付款
					this.offlinePay();
				}
			},
			async happyConfirm(type) {

				if (!(this.checkbox1[0] === 1)) {
					this.msgType = type
					this.$refs.alertDialog.open()
					return
				} else {
					this.$refs.inputDialog.open()
					// uni.showLoading({
					// 	title: '正在付款中.....',
					// 	mask: true
					// });
					// let data = await this.$api.request('/pay/happyConfirm', 'GET', {
					// 	order_id: this.orderId
					// });
					// if (data) {
					// 	uni.redirectTo({
					// 		url: '/pages/money/paySuccess'
					// 	});
					// 	uni.hideLoading()
					// }
				}

			},
			async alipay() {

				// #ifdef H5
				window.open(this.$unishow + '/pay/alipay?order_id=' + this.orderId);

				setTimeout(function() {
					uni.showModal({
						title: '提示',
						content: '是否已支付?',
						cancelText: '否',
						confirmText: '是',
						success: function(res) {
							if (res.confirm) {
								uni.redirectTo({
									url: '/pages_other/order/order?state=0'
								});
							} else if (res.cancel) {
								//console.log('用户点击取消');
							}
						},
						fail: function(res) {
							//console.log(res)
						}
					});
				}, 3000);
				// #endif

				// #ifdef APP-PLUS
				let orderInfo = await this.$api.request('/pay/alipay', 'POST', {
					order_id: this.orderId
				});
				if (orderInfo) {
					//console.log(orderInfo);
					uni.requestPayment({
						provider: 'alipay',
						orderInfo: orderInfo,
						success: function(res) {
							console.log('success:' + JSON.stringify(res));
							uni.redirectTo({
								url: '/pages/money/paySuccess'
							})
						},
						fail: function(err) {
							console.log('fail:' + JSON.stringify(err));
							that.$api.msg('支付失败');
						}
					});
				}

				// #endif

			},
			async weixinPay() {
				let data = await this.$api.request('/pay/unify', 'GET', {
					order_id: this.orderId
				});
				let that = this;
				if (data) {

					if (data.trade_type == 'MWEB') {
						// #ifdef H5
						// 微信外的H5
						location.href = data.mweb_url;
						// #endif

						// #ifdef APP-PLUS
						// app 使用h5支付
						var wv; //计划创建的webview 
						wv = plus.webview.create("", "custom-webview", {
							'uni-app': 'none', //不加载uni-app渲染层框架，避免样式冲突
						})
						wv.loadURL(data.mweb_url, {
							Referer: data.referer
						});

						setTimeout(function() {
							uni.showModal({
								title: '提示',
								content: '是否已支付?',
								cancelText: '否',
								confirmText: '是',
								success: function(res) {
									if (res.confirm) {
										uni.redirectTo({
											url: '/pages_other/order/order?state=0'
										});
									} else if (res.cancel) {
										//console.log('用户点击取消');
									}
								},
								fail: function(res) {
									//console.log(res)
								}
							});
						}, 3000);
						// #endif

					} else if (data.trade_type == 'JSAPI') {
						if (data.weixinOauth2) {
							// 微信oauth2授权（主要用来拿openid）
							location.href = data.weixinOauth2
							return;
						}

						// #ifdef H5
						let now_url = window.location.href;

						let config = await this.$api.request('/pay/jssdkBuildConfig', 'POST', {
							url: now_url
						});
						jweixin.config({
							debug: false,
							appId: config.appId, // 必填，公众号的唯一标识
							timestamp: config.timestamp, // 必填，生成签名的时间戳
							nonceStr: config.nonceStr, // 必填，生成签名的随机串
							signature: config.signature, // 必填，签名
							jsApiList: [
								'chooseWXPay'
							] // 必填，需要使用的JS接口列表
						});


						jweixin.ready(() => {
							jweixin.chooseWXPay({
								appId: data.appId,
								timestamp: data
									.timeStamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
								nonceStr: data.nonceStr, // 支付签名随机串，不长于 32 位
								package: data.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=\*\*\*）
								signType: data.signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
								paySign: data.paySign, // 支付签名
								success: (res) => {
									uni.redirectTo({
										url: '/pages/money/paySuccess'
									})
								}
							});
						});





						// 微信内的H5
						// let config = await this.$api.request('/pay/jssdkBuildConfig');
						// if (config) {
						// 	jweixin.config(config);
						// 	jweixin.ready(function() {
						// 		jweixin.chooseWXPay({
						// 			timestamp: data.timeStamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
						// 			nonceStr: data.nonce_str, // 支付签名随机串，不长于 32 位
						// 			package: 'prepay_id=' + data.prepay_id, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=\*\*\*）
						// 			signType: 'MD5', // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
						// 			paySign: data.paySign, // 支付签名
						// 			success: function(res) {
						// 				// 支付成功后的回调函数
						// 				uni.redirectTo({
						// 					url: '/pages/money/paySuccess'
						// 				})
						// 			},
						// 			fail: function(err) {
						// 				//console.log('fail:' + JSON.stringify(err));
						// 				//that.$api.msg('fail:' + JSON.stringify(err))
						// 				that.$api.msg('支付失败');
						// 			}
						// 		})
						// 	});
						// 	jweixin.error(function(res) {
						// 		//that.$api.msg(JSON.stringify(res));
						// 		that.$api.msg('支付失败');
						// 	});
						// } else {
						// 	that.$api.msg('支付失败');
						// }


						// #endif

						// #ifdef MP-WEIXIN
						uni.requestPayment({
							provider: 'wxpay',
							timeStamp: data.timeStamp,
							nonceStr: data.nonce_str,
							package: 'prepay_id=' + data.prepay_id,
							signType: 'MD5',
							paySign: data.paySign,
							success: function(res) {
								uni.redirectTo({
									url: '/pages/money/paySuccess'
								})
							},
							fail: function(err) {
								//console.log('fail:' + JSON.stringify(err));
								//that.$api.msg('fail:' + JSON.stringify(err))
								that.$api.msg('支付失败');
							}
						});
						// #endif
					}
					uni.hideLoading();
				}
			},

			async offlinePay() {
				let data = await this.$api.request('/pay/offline', 'GET', {
					order_id: this.orderId
				});
				if (data) {
					uni.redirectTo({
						url: '/pages/money/paySuccess'
					});
				}
			},
			dialogClose() {
				this.checkbox1 = []
			},
			dialogConfirm() {
				// this.checkbox1[0] = 1
			},
			notice() {
				uni.navigateTo({
					url: '/pages/article/article?id=6'
				})
			},
			async dialogInputConfirm(val) {
				// uni.showLoading({
				// 	title: '3秒后关闭'
				// })

				// setTimeout(() => {
				// 	uni.hideLoading()
				// 	console.log(val)
				// 	this.value = val
				// 	// 关闭窗口后，恢复默认内容
				// 	this.$refs.inputDialog.close()
				// }, 3000)
				// console.log(val);
				try {
					const data = await this.$api.request('/user/checkSafePassword', 'POST', {
						safe_password: val
					})
					if (data == null || data) {
						this.submit = true
					}

				} catch (err) {

				} finally {
					if (this.submit) {
						console.log(11111);
						uni.showLoading({
							title: '正在付款中.....',
							mask: true
						});
						try {
							let data = await this.$api.request('/pay/happyConfirm', 'GET', {
								order_id: this.orderId
							});
							console.log('555', data.url);

							// 根据data.url是否存在构造目标URL
							const _url = data.url ? `/pages/money/paySuccess?url=${encodeURIComponent(data.url)}` :
								'/pages/money/paySuccess';

							// 确保data存在且逻辑正确后执行跳转
							if (data) {
								uni.redirectTo({
									url: _url
								});
								uni.hideLoading();
							}
						} catch (error) {
							// 错误处理逻辑，比如提示用户、记录日志等
							console.error('支付确认请求失败:', error);
							uni.hideLoading(); // 如果出现错误，也应该隐藏加载提示
						}
					}
				}
			},
		}
	}
</script>

<style lang='scss' scoped>
	.app {
		width: 100%;
		height: calc(100vh - 88rpx);
		position: relative;
		padding-top: 15vh;
	}

	.price-box {
		background-color: #fff;
		/* height: 400rpx; */
		display: flex;
		/* margin-top: 15vh; */
		flex-direction: column;
		justify-content: center;
		align-items: center;
		font-size: 24rpx;
		color: #909399;

		.price {
			font-size: 72rpx;
			color: #303133;
			margin: 12rpx 0;

			&:before {
				content: '￥';
				font-size: 48rpx;
			}
		}
	}

	.pay-type-list {
		margin-top: 20upx;
		background-color: #fff;
		padding-left: 60upx;

		.type-item {
			height: 120upx;
			padding: 20upx 0;
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding-right: 60upx;
			font-size: 30upx;
			position: relative;
		}

		.icon {
			width: 100upx;
			font-size: 52upx;
		}

		.icon-pay {
			color: #fe8e2e;
		}

		.icon-wxpay {
			color: #36cb59;
		}

		.icon-alipay {
			color: #01aaef;
		}

		.tit {
			font-size: $font-lg;
			color: $font-color-dark;
			margin-bottom: 4upx;
		}

		.con {
			flex: 1;
			display: flex;
			flex-direction: column;
			font-size: $font-sm;
			color: $font-color-light;
		}
	}

	.happy {
		text-align: center;
		color: rgba(50, 50, 51, 0.6);
		font-size: 28rpx;
	}

	.mix-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 630upx;
		height: 80upx;
		margin: 12upx auto 30upx;
		font-size: 28rpx;
		color: #fff;
		background: linear-gradient( 270deg, #FF7A00 0%, #FF3D00 100%);
		border-radius: 106upx;
		box-shadow: $box_shadow;
	}

	#bottom {
		position: absolute;
		bottom: 36rpx;
		left: 50%;
		display: flex;
		flex-direction: column;
		
		transform: translateX(-50%);
		.userNotice {
			width: 40rpx;
			height: 60rpx;
			display: flex;
			margin-left: 24rpx;
			/* justify-content: flex-end; */
		}

		::v-deep .uni-data-checklist .checklist-group .checklist-box.is--default.is-checked .checkbox__inner {
			border-color: #ff5400;
			background-color: #ff5400;
		}

		.notice {
			display: flex;
			justify-content: center;
			align-items: center;
			font-size: 26rpx;
			margin: 0 auto;
			/* width: 702rpx; */
		}

		.text {
			position: relative;
			right: 28rpx;
			margin-left: 40rpx;
		}
	}

	.active {
		color: #ff5400;
	}
</style>