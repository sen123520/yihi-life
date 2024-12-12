<template>
	<view class="content">
		<view class="search">
			<uni-search-bar radius="20" bgColor="#ffffff" placeholder="输入关键词搜索" clearButton="auto" v-model="searchword"
				cancelButton="none" @confirm="search" />
		</view>
		<view class="navbar">
			<view class="nav-item" :class="{ current: filterIndex === 0 }" @click="tabClick(0)">综合排序</view>
			<view class="nav-item" :class="{ current: filterIndex === 1 }" @click="tabClick(1)">销量优先</view>
			<view class="nav-item" :class="{ current: filterIndex === 2 }" @click="tabClick(2)">
				<text>价格</text>
				<view class="p-box">
					<text :class="{ active: priceOrder === 1 && filterIndex === 2 }" class="yticon icon-shang"></text>
					<text :class="{ active: priceOrder === 2 && filterIndex === 2 }"
						class="yticon icon-shang xia"></text>
				</view>
			</view>
			<text class="cate-item yticon icon-fenlei" @click="toggleCateMask('show')"></text>
		</view>
		<view style="display: flex">
			
			<view class="aside">
				<view class="catgroy">
					<scroll-view scroll-y="true" class="scroll-container">
						<view class="catgroy-item" :class="{ active: currentId == 0 }" @click="toggleKinds(allItem)">全部
						</view>
						<view class="catgroy-item" v-for="(item, index) in clist" :key="item.id"
							:class="{ active: item.id === currentId }" @click="toggleKinds(item)">{{ item.name }}</view>
					</scroll-view>

				</view>
			</view>
			<view class="guess-section">
				<view class="empty" v-if="goodsList.length==0">
					暂无商品
				</view>
				<view v-for="(item, index) in goodsList" :key="index" class="guess-item" @click="navToDetailPage(item)">
					<!-- <view class="cate_name"></view> -->
					<view class="image-wrapper">
						<image :src="item.image" mode="aspectFill"></image>
					</view>
					<text class="title">
						<text class="partition">{{ item.cate_name }}</text>
						{{ item.title }}
					</text>
					<text class="shop_tag">{{ item.shop_tag }}</text>
					<view class="">
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

		<uni-load-more :status="loadingType"></uni-load-more>

		<view class="cate-mask" :class="cateMaskState === 0 ? 'none' : cateMaskState === 1 ? 'show' : ''"
			@click="toggleCateMask">
			<view class="cate-content" @click.stop.prevent="stopPrevent" @touchmove.stop.prevent="stopPrevent">
				<scroll-view scroll-y class="cate-list">
					<view v-for="item in cateList" :key="item.id">
						<view class="cate-item b-b two" :class="{ active: item.id == fId }"
							@click="changeFirst(item.id)">{{ item.name }}</view>
						<view v-for="tItem in item.child" :key="tItem.id" class="cate-item b-b"
							:class="{ active: tItem.id == sId }" @click="changeSecond(tItem)">
							{{ tItem.name }}
						</view>
					</view>
				</scroll-view>
			</view>
		</view>
	</view>
</template>

<script>
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';

	export default {
		components: {
			uniLoadMore
		},
		data() {
			return {
				cateMaskState: 0, //分类面板展开状态
				headerPosition: 'fixed',
				headerTop: '88rpx',
				loadingType: 'more', //加载更多状态
				filterIndex: 0,
				fId: 0, // 已选一级分类
				sId: 0, // 已选二级分类id
				priceOrder: 0, //1 价格从低到高 2价格从高到低
				cateList: [],
				goodsList: [],
				page: 1,
				currentId: 0,
				allItem: {

				},
				clist: [
					// { id: 1, name: '分类1' },
					// { id: 2, name: '分类2' },
					// { id: 3, name: '分类3' }
				]
			};
		},
		// #ifndef H5
		data() {
			return {
				cateMaskState: 0, //分类面板展开状态
				headerPosition: 'fixed',
				headerTop: '0',
				loadingType: 'more', //加载更多状态
				filterIndex: 0,
				fId: 0, // 已选一级分类
				sId: 0, // 已选二级分类id
				priceOrder: 0, //1 价格从低到高 2价格从高到低
				cateList: [],
				goodsList: [],
				page: 1,
				currentId: 0,
				allItem: {

				},
				clist: [
					// { id: 1, name: '分类1' },
					// { id: 2, name: '分类2' },
					// { id: 3, name: '分类3' }
				]
			};
		},
		// #endif
		computed: {},
		onShareAppMessage(e) {
			return {
				path: '/pages/product/list?fid=' + this.fId + '&sid=' + this.sId
			};
		},
		onLoad(options) {
			// #ifdef H5
			//this.headerTop = document.getElementsByTagName('uni-page-head')[0].offsetHeight+'px';
			// #endif
			this.fId = options.fid;
			this.sId = options.sid ? options.sid : 0;
			this.loadCateList(options.fid, options.sid);
			this.loadData();
			this.allItem = {
				name: '全部',
				pid: options.fid,
				id: 0,
			}

		},
		onPageScroll(e) {
			//兼容iOS端下拉时顶部漂移
			if (e.scrollTop >= 0) {
				this.headerPosition = 'fixed';
			} else {
				this.headerPosition = 'absolute';
			}
		},
		//下拉刷新
		onPullDownRefresh() {
			this.loadData('refresh');
		},
		//加载更多
		onReachBottom() {
			this.loadData();
		},
		methods: {
			//商品种类分类
			async toggleKinds(item) {
				console.log(item);
				this.currentId = item.id;
				this.sId = item.id;
				// console.log(item.id);
				let by = this.filterIndex == 0 ? 'weigh' : this.filterIndex == 1 ? 'sales' : 'sales_price';
				let desc = 'desc';
				if (this.filterIndex == 2) {
					desc = this.priceOrder === 1 ? 'desc' : 'asc';
				}
				this.page = 1
				// if (type === 'refresh') {
				//   this.goodsList = [];
				//   this.page = 1;
				// }
				const res = await this.$api.request('/product/lists', 'GET', {
					fid: item.pid,
					sid: item.id,
					page: this.page,
					by: by,
					desc: desc
				});
				this.goodsList = res
				// console.log('----', res);
			},

			//加载分类
			async loadCateList(fid, sid) {
				const that = this;
				//let list = await this.$api.json('cateList');
				let list = await this.$api.request('/category/all');
				// console.log('list', list);
				let cateList = list.filter((item) => item.pid == 0);
				// console.log(list);
				cateList.forEach((item) => {
					let tempList = list.filter((val) => val.pid == item.id);
					item.child = tempList;
				});
				this.cateList = cateList;
				// console.log(this.cateList);
				this.clist = this.cateList.filter(item => item.id == this.fId)[0].child
				// console.log( '555',this.clist);
			},
			//加载商品 ，带下拉刷新和上滑加载
			async loadData(type = 'add', loading) {
				//没有更多直接返回
				if (type === 'add') {
					if (this.loadingType === 'nomore') {
						return;
					}
					this.loadingType = 'loading';
				} else {
					this.loadingType = 'more';
				}
				let by = this.filterIndex == 0 ? 'weigh' : this.filterIndex == 1 ? 'sales' : 'sales_price';
				let desc = 'desc';
				if (this.filterIndex == 2) {
					desc = this.priceOrder === 1 ? 'desc' : 'asc';
				}

				if (type === 'refresh') {
					this.goodsList = [];
					this.page = 1;
				}

				let goodsList = await this.$api.request('/product/lists', 'GET', {
					fid: this.fId,
					sid: this.sId,
					page: this.page,
					by: by,
					desc: desc
				});
				// if (by === 'weigh') {
				// 	console.log('yes');
				// 	goodsList.sort((a, b) => {
				// 		if (a.weigh !== b.weigh) {
				// 			// 如果weigh不相同，按weigh降序排列
				// 			return b.weigh - a.weigh;
				// 		} else if (a.sales !== b.sales) {
				// 			// 如果weigh相同但sales不相同，按sales降序排列
				// 			return b.sales - a.sales;
				// 		} else {
				// 			// 如果weigh和sales都相同，按price降序排列
				// 			return b.sales_price - a.sales_price;
				// 		}
				// 	})
				// 	console.log(goodsList);
				// }
				uni.stopPullDownRefresh();
				if (!goodsList) {
					this.loadingType = 'nomore';
					return;
				}
				// let clist = await this.$api.request('/product/catelists', 'get', { fid: this.fId });
				// this.clist = clist;
				// console.log('---------', clist);
				// console.log('goodlist', goodsList);
				this.goodsList = this.goodsList.concat(goodsList);

				//判断是否还有下一页，有是more  没有是nomore
				this.loadingType = goodsList.length > 20 ? 'nomore' : 'more';
				if (goodsList.length < 20) {
					this.loadingType = 'nomore';
				} else {
					this.loadingType = 'more';
					this.page++;
				}

				if (type === 'refresh') {
					if (loading == 1) {
						uni.hideLoading();
					} else {
						uni.stopPullDownRefresh();
					}
				}
			},
			//筛选点击
			tabClick(index) {
				console.log(index);
				if (this.filterIndex === index && index !== 2) {
					return;
				}
				this.filterIndex = index;
				if (index === 2) {
					this.priceOrder = this.priceOrder === 1 ? 2 : 1;
				} else {
					this.priceOrder = 0;
				}
				uni.pageScrollTo({
					duration: 300,
					scrollTop: 0
				});
				this.loadData('refresh', 1);
				uni.showLoading({
					title: '正在加载'
				});
			},
			//显示分类面板
			toggleCateMask(type) {
				let timer = type === 'show' ? 10 : 300;
				let state = type === 'show' ? 1 : 0;
				this.cateMaskState = 2;
				setTimeout(() => {
					this.cateMaskState = state;
				}, timer);
			},
			// 点击一级分类
			changeFirst(id) {
				this.page = 1;
				this.fId = id;
				this.sId = 0;
				// console.log('点击分类');
				this.toggleCateMask();
				uni.pageScrollTo({
					duration: 300,
					scrollTop: 0
				});
				this.loadData('refresh', 1);
				uni.showLoading({
					title: '正在加载'
				});
			},
			// 点击二级分类
			changeSecond(item) {
				this.page = 1;
				this.fId = item.pid;
				this.sId = item.id;
				this.toggleCateMask();
				uni.pageScrollTo({
					duration: 300,
					scrollTop: 0
				});
				this.loadData('refresh', 1);
				uni.showLoading({
					title: '正在加载'
				});
			},
			//详情
			navToDetailPage(item) {
				uni.navigateTo({
					url: `/pages/product/product?category_id=${item.category_id}&id=${item.product_id}`
				});
			},
			stopPrevent() {}
		}
	};
</script>

<style lang="scss">
	page,
	.content {
		height: 100%;
		background-color: #F2F4F7;
	}
	.content {
		display: flex;
		flex-direction: column;
		position: relative;
	}

	.search {
		width: 750rpx;
		height: 98rpx;
		padding: 0 10rpx 24rpx;

		position: fixed;
		background-color: #F2F4F7;
		z-index: 99;
	}

	.page-main {
		display: flex;
		margin-top: 100rpx;
		justify-content: space-between;
		border-radius: 16rpx 16rpx 0 0;
		overflow: hidden;
	}


	.navbar {
		position: fixed;
		right: 24rpx;
		top: 176rpx;
		display: flex;
		width: 586rpx;
		height: 80rpx;
		background: #fff;
		box-shadow: 0 2upx 10upx rgba(0, 0, 0, 0.06);
		z-index:999;

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
				color: $base-color;

				&:after {
					content: '';
					position: absolute;
					left: 50%;
					bottom: 0;
					transform: translateX(-50%);
					width: 120upx;
					height: 0;
					border-bottom: 4upx solid $base-color;
				}
			}
		}

		.p-box {
			display: flex;
			flex-direction: column;

			.yticon {
				display: flex;
				align-items: center;
				justify-content: center;
				width: 30upx;
				height: 14upx;
				line-height: 1;
				margin-left: 4upx;
				font-size: 26upx;
				color: #888;

				&.active {
					color: $base-color;
				}
			}

			.xia {
				transform: scaleY(-1);
			}
		}

		.cate-item {
			display: flex;
			justify-content: center;
			align-items: center;
			height: 100%;
			width: 80upx;
			position: relative;
			font-size: 44upx;

			&:after {
				content: '';
				position: absolute;
				left: 0;
				top: 50%;
				transform: translateY(-50%);
				border-left: 1px solid #ddd;
				width: 0;
				height: 36upx;
			}
		}
	}

	/* 分类 */
	.cate-mask {
		position: fixed;
		left: 0;
		top: var(--window-top);
		bottom: 0;
		width: 100%;
		background: rgba(0, 0, 0, 0);
		z-index: 95;
		transition: 0.3s;

		.cate-content {
			width: 630rpx;
			height: 100%;
			background: #fff;
			float: right;
			transform: translateX(100%);
			transition: 0.3s;
		}

		&.none {
			display: none;
		}

		&.show {
			background: rgba(0, 0, 0, 0.4);

			.cate-content {
				transform: translateX(0);
			}
		}
	}

	.cate-list {
		display: flex;
		flex-direction: column;
		height: 100%;

		.cate-item {
			display: flex;
			align-items: center;
			height: 90upx;
			padding-left: 30upx;
			font-size: 28upx;
			color: #555;
			position: relative;
		}

		.two {
			height: 140upx;
			color: #303133;
			font-size: 30upx;
			background: #f8f8f8;
		}

		.active {
			color: $base-color;
		}

		.uni-scroll-view-content {
			margin-top: 80rpx;
		}
	}

	/* 商品列表 */
	.goods-list {
		display: flex;
		flex-wrap: wrap;
		padding: 30upx;
		background: #fff;

		.goods-item {
			display: flex;
			flex-direction: column;
			width: 48%;
			padding-bottom: 40upx;

			&:nth-child(2n + 1) {
				margin-right: 4%;
			}
		}

		.image-wrapper {
			width: 100%;
			height: 330upx;
			border-radius: 3px;
			overflow: hidden;

			image {
				width: 100%;
				height: 100%;
				opacity: 1;
			}
		}

		.title {
			font-size: $font-lg;
			color: $font-color-dark;
			line-height: 80upx;
		}

		.price-box {
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding-right: 10upx;
			font-size: 24upx;
			color: $font-color-light;
		}

		.price {
			font-size: $font-lg;
			color: $uni-color-primary;
			line-height: 1;

			&:before {
				content: '￥';
				font-size: 26upx;
			}
		}
	}

	.aside {
		// background-color: #c66981;
		width: 18%;
		padding: 180rpx 0 0 4rpx;
		height: 100vh;
		position: relative;

		.catgroy {
			height: 100%;
			width: 18%;
			text-align: center;
			position: fixed;

			.scroll-container {
				height: calc(100vh - 120rpx);
				overflow-y: auto;
			}

			.catgroy-item {
				font-size: 30rpx;
				height: 70rpx;
				line-height: 70rpx;
				margin-top: 10rpx;
				background-color: #fff;
				position: relative;

				&.active {
					color: $base-color;
					background: #F2F4F7;

					// border: #fff 2rpx solid;
					&:before {
						content: '';
						position: absolute;
						left: 0;
						top: 50%;
						transform: translateY(-50%);
						height: 36upx;
						width: 8upx;
						background-color: $base-color;
						border-radius: 0 4px 4px 0;

						opacity: 0.8;
					}
				}
			}
		}
	}

	.guess-section {
		display: flex;
		flex-wrap: wrap;
		width: 82%;
		padding: 180rpx  10rpx 10rpx;
		position: relative;
		background-color: #f1f1f1;

		.empty {
			width: 100%;
			display: flex;
			justify-content: center;
			align-items: center;
		}

		//justify-content: space-around;
		.guess-item {
			position: relative;
			display: flex;
			flex-direction: column;
			width: 48%;
			margin: 2% 1%;
			padding: 20upx;
			background-color: #fff;
			border-radius: 20rpx;
			z-index: 10;
			max-height: 620rpx;
			overflow: hidden;
		}

		.partition {
			display: inline-block;
			color: white;
			height: 26rpx;
			width: 70rpx;
			text-align: center;
			font-size: 20rpx;
			padding: 0rpx 4rpx;
			background-color: #f55519;
			border-radius: 6rpx;
			margin-right: 10rpx;
			line-height: 26rpx;
		}

		.image-wrapper {
			width: 100%;
			height: 330upx;
			border-radius: 3px;
			overflow: hidden;

			image {
				width: 100%;
				height: 100%;
				opacity: 1;
			}
		}

		.title {
			font-size:28rpx;
			color: $font-color-dark;
			line-height: 1.7;
			overflow: hidden;
			display: -webkit-box;
			-webkit-line-clamp: 2;
			-webkit-box-orient: vertical;
			text-overflow: ellipsis;
		}

		.shop_tag {
			width: 50%;
			background-image: url('/static/small_1.png');
			background-size: 100% 100%;
			background-repeat: no-repeat;
			color: #d69993;
			font-size: 24rpx;
			padding: 8rpx;
			text-align: center;
		}

		.market_price {
			margin-left: 6rpx;
			font-size: 20rpx;
			text-decoration: line-through;
			color: #cecece;
		}

		.bottom-text {
			display: flex;
			justify-content: space-between;
			font-size: 22rpx;
			margin-top: 6rpx;

			text {
				background-color: #fcf0f4;
				color: #c66981;
				display: flex;
				justify-content: flex-start;
				margin-right: 2rpx;
				padding: 4rpx 0rpx 4rpx 6rpx;
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
			color: $uni-color-primary;
			line-height: 1;

			.symbol {
				font-size: 24upx;
			}
		}
	}
</style>