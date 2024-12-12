<template>
	<view class="content">
		<view class="navbar">
			<view v-for="(item, index) in navList" :key="index" class="nav-item"
				:class="{current: tabCurrentIndex === index}" @click="tabClick(index)">
				{{item.text}}
			</view>
		</view>

		<swiper :current="tabCurrentIndex" class="swiper-box" duration="300" @change="changeTab">
			<swiper-item class="tab-content" v-for="(tabItem,tabIndex) in navList" :key="tabIndex">
				<scroll-view class="list-scroll-content" scroll-y @scrolltolower="loadData">
					<!-- 空白页 -->
					<template v-if="tabItem.loaded === true && tabItem.orderList.length === 0">
						<empty></empty>
						<view>您还没有相关订单~</view>
					</template>

					<!-- 订单列表 -->
					<view v-for="(item,index) in tabItem.orderList" :key="index" class="order-item"
						@click="navTo('/pages_other/order/orderDetail?order_id='+item.order_id)">
						<view class="i-top">
							<text class="time">订单号：{{item.id}}</text>
							<view class="copy" @click.stop="oncopy(item.id)">
								<image src="@/static/copy.png" mode="aspectFill"></image>
							</view>
						</view>
						<view class="i-top">
							<text class="time">下单时间：{{item.createtime}}</text>
							<text class="state"
								:style="{color: item.stateTipColor}">{{item.stateTip + (item.refund_status_text ? item.refund_status_text : '')}}
							</text>
							<!-- <text v-if="item.state===9" class="del-btn yticon icon-lajitong" @click.stop="deleteOrder(index)"></text> -->
						</view>
						<view class="line"> </view>

						<view class="goods-box-single" v-for="(goodsItem, goodsIndex) in item.products"
							:key="goodsIndex">
							<image class="goods-img" :src="goodsItem.image" mode="aspectFill"></image>
							<view class="center">
								<text class="refund" v-if="goodsItem.refund">退款成功</text>
								<text class="title clamp">{{goodsItem.title}}</text>
								<text class="attr-box">规格： {{goodsItem.spec || '默认' }}</text>
								<!--  -->
								<button class="action-btn" v-if="item.have_received != 0 && goodsItem.evaluate == false && goodsItem.refund==false" @click.stop="button('evaluate', {order_id:item.order_id,id:goodsItem.id,image:goodsItem.image,title:goodsItem.title,spec:goodsItem.spec})">评价</button>
								<view class="right">
									<text class="price">{{goodsItem.price}}</text>
									<text class="attr-box"> x {{goodsItem.number}}</text>
								</view>
							</view>

						</view>

						<view class="line"> </view>

						<view class="price-box">
							共
							<text class="num">{{quantity(item.products)}}</text>
							件商品 合计
							<text class="price">{{item.total_price}}</text>
							<text v-if="item.discount_price > 0">(已优惠￥{{item.discount_price}})</text>
							<text v-if="item.delivery_price > 0">(含运费￥{{item.delivery_price}})</text>
						</view>
						<view class="action-box">
							<button class="action-btn" v-if="!item.have_paid"
								@click.stop="deleteOrder(item.order_id)">删除订单</button>
							<button class="action-btn" v-if="item.have_paid"
								@click.stop="navTo('/pages_other/order/orderDetail?order_id='+item.order_id)">订单详情</button>
							<button class="action-btn" v-if="item.state == 1"
								@click.stop="button('cancel',item)">取消订单</button>
							<button class="action-btn" @click="toOther(item.tieqing_url)"
								v-if="item.tieqing_url&&item.have_paid">铁青订单</button>
							<button class="action-btn recom"
								v-if="item.have_paid == 0&&item.state != 9&&item.order_type!=8"
								@click.stop="button('pay',item)">立即支付</button>
							<button class="action-btn" v-if="item.have_paid != 0 && item.extend.express_number != ''"
								@click.stop="button('delivery',item)">查看物流</button>
							<button class="action-btn" v-if="item.have_paid != 0 && item.have_received == 1"
								@click.stop="button('recerved',item)">确认收货</button>
							<!-- <button class="action-btn" v-if="item.have_received != 0 && item.have_commented != 0">追加评价</button> -->
							<!-- <button class="action-btn" v-if="item.have_paid != 0" @click.stop="button('refund', item)">申请售后</button> -->
						</view>
						<!-- <view class="action-box b-t" v-if="item.state == 9 && item.status == -1">
							<button class="action-btn" v-if="item.have_paid != 0" @click.stop="button('refund', item)">查看售后</button>
						</view> -->
					</view>
					<uni-load-more :status="tabItem.loadingType"></uni-load-more>
				</scroll-view>
			</swiper-item>
		</swiper>
	</view>
</template>

<script>
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
	import empty from "@/components/empty";
	export default {
		components: {
			uniLoadMore,
			empty
		},
		data() {
			return {
				currentTime: '',
				tabCurrentIndex: 0,
				navList: [{
						state: 0,
						text: '全部',
						loadingType: 'more',
						orderList: [],
						page: 1
					},
					{
						state: 1,
						text: '待付款',
						loadingType: 'more',
						orderList: [],
						page: 1
					},
					{
						state: 2,
						text: '待发货',
						loadingType: 'more',
						orderList: [],
						page: 1
					},
					{
						state: 3,
						text: '待收货',
						loadingType: 'more',
						orderList: [],
						page: 1
					},
					{
						state: 4,
						text: '评价',
						loadingType: 'more',
						orderList: [],
						page: 1
					}
					// ,{
					// 	state: 5,
					// 	text: '售后',
					// 	loadingType: 'more',
					// 	orderList: [],
					// 	page: 1
					// }
				],
				pageSize: 10
			};
		},
		onLoad(options) {
			/**
			 * 修复app端点击除全部订单外的按钮进入时不加载数据的问题
			 * 替换onLoad下代码即可
			 */
			this.currentTime = Date.now() / 1000
			this.tabCurrentIndex = +options.state;
			// #ifndef MP
			this.loadData()
			// #endif
			// #ifdef MP
			if (options.state == 0) {
				this.loadData()
			}
			// #endif
		},
		onPullDownRefresh() {
			this.pullDownRefresh()
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
			//获取订单列表
			async loadData(source) {
				//这里是将订单挂载到tab列表下
				let index = this.tabCurrentIndex;
				let navItem = this.navList[index];
				// console.log(this.navList);
				let state = navItem.state;

				if (source === 'tabChange' && navItem.loaded === true) {
					//tab切换只有第一次需要加载数据
					return;
				}
				if (navItem.loadingType === 'loading') {
					//防止重复加载
					return;
				}
				if (navItem.loadingType == 'noMore') {
					//没有更多数据
					return;
				}

				navItem.loadingType = 'loading';

				let result = await this.$api.request('/order/getOrders', 'GET', {
					type: state,
					page: navItem.page,
					pagesize: this.pageSize
				});
				uni.stopPullDownRefresh();
				if (!result) {
					navItem.loadingType = 'more';
				} else {
					//console.log(result)
					if (result.length >= this.pageSize) {
						//判断是否还有数据， 有改为 more， 没有改为noMore
						navItem.loadingType = 'more';
					} else {
						navItem.loadingType = 'noMore';
					}
					// 页数加一
					navItem.page++;
					result.forEach(item => {
						item = Object.assign(item, this.orderStateExp(item.state));
						navItem.orderList.push(item);
					});
					//loaded新字段用于表示数据加载完毕，如果为空可以显示空白页
					this.$set(navItem, 'loaded', true);
				}

			},

			//swiper 切换
			changeTab(e) {
				this.tabCurrentIndex = e.target.current;
				this.loadData('tabChange');
			},
			//顶部tab点击
			tabClick(index) {
				this.tabCurrentIndex = index;
			},
			//删除订单
			async deleteOrder(id) {
				let [error, res] = await uni.showModal({
					title: '确认删除订单'
				});
				if (res.confirm) {
					// let order_id = this.navList[this.tabCurrentIndex].orderList[index].order_id;
					let order_id = id
					let result = await this.$api.request('/order/delete?order_id=' + order_id)
					if (result) {
						this.navList[this.tabCurrentIndex].orderList = this.navList[this.tabCurrentIndex].orderList
							.filter((item, index) => {
								return item.order_id != id
							})
						console.log(this.navList[this.tabCurrentIndex].orderList);
						// console.log(this.navList[this.tabCurrentIndex]);	
					}
				}

			},
			//取消订单
			async cancelOrder(item) {
				let that = this;
				let [error, res] = await uni.showModal({
					title: '确认取消订单',
					content: '取消之后不可恢复',
				});
				if (res.confirm) {
					let result = await that.$api.request('/order/cancel?order_id=' + item.order_id);
					if (result) {
						let {
							stateTip,
							stateTipColor
						} = that.orderStateExp(9);
						item = Object.assign(item, {
							state: 9,
							stateTip,
							stateTipColor
						});
						// 更新全部订单里面的状态
						let position = that.navList[0].orderList.findIndex(val => val.order_id === item.order_id);
						if (position !== -1) {
							that.navList[0].orderList[position] = item;
						}

						//取消订单后删除待付款中该项
						let list = that.navList[1].orderList;
						let index = list.findIndex(val => val.order_id === item.order_id);
						index !== -1 && list.splice(index, 1);
					}
					return true;
				}
				//this.$api.msg('取消失败');
				return false;
			},
			// 收货
			async receivedOrder(item) {
				let that = this;
				let [error, res] = await uni.showModal({
					title: '确认收货'
				});
				if (res.confirm == true) {
					let res = await that.$api.request('/order/received', 'GET', {
						order_id: item.order_id
					});
					if (res) {
						// 已确认收货

						let {
							stateTip,
							stateTipColor
						} = that.orderStateExp(4);

						// 更新全部订单里面的状态
						let position = that.navList[0].orderList.findIndex(val => val.order_id === item.order_id);
						if (position !== -1) {
							let item = that.navList[0].orderList[position];
							console.log(item);
							that.navList[0].orderList[position] = Object.assign(item, {
								state: 4,
								stateTip,
								stateTipColor,
								have_received: 1
							});
						}
						//收货订单后删除待收货中该项
						let list = that.navList[3].orderList;
						let index = list.findIndex(val => val.order_id === item.order_id);
						index !== -1 && list.splice(index, 1);
					}
					return true;
				}
				this.$api.msg('收货失败');
				return false;
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
						stateTipColor = '#909399';
						break;

						//更多自定义
				}
				return {
					stateTip,
					stateTipColor
				};
			},
			// 计算当前订单有多少个商品
			quantity(products) {
				let number = 0;
				for (let i in products) {
					number += parseInt(products[i].number);
				}
				return number;
			},
			navTo(url) {
				this.$api.navTo(url);
			},
			// 下面的一排按钮
			button(action, item) {
				switch (action) {
					case 'cancel':
						this.cancelOrder(item);
						break;
					case 'pay':
						// this.navTo('/pages/money/pay?order_id=' + item.order_id + '&total=' + item.total_price);
						this.navTo('/pages/money/payP?pay=1&order_id=' + item.order_id + '&total=' + item.total_price);
						break;
					case 'delivery':
						this.navTo('/pages_other/order/express?expresssn=' + item.extend.express_number + '&express=' +
							item.extend.express_company);
						break;
					case 'recerved':
						this.receivedOrder(item);
						break;
					case 'evaluate':
						this.$api.navTo('/pages_other/order/evaluate?product_id=' + item.id + '&order_id=' + item
							.order_id + '&image=' + item.image + '&title=' + item.title + '&spec=' + item.spec);
						break;
					case 'refund':
						this.$api.navTo('/pages_other/order/refund?order_id=' + item.order_id);
						break;
				}
			},
			pullDownRefresh() {
				this.navList = [];
				this.navList = [{
						state: 0,
						text: '全部',
						loadingType: 'more',
						orderList: [],
						page: 1
					},
					{
						state: 1,
						text: '待付款',
						loadingType: 'more',
						orderList: [],
						page: 1
					},
					{
						state: 2,
						text: '待发货',
						loadingType: 'more',
						orderList: [],
						page: 1
					},
					{
						state: 3,
						text: '待收货',
						loadingType: 'more',
						orderList: [],
						page: 1
					},
					{
						state: 4,
						text: '评价',
						loadingType: 'more',
						orderList: [],
						page: 1
					},
					// {
					// 	state: 5,
					// 	text: '售后',
					// 	loadingType: 'more',
					// 	orderList: [],
					// 	page: 1
					// }
				];
				this.loadData();
			}
		},
	}
</script>

<style lang="scss">
	page,
	.content {
		background: #F2F4F7;
		height: 100%;
	}


	.swiper-box {
		height: calc(100% - 40px);

	}

	.list-scroll-content {
		height: 100%;
		padding: 0 24rpx;
		
	}

	.navbar {
		display: flex;
		height: 88rpx;
		padding: 0 10rpx;
		background: #fff;
		box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, .06);
		position: relative;
		z-index: 10;

		.nav-item {
			flex: 1;
			display: flex;
			justify-content: center;
			align-items: center;
			height: 100%;
			font-size: 28rpx;
			color: $font-color-dark;
			position: relative;

			&.current {
				color: #ff5040;
				&:after {
					content: '';
					position: absolute;
					left: 50%;
					bottom: 10rpx;
					transform: translateX(-50%);
					width: 40rpx;
					height: 8rpx;
					background: linear-gradient( 90deg, #FF7040 0%, #FF5040 100%);
					border-radius: 4rpx;
				}
			}
		}
	}

	.uni-swiper-item {
		height: auto;
	}

	.order-item {
		display: flex;
		flex-direction: column;
		padding: 24rpx;
		background: #fff;
		margin: 24rpx 0;
		border-radius: 16rpx;

		.line {
			width: 100%;
			height: 2rpx;
			background-color: #F2F4F7;
			margin-top: 10rpx;
		}

		.i-top {
			display: flex;
			align-items: center;
			height: 42upx;
			padding-right: 30upx;
			font-size: $font-base;
			color: rgba(50, 50, 51, 0.6);
			position: relative;

			.time {
				flex: 1;
				font-size: 26rpx;
			}

			.copy {
				width: 36rpx;
				height: 36rpx;
				font-size: 24rpx;
				text-align: center;
				image{
					width: 30rpx;
					height: 30rpx;
				}
			}

			.state {
				font-size: 24rpx;
				color: $base-color;
			}

			.del-btn {
				padding: 10upx 0 10upx 36upx;
				font-size: $font-lg;
				color: $font-color-light;
				position: relative;

				&:after {
					content: '';
					width: 0;
					height: 30upx;
					border-left: 1px solid $border-color-dark;
					position: absolute;
					left: 20upx;
					top: 50%;
					transform: translateY(-50%);
				}
			}
		}

		/* 多条商品 */
		.goods-box {
			height: 160upx;
			padding: 20upx 0;
			white-space: nowrap;

			.goods-item {
				width: 120upx;
				height: 120upx;
				display: inline-block;
				margin-right: 24upx;
			}

			.goods-img {
				display: block;
				width: 100%;
				height: 100%;
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
					display: block;
					width: 360rpx;
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
					width: 120rpx;
					height: 60rpx;
					padding: 0;
					text-align: center;
					line-height: 60rpx;
					font-size: 24rpx;
					color: #303133;
					background: #f2f4f7;
					border:#f3f4f7 solid 1rpx;
					border-radius: 16rpx;
					position: absolute;
					right: 24rpx;
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
					display: flex;
					align-items: center;
					justify-content: end;

					.attr-box {
						font-size: 24rpx;
						color: rgba(50, 50, 51, 0.6);
						margin-left: 16rpx;

					}

					.price {
						font-size: 28rpx;
						;
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

		.price-box {
			display: flex;
			justify-content: flex-end;
			align-items: baseline;
			padding: 20upx 30upx;
			font-size: 28rpx;
			font-weight: 400;
			letter-spacing: 0rpx;
			line-height: 39rpx;
			color: rgba(51, 51, 51, 1);
			text-align: left;
			vertical-align: top;

			// .num {
			// 	margin: 0 8upx;
			// 	color: $font-color-dark;
			// }

			.price {
				font-size: 28rpx;
				color: #FF5040;

				&:before {
					content: '￥';
					font-size: 22rpx;
					margin: 0 2upx 0 8upx;
				}
			}
		}

		.action-box {
			display: flex;
			justify-content: flex-end;
			align-items: center;
			height: 80rpx;
			position: relative;
			padding-right: 30upx;
		}

		.action-btn {
			width: 144rpx;
			height: 60rpx;
			margin: 0;
			margin-left: 24rpx;
			padding: 0;
			text-align: center;
			line-height: 60rpx;
			font-size: 24rpx;
			color: #323233;
			background: #fff;
			border: 1rpx solid #AFB0B2;
			border-radius: 30rpx;
			&.recom {
				border: #FF5040 solid 1rpx;
				color: #FF5040;

				// &:after {
				// 	border-color: #f7bcc8;
				// }
			}
		}
	}


	/* load-more */
	.uni-load-more {
		display: flex;
		flex-direction: row;
		height: 80upx;
		align-items: center;
		justify-content: center
	}

	.uni-load-more__text {
		font-size: 28upx;
		color: #999
	}

	.uni-load-more__img {
		height: 24px;
		width: 24px;
		margin-right: 10px
	}

	.uni-load-more__img>view {
		position: absolute
	}

	.uni-load-more__img>view view {
		width: 6px;
		height: 2px;
		border-top-left-radius: 1px;
		border-bottom-left-radius: 1px;
		background: #999;
		position: absolute;
		opacity: .2;
		transform-origin: 50%;
		animation: load 1.56s ease infinite
	}

	.uni-load-more__img>view view:nth-child(1) {
		transform: rotate(90deg);
		top: 2px;
		left: 9px
	}

	.uni-load-more__img>view view:nth-child(2) {
		transform: rotate(180deg);
		top: 11px;
		right: 0
	}

	.uni-load-more__img>view view:nth-child(3) {
		transform: rotate(270deg);
		bottom: 2px;
		left: 9px
	}

	.uni-load-more__img>view view:nth-child(4) {
		top: 11px;
		left: 0
	}

	.load1,
	.load2,
	.load3 {
		height: 24px;
		width: 24px
	}

	.load2 {
		transform: rotate(30deg)
	}

	.load3 {
		transform: rotate(60deg)
	}

	.load1 view:nth-child(1) {
		animation-delay: 0s
	}

	.load2 view:nth-child(1) {
		animation-delay: .13s
	}

	.load3 view:nth-child(1) {
		animation-delay: .26s
	}

	.load1 view:nth-child(2) {
		animation-delay: .39s
	}

	.load2 view:nth-child(2) {
		animation-delay: .52s
	}

	.load3 view:nth-child(2) {
		animation-delay: .65s
	}

	.load1 view:nth-child(3) {
		animation-delay: .78s
	}

	.load2 view:nth-child(3) {
		animation-delay: .91s
	}

	.load3 view:nth-child(3) {
		animation-delay: 1.04s
	}

	.load1 view:nth-child(4) {
		animation-delay: 1.17s
	}

	.load2 view:nth-child(4) {
		animation-delay: 1.3s
	}

	.load3 view:nth-child(4) {
		animation-delay: 1.43s
	}

	@-webkit-keyframes load {
		0% {
			opacity: 1
		}

		100% {
			opacity: .2
		}
	}
</style>