<template>
	<view class="container">
		<uni-nav-bar left-icon="left" :border="false" height="50" right-icon="more-filled" fixed statusBar
			@clickLeft="back()">
			<view class="navbar">
				<view class="nav-item" v-for="(item) in navList" :key="item.id" :class="{'nav-active': item.id==navId}"
					@click="chooseNav(item.id)">
					{{item.name}}
				</view>

			</view>
		</uni-nav-bar>
		<view class="carousel" id="shop">
			<swiper indicator-dots circular="true" duration="400">
				<swiper-item class="swiper-item" v-for="(item, index) in product.images_text" :key="index">
					<view class="image-wrapper">
						<image :src="item" class="loaded" @click="previewImage(index)" mode="aspectFill"></image>
					</view>
				</swiper-item>
			</swiper>
		</view>

		<view class="container-main">

			<view class="introduce-section" v-if="product.product_id">
				<view class="price-box" v-if="flash == false">
					<text class="price-tip">¥</text>
					<text class="price">{{ specProduct.sales_price }}</text>
					<text class="m-price" v-if="specProduct.market_price">¥{{ specProduct.market_price }}</text>
				</view>

				<text class="title">{{ product.title }}</text>
				<view class="tag-box">
					<view class="shop-tag tag">
						{{ product.shop_tag }}
					</view>
					<view class="cate-tag tag">
						{{ product.cate_name }}
					</view>
					<view class="pv tag">
						<text class="pv-text">PV :</text>
						<text>{{ specProduct.pv_score }}</text>
					</view>
					<view class="pv tag">
						<text class="pv-text">贡献值 :</text>
						<text>{{ specProduct.contribute }}</text>
					</view>
				</view>


				<view class="desc-box">
					<view class="desc-box-item">
						<image src="@/static/baoxiu.png" mode="aspectFill"></image>
						<text>保修</text>
					</view>
					<view class="desc-box-item">
						<image src="@/static/tuihuan.png" mode="aspectFill"></image>
						<text>七天无理由退换</text>
					</view>

				</view>

				<view class="explain">
					<view class="e-header">
						<text>说明</text>
						<image src="@/static/right.png" mode="aspectFill"></image>
					</view>
					<view class="e-body">
						<view class="e-body-item">
							<image src="@/static/zhengpin.png" mode="aspectFill"></image>
							<text>正品保障</text>
						</view>
						<view class="e-body-item">
							<image src="@/static/jisufahuo.png" mode="aspectFill"></image>
							<text>极速发货</text>
						</view>
						<view class="e-body-item">
							<image src="@/static/jisuda.png" mode="aspectFill"></image>
							<text>极速达</text>
						</view>
					</view>
				</view>



				<view class="bot-row" v-if="false">
					<view class="bot-row-sales" v-if="true"></view>
					<view class="bot-row-sales" v-else>
						<image src="@/static/sales.png" mode="aspectFill"></image>
						<text>销量: {{ product.sales }}</text>
					</view>

					<view class="bot-row-stock">
						<image src="@/static/stock.png" mode="aspectFill"></image>
						<text>库存: {{ product.stock }}</text>
					</view>
				</view>
			</view>

			<view class="c-list">
				<!-- v-if="product.use_spec" -->
				<view class="c-row b-b" @click="toggleSpec" v-if="product.use_spec&&product.spec_list.length>1">
					<text class="tit">规格分类</text>
					<view class="con">
						<text class="selected-text">
							{{ specSelectedName }}
						</text>
						<text style="margin-left: 50rpx">库存:{{ specProduct.stock }}</text>
					</view>
					<text class="yticon icon-you"></text>
				</view>

			</view>

			<!-- 评价 -->
			<view class="eva-section" v-if="product.evaluate_data">
				<view class="e-header" @click="$api.navTo('/pages/product/evaluate?product_id=' + product.product_id)">
					<text class="tit">评价</text>
					<text>({{ product.evaluate_data.count }})</text>
					<text class="tip">查看全部</text>
					<text class="yticon icon-you"></text>
				</view>
				<view class="eva-box" v-if="evaluate_list.length>0" v-for="(item, index) in evaluate_list" :key="index">
					<view class="eva-top">
						<view class="eva-info">
							<image class="portrait" :src="item.avatar" mode="aspectFill"></image>
							<text class="name">{{ $api.maskUserName(item.username)  }}</text>
						</view>
						<text class="time">{{ item.createtime_text }}</text>
					</view>
					<view class="right">
						<text class="con">{{ item.comment || "无" }}</text>
						<view class="bot">
							<text class="attr" v-if="item.spec">购买类型：{{ item.spec }}</text>
							<text class="attr" v-else></text>
						</view>
					</view>
				</view>
				<view class="eva-box" v-if="evaluate_list.length==0">
					<view class="right">
						<text class="con">暂无评论，期待您的评论</text>
					</view>
				</view>
			</view>
			<view id="desc"></view>
			<view class="detail-desc" v-if="product.desc">
				<view class="d-header">
					<text>商品详情</text>
				</view>
				<rich-text :nodes="product.desc"></rich-text>
			</view>

		</view>

		<!-- 底部操作菜单 -->
		<view class="page-bottom">
			<navigator url="/pages/index/index" open-type="switchTab" class="p-b-btn">
				<image class="c-icon" src="../../static/index2.png" mode="aspectFill"></image>
				<text>首页</text>
			</navigator>
			<navigator url="/pages/cart/cart" open-type="switchTab" class="p-b-btn" v-if="product.join_cart">
				<image class="c-icon" src="../../static/cart2.png" mode="aspectFill"></image>
				<text>购物车</text>
				<text class="cart-count" v-if="product.cart_num">{{ product.cart_num }}</text>
			</navigator>
			<view class="p-b-btn" :class="{ active: favorite }" @click="toFavorite" v-if="!flash">
				<image class="c-icon" src="../../static/like.png" mode="aspectFill" v-if="!favorite"></image>
				<image class="c-icon" src="../../static/liked.png" mode="aspectFill" v-else></image>
				<text>收藏</text>
			</view>
			<view class="action-btn-group" v-if="!flash && product.join_cart">
				<button type="primary" class="action-btn no-border add-cart-btn" @click="addCart">加入购物车</button>
				<button type="primary" class="action-btn no-border buy-now-btn" @click="toggleSpec">立即购买</button>
			</view>
			<view class="action-btn-group only_cart" v-if="flash">
				<button type="primary" class="action-btn no-border buy-now-btn" @click="toggleSpec">立即购买</button>
			</view>
			<view class="action-btn-group only_cart" v-if="!product.join_cart" @click="toggleSpec()">
				<button type="primary"
					class="action-btn no-border buy-now-btn">{{ category_id == 8 ? '立即兑换' : '立即购买' }}</button>
			</view>
		</view>

		<!-- 领取优惠券-模态层弹窗 -->
		<view class="popup spec" :class="couponClass" @touchmove.stop.prevent="stopPrevent" @click="toggleCoupon">
			<!-- 遮罩层 -->
			<view class="mask"></view>
			<view class="layer attr-content content-coupon" @click.stop="stopPrevent">
				<!-- 优惠券页面，仿mt -->
				<view class="coupon-item" v-for="(item, index) in product.coupon" :key="index">
					<view class="con">
						<view class="left">
							<text class="title">{{ item.title }}</text>
							<text class="time">有效期至{{ item.endtime_text }}</text>
						</view>
						<view class="right">
							<text class="price">{{ item.value }}</text>
							<text>满{{ item.least }}可用</text>
						</view>
						<view class="circle l"></view>
						<view class="circle r"></view>
					</view>
					<text class="tips">限一张使用</text>
				</view>
			</view>
			<button class="btn retract" @click="toggleCoupon">收起</button>
		</view>

		<!-- 规格-模态层弹窗 -->
		<view class="popup spec" :class="specClass" @touchmove.stop.prevent="stopPrevent" @click="toggleSpec">
			<!-- 遮罩层 -->
			<view class="mask"></view>
			<view class="layer attr-content" @click.stop="stopPrevent">
				<view class="a-t">
					<image v-if="specProduct.image" mode="aspectFill" :src="specProduct.image"></image>
					<view class="right">
						<text class="price">¥{{ specProduct.sales_price }}</text>
						<text class="stock">库存：{{ specProduct.stock }}件</text>
						<view class="selected" v-if="specSelectedName">
							已选：
							<text class="selected-text">
								{{ specSelectedName }}
							</text>
						</view>
					</view>
				</view>
				<view v-for="(item, index) in specList" :key="index" class="attr-list">
					<text>{{ item.name }}</text>
					<view class="item-list">
						<text v-for="(childItem, childIndex) in specChildList" v-if="childItem.pid === item.id"
							:key="childIndex" class="tit" :class="{ selected: childItem.selected }"
							@click="selectSpec(childIndex, childItem.pid)">
							{{ childItem.name }}
						</text>
					</view>
				</view>
				<button class="btn buyBtn" @click="buy">{{ category_id == 8 ? '立即兑换' : '立即购买' }}</button>
				<!-- <button class="btn buyBtn" @click="buy"> 立即兑换</button> -->
			</view>
		</view>
		<view id="evaluate"></view>
		<!-- 分享 -->
		<!-- <share ref="share" :contentHeight="580" :shareList="shareList"></share> -->
	</view>
</template>

<script>
	import {
		mapGetters
	} from 'vuex';
	import share from '@/components/share';
	import ProgressBar from '@/components/Progress-Bar/Progress-Bar';
	import uniCountdown from '@/components/uni-countdown/uni-countdown.vue';
	let flash_id = 0;
	export default {
		components: {
			share,
			ProgressBar,
			uniCountdown
		},
		computed: {
			...mapGetters(['userInfo', 'hasLogin']),

			specSelectedName() {
				return this.specSelected.join(' ');
			},
			specProduct() {
				if (this.product.use_spec == 1) {
					let market_price = this.product.market_price;
					let sales_price = this.product.sales_price;
					let stock = this.product.stock;
					let image = this.product.image;
					let pv_score = this.product.pv_score;
					let epuity = this.product.epuity;
					let contribute = this.product.contribute;
					let specSelectedName = this.specSelected.join(' ');
					let specTableList = this.specTableList;
					for (var item of this.specTableList) {
						if (item.value.join(' ') == specSelectedName) {
							market_price = item.market_price;
							sales_price = item.sales_price;
							stock = item.stock;
							image = item.image;
							pv_score = item.pv_score;
							epuity = item.epuity;
							contribute = item.contribute;
						}
					}
					return {
						market_price,
						sales_price,
						stock,
						image,
						pv_score,
						epuity,
						contribute
					};
				} else {
					return this.product;
				}
			}
		},
		data() {
			return {
				couponClass: 'none',
				specClass: 'none',
				specSelected: [],
				spec:'',
				favorite: false,
				shareList: [],
				specList: [],
				specChildList: [],
				specTableList: [],
				product: {},
				flash: false,
				id: 0,
				category_id: 0,
				countdown: {},
				progress: {
					sold: 1,
					number: 1
				},
				navId: 0,
				navList: [{
						id: 0,
						name: '商品'
					},
					{
						id: 1,
						name: '评价'
					},
					{
						id: 2,
						name: '详情'
					}
				],
				shopTop: 0,
				evaluateTop: 0,
				descTop: 0,
				scrollTop: 0,
				timer: null,
				evaluate_list: [],
				evaluateFlag: false,
				Detailheight: 720,
			};
		},
		watch: {
			evaluateFlag(newValue) {
				if (newValue) {
					this.Detailheight = 720;
				} else {
					this.Detailheight = 720;
				}
			}
		},
		onPullDownRefresh() {
			if (this.$refs && this.$refs.countd) {
				this.$refs.countd.syncFlag = false;
			}
			this.getDetail(this.id, this.flash ? this.flash : 0);
		},
		onShareAppMessage(e) {
			return {
				title: this.product.title
			};
		},
		onPageScroll(event) {
			this.scrollTop = event.scrollTop;
			// console.log('页面滚动位置：', event.scrollTop);
			if (this.timer) {
				clearTimeout(this.timer);
			}

			this.timer = setTimeout(() => {
				if (event.scrollTop < 609 && this.navId !== 0) {
					this.navId = 0;
				} else if (event.scrollTop >= 643 && event.scrollTop <= this.Detailheight && this.navId !== 1) {
					this.navId = 1;
				} else if (event.scrollTop > this.Detailheight && this.navId !== 2) {
					this.navId = 2;
				}
			}, 300);
		},
		async onLoad(options) {
			this.id = options.id;
			this.category_id = options.category_id;
			console.log(this.category_id);
			flash_id = options.flash ? options.flash : 0;
			if (flash_id != 0) {
				this.flash = flash_id;
			}
			await this.getDetail(this.id, flash_id);
			this.getEvaluete()
		},

		mounted() {
			this.getScroll()
		},
		methods: {

			async getEvaluete() {
				let comment = await this.$api.request('/product/evaluate', 'GET', {
					product_id: this.product.product_id,
					page: 1,
					pagesize: 3
				});
				uni.stopPullDownRefresh();
				console.log('555', comment);

				if (comment.length > 0) {
					this.evaluateFlag = true
				}
				if (comment) {
					this.page++;
					comment.forEach(item => {
						this.evaluate_list.push(item);
					});
				}
			},

			async getScroll() {
				await this.$nextTick();
				const query1 = uni.createSelectorQuery().in(this);
				query1
					.select("#shop")
					.boundingClientRect((data) => {
						// console.log("得到布局位置信息" + JSON.stringify(data));
						this.shopTop = data.top
						console.log("节点离页面顶部的距离为" + data.top);
					})
					.exec();

				const query2 = uni.createSelectorQuery().in(this);
				query2
					.select("#evaluate")
					.boundingClientRect((data) => {
						// console.log("得到布局位置信息" + JSON.stringify(data));
						this.evaluateTop = data.top
						console.log("节点离页面顶部的距离为" + data.top);
					})
					.exec();
				const query3 = uni.createSelectorQuery().in(this);
				query3
					.select("#desc")
					.boundingClientRect((data) => {
						// console.log("得到布局位置信息" + JSON.stringify(data));
						this.descTop = data.top
						console.log("节点离页面顶部的距离为" + data.top);
					})
					.exec();

			},
			chooseNav(id) {
				this.navId = id
				//滑动逻辑
				// console.log(this.navId);
				if (id === 0) {
					uni.pageScrollTo({
						scrollTop: this.shopTop - this.shopTop,
						duration: 200
					});
				}
				if (id === 1) {
					uni.pageScrollTo({
						scrollTop: 610,
						duration: 200
					});
				}
				if (id === 2) {
					uni.pageScrollTo({
						// scrollTop: this.descTop+250-this.shopTop,
						scrollTop: 727,
						duration: 200
					});
				}


			},

			// 为0时刷新页面
			timeup() {
				this.getDetail(this.id, this.flash ? this.flash : 0);
			},
			// 获取商品详情
			async getDetail(id, flash_id) {
				let apiUrl = flash_id == 0 ? '/product/detail' : '/flash/productDetail';
				let product = await this.$api.request(apiUrl + `?id=${id}&flash_id=${flash_id}`, 'GET');
				// console.log('+++', product);
				uni.stopPullDownRefresh();
				if (!product) {
					setTimeout(function() {
						uni.navigateBack();
					}, 2000);
					return;
				}
				this.product = product;
				// console.log(this.product);
				if (product.flash) {
					this.countdown = product.flash.countdown;
					this.progress = product.flash;
				}
				this.favorite = this.product.favorite;
				if (this.product.use_spec) {
					let specList = this.product.spec_list;
					let specTableList = this.product.spec_table_list;

					let e = 1;
					let ee = 1;
					let specChildList = [];
					for (let i in specList) {
						specList[i].id = e++;
						for (let ii in specList[i].child) {
							specChildList.push({
								id: ee++,
								pid: specList[i].id,
								name: specList[i].child[ii]
							});
						}
					}
					this.specList = specList;
					this.specChildList = specChildList;
					this.specTableList = specTableList;
					//console.log(this.specList)
					//console.log(specChildList)

					//规格 默认选中第一条
					this.specSelected = [];
					this.specList.forEach((item) => {
						for (let cItem of this.specChildList) {
							if (cItem.pid === item.id) {
								this.$set(cItem, 'selected', true);
								this.specSelected.push(cItem.name);
								break; //forEach不能使用break
							}
						}
					});
				}
			},
			//领取优惠券开关
			toggleCoupon() {
				if (this.couponClass === 'show') {
					this.couponClass = 'hide';
					setTimeout(() => {
						this.couponClass = 'none';
					}, 250);
				} else if (this.couponClass === 'none') {
					this.couponClass = 'show';
				}
			},
			//规格弹窗开关
			toggleSpec() {
				if (this.specClass === 'show') {
					this.specClass = 'hide';
					setTimeout(() => {
						this.specClass = 'none';
					}, 250);
				} else if (this.specClass === 'none') {
					this.specClass = 'show';
				}
				// this.buy()
			},
			//选择规格
			selectSpec(index, pid) {
				console.log(index,pid);
				let list = this.specChildList;
				this.spec = list[index].name
				console.log(this.spec);
				// console.log(this.specChildList);
				
				list.forEach((item) => {
					if (item.pid === pid) {
						this.$set(item, 'selected', false);
					}
				});

				this.$set(list[index], 'selected', true);
				//存储已选择
				/**
				 * 修复选择规格存储错误
				 * 将这几行代码替换即可
				 * 选择的规格存放在specSelected中
				 */
				this.specSelected = [];
				//console.log(list)
				list.forEach((item) => {
					if (item.selected === true) {
						this.specSelected.push(item.name);
					}
				});
			},

			back() {
				uni.navigateBack()
			},
			//分享
			share() {
				this.$refs.share.toggleMask();
			},
			//收藏
			async toFavorite() {
				if (this.flash) {
					this.$api.msg('秒杀商品不能收藏');
					return;
				}
				let is_login = await this.$api.checkLogin();
				if (is_login) {
					this.favorite = !this.favorite;
					let bool = await this.$api.request('/product/favorite?id=' + this.product.product_id);
					if (!bool) {
						this.favorite = !this.favorite;
					}
				}
			},
			async buy() {
				let is_login = await this.$api.checkLogin();
				if (is_login) {
					let spec = this.spec;
					// if (this.product.use_spec == 1) {
					// 	spec = this.specSelected.join(',');
					// }
					let url = '';
					if (this.category_id == 8) {
						url = `/pages_other/order/seckillOrder?id=${this.product.product_id}&spec=${spec}`;
					} else {
						url = `/pages_other/order/createOrder?id=${this.product.product_id}&spec=${spec}`;
					}

					if (this.flash) {
						url = url + `&flash_id=${this.flash}`;
					}
					uni.navigateTo({
						url: url
					});
				}
			},
			//添加购物车
			async addCart() {
				if (this.flash) {
					this.$api.msg('秒杀商品不能加入购物车');
					return;
				}
				let is_login = await this.$api.checkLogin();
				if (is_login) {
					let spec = '';
					if (this.product.use_spec == 1) {
						spec = this.specSelected.join(',');
					}
					let data = await this.$api.request('/cart/add?id=' + this.product.product_id + '&spec=' + spec);
					if (data) {
						this.product.cart_num++;
					}
				}
			},
			stopPrevent() {},
			// 计算百分比
			percentage(number, sold) {
				if (!sold) {
					return 0;
				}
				return parseInt((sold / number) * 100);
			},
			// 查看图片
			previewImage(index) {
				uni.previewImage({
					current: this.product.images_text[index],
					urls: this.product.images_text,
					indicator: 'number',
					loop: true
				});
			}
		}
	};
</script>

<style lang="scss">
	page {
		background: #F2F4F7;
		padding-bottom: 180rpx;
	}



	.navbar {
		width: 100%;
		display: flex;
		justify-content: space-evenly;
		align-items: center;
		font-size: 32rpx;
		height: 100%;
		padding: 16rpx 0;

		// background-color: lightblue;
		.nav-item {
			color: #333;
			height: 70rpx;
			line-height: 68rpx;
			/* #ifdef APP */
			height: 60rpx;
			line-height: 58rpx;
			/* #endif */
			border: transparent solid 4rpx;
		}

		.nav-active {
			color: #ff5733;
			border-bottom: #ff5733 solid 4rpx;
		}
	}

	.icon-you {
		font-size: $font-base + 2upx;
		color: #888;
	}

	.container-main {
		transform: translateY(-40rpx);
		background-color: #fff;
		overflow: hidden;
		border-radius: 36rpx;
	}

	.carousel {
		height: 750upx;
		position: relative;

		swiper {
			height: 100%;
		}

		.image-wrapper {
			width: 100%;
			height: 100%;
		}

		.swiper-item {
			display: flex;
			justify-content: center;
			align-content: center;
			height: 750upx;
			overflow: hidden;

			image {
				width: 100%;
				height: 100%;
			}
		}
	}

	/* 标题简介 */
	.introduce-section {
		background: #fff;
		padding: 20upx 30upx;

		.title {
			display: inline-block;
			font-size: 32rpx;
			color: $font-color-dark;
			height: 48rpx;
			// margin-top: 50rpx;
			margin-top: 14rpx;
			line-height: 48rpx;
		}

		.down {
			font-size: 28rpx;
			color: #909399;
		}

		.price-box {
			display: flex;
			align-items: baseline;
			height: 64rpx;
			padding: 10rpx 0;
			font-size: 48rpx;
			font-weight: 400;
			letter-spacing: 0rpx;
			line-height: 64rpx;
			color: rgba(255, 87, 51, 1);
			text-align: left;
			margin-bottom: 10rpx;
			margin-top: 12rpx;

			.price-tip {
				font-size: 36rpx
			}

			.price {
				font-size: 64rpx;
				margin-right: 14rpx;
			}

			.m-price {
				margin: 0 12upx;
				color: $font-color-light;
				font-size: 28rpx;
				// text-decoration: line-through;
			}
		}


		.desc-box {
			height: 40rpx;
			width: 100%;
			display: flex;

			.desc-box-item {
				height: 40rpx;
				// width: 100rpx;
				display: flex;
				align-items: center;
				margin-right: 42rpx;

				image {
					width: 36rpx;
					height: 36rpx;
				}

				text {
					font-size: 24rpx;
					font-weight: 300;
					margin-left: 10rpx;
				}
			}
		}

		.explain {
			width: 100%;
			height: 134rpx;
			margin-top: 12rpx;
			padding: 20rpx;
			background-color: rgba(242, 244, 247, 0.6);
			// opacity: 0.6;
			border-radius: 16rpx;

			.e-header {
				width: 100%;
				height: 36rpx;
				font-size: 24rpx;
				color: #323233;
				display: flex;
				align-items: center;
				justify-content: space-between;

				image {
					width: 36rpx;
					height: 36rpx;
				}
			}

			.e-body {
				display: flex;
				align-items: center;
				justify-content: space-around;
				height: 58rpx;
				width: 100%;
				font-size: 24rpx;

				.e-body-item {
					width: 160rpx;
					display: flex;
					align-items: center;

					// justify-content: space-evenly;
					image {
						width: 32rpx;
						height: 32rpx;
						margin-right: 12rpx;
					}
				}
			}
		}

		.tag-box {
			width: 100%;
			display: flex;
			font-size: 20rpx;
			margin: 20rpx 0;

			.tag {
				padding: 0 16rpx;
				height: 36rpx;
				line-height: 36rpx;
				border-radius: 8rpx;
				margin-right: 20rpx;
			}

			.shop-tag {
				color: #fff;
				background-color: $uni-color-primary;
			}

			.cate-tag {
				background-color: #fff;
				color: #FFA800;
				border: 1rpx solid #FFA800;
			}

			.pv {
				border: none;
				padding: 0;

				.pv-text {
					font-size: 24rpx;
					color: rgba(153, 153, 153, 1);
				}
			}
		}

		.coupon-tip {
			align-items: center;
			padding: 4upx 10upx;
			background: $uni-color-primary;
			font-size: $font-sm;
			color: #fff;
			border-radius: 6upx;
			line-height: 1;
			transform: translateY(-4upx);
		}

		.bot-row {
			display: flex;
			align-items: center;
			height: 50rpx;
			font-size: $font-sm;
			color: $font-color-light;
			margin-top: 20rpx;

			.bot-row-sales,
			.bot-row-stock {
				width: 50%;
				display: flex;
				justify-content: center;
				align-items: center;

				image {
					width: 40rpx;
					height: 40rpx;
				}

				text {
					margin-left: 14rpx;
				}
			}

			.iconfont {
				margin-right: 20upx;
			}
		}
	}

	/* 分享 */
	.share-section {
		display: flex;
		align-items: center;
		color: $font-color-base;
		background: linear-gradient(left, #fdf5f6, #fbebf6);
		padding: 12upx 30upx;

		.share-icon {
			display: flex;
			align-items: center;
			width: 70upx;
			height: 30upx;
			line-height: 1;
			border: 1px solid $uni-color-primary;
			border-radius: 4upx;
			position: relative;
			overflow: hidden;
			font-size: 22upx;
			color: $uni-color-primary;

			&:after {
				content: '';
				width: 50upx;
				height: 50upx;
				border-radius: 50%;
				left: -20upx;
				top: -12upx;
				position: absolute;
				background: $uni-color-primary;
			}
		}

		.icon-xingxing {
			position: relative;
			z-index: 1;
			font-size: 24upx;
			margin-left: 2upx;
			margin-right: 10upx;
			color: #fff;
			line-height: 1;
		}

		.tit {
			font-size: $font-base;
			margin-left: 10upx;
		}

		.icon-bangzhu1 {
			padding: 10upx;
			font-size: 30upx;
			line-height: 1;
		}

		.share-btn {
			flex: 1;
			text-align: right;
			font-size: $font-sm;
			color: $uni-color-primary;
		}

		.icon-you {
			font-size: $font-sm;
			margin-left: 4upx;
			color: $uni-color-primary;
		}
	}

	.c-list {
		font-size: $font-sm + 2upx;
		color: $font-color-base;
		background: #fff;
		padding-bottom: 20upx;
		margin-bottom: 20rpx;

		.c-row {
			display: flex;
			align-items: center;
			padding: 40upx 0upx;
			position: relative;
			margin: 0 30upx;
		}

		.tit {
			width: 140upx;
		}

		.con {
			flex: 1;
			color: $font-color-dark;

			.selected-text {
				margin-right: 10upx;
			}
		}

		.bz-list {
			height: 40upx;
			font-size: $font-sm + 2upx;
			color: $font-color-dark;

			text {
				display: inline-block;
				margin-right: 30upx;
			}
		}

		.con-list {
			flex: 1;
			display: flex;
			flex-direction: column;
			color: $font-color-dark;
			line-height: 40upx;
		}

		.red {
			color: $uni-color-primary;
		}
	}

	/* 评价 */
	.eva-section {
		display: flex;
		flex-direction: column;
		padding: 20upx 30upx;
		background: #fff;
		margin-top: 16upx;

		.e-header {
			display: flex;
			align-items: center;
			height: 70upx;
			font-size: $font-sm + 2upx;
			color: $font-color-light;

			.tit {
				font-size: $font-base + 2upx;
				color: $font-color-dark;
				margin-right: 4upx;
			}

			.tip-ex {
				width: 85%;
				text-align: right;

				.iconfont {
					font-size: 28rpx;
					margin: 0 16rpx;
					color: $uni-color-primary;
				}
			}

			.tip {
				flex: 1;
				text-align: right;
			}

			.icon-you {
				margin-left: 10upx;
			}
		}
	}

	.eva-box {
		padding: 20rpx 0;

		.eva-top {
			width: 100%;
			display: flex;
			align-items: center;
			font-size: 28rpx;
			justify-content: space-between;

			.eva-info {
				display: flex;
				align-items: center;

				.portrait {
					width: 72rpx;
					height: 72rpx;
					margin-right: 12rpx;
				}
			}

			.time {
				font-size: 24rpx;
				color: #a3a3a4;
			}

		}


		.right {
			flex: 1;
			display: flex;
			flex-direction: column;
			font-size: $font-base;
			color: $font-color-base;
			padding-left: 26upx;

			.con {
				font-size: $font-base;
				color: $font-color-dark;
				padding: 12rpx 0;
			}

			.bot {
				display: flex;
				justify-content: space-between;
				font-size: $font-sm;
				color: $font-color-light;
			}
		}
	}

	/*  详情 */
	.detail-desc {
		background: #fff;
		// margin-top: 16rpx;
		padding: 0 20rpx;
		font-size: $font-base;
		box-sizing: border-box;

		.d-header {
			display: flex;
			justify-content: center;
			align-items: center;
			height: 80upx;
			font-size: $font-base + 2upx;
			color: $font-color-dark;
			position: relative;

			text {
				padding: 0 20upx;
				background: #fff;
				position: relative;
				z-index: 1;
			}

			&:after {
				position: absolute;
				left: 50%;
				top: 50%;
				transform: translateX(-50%);
				width: 300upx;
				height: 0;
				content: '';
				border-bottom: 1px solid #ccc;
			}
		}
	}

	/* 规格选择弹窗 */
	.attr-content {
		padding: 30upx 30upx 120upx;

		.a-t {
			display: flex;

			image {
				width: 170upx;
				height: 170upx;
				flex-shrink: 0;
				margin-top: -50upx;
				border-radius: 8upx;
				border: 1px solid #ccc;
				background: #fff;
			}

			.right {
				display: flex;
				flex-direction: column;
				padding-left: 24upx;
				font-size: $font-sm + 2upx;
				color: $font-color-base;
				line-height: 42upx;

				.price {
					font-size: $font-lg;
					color: $uni-color-primary;
					margin-bottom: 10upx;
				}

				.selected-text {
					margin-right: 10upx;
				}
			}
		}

		.attr-list {
			display: flex;
			flex-direction: column;
			font-size: $font-base + 2upx;
			color: $font-color-base;
			padding-top: 30upx;
			padding-left: 10upx;
		}

		.item-list {
			padding: 20upx 0 0;
			display: flex;
			flex-wrap: wrap;

			text {
				display: flex;
				align-items: center;
				justify-content: center;
				background: #eee;
				margin-right: 20upx;
				margin-bottom: 20upx;
				border-radius: 100upx;
				min-width: 60upx;
				height: 60upx;
				padding: 0 20upx;
				font-size: $font-base;
				color: $font-color-dark;
			}

			.selected {
				background: #fbebee;
				color: $uni-color-primary;
			}
		}
	}

	/*  弹出层 */
	.popup {
		position: fixed;
		left: 0;
		top: 0;
		right: 0;
		bottom: 0;
		z-index: 99;

		&.show {
			display: block;

			.mask {
				animation: showPopup 0.2s linear both;
			}

			.layer {
				animation: showLayer 0.2s linear both;
			}
		}

		&.hide {
			.mask {
				animation: hidePopup 0.2s linear both;
			}

			.layer {
				animation: hideLayer 0.2s linear both;
			}
		}

		&.none {
			display: none;
		}

		.mask {
			position: fixed;
			top: 0;
			width: 100%;
			height: 100%;
			z-index: 1;
			background-color: rgba(0, 0, 0, 0.4);
		}

		.layer {
			position: fixed;
			z-index: 99;
			bottom: 0;
			width: 100%;
			min-height: 25vh;
			border-radius: 10upx 10upx 0 0;
			background-color: #fff;

			.btn {
				height: 66upx;
				line-height: 66upx;
				border-radius: 100upx;
				background: $uni-color-primary;
				font-size: $font-base + 2upx;
				color: #fff;
				margin: 30upx auto 20upx;
			}

			.btn.buyBtn {
				position: absolute;
				bottom: 0;
				left: 5%;
				width: 90%;
			}
		}

		@keyframes showPopup {
			0% {
				opacity: 0;
			}

			100% {
				opacity: 1;
			}
		}

		@keyframes hidePopup {
			0% {
				opacity: 1;
			}

			100% {
				opacity: 0;
			}
		}

		@keyframes showLayer {
			0% {
				transform: translateY(120%);
			}

			100% {
				transform: translateY(0%);
			}
		}

		@keyframes hideLayer {
			0% {
				transform: translateY(0);
			}

			100% {
				transform: translateY(120%);
			}
		}
	}

	/* 底部操作菜单 */
	.page-bottom {
		position: fixed;
		left: 0;
		bottom: 0;
		z-index: 95;
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 100%;
		height: 140rpx;
		background: rgba(255, 255, 255, 1);
		box-shadow: 0 0 20upx 0 rgba(51, 51, 51, 0.4);
		padding-left: 30rpx;
		padding-bottom: 24rpx;

		.p-b-btn {
			width: 60rpx;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			font-size: 20rpx;
			color: $font-color-base;
			width: 60rpx;
			height: 80rpx;
			position: relative;

			.c-icon {
				width: 52rpx;
				height: 52rpx;
			}

			/* 购物车数量 */
			.cart-count {
				border: 4rpx solid $uni-color-primary;
				width: 36rpx;
				height: 36rpx;
				color: #fff;
				text-align: center;
				border-radius: 40rpx;
				position: absolute;
				font-size: 24rpx;
				background: #FF2E00;
				top: -12rpx;
				right: 0;
			}

			.yticon {
				font-size: 40rpx;
				line-height: 42rpx;
				color: $font-color-light;
			}

			&.active,
			&.active .yticon {
				color: $uni-color-primary;
			}
		}

		.action-btn-group {
			display: flex;
			height: 80rpx;
			overflow: hidden;

			margin-left: 20rpx;
			position: relative;
			border-radius: 40rpx;
			margin-right: 24rpx;

			.action-btn {
				display: flex;
				align-items: center;
				justify-content: center;
				width: 198rpx;
				height: 80rpx;
				font-size: $font-sm;
				padding: 0;
				border-radius: 0;
				background: transparent;
			}

			.add-cart-btn {
				background-color: rgba(51, 51, 51, 1);
				color: #fff;
			}

			.buy-now-btn {
				background-color: #FF2E00;
				color: #fff;
			}
		}

		.action-btn-group.only_cart {
			margin-left: 30px;

			width: 65%;

			.action-btn {
				width: 300upx;
			}

			&:after {
				content: '';
				position: absolute;
				top: 0;
				right: 0;
				transform: translateY(-50%);
				height: 0;
				width: 0;
				border: 0;
			}
		}
	}

	.flash {
		height: 100upx;
		background: linear-gradient(to right, #ffac30, #fa436a, #f56c6c);
		display: flex;
		flex-direction: row;
		position: relative;

		.sales_price {
			.symbol {
				font-size: 30upx;
				display: inline;
			}

			color: #fff;
			font-size: 50upx;
		}

		.left {
			font-size: 28upx;
			padding: 10upx;

			.market_price {
				color: #dcdfe6;
				text-decoration: line-through;
			}

			.sold {
				color: #e4e7ed;
			}
		}

		.right {
			height: 100%;
			width: 300upx;
			position: absolute;
			right: 0;
			padding: 4upx;
			margin-right: 20upx;

			.time {
				font-size: 30upx;
				color: #fffa30;
				text-align: center;

				.uni-countdown {
					display: inline-flex;
				}
			}

			.progress {
				position: absolute;
				bottom: 7rpx;
				right: 10upx;
			}

			.flashDone {
				font-size: 40rpx;
				height: 90rpx;
				line-height: 90rpx;
			}
		}
	}

	/* 优惠券列表 */
	.content-coupon {
		padding-bottom: 100rpx;
		max-height: 800rpx;
		overflow: auto;
	}

	.retract {
		position: fixed;
		bottom: 0;
		width: 700rpx;
		z-index: 100;
		margin: 20rpx 25rpx;
		color: #ffffff;
		background: #fa436a;
	}

	.coupon-item {
		display: flex;
		flex-direction: column;
		background: #fff;

		.con {
			display: flex;
			align-items: center;
			position: relative;
			height: 120upx;
			padding: 0 30upx;

			&:after {
				position: absolute;
				left: 0;
				bottom: 0;
				content: '';
				width: 100%;
				height: 0;
				border-bottom: 1px dashed #f3f3f3;
				transform: scaleY(50%);
			}
		}

		.left {
			display: flex;
			flex-direction: column;
			justify-content: center;
			flex: 1;
			overflow: hidden;
			height: 100upx;
		}

		.title {
			font-size: 32upx;
			color: $font-color-dark;
			margin-bottom: 10upx;
		}

		.time {
			font-size: 24upx;
			color: $font-color-light;
		}

		.right {
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			font-size: 26upx;
			color: $font-color-base;
			height: 100upx;
		}

		.price {
			font-size: 44upx;
			color: $base-color;

			&:before {
				content: '￥';
				font-size: 34upx;
			}
		}

		.tips {
			font-size: 24upx;
			color: $font-color-light;
			line-height: 60upx;
			padding-left: 30upx;
		}

		.circle {
			position: absolute;
			left: -6upx;
			bottom: -10upx;
			z-index: 10;
			width: 20upx;
			height: 20upx;
			background: #f3f3f3;
			border-radius: 100px;

			&.r {
				left: auto;
				right: -6upx;
			}
		}
	}

	.tag {
		font-size: 24upx;
		color: $base-color;
		margin-right: 5upx;
		background: #ffffff;
		border: 1px solid $base-color;
		border-radius: 4upx;
		padding: 4upx 10upx;
		line-height: 1;
	}

	.c-list .titlable {
		width: auto;
		margin-right: 10rpx;
	}
</style>