<template>
	<view>
		<!-- 		<view class="header">
			<view class="left">{{status + (order.refund_status_text ? ':'+order.refund_status_text : '')}}</view>
		</view> -->
		<view class="line">

		</view>
		<view class="delivery" v-if="order.have_delivered">
			<view class="icon">
				<text class="cell-icon yticon icon-huoche" style="color: #ffffff"></text>
			</view>
			<view class="info">
				<view v-if="order.express_number">{{order.express_company}}：{{order.express_number}}</view>
				<view>发货时间：{{order.deliveredtime}}</view>
				<!-- <text class="yticon right icon-you"></text> -->
			</view>

		</view>
		<view class="address" v-if="order.delivery">
			<!-- 			<view class="icon">
				<text class="cell-icon yticon icon-dizhi" style="color: #ffffff"></text>
			</view> -->
			<view class="info">
				<view class="name">{{order.delivery.username}}<text class="mobile">{{order.delivery.mobile}}</text>
				</view>
				<view class="ads">
					<image src="@/static/local.png" mode="aspectFill"></image>
					<text>{{order.delivery.address}}</text>
				</view>
			</view>
			<image class="a-bg"
				src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAABXwAAAAQCAYAAAClf7fdAAAAAXNSR0IArs4c6QAABEtJREFUeF7t2k1qFVEURtFbTikOoOzrCLQtzki0Lw5A+4kDEGeUK9oQghrYITw9sNLOHyubj1Cnjqt3e6+pH3vdfH1zPLvUr79fPT/XPq4v9fMe/+fsm+PD54t5PX27z/1kzfXSV0xQXwlMX4lrLX0lMH0lLn1VLv9/NTH7lbzsV+KyX5XLfjUx+5W87Ffisl+Vy341Mft1TH7ge3us89vr40v7oz/8s/fLFz8eXp4P/w7/+Ctv13l8/HQxr6v3+3rtuV76ir3qK4HpK3Gtpa8Epq/Epa/K5f+vJma/kpf9Slz2q3LZryZmv5KX/Upc9qty2a8mZr/W3Ae+rmctdm/HNS99NS99NS99NS99NS99NS99NS99NS99NS99NS99NS99NS99NS99NS99NS99NS99/fQa+8DX9Sz27rqRwPSVuFxnK5frbBOzX8nLfiUu+1W57FcTs1/Jy34lLvtVuexXE7Nfyct+JS77VbnsVxOzX4Mf+LputNhdN5qXvpqXvpqXvpqXvpqXvpqXvpqXvpqXvpqXvpqXvpqXvpqXvpqXvpqXvpqXvpqXvn55jXzD1/Us9u66kcD0lbhcZyuX62wTs1/Jy34lLvtVuexXE7Nfyct+JS77VbnsVxOzX8nLfiUu+1W57FcTs1+DH/i6brTYXTeal76al76al76al76al76al76al76al76al76al76al76al76al76al76al76al77ueI17w9f1LPbuupHA9JW4XGcrl+tsE7Nfyct+JS77VbnsVxOzX8nLfiUu+1W57FcTs1/Jy34lLvtVuexXE7Nfgx/4um602F03mpe+mpe+mpe+mpe+mpe+mpe+mpe+mpe+mpe+mpe+mpe+mpe+mpe+mpe+mpe+mpe+fvMa9Yav61ns3XUjgekrcbnOVi7X2SZmv5KX/Upc9qty2a8mZr+Sl/1KXParctmvJma/kpf9Slz2q3LZryZmvwY/8HXdaLG7bjQvfTUvfTUvfTUvfTUvfTUvfTUvfTUvfTUvfTUvfTUvfTUvfTUvfTUvfTUvfTUvff3Ra8wbvq5nsXfXjQSmr8TlOlu5XGebmP1KXvYrcdmvymW/mpj9Sl72K3HZr8plv5qY/Upe9itx2a/KZb+amP0a/MDXdaPF7rrRvPTVvPTVvPTVvPTVvPTVvPTVvPTVvPTVvPTVvPTVvPTVvPTVvPTVvPTVvPTVvPT1V68Rb/i6nsXeXTcSmL4Sl+ts5XKdbWL2K3nZr8RlvyqX/Wpi9it52a/EZb8ql/1qYvYredmvxGW/Kpf9amL2a/ADX9eNFrvrRvPSV/PSV/PSV/PSV/PSV/PSV/PSV/PSV/PSV/PSV/PSV/PSV/PSV/PSV/PSV/PS171e//0bvq5nsXfXjQSmr8TlOlu5XGebmP1KXvYrcdmvymW/mpj9Sl72K3HZr8plv5qY/Upe9itx2a/KZb+amP261+s7iJzFGktp/iwAAAAASUVORK5CYII=">
			</image>
		</view>
		<view class="address" v-else>
			<view class="info">
				<view class="name">自提订单</view>
			</view>
		</view>

		<view class="product" v-if="order.products">
			<view class="product-header">
				<text>下单时间： {{order.createtime}} </text>
				<text>{{status + (order.refund_status_text ? order.refund_status_text : '')}}</text>
			</view>
			<view class="line"></view>
			<view class="goods-box-single" v-for="(goodsItem, goodsIndex) in order.products" :key="goodsIndex">
				<image class="goods-img" :src="goodsItem.image" mode="aspectFill"></image>
				<view class="center">
					<text class="refund" v-if="goodsItem.refund">退款成功</text>
					<text class="title clamp">{{goodsItem.title}}</text>
					<text class="attr-box">规格： {{goodsItem.spec || '默认' }}</text>
					<!--  -->
					<!-- 					<button class="action-btn"
						v-if="order.have_received != 0 && goodsItem.evaluate == false && goodsItem.refund==false"
						@click.stop="button('evaluate', {order_id:item.order_id,id:goodsItem.id,image:goodsItem.image,title:goodsItem.title,spec:goodsItem.spec})">评价</button> -->
					<view class="right">
						<text class="price">{{goodsItem.price}}</text>
						<text class="attr-box"> x {{goodsItem.number}}</text>
					</view>
				</view>

			</view>

			<view class="price">
				<view class="box"><text>商品总额</text> <text class="moneyNum"> {{order.order_price}}</text></view>
				<view v-if="order.discount_price" class="box"><text>优惠券</text> <text class="moneyNum">
						{{'-'+order.discount_price}}</text>
				</view>
				<view class="box"><text>运费</text> <text class="moneyNum"> {{order.delivery_price}}</text></view>
				<view class="box"><text>余额</text> <text class="moneyNum"> {{order.real_money}}</text></view>
				<view class="box"><text>绑定余额</text> <text class="moneyNum"> {{order.real_money_2}}</text></view>
				<view class="box"><text>使用奖励积分</text> <text class="moneyNum"> {{order.been}}</text></view>
				<!-- <view class="box"><text>使用消费奖励积分</text> <text class="moneyNum"> {{order.been_benefit}}</text></view> -->
				<view class="box"><text>使用购物券</text> <text class="moneyNum"> {{order.greenscore}}</text></view>
				<view class="box"><text>使用福利购物券</text> <text class="moneyNum"> {{order.greenscore_benefit}}</text>
				</view>
				<view class="box"><text>使用复消积分</text> <text class="moneyNum"> {{order.rebuyscore}}</text></view>
				<view class="box" v-if="order.order_type==7"><text>使用兑换积分</text> <text class="moneyNum">
						{{order.exchange_score}}</text>
				</view>
				<!-- <view class="box"><text>级别优惠</text> <text class="moneyNum">￥ {{order.other_coupon_price}}</text></view> -->
				<view class="total box"><text>付款总额</text><text class="moneyNum"> {{order.total_price}}</text></view>
			</view>
		</view>
		<view class="order" v-if="order.createtime">
			<!-- <view class="title">订单信息</view> -->
			<view class="oder-desc">
				<text>订单编号：</text>
				<view>
					<text class="time">{{order.id}}</text>
					<text class="copy" @click.stop="oncopy(order.id)">复制</text>
				</view>
			</view>
			<view class="oder-desc">
				<text>创建时间：</text>
				<text>{{order.createtime}}</text>
			</view>
			<view class="oder-desc" v-if="order.jiaoyi_account">
				<text>交易账号：</text>
				<text>{{order.jiaoyi_account}}</text>

			</view>
			<view class="oder-desc">
				<text>付款时间：</text>
				<text>{{order.have_paid ? order.paidtime : '未付款'}}</text>
			</view>
			<view class="oder-desc">
				<text>发货时间：</text>
				<text>{{order.have_delivered ? order.deliveredtime : '未发货'}}</text>
			</view>
			<view class="oder-desc" v-if="order.have_received">
				<text>成交时间：</text>
				<text>{{order.receivedtime}}</text>
			</view>
			<view class="oder-desc" v-if="order.have_refunded">
				<text>退货时间：</text>
				<text>{{order.refundedtime}}</text>
			</view>
		</view>
		<view style="height: 10rpx;">
			<!--兼容苹果系统下margin-bottom不生效-->
		</view>
		<view class="bottom" v-if="order.state != 9">
			<block v-if="order.refund_status!=1">
				<button class="action-btn" v-if="order.state == 1" @click.stop="button('cancel')">取消订单</button>

				<button class="action-btn" @click="toOther(order.tieqing_url)" v-if="order.tieqing_url">铁青订单</button>

				<button class="action-btn" v-if="order.have_paid != 0 && order.express_number != ''"
					@click.stop="button('delivery')">查看物流</button>
				<button class="action-btn" v-if="order.have_paid != 0 && order.have_received == 0"
					@click.stop="button('recerved')">确认收货</button>
				<button class="action-btn recom" v-if="order.have_paid == 0 &&order.order_type!=8"
					@click.stop="button('pay')">立即支付</button>
			</block>
			<block v-else>
				<button class="action-btn" @click.stop="">申请退款中</button>
			</block>
			<!-- <button class="action-btn" v-if="order.have_paid != 0" @click.stop="button('refund')">申请售后</button> -->
		</view>
		<!-- <view class="bottom" v-if="order.state == 9 && order.status == -1">
			<button class="action-btn" v-if="order.have_paid != 0" @click.stop="button('refund')">查看售后</button>
		</view> -->
	</view>
</template>

<script>
	export default {
		data() {
			return {
				currentTime: '',
				order_id: 0,
				status: '订单状态',
				order: {}
			}
		},
		onLoad(options) {
			this.currentTime = Date.now() / 1000
			this.order_id = options.order_id;
			this.detail(options.order_id);
		},
		methods: {

			async toOther(url) {

				//app时跳转到浏览器打开this.url
				//h5 时跳转到指定this.url页面
				// #ifdef H5
				// 在H5环境下执行的操作
				window.location.href = url;
				// #endif

				// #ifdef APP
				// 在APP或其他非H5环境下执行的操作
				plus.runtime.openURL(url).catch(() => {
					// 如果uni.openURL调用失败（例如在不支持直接打开URL的小程序中）
					uni.showToast({
						title: '无法直接打开链接，请手动复制并访问:',
						duration: 2000
					});
					uni.setClipboardData({
						data: url,
					});
				});
				// #endif
			},

			oncopy(value) {
				uni.setClipboardData({
					data: value,
					success: function() {
						uni.showToast({
							title: '复制成功',
							duration: 1500
						})
					}
				})
			},
			async detail(order_id) {
				let data = await this.$api.request('/order/detail?order_id=' + order_id);
				uni.stopPullDownRefresh();
				if (data) {
					this.status = this.orderStateExp(data.state);
					this.order = data;
					console.log(data);
				}
			},
			// 订单状态文字和颜色
			orderStateExp(state) {
				let stateTip = '',
					stateTipColor = '#fa436a';
				switch (+state) {
					case 0:
						stateTip = '交易成功';
						break;
					case 1:
						stateTip = '待付款';
						break;
					case 2:
						stateTip = '待发货';
						break;
					case 3:
						stateTip = '待收货';
						break;
					case 4:
						stateTip = '待评价';
						break;
						// case 5:
						// 	stateTip = '售后';
						// 	break;
					case 6:
						stateTip = '拒绝退款';
						break;
					case 9:
						stateTip = '订单已关闭';
						break;

						//更多自定义
				}
				return stateTip;
			},
			navTo(url) {
				this.$api.navTo(url);
			},
			// 按钮动作
			async button(action, item = {}) {
				console.log('触发');
				let detail = false;
				switch (action) {
					case 'cancel':
						detail = await this.$api.prePage().cancelOrder({
							order_id: this.order_id
						});
						break;
					case 'pay':
						this.navTo('/pages/money/pay?order_id=' + this.order_id + '&total=' + this.order.total_price);
						break;
					case 'delivery':
						this.navTo('/pages_other/order/express?expresssn=' + this.order.express_number + '&express=' +
							this.order.express);
						break;
					case 'recerved':
						detail = await this.$api.prePage().receivedOrder({
							order_id: this.order_id
						});
						break;
					case 'evaluate':
						this.$api.navTo('/pages_other/order/evaluate?product_id=' + item.id + '&order_id=' + this
							.order_id + '&image=' + item.image +
							'&title=' + item.title + '&spec=' + item.spec);
						break;
					case 'refund':
						uni.navigateTo({
							url: '/pages_other/order/refund?order_id=' + this.order_id
						})
						// this.$api.navTo('/pages_other/order/refund?order_id=' + this.order_id);
						break;
				}
				if (detail) {
					this.detail(this.order_id);
				}
			},
			pullDownRefresh() {
				this.detail(this.order_id);
			}
		},
		onPullDownRefresh() {
			this.pullDownRefresh();
		}
	}
</script>

<style lang="scss">
	page {
		background: #F2F4F7;
		padding: 24rpx;
	}

	.header {
		height: 200rpx;

		.left {
			color: #ffffff;
			line-height: 200rpx;
			padding-left: 100rpx;
		}
	}

	.delivery {
		color: #545454;
		background: #ffffff;
		border-radius: 16rpx;
		margin-bottom: 24rpx;
		display: flex;

		.icon {
			background: #00a7c8;
			height: 60rpx;
			width: 60rpx;
			display: inline-block;
			border-radius: 100rpx;
			margin: 50rpx 30rpx;
			text-align: center;
			line-height: 60rpx;
		}

		.info {
			display: inline-flex;
			flex-direction: column;
			justify-content: center;
			font-size: 28rpx;
			width: 600rpx;
			vertical-align: middle;
			// margin: 30rpx 0;
			position: relative;

			.right {
				position: absolute;
				right: 0;
			}
		}

	}

	.address {
		color: #545454;
		background: #ffffff;
		padding: 24rpx;
		height: 156rpx;
		position: relative;
		border-radius: 16rpx;
		overflow: hidden;

		.a-bg {
			position: absolute;
			left: 0;
			bottom: 0;
			display: block;
			width: 100%;
			height: 8rpx;
		}

		.info {
			height: 100%;
			display: flex;
			flex-direction: column;
			justify-content: center;
			width: 100%;
			vertical-align: middle;
			font-size: 28rpx;
			letter-spacing: 0rpx;
			line-height: 44.8rpx;
			color: rgba(51, 51, 51, 1);
			text-align: left;
			vertical-align: top;

			// margin: 30rpx 0;
			.mobile {
				color: rgba(51, 51, 51, 0.6);
				margin-left: 12rpx;
				font-size: 24rpx;
			}

			.ads {
				font-size: 24rpx;
				font-weight: 400;
				letter-spacing: 0rpx;
				color: rgba(50, 50, 51, 0.8);
				text-align: left;
				margin-top: 12rpx;
				display: flex;
				align-items: center;

				image {
					width: 40rpx;
					height: 40rpx;
				}
			}
		}
	}

	.line {
		width: 100%;
		height: 2rpx;
		background-color: #F2F4F7;
		margin-top: 10rpx;
	}

	.product {
		background: #ffffff;
		margin-top: 20rpx;
		padding: 0rpx 24rpx 24rpx 24rpx;
		border-radius: 16rpx;

		.product-header {
			width: 100%;
			height: 96rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;

			text {
				font-size: 28rpx;
				font-weight: 400;
				letter-spacing: 0rpx;
				line-height: 39.2rpx;
				color: rgba(51, 51, 51, 1);
				text-align: left;
				vertical-align: top;
			}
		}

		.price {

			.box {
				height: 100rpx;
				font-size: 28rpx;
				font-weight: 500;
				letter-spacing: 0rpx;
				line-height: 40rpx;
				color: rgba(51, 51, 51, 1);
				text-align: left;
				border-bottom: #F2F4F7 solid 2rpx;
				display: flex;
				align-items: center;
			}
		}

		/* 单条商品 */
		.goods-box-single {
			display: flex;
			padding: 20rpx 0;

			.goods-img {
				display: block;
				width: 140rpx;
				height: 140rpx;
				border-radius: 16rpx;
			}

			.center {
				flex: 1;
				display: flex;
				flex-direction: column;
				padding: 20rpx;
				overflow: hidden;
				position: relative;

				.title {
					font-size: 28rpx;
					font-weight: 400;
					letter-spacing: 0rpx;
					line-height: 39rpx;
					color: rgba(51, 51, 51, 1);
					text-align: left;
					vertical-align: top;
				}

				.attr-box {
					font-size: $font-sm + 2upx;
					color: $font-color-light;
					padding: 10rpx 0;
				}

				.price {
					font-size: 28rpx;
					color: $font-color-dark;

					&:before {
						content: '￥';
						font-size: 24rpx;
						margin: 0 2upx 0 8upx;
					}
				}

				.action-btn {
					width: 160rpx;
					height: 60rpx;
					padding: 0;
					text-align: center;
					line-height: 60rpx;
					font-size: 24rpx;
					color: #303133;
					background: #f2f4f7;
					border: #f3f4f7 solid 1rpx;
					border-radius: 16rpx;
					position: absolute;
					right: 30rpx;
					top: 0;
				}

				.refund {
					position: absolute;
					right: 30rpx;
					font-size: 28rpx;
					color: #fa436a;
					top: 35rpx;
				}

				.right {
					width: 100%;
					height: 40rpx;
					line-height: 40rpx;
					text-align: right;

					.attr-box {
						font-size: 24rpx;
						color: rgba(50, 50, 51, 0.6);
						margin-left: 16rpx;
					}

					.price {
						font-size: 28rpx;
						color: $font-color-dark;

						&:before {
							content: '￥';
							font-size: 24rpx;
							margin: 0 2upx 0 8upx;
						}
					}
				}


			}
		}

		.price {
			color: #9b9b9b;
			font-size: 28rpx;
			margin-top: 12rpx;

			text {
				float: right;
			}

			.total {
				font-size: 35rpx;

				text:last-child {
					color: rgba(248, 61, 61, 1);
					font-weight: 700;

				}
			}
		}
	}

	.order {
		background: #ffffff;
		margin-top: 20rpx;
		padding: 24rpx;
		border-radius: 16rpx;

		.oder-desc {
			display: flex;
			justify-content: space-between;
		}

		.title {
			border-left: 4rpx solid #F56C6C;
			padding-left: 17rpx;
			color: #898989;
			font-size: 35rpx;
			margin-bottom: 20rpx;
		}

		.copy {
			padding: 0 12rpx;
			font-size: 24rpx;
			color: rgba(153, 153, 153, 1);
				
			&::before{
				content: '';
				height: 20rpx;
				width: 2rpx;
				display: inline-block;
				background:  rgba(153, 153, 153, 1);
				margin-right: 12rpx;
			}			
		}

		font-size: 26rpx;
		color: #9b9b9b;
		line-height: 45rpx;
		margin-bottom: 120rpx;
	}

	.bottom {
		position: fixed;
		left: 0;
		width: 100%;
		height: 120rpx;
		background: #ffffff;
		bottom: 0;
		border-top: 1px solid #e9e9e9;
		display: flex;
		justify-content: flex-end;

		.action-btn {
			width: 160rpx;
			height: 60rpx;
			margin: 20rpx;
			padding: 0;
			text-align: center;
			line-height: 60rpx;
			font-size: 26rpx;
			color: #303133;
			background: #fff;
			border-radius: 10rpx;

			&:after {
				// border-radius: 10rpx;
			}

			&.recom {
				background: #fff9f9;
				color: $base-color;

				&:after {
					border-color: #f7bcc8;
				}
			}
		}
	}

	.box {
		display: flex;
		justify-content: space-between;

		.moneyNum {
			color: rgba(50, 50, 51, 0.6);

			&:before {
				content: '￥';
				font-size: 24rpx;
				margin: 0 2upx 0 8upx;
			}
		}
	}
</style>