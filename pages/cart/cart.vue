<template>
	<view class="container">
		<uni-nav-bar statusBar shadow title="购物车" backgroundColor='#f2f4f7' :right-text="`${editStatus ? '取消' : ''}编辑`"
			@clickRight="editSwitch" :border="false" fixed></uni-nav-bar>

		<uni-section v-if="defaultAddress&&!empty" title="" style="background: #f2f4f7; padding: 0;"
			:sub-title="defaultAddress" @click="navTo('/pages_other/address/address')">
			<template v-slot:decoration>
				<view class="decoration">
					<uni-icons type="location" color="#666" size="20"></uni-icons>
				</view>
			</template>
			<template v-slot:right>
				<uni-icons type="right" color="#666" size="20"></uni-icons>
			</template>
		</uni-section>


		<!-- 空白页 -->
		<view v-if="(!hasLogin || empty === true) && state != 'load'" class="empty">
			<view class="emptyImg">
				<image src="@/static/emptyCart.png" mode="aspectFill"></image>
				<text>空空如也</text>
				<view class="guang" @click="toCategory">
					<text>随便逛逛</text>
					<image src="@/static/rightH.png" mode="aspectFill"></image>
				</view>
			</view>

			<view class="guessyou">
				<view class="point"></view>
				<view class="point"></view>
				<text>猜你喜欢</text>
				<view class="point"></view>
				<view class="point"></view>
			</view>
			<view class="guess-section">
				<view v-for="(item, index) in goodsList" :key="item.id" class="guess-item"
					@click="navToDetailPage(item)">
					<!-- <view class="cate_name"></view> -->
					<view class="image-wrapper">
						<image :src="item.image" mode="aspectFill"></image>
					</view>
					<text class="title">
						<text class="partition">{{ item.cate_name }}</text><text
							class="shop_tag">{{ item.shop_tag }}</text><text
							class="sales">已售{{ item.sales || 0 }}件</text>
					</text>
					<text class="t-text">{{ item.title }}</text>
					<view>
						<text class="price">
							<text class="symbol">￥</text>
							{{ item.sales_price }}
						</text>
						<text class="market_price">￥{{ item.market_price }}</text>
					</view>
					<view class="bottom-text">
						<text class="text1">PV:{{ item.pv_score }}</text>
						<text class="text2">贡献值:{{ item.contribute }}</text>
					</view>
				</view>
			</view>
		</view>


		<view v-else>
			<!-- 列表 -->
			<view class="cart-list">
				<block v-for="(item, index) in cartList" :key="item.cart_id">
					<view class="cart-item" :class="{ 'b-b': index !== cartList.length - 1 }"
						:style="{ background: item.isset ? '' : '#F2F4F7' }"
						@click="navTo(`/pages/product/product?id=${item.product_id}&flash=0`)">
						<view v-if="item.isset == true && !editStatus" class="yticon icon-xuanzhong checkbox"
							:class="{ checked: item.choose }" @click.stop="check('item', index)"></view>
						<view class="image-wrapper">
							<image :src="item.image" class="loaded" mode="aspectFill"></image>
						</view>
						<view class="item-right">
							<view class="title">{{ item.title }}</view>
							<view class="attr" v-if="item.spec">{{ item.spec }}</view>
							<view class="attr" v-if="!item.spec">规格：默认</view>
							<view class="price"><text style="font-size:28rpx ;">￥</text>{{ item.nowPrice }}</view>
							<!-- 	<uni-number-box class="step" :min="1" :max="item.stock"
								:disabled="item.number >= item.stock" :value="cartList[index].number"
								:isMax="item.number >= item.stock ? true : false" :isMin="item.number === 1"
								:index="index" @eventChange="numberChange">
							</uni-number-box> -->
							<view class="count">
								<view class="jianhao" @click.stop="downNumber(index)">
									<image src="@/static/jianhao.png" mode="aspectFill"></image>
								</view>
								<text> {{item.number}} </text>
								<view class="jiahao" @click.stop="upNumber(index)">
									<image src="@/static/jiahao.png" mode="aspectFill"></image>
								</view>
							</view>
						</view>
						<text v-if="editStatus" class="del-btn yticon icon-lajitong"
							@click.stop="deleteCartItem(index)"></text>
						<text class="invalid" v-if="item.isset == false">失效</text>
						<text class="invalid" v-if="item.stock == 0 && item.isset == true">库存不足</text>
					</view>
				</block>
			</view>
			<view class="guessyou">
				<view class="point"></view>
				<view class="point"></view>
				<text>猜你喜欢</text>
				<view class="point"></view>
				<view class="point"></view>
				<!-- <image src="@/static/guessyoulike.png" mode="aspectFill"></image> -->
			</view>
			<view class="guess-section">
				<view v-for="(item, index) in goodsList" :key="item.id" class="guess-item"
					@click="navToDetailPage(item)">
					<!-- <view class="cate_name"></view> -->
					<view class="image-wrapper">
						<image :src="item.image" mode="aspectFill"></image>
					</view>

					<view class="text-wrapper">
						<text class="title">
							<text class="partition">{{ item.cate_name }}</text><text
								class="shop_tag">{{ item.shop_tag }}</text><text
								class="sales">已售{{item.sales||0}}件</text>
						</text>
						<text class="t-text">{{ item.title }}</text>
						<view class="price">
							<text class="symbol">{{ item.sales_price }}</text>
							<text class="market_price">￥{{ item.market_price }}</text>
						</view>
						<view>
						</view>
						<view class="bottom-text">
							<text class="text1">PV:{{ item.pv_score }}</text>
							<text class="text2">贡献值:{{ item.contribute }}</text>
						</view>
					</view>




				</view>
			</view>
			<!-- 底部菜单栏 -->
			<view class="action-section" v-if="state != 'load' && !editStatus">
				<view class="checkbox" @click="check('all')">
					<image :src="allChoose ? '/static/selected.png' : '/static/select.png'" mode="aspectFit"></image>
					<view>全选</view>
					<!-- <view class="clear-btn" :class="{ show: allChoose }" @click="clearCart">清空</view> -->
				</view>
				<view class="total-box">
					<text style="color: #FF5040;font-size: 28rpx;">合计: ¥</text><text class="price">{{ total }}</text>
				</view>
				<button type="primary" class="no-border confirm-btn" @click="createOrder">去结算（{{ count }}）</button>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex';
	import uniNumberBox from '@/components/uni-number-box.vue';
	export default {
		components: {
			uniNumberBox
		},
		data() {
			return {
				total: 0, //总价格
				allChoose: false, //全选状态  true|false
				empty: false, //空白页现实  true|false
				cartList: [],
				state: 'load',
				editStatus: false,
				defaultAddress: '',
				goodsList: []
			};
		},
		onLoad() {},
		onPullDownRefresh() {
			this.state = 'load';
			this.cartList = [];
			this.getCart();
		},
		onShow() {
			this.state = 'load';
			this.cartList = [];
			this.getCart();
		},
		watch: {
			//显示空白页
			cartList(e) {
				let empty = e.length === 0 ? true : false;
				if (this.empty !== empty) {
					this.empty = empty;
				}
			}
		},
		computed: {
			...mapState(['hasLogin']),
			count() {
				let _count = 0
				this.cartList.map((item, index) => {
					return _count += item.number
				})
				return _count

			}
		},
		methods: {
			editSwitch() {
				this.editStatus = !this.editStatus
			},
			// 商品详情页
			navToDetailPage(item, flash_id = 0) {
				let id = item.product_id;
				uni.navigateTo({
					url: `/pages/product/product?id=${id}&flash=${flash_id}`
				});
			},

			// 获取产品列表
			async getProduct() {
				let goodsList = await this.$api.request('/product/lists', 'GET', {
					page: 1,
					pagesize: 6,
					show_in_home: 1
				});
				// console.log(goodsList);
				if (goodsList) {
					if (goodsList.length > 0) {
						this.goodsList = goodsList
					} else {
						this.$api.msg('');
					}
				}
			},
			//获取我的收货地址
			async getAddress() {
				let list = await this.$api.request('/address/all', 'POST', {
					page: 1,
					pagesize: 2
				});
				console.log(list)
				if (list) {
					const address = list[0]
					console.log(address)
					this.defaultAddress = address.province.name + address.city.name + address.area.name + address
						.address
				}
			},

			toCategory() {
				uni.switchTab({
					url: '/pages/category/itemize'
				})
			},

			async getCart() {
				let login = await this.$api.checkLogin();
				if (login) {
					let data = await this.$api.request('/cart');
					uni.stopPullDownRefresh();
					this.state = 'loaded';
					if (data) {
						this.cartList = data;
						console.log(this.cartList);
						this.calcTotal();
						this.getAddress()
						this.getProduct()
					}
				}
			},
			cartPrice(oldPrice, nowPrice) {
				let string = '';
				if (oldPrice < nowPrice) {
					let number = (nowPrice - oldPrice).toFixed(2);
					string = ' ↑涨价 ' + number + '元';
				} else if (oldPrice > nowPrice) {
					let number = (oldPrice - nowPrice).toFixed(2);
					string = ' ↓降价 ' + number + '元';
				}
				return string;
			},
			navToLogin() {
				uni.navigateTo({
					url: '/pages/public/login'
				});
			},
			//选中状态处理
			async check(type, index) {
				let trueArr = [];
				let falseArr = [];
				let oldChoose = [];
				const list = this.cartList;
				//保存旧的数据
				list.forEach((item) => {
					if (item.choose) {
						oldChoose.push(item.cart_id);
					}
				});

				//本地处理
				if (type === 'item') {
					this.cartList[index].choose = !this.cartList[index].choose;
					if (this.cartList[index].choose) {
						trueArr.push(this.cartList[index].cart_id);
					} else {
						falseArr.push(this.cartList[index].cart_id);
					}
				} else {
					const choose = !this.allChoose;
					list.forEach((item) => {
						item.choose = choose;
						if (item.isset) {
							if (choose) {
								trueArr.push(item.cart_id);
							} else {
								falseArr.push(item.cart_id);
							}
						}
					});
					this.allChoose = choose;
				}
				this.calcTotal(type);

				//远程处理
				let result = await this.$api.request('/cart/choose_change', 'POST', {
					trueArr,
					falseArr
				});
				if (!result) {
					//恢复原来勾选的状态
					list.forEach((item) => {
						if (oldChoose.indexOf(item.cart_id) >= 0) {
							item.choose = 1;
						} else {
							item.choose = 0;
						}
					});
					this.calcTotal(type);
				}
			},

			//++
			async upNumber(index) {

				let oldNumber = this.cartList[index].number;
				let newNumber = oldNumber + 1
				this.cartList[index].number++
				let cart_id = this.cartList[index].cart_id;
				console.log(newNumber);
				this.calcTotal();
				let result = await this.$api.request('/cart/number_change?id=' + cart_id, 'GET', {
					number: newNumber
				}, false);


			},
			//--
			async downNumber(index) {

				if (this.cartList[index].number === 1) {
					return
				}
				let oldNumber = this.cartList[index].number;
				let newNumber = oldNumber - 1
				this.cartList[index].number--
				let cart_id = this.cartList[index].cart_id;
				console.log(newNumber);
				this.calcTotal();
				let result = await this.$api.request('/cart/number_change?id=' + cart_id, 'GET', {
					number: newNumber
				}, false);


			},

			//数量
			async numberChange(data) {
				let oldNumber = this.cartList[data.index].number;
				let newNumber = data.number;
				this.cartList[data.index].number = newNumber;
				this.calcTotal();

				let cart_id = this.cartList[data.index].cart_id;
				let result = await this.$api.request('/cart/number_change?id=' + cart_id, 'GET', {
					number: newNumber
				}, false);
				if (!result) {
					this.cartList[data.index].number = oldNumber;
					this.calcTotal();
				}
			},
			//删除
			async deleteCartItem(index) {
				let list = this.cartList;
				let row = list[index];
				let id = row.cart_id;
				uni.showModal({
					content: '确认删除 ' + list[index].title + '？',
					success: async (e) => {
						if (e.confirm) {
							let result = await this.$api.request('/cart/delete?', 'POST', {
								id: id
							});
							if (result) {
								let tempCart = this.cartList.splice(index, 1);
								this.calcTotal();
							}
						}
					}
				});
			},
			//清空
			async clearCart() {
				let [error, res] = await uni.showModal({
					title: '确认清空？'
				});
				if (res.confirm) {
					let id = [];
					this.cartList.forEach((item) => {
						id.push(item.cart_id);
					});
					let data = this.$api.request('/cart/delete', 'POST', {
						id: id
					});
					let that = this;
					if (data) {
						setTimeout(function() {
							that.state = 'load';
							that.cartList = [];
							that.getCart();
						}, 300);
					}
				}
			},
			//计算总价
			calcTotal() {
				let list = this.cartList;
				if (list.length === 0) {
					this.empty = true;
					return;
				}
				let total = 0;
				let choose = true;
				list.forEach((item) => {
					if (item.isset) {
						if (item.choose == 1) {
							total += item.nowPrice * item.number;
						} else if (choose === true) {
							choose = false;
						}
					}
				});
				this.allChoose = choose;
				this.total = total.toFixed(2);
			},
			//创建订单
			createOrder() {
				let list = this.cartList;
				let cartId = [];
				list.forEach((item) => {
					if (item.choose) {
						cartId.push(item.cart_id);
					}
				});
				if (cartId.length == 0) {
					this.$api.msg('没有选中商品');
					return;
				}
				this.$api.navTo(`/pages_other/order/createOrder?cart=${cartId.join(',')}`);
			},
			navTo(url) {
				this.$api.navTo(url);
			}
		}
	};
</script>

<style lang="scss">
	page {
		background-color: #F2F4F7;
	}

	.guessyou {
		// width: 280rpx;
		height: 44rpx;
		width: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		margin-top: 50rpx;

		.point {
			width: 12rpx;
			height: 12rpx;
			border-radius: 50%;
			background-color: #FF4C00;
		}

		text {
			font-size: 32rpx;
			margin: 0 12rpx;
		}

		image {
			width: 100%;
			height: 100%;
		}
	}

	.container {
		padding-bottom: 134upx;
		background-color: #F2F4F7;
		height: 100vh;
		padding-top: 2rpx;
		padding: 0 24rpx;

		/deep/ .uni-navbar {
			.uni-navbar__header-btns-right {
				justify-content: flex-start;
			}
		}

		/* 空白页 */
		.empty {
			width: 100%;
			display: flex;
			justify-content: center;
			flex-direction: column;
			align-items: center;

			// background: #fff;
			.emptyImg {
				width: 100%;
				height: 500rpx;
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;

				.guang {

					display: flex;
					justify-content: center;
					align-items: center;

					image {
						width: 32rpx;
						height: 32rpx;
						margin-top: 8rpx;
					}

					text {
						color: #FF001F;
						height: 36rpx;

					}
				}

				image {
					width: 526rpx;
					height: 352rpx;
					margin-bottom: 12rpx;
				}

				text {
					font-size: 24rpx;
					color: rgba(50, 50, 51, 0.6);

				}
			}


			.empty-tips {
				display: flex;
				font-size: $font-sm + 2upx;
				color: $font-color-disabled;

				.navigator {
					color: $uni-color-primary;
					margin-left: 16upx;
				}
			}
		}
	}


	/* 购物车列表项 */

	.cart-list {
		// padding-bottom: 128rpx;
		// border: #333 solid 1rpx;

		.cart-item {
			display: flex;
			height: 220rpx;
			position: relative;
			padding: 20rpx 24rpx;
			border-radius: 16rpx;
			background-color: white;
			margin-bottom: 24rpx;

			.image-wrapper {
				margin-left: 46rpx;
				width: 180rpx;
				height: 180rpx;
				flex-shrink: 0;
				position: relative;

				image {
					border-radius: 16rpx;
				}
			}

			.checkbox {
				position: absolute;
				left: 16rpx;
				top: 50%;
				transform: translateY(-50%);
				z-index: 8;
				font-size: 42rpx;
				line-height: 1;
				color: $font-color-disabled;
				background: #fff;
				border-radius: 50px;
			}

			.item-right {
				height: 180rpx;
				display: flex;
				flex-direction: column;
				flex: 1;
				overflow: hidden;
				position: relative;
				padding-left: 30rpx;
				font-size: 28rpx;

				.title {
					color: rgba(51, 51, 51, 1);
					font-weight: 500;
					font-size: 28rpx;
					height: 40rpx;
					line-height: 40rpx;
					overflow: hidden;
					-webkit-line-clamp: 1;
					-webkit-box-orient: vertical;
					text-overflow: ellipsis;
				}

				.attr {
					font-size: 24rpx;
					color: $font-color-light;
					height: 50upx;
					line-height: 50upx;
				}

				.price {
					height: 50rpx;
					line-height: 50rpx;
					font-size: 40rpx;
					color: rgba(255, 87, 51, 1);
					position: absolute;
					// left: 10rpx;
					bottom: 0;
				}

				.step {
					background-color: #F2F4F7;

					button {
						width: 36rpx !important;
						height: 36rpx !important;
						border-radius: 0 !important;
					}

					button::after {
						border: none;
					}

					.icon-jiahao {
						color: #333;
					}

					input {
						border-top: 2rpx solid #f8f8f8;
						border-bottom: 2rpx solid #f8f8f8;
					}

					.uni-numbox {
						height: auto;
					}

					.uni-numbox-value {
						min-height: 36rpx;
					}
				}



				.count {
					width: 154rpx;
					height: 44rpx;
					position: absolute;
					bottom: 0;
					right: 20rpx;
					background-color: #f2f3f7;
					border-radius: 22rpx;
					display: flex;
					justify-content: space-around;
					align-items: center;
					text-align: center;

					.jiahao,
					.jianhao {
						width: 70rpx;
						height: 44rpx;
						line-height: 44rpx;

						image {
							width: 20rpx;
							height: 20rpx;
						}
					}
				}
			}

			.del-btn {
				position: absolute;
				top: 24rpx;
				right: 24rpx;
				padding: 4rpx 10rpx;
				font-size: 30rpx;
				height: 50rpx;
				color: $font-color-light;
			}

			.invalid {
				position: absolute;
				right: 0;
				bottom: 0;
				background: #999999;
				color: #ffffff;
				padding: 6upx 12upx;
				border-radius: 10upx;
				font-size: 26upx;
				margin-right: 50upx;
				margin-bottom: 32upx;
			}
		}

	}


	/* 底部栏 */
	.action-section {
		/* #ifdef H5 */
		margin-bottom: 100upx;
		/* #endif */
		position: fixed;
		left: 0;
		bottom: 0;
		z-index: 999;
		display: flex;
		align-items: center;
		width: 100%;
		height: 120rpx;
		// padding: 0 30upx;
		background: rgba(255, 255, 255, 1);
		box-shadow: 0 0 20upx 0 rgba(0, 0, 0, 0.1);
		// border-radius: 16upx;

		.checkbox {
			height: 44rpx;
			position: relative;
			display: flex;
			font-size: 28rpx;
			align-items: center;
			margin-left: 30rpx;
			color: rgba(51, 51, 51, 1);

			image {
				width: 36rpx;
				height: 100%;
				position: relative;
				margin-right: 10rpx;
				z-index: 5;
			}
		}

		.clear-btn {
			position: absolute;
			left: 26upx;
			top: 0;
			z-index: 4;
			width: 0;
			height: 52upx;
			line-height: 52upx;
			padding-left: 38upx;
			font-size: $font-base;
			color: #555;
			background: $font-color-disabled;
			border-radius: 0 50px 50px 0;
			opacity: 0;
			transition: 0.2s;

			&.show {
				opacity: 1;
				width: 120upx;
			}
		}

		.total-box {
			flex: 1;
			display: flex;
			justify-content: flex-end;
			align-items: center;
			// flex-direction: column;
			text-align: right;
			padding-right: 40upx;
			font-size: 32rpx;
			color: rgba(51, 51, 51, 1);

			.price {
				// margin-left: 20rpx;
				font-size: 40rpx;
				color: rgba(255, 87, 51, 1);
			}
		}

		.confirm-btn {
			// padding: 0 10rpx;
			height: 88rpx;
			width: 230rpx;
			border-radius: 16rpx;
			margin-right: 24rpx;
			line-height: 88rpx;
			font-size: 32rpx;
			font-weight: 300;
			background: $uni-color-primary;
			box-shadow: $box_shadow;
			white-space: nowrap;
		}
	}

	/* 复选框选中状态 */
	.action-section .checkbox.checked,
	.cart-item .checkbox.checked {
		color: $uni-color-primary;
	}

	/* 底部商品列表 */
	.guess-section {
		display: flex;
		flex-wrap: wrap;
		padding: 10rpx 10rpx;
		position: relative;
		background-color: #f2f3f7;
		padding-bottom: 218rpx;

		//justify-content: space-around;
		.guess-item {
			position: relative;
			display: flex;
			flex-direction: column;
			width: 48%;
			margin: 1% 1%;
			background-color: #fff;
			border-radius: 16rpx;
			overflow: hidden;
			z-index: 98;

			.text-wrapper {
				width: 100%;
				display: flex;
				flex-direction: column;
				padding: 0 12rpx 12rpx;
			}
		}

		.t-text {
			width: 300rpx;
			font-size: 28rpx;
			text-align: left;
			line-height: 1.6em;
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
		}

		.partition {
			// display: inline-block;
			color: white;
			height: 36rpx;
			line-height: 36rpx;
			text-align: center;
			font-size: 18rpx;
			padding: 2rpx 8rpx;
			background-color: #f55519;
			border-radius: 8rpx;
			margin-right: 10rpx;
			line-height: 26rpx;

		}

		.image-wrapper {
			width: 100%;
			height: 330upx;
			// border-radius: 10px;
			overflow: hidden;

			image {
				width: 100%;
				height: 100%;
				opacity: 1;
			}
		}

		.title {
			font-size: $font-base + 2upx;
			color: $font-color-dark;
			line-height: 1.7;
			overflow: hidden;
			display: -webkit-box;
			-webkit-line-clamp: 2;
			-webkit-box-orient: vertical;
			text-overflow: ellipsis;
		}

		.shop_tag {
			// width: 50%;
			font-size: 18rpx;
			text-align: center;
			padding: 0 8rpx;
			// height: 36rpx;
			line-height: 36rpx;
			border-radius: 8rpx;
			margin-right: 20rpx;
			background-color: #fff;
			color: $uni-color-primary;
			border: 1rpx solid $uni-color-primary;
		}

		.sales {
			margin-left: 6rpx;
			font-size: 20rpx;
			color: #cecece;
		}

		.market_price {
			margin-left: 6rpx;
			font-size: 20rpx;
			text-decoration: line-through;
			color: rgba(153, 153, 153, 1);
		}

		.bottom-text {
			display: flex;
			justify-content: space-between;
			font-size: 22rpx;
			margin-top: 6rpx;
			line-height: 22rpx;

			text {
				font-size: 20rpx;
				background-color: #f2f4f7;
				color: #323233;
				display: flex;
				justify-content: flex-start;
				margin-right: 2rpx;
				padding: 6rpx;
				white-space: nowrap;
			}

			.text1 {
				width: 45%;
			}

			.text2 {
				width: 55%;
			}
		}

		.price {
			font-size: $font-lg;
			line-height: 1;
			color: rgba(255, 87, 51, 1);
			text-align: left;
			letter-spacing: 0;

			.symbol {
				font-size: 36rpx;

				&::before {
					content: '￥';
					font-size: 24rpx;
				}
			}
		}
	}
</style>