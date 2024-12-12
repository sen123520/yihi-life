<template>
	<view class="content">
		<view class="blank">
			<view class="search">
				<uni-icons class="input-uni-icon" type="search" :size="20" color="#999" />
				<input type="text" placeholder="输入关键词搜索" v-model="searchword" @confirm="search" />
			</view>
		</view>
		<view class="page-main">
			<view class="sr-aside">
				<view class="s-content">
					<scroll-view scroll-y="true" class="scroll-container">
						<view class="s-item" :class="{ active: currentId == 0 }" @click="toggleKinds(allItem)">全部
						</view>
						<view class="s-item" v-for="(item, index) in clist" :key="item.id"
							:class="{active: item.id === currentId}" @click="toggleKinds(item)">{{ item.name }}</view>
					</scroll-view>
				</view>
			</view>
			<view class="top-sort">
				<view class="sort">
					<view class="sort-item" :class="{ 'sort-item-active': sortBy === 'weigh' }" @click="tabClick(0)">
						综合排序
					</view>
					<view class="sort-item" :class="{ 'sort-item-active':sortBy === 'sales' }" @click="tabClick(1)">
						销量优先
					</view>
					<view class="sort-item" :class="{ 'sort-item-active':sortBy === 'sales_price'}"
						@click="tabClick(2)">
						价格
					</view>
				</view>
				<view class="other">
					<image src="../../static/other.png" mode="aspectFill"></image>
				</view>
			</view>
			<scroll-view scroll-with-animation scroll-y class="right-aside" @scroll="asideScroll">
				<view class="guess-section">
					<view v-for="(item, index) in goodsList" :key="index" class="guess-item-info"
						@click="navToDetailPage(item)">
						<!-- <view class="cate_name"></view> -->
						<view class="image-wrapper">
							<image :src="item.image" mode="aspectFill"></image>
						</view>
						<view class="text-wrapper">
							<view class="title clamp">{{ item.title }}</view>
							<view class="bottom-text">
								<text class="text1">PV:{{item.pv_score}}</text>
								<text class="text2">贡献值:{{item.contribute}}</text>
							</view>

							<view class="price">
								<text class="symbol">￥</text>
								{{ item.sales_price }}
							</view>
						</view>
					</view>
					<uni-load-more :status="loadingType" />
				</view>
				<!-- 底部提示 -->
			</scroll-view>
		</view>





		<view class="cate-mask" v-if="false" :class="cateMaskState === 0 ? 'none' : cateMaskState === 1 ? 'show' : ''"
			@click="toggleCateMask">
			<view class="cate-content" @click.stop.prevent="stopPrevent" @touchmove.stop.prevent="stopPrevent">
				<scroll-view scroll-y class="cate-list">
					<view class="catgroy-item" :class="{ active: fId == 0 }" @click="changeFirst(allItem)">全部
					</view>
					<view v-for="item in cateList" :key="item.id">
						<view class="cate-item b-b two" :class="{ active: item.id == fId }"
							@click="changeFirst(item.id)">
							{{ item.name }}
						</view>
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
				headerTop: '0rpx',
				loadingType: 'more', //加载更多状态
				filterIndex: 0,
				fId: 0, // 已选一级分类
				sId: 0, // 已选二级分类id
				priceOrder: 0, //1 价格从低到高 2价格从高到低
				cateList: [],
				goodsList: [],
				page: 1,
				currentId: 0,
				scrollValue: '',
				sortBy: 'weigh', //weigh-综合排序  sales-销量  sales_price价格
				allItem: {

				},
				searchword: '',
				// status: 'loading',
				clist: [
					// { id: 1, name: '分类1' },
					// { id: 2, name: '分类2' },
					// { id: 3, name: '分类3' }
				]
			};
		},
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
			this.loadData('refresh');
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
			asideScroll(e) {
				this.throttleScroll()

			},
			throttleScroll() {
				if (!this.throttleTimeout) {
					this.loadData('add');
					this.throttleTimeout = setTimeout(() => {
						this.throttleTimeout = null;
					}, 200);
				}
			},
			search() {
				let t_url = '/pages/product/search?searchword=' + this.searchword;
				uni.navigateTo({
					url: t_url
				});
			},
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
				console.log('555', this.clist);
			},
			//加载商品 ，带下拉刷新和上滑加载
			async loadData(type = 'add', loading) {
				//没有更多直接返回
				console.log(type);
				let by = this.sortBy
				if (type === 'add') {
					if (this.loadingType === 'nomore') {
						return;
					}
					this.page++
					this.loadingType = 'loading';
				} else {
					this.loadingType = 'more';
				}
				let desc = 'desc';
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
				uni.stopPullDownRefresh();
				if (!goodsList) {
					this.loadingType = 'nomore';
					return;
				}
				this.goodsList = [...this.goodsList, ...goodsList];
				console.log(this.goodsList);
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

			async tabClick(id) {
				let by
				switch (id) {
					case 0:
						by = 'weigh'
						break;
					case 1:
						by = 'sales'
						break;
					case 2:
						by = 'sales_price'
						break;
					default:
						by = ''
						break;
				}
				console.log(by);
				this.sortBy = by
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

<style lang='scss' scoped>
	page,
	.content {
		height: 100%;
		background-color: #F2F4F7;
		overflow: hidden;
	}

	.content {
		display: flex;
		flex-direction: column;
	}

	.blank {
		width: 100%;
		height: 120rpx;
		/* background-color: greenyellow; */
		display: flex;
		align-items: center;
		position: relative;
	}

	.search {
		width: 690rpx;
		height: 68rpx;
		margin: 0 auto;
		background-color: #fff;
		border-radius: 106rpx;
		display: flex;
		align-items: center;
		padding: 0 24rpx;
		font-size: 24rpx;
		input {
			width: 580rpx;
			margin-left: 12rpx;
			font-size: 24rpx;
		}
	}


	.page-main {
		display: flex;
		height: calc(100vh - 200rpx);
		justify-content: space-between;
		border-radius: 16rpx 16rpx 0 0;
		background-color: #fff;
		overflow: hidden;
		position: relative;
	}


	.top-sort {
		width: 586rpx;
		height: 56rpx;
		position: absolute;
		z-index: 999;
		top: 0rpx;
		left: 164rpx;
		background-color: #fff;
		border-radius: 0 16rpx 0 0;
		font-size: 24rpx;
		color: #323233;
		font-weight: 300;
		display: flex;
		align-items: center;
		justify-content: space-around;
		overflow: hidden;

		.sort {
			display: flex;
			overflow: hidden;

			.sort-item {
				width: 140rpx;
				height: 64rpx;
				line-height: 64rpx;
				text-align: center;
			}

			.sort-item-active {
				color: #FF5040;
			}
		}

		.other {
			width: 24rpx;
			height: 24rpx;

			image {
				width: 100%;
				height: 100%;
			}
		}
	}

	.right-aside {
		width: 586rpx;
		overflow: hidden;
		background-color: #fff;
		margin-top: 56rpx;

		.guess-item {
			position: relative;
			display: flex;
			flex-direction: column;
			width: 48%;
			margin: 2% 1%;
			padding: 20upx;
			background-color: #fff;
			border-radius: 14rpx;
			z-index: 98;
		}
	}

	.sr-aside {
		width: 164rpx;
		height: 100%;
		/* position: relative; */
		/* background: #FFF; */
		overflow: hidden;

		.s-content {
			height: 100%;
			width: 164rpx;
			text-align: center;
			position: fixed;

			border-radius: 16rpx 0 0 0;


			.scroll-container {
				height: calc(100vh - 210rpx);
				/* height: 100%; */
				overflow: auto;
				/* margin-top: 120rpx; */
			}

			.s-item {
				font-size: 28rpx;
				color: #323233;
				height: 90rpx;
				line-height: 90rpx;
				position: relative;

				&.active {
					color: $base-color;

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

	.t-list {
		display: flex;
		flex-wrap: wrap;
		width: 100%;
		background: #fff;
		padding-top: 12upx;

		&:after {
			content: '';
			flex: 99;
			height: 0;
		}
	}

	.t-item {
		flex-shrink: 0;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		width: 176upx;
		font-size: 26upx;
		color: #666;
		padding-bottom: 20upx;

		image {
			width: 140upx;
			height: 140upx;
		}
	}

	.product_item {
		padding: 20rpx;
		margin: 10rpx;
		display: flex;
		justify-content: space-around;
		position: relative;
		background-color: #fff;
		border-radius: 20rpx;

		.product_image {
			width: 40%;
			height: 200rpx;

			image {
				width: 100%;
				height: 100%;
				border-radius: 20rpx;
			}
		}

		.product_detail {
			width: 60%;
			padding-left: 20rpx;

			.title {
				font-size: $font-xlg;
				color: $font-color-dark;
				line-height: 50upx;
			}

			.share_desc {
				font-size: $font-sm;
				color: $font-color-light;
				line-height: 50upx;
			}

			.price {
				font-size: $font-xlg;
				line-height: 60upx;
				color: $uni-color-primary;
				line-height: 1;

				.symbol {
					font-size: 24upx;
				}
			}
		}
	}




	.guess-section {
		position: relative;
		padding: 0rpx 24rpx 40rpx 24rpx;

		.guess-item-info {
			position: relative;
			display: flex;
			justify-content: space-between;
			align-items: center;
			width: 100%;
			height: 138rpx;
			margin-top: 24rpx;
			padding: 4rpx;
			background-color: #fff;
			border-radius: 20rpx;
			z-index: 98;

		}

		.partition {
			color: white;
			width: 60rpx;
			font-size: 20rpx;
			padding: 4rpx;
			background-color: red;
			border-radius: 6rpx;
			margin-right: 10rpx;
			line-height: 16rpx;
		}

		.image-wrapper {
			width: 138rpx;
			height: 138rpx;
			overflow: hidden;
			border-radius: 16rpx;

			image {
				width: 100%;
				height: 100%;
				opacity: 1;
			}
		}

		.text-wrapper {
			width: 364rpx;
			height: 138rpx;
			/* border: #333 solid 1rpx; */
			display: flex;
			flex-direction: column;
			justify-content: space-around;
		}

		.title {

			font-size: 28rpx;
			color: #323233;
			font-weight: 600;
			overflow: hidden;
			-webkit-line-clamp: 2;
			-webkit-box-orient: vertical;
			text-overflow: ellipsis;
		}

		.shop_tag {
			width: 50%;
			background-image: url('/static/small_1.png');
			background-size: 100% 100%;
			background-repeat: no-repeat;
			color: red;
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
			font-size: 24rpx;
			line-height: 24rpx;

			text {
				color: #323233;
				font-weight: 300;
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
			font-size: 36rpx;
			color: #FF5040;
			line-height: 1;

			.symbol {
				font-size: 24rpx;
			}
		}
	}
</style>