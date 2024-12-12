<template>
	<view class="container">
		<view class="top-bgimg">
			<!-- 顶部搜索及导航 begin -->
			<view class="top-view top_nav_bg">
				<view class="thestatus-bar"></view>
				<view class="search-view">
					<view class="sao">
						<image src="@/static/sao.png" mode="aspectFit"></image>
					</view>
					<view class="search" @click="turnSearchPage()">
						<view class="iconfont" @click="turnSearchPage()">&#xe60a;</view>
						<input class="input" type="text" v-model="searchproduct" placeholder="输入关键词搜索" />
						<view class="searchBtn"> 搜索 </view>
					</view>
					<view class="mynotice">
						<image src="@/static/mynotice.png" mode="aspectFit"></image>
					</view>
				</view>
			</view>
			<!-- 通知栏 -->
			<view class="yh-notice">
				<uni-notice-bar :speed="20" scrollable showIcon single :text="homenews.content" color="#fff"
					background-color="transparent" @click="turnPage(homenews.urllink)"></uni-notice-bar>
			</view>

			<!-- 头部轮播 -->
			<view class="carousel-section">
				<!-- 标题栏和状态栏占位符 -->
				<!-- <view class="titleNview-placing"></view> -->
				<swiper class="carousel" circular indicator-dots="true" indicator-color="rgba(255, 87, 51, 0.3)"
					indicator-active-color="rgba(255,255,255,1)" autoplay="true" interval="4000">
					<swiper-item v-for="(item, index) in carouselList" :key="item.id" class="carousel-item"
						@click="turnPage(item.urllink)">
						<image mode="aspectFill" :src="item.image"></image>
					</swiper-item>
				</swiper>
				<view class="guarantee">
					<view class="guarantee-item">
						<view class="gi-box">
							<image src="../../static/zheng.png" mode="aspectFill"></image>
						</view>100%正品保证
					</view>
					<view class="guarantee-item">
						<view class="gi-box">
							<image src="../../static/pei.png" mode="aspectFill"></image>
						</view>假一赔十
					</view>
					<view class="guarantee-item">
						<view class="gi-box">
							<image src="../../static/shouhou.png" mode="aspectFill"></image>
						</view>24小时安心售后
					</view>
				</view>
			</view>

		</view>
		<!-- 保障 -->

		<view class="blank">

		</view>

		<!-- 分类 -->
		<view class="cate-section">
			<view class="cate-item" v-for="(item, index) in menu" :key="item.id"
				@click="turnPage(item.href, item.pic_type, item.alerttext, item.mp_appid, item.mp_path)">
				<!-- <view class="cate-item-img"> -->
				<image :src="item.image"
					@click.stop="turnPage(item.href, item.pic_type, item.alerttext, item.mp_appid, item.mp_path)">
				</image>
				<!-- </view> -->
				<text>{{ item.name }}</text>
			</view>
		</view>

		<div class="ball" :style="'top:' + ballTop + ';left:' + ballLeft" v-if="showBall" @click="stopBall">
			<uni-icons type="clear" class="ball-close" size="30" @click="closeBall" />
			<div class="ball-top">
				<div>复消额 </div>
				<div> (0 元霸)</div>
				<div>{{ ballData.epuity_4 }}</div>
			</div>
			<div class="ball-bottom">
				<div>今日已获得累计奖励积分</div>
				<div>{{ ballData.today_point }}</div>
				<div>复消额不足今日</div>
				<div>无法兑换金额</div>
				<div>{{ ballData.today_wei_point }}</div>
			</div>
		</div>

		<!-- <view class="zero">
			<img class="zero-bg" src="static/zero.png" @click="toZeroBa">
			<div class="zero-btn">立即前往</div>
		</view> -->
		<!-- #ifdef APP-PLUS -->
		<!-- #endif -->

		<!-- 瓷片区 -->
		<view class="chip">
			<view class="chip-left">

			</view>
			<view class="chip-right">
				<view class="chip-r-top">

				</view>
				<view class="chip-r-bottom">

				</view>
			</view>
		</view>

		<!-- 商品置顶区 -->
		<view class="product">
			<view class="product-top">
				<view style="margin-bottom: 24rpx; background-color: #fff; border-radius: 16rpx;"
					v-for="(item, index) in classification" :key="item.category_id">
					<view class="product-top-title">
						<view class="product-top-title-name">{{ item.category_name }}</view>
						<view class="product-top-title-all" @click="zonejump(item.category_id)"> <text>查看全部</text>
							<image src="@/static/right.png" mode="aspectFill"></image> </uni-icons>
						</view>
					</view>
					<view class="product-top-info">
						<view class="goods-info" v-for="(items, index) in item.product_list" :key="items.id"
							@click="navToDetailPage(items)">
							<view class="info-img">
								<image :src="$api.img_complete(items.image)" mode="aspectFit"></image>
							</view>
							<view class="info-name">
								{{ items.title }}
							</view>
							<view class="info-price">
								<text class="price-real">￥{{ items.sales_price }}</text> <text class="price-market">￥{{
									items.market_price }}</text>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>

		<!-- 底部商品列表 -->
		<view class="guessyou">
			<image src="@/static/guessyoulike.png" mode="aspectFill"></image>
		</view>
		<view class="guess-section">
			<view v-for="(item, index) in goodsList" :key="item.id" class="guess-item" @click="navToDetailPage(item)">

				<view class="image-wrapper">
					<image :src="item.image" mode="aspectFill"></image>
				</view>
				<view class="text-wrapper">
					<text class="title">
						<text class="partition">{{ item.cate_name }}</text><text class="shop_tag">{{ item.shop_tag
							}}</text><text class="sales">已售{{ item.sales || 0 }}件</text>
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
		<uni-popup ref="popup" :before-close="true" @change="change" :mask-click="false" v-if="popups"
			mask-background-color="rgba(0, 0, 0, 0.8)">
			<uni-icons type="closeempty" size="30" class="popup_close" @click="closepop" color="white"></uni-icons>
			<view class="popup_img" @click="navTo(popups.urllink)">
				<img :src="popups.image" alt="" class="imgs" />
			</view>
		</uni-popup>
	</view>
</template>

<script>
let _ball = 0
let ball = null
var _self = this;
import uniCountdown from '@/components/uni-countdown/uni-countdown.vue';
import {
	mapMutations,
	mapState
} from 'vuex';
export default {
	components: {
		uniCountdown
	},
	data() {
		return {
			carouselList: [],
			goodsList: [],
			menu: [],
			homenews: '',
			page: 1,
			pageSize: 16,
			searchproduct: '',
			fiveimg: [],
			classification: [],
			restart: '',
			version_number: 0,
			appinfos: {},
			horizontalView: '',
			type: 'center',
			popups: {},
			id: '',
			token: '',
			tomweichat: '',
			showBall: false,
			ballLeft: 0,
			ballTop: 0,
			ballData: null
		};
	},
	computed: {},
	onLoad(options) {
		console.log(`output->111`,111)
		// #ifdef APP
		const systemInfo = uni.getSystemInfoSync();
		this.version_number = systemInfo.appWgtVersion;
		//版本更新
		this.pickUpInformation();
		// #endif

		this.loadData();
		this.homefiveproduct();
		this.url = decodeURIComponent(options.url);
		console.log('安全', this.$store.state.safeArea);
	},

	onHide() {
		clearInterval(_ball)
	},
	onShow: function (opt) {
		if (opt) {
			if (opt.query.pid > 0) {
				let pid = opt.query.pid;
				uni.setStorage({
					key: 'pid',
					data: pid
				});
			}
		}
		this.id = this.$store.state.userInfo.user_id
		this.token = this.$store.state.userInfo.token
		this.checkPassword()
		this.getBall()
		// #ifdef APP-PLUS
		// #endif
		// console.log('id', this.id);
		// console.log('token', this.token);
		// if (this.id && this.token) {
		// 	this.getToMiniUrl()
		// }
	},
	onReachBottom() {
		this.getProduct();
	},
	onPullDownRefresh() {
		// console.log('刷新');
		if (this.$refs && this.$refs.countd) {
			this.$refs.countd.syncFlag = false;
		}
		this.goodsList = [];
		this.page = 1;
		this.loadData();
	},
	onShareAppMessage(e) { },
	mounted() {
		// this.toggle('center')
		// console.log('1111', this.goodsList);	
	},
	beforeDestroy() {
		clearInterval(_ball)
	},
	methods: {
		...mapMutations(['logout', 'setSafeArea']),

		async getBall() {
			if (!this.$store.state.hasLogin || new Date().getDate() == uni.getStorageSync('ball')) {
				this.showBall = false
				return
			}
			let _ball = await this.$api.request('/user/getYuanBaProfit', 'post')
			this.ballData = _ball
			this.showBall = true
			clearInterval(_ball)
			setTimeout(() => {
				this.animateBall()
			}, 888);
			console.log(`output->_ball`, _ball)
		},

		async toZeroBa() {
			// uni.setStorageSync('ball', '0')
			console.log(`output->this.token`, this.token)
			if (!this.token || !this.$store.state.hasLogin) {
				uni.navigateTo({
					url: `/pages/public/login`
				});
				return
			}

			let toMiniUrl = await this.$api.request('/user/getYuanBaUrl', 'post')
			if (toMiniUrl.includes('https')) {
				console.log(`output->tom`, toMiniUrl)
				uni.showModal({
					title: '提示',
					content: '即将跳转小程序',
					success: (res) => {
						if (res.confirm) {
							// #ifdef H5
							// console.log(`output->window`,window)
							window.open(toMiniUrl, '_blank')
							// #endif

							// #ifdef APP-PLUS
							plus.runtime.openURL(toMiniUrl)
							// #endif
							// 获取分享服务列表
							// plus.share.getServices(
							// 	res => {
							// 		let sweixin = '';
							// 		for (var i = 0; i < res.length; i++) {
							// 			let t = res[i];
							// 			if (t.id == 'weixin') {
							// 				sweixin = t;
							// 			}
							// 		}
							// 		if (sweixin) {
							// 			sweixin.launchMiniProgram({
							// 				id: 'gh_b1e20776992a', // 要跳转小程序的原始ID
							// 				path: toMiniUrl, //  可带参数
							// 				type: 0 // 微信小程序版本类型可取值： 0-正式版； 1-测试版； 2-体验版。 默认值为0。
							// 			},
							// 				// 目标小程序点击返回App后执行的回调，在此接收微信小程序传递的参数
							// 				res2 => {
							// 					console.log(typeof res2, res2)
							// 					// res2是微信小程序传递回来的参数 类型为string 需转化为js对象使用
							// 					let result = JSON.parse(res2)
							// 					console.log(result, '微信操作res3...')
							// 					// 拿到参数后执行你需要的逻辑
							// 				},
							// 				err2 => {
							// 					console.log(err2)
							// 					console.log(err2, '微信操作err2...')
							// 				}
							// 			);
							// 		} else {
							// 			// 没有获取到微信分享服务
							// 			uni.showToast({
							// 				icon: 'none',
							// 				title: '当前环境不支持微信操作!'
							// 			})
							// 		}
							// 	},
							// 	err => {
							// 		// 获取分享服务列表失败
							// 		console.log(err)
							// 	}
							// )
						}
					}
				})


			}
		},

		createRandomPosition() {
			let width = ''
			let height = ''
			// #ifdef H5
			width = window.innerWidth - 184;
			height = window.innerHeight - 184;
			// #endif
			console.log(`output->`, width)
			// #ifdef APP-PLUS
			uni.getSystemInfo({
				success: function (info) {
					width = info.windowWidth - 184;
					height = info.windowHeight - 184;
				}
			});
			// #endif
			return {
				x: Math.random() * width,
				y: Math.random() * height
			};
		},

		animateBall() {
			clearInterval(_ball)
			let newPosition = this.createRandomPosition()
			this.ballTop = `${newPosition.y}px`;
			this.ballLeft = `${newPosition.x}px`;
			_ball = setInterval(() => {
				console.log(`output->_ball`, _ball)
				this.animateBall()
			}, 1666)
		},

		stopBall() {
			clearInterval(_ball)
		},

		closeBall() {
			this.showBall = false
			uni.setStorageSync('ball', new Date().getDate())
			clearInterval(_ball)
		},

		checkPassword() {
			let user = uni.getStorageSync('userInfo');
			console.log('check', user);
			if (user) {
				if (user.pw_status != 0) {
					uni.showModal({
						title: '安全警告',
						content: '检测到您的登陆密码过于简单,为了您的账户安全,请修改登陆密码。',
						confirmText: '确认',
						cancelText: '返回',
						success: (res) => {
							if (res.confirm) {
								uni.navigateTo({
									url: '/pages_other/userinfo/changePassword'
								})
							}
							if (res.cancel) {
								this.logout()
								this.$api.navTo('/pages/public/login')
							}
						}
					})
				}
			}
		},
		closepop() {
			this.$refs.popup.close('center');
		},
		change(e) {
			// console.log(e);
			if (e.show) {
				//隐藏tabbar
				uni.hideTabBar();
			} else {
				//显示tabbar
				uni.showTabBar();
			}
		},
		toggle(type) {
			this.type = type;
			this.$refs.popup.open(type);
		},
		async getToMiniUrl() {
			let tominiUrl = await this.$api.request('/index/gettominiUrl', 'get', {
				id: this.id,
				token: this.token
			})
			// console.log(tominiUrl);
			this.tomweichat = tominiUrl
		},
		loadData() {
			// console.log('调用了loadData');
			let that = this;
			//获取首页banner				
			uni.request({
				url: that.$unishow + '/index/homeMenu',
				success(res) {
					that.menu = res.data.data.menulist;
					// console.log('---', that.menu);
					that.carouselList = res.data.data.homebanner;
					that.homenews = res.data.data.homenews;
					that.horizontalView = res.data.data.homead[0].image;
				}
			});
			if (that.popups) {
				uni.request({
					url: that.$unishow + '/index/getIndexAd',
					success(res) {
						that.popups = res.data.data.indexad;
						if (that.popups?.id) {
							that.toggle('center');
						}
					}
				});
			}
			uni.stopPullDownRefresh();
			this.getProduct();
		},
		// 获取产品列表
		async getProduct() {
			let goodsList = await this.$api.request('/product/lists', 'GET', {
				page: this.page,
				pagesize: this.pageSize,
				show_in_home: 1
			});
			// console.log(goodsList);
			if (goodsList) {
				if (goodsList.length > 0) {
					goodsList.forEach((item) => {
						this.goodsList.push(item);
					});
					this.page++;
				} else {
					this.$api.msg('');
				}
			}
		},

		// 商品详情页
		navToDetailPage(item, flash_id = 0) {
			let id = item.product_id;
			uni.navigateTo({
				url: `/pages/product/product?id=${id}&flash=${flash_id}`
			});
		},
		async turnPage(url, type, text, appid, path) {
			if (type) {
				if (url.includes('fid=10')) {
					this.toZeroBa()
					return
				}
				if (type == 1) {
					this.$api.navTo(url);
				}
				if (type == 2) {
					// #ifndef H5
					uni.navigateToMiniProgram({
						appId: appid,
						path: path,
						extraData: {
							foo: 'bar'
						},
						success(res) {
							console.log('成功跳转到小程序');
						},
						fail(err) {
							console.error('跳转失败', err);
						}
					});
					// #endif

					// #ifdef H5
					uni.showModal({
						content: '请在APP内打开',
						success: (res) => {
							if (res.confirm) { }
						}
					});
					// #endif
				}
				if (type == 3) {
					uni.showModal({
						content: text,
						success: (res) => {
							if (res.confirm) { }
						}
					});
				}
				if (type == 4) {
					const token = this.$store.state.userInfo.token;
					if (!token) {
						uni.navigateTo({
							url: `/pages/public/login`
						});
						return
					}
					const { user_id, mobile, username, real_name, } = this.$store.state.userInfo;
					// console.log(yihai);
					// console.log(`output->token`,userInfo)
					const _url = 'https://yb.youyi99.cn'
					// #ifdef H5
					window.location.href = _url;
					// #endif
					// #ifdef APP
					plus.runtime.openURL(_url).catch(() => {
						// 如果uni.openURL调用失败（例如在不支持直接打开URL的小程序中）
						uni.showToast({
							title: '无法直接打开链接，请手动复制并访问:',
							duration: 2000
						});
						uni.setClipboardData({
							data: _url,
						});
					});
					// #endif
					let yihai = await this.$api.request('/api-yihai', 'POST', JSON.stringify({
						user_id: Number(user_id),
						username,
						hid: '',
						type: 'reg',
						tel: mobile,
						realname: real_name
					}));


					// const id = this.$store.state.userInfo.user_id;
					// const token = this.$store.state.userInfo.token;
					// const url = url ||
					// 	'http://yihuo.rongyigou8.com/app/index.php?i=1&c=entry&m=ewei_shopv2&do=mobile&r=account.login&attach=qicai';
					// await this.getToMiniUrl()
					// // 仅在app中运行，且调用plus这个api
					// // #ifdef APP-PLUS
					// if (token) {
					// 	// console.log(this.tomweichat);
					// 	uni.showModal({
					// 		title: '提示',
					// 		content: '即将跳转',
					// 		success: (res) => {
					// 			//跳小程序
					// 			if (res.confirm) {
					// 				if (this.tomweichat != '') {
					// 					plus.runtime.openURL(this.tomweichat)
					// 				} else {
					// 					if (url.includes('?')) {
					// 						plus.runtime.openURL(
					// 							`${url}&token=${token}&qicai_id=${id}`,
					// 							function(
					// 								err) {
					// 								uni.showToast({
					// 									title: JSON.stringify(err),
					// 									duration: 8000
					// 								});
					// 							});
					// 					} else {
					// 						url = url + '?';
					// 						plus.runtime.openURL(
					// 							`${url}&token=${token}&qicai_id=${id}`,
					// 							function(
					// 								err) {
					// 								uni.showToast({
					// 									title: JSON.stringify(err),
					// 									duration: 8000
					// 								});
					// 							});
					// 					}
					// 				}

					// 			}
					// 			// 跳h5
					// 			// if (res.confirm) {
					// 			//   if (url.includes('?')) {
					// 			//     plus.runtime.openURL(`${url}&token=${token}&qicai_id=${id}`, function (err) {
					// 			//       uni.showToast({
					// 			//         title: JSON.stringify(err),
					// 			//         duration: 8000
					// 			//       });
					// 			//     });
					// 			//   } else {
					// 			//     url = url + '?';
					// 			//     plus.runtime.openURL(`${url}&token=${token}&qicai_id=${id}`, function (err) {
					// 			//       uni.showToast({
					// 			//         title: JSON.stringify(err),
					// 			//         duration: 8000
					// 			//       });
					// 			//     });
					// 			//   }
					// 			// } else if (res.cancel) {
					// 			//   console.log('无事发生');
					// 			// }
					// 		}
					// 	});
					// } else {
					// 	uni.showModal({
					// 		content: '请登录',
					// 		success: (res) => {
					// 			if (res.confirm) {
					// 				uni.navigateTo({
					// 					url: `/pages/public/login`
					// 				});
					// 			}
					// 		}
					// 	});
					// }
					// // #endif

					// // #ifdef H5
					// if (token) {
					// 	//跳小程序
					// 	uni.showModal({
					// 		title: '提示',
					// 		content: '即将跳转',
					// 		success: (res) => {
					// 			if (res.confirm) {
					// 				if (this.tomweichat != '') {
					// 					window.location.href = this.tomweichat;
					// 				} else {
					// 					if (url.includes('?')) {
					// 						window.location.href =
					// 							`${url}&token=${token}&qicai_id=${id}`;
					// 						uni.switchTab({
					// 							url: '/pages/index/index'
					// 						});
					// 					} else {
					// 						url = url + '?';
					// 						window.location.href =
					// 							`${url}&token=${token}&qicai_id=${id}`;
					// 						uni.switchTab({
					// 							url: '/pages/index/index'
					// 						});
					// 					}

					// 				}
					// 			}
					// 		}
					// 	});
					// 	// if (this.tomweichat != '') {
					// 	// 	window.location.href = this.tomweichat;
					// 	// }
					// 	//跳h5
					// 	// if (url.includes('?')) {
					// 	//   window.location.href = `${url}&token=${token}&qicai_id=${id}`;
					// 	//   uni.switchTab({
					// 	//     url: '/pages/index/index'
					// 	//   });
					// 	// } else {
					// 	//   url = url + '?';
					// 	//   window.location.href = `${url}&token=${token}&qicai_id=${id}`;
					// 	//   uni.switchTab({
					// 	//     url: '/pages/index/index'
					// 	//   });
					// 	// }
					// } else {
					// 	uni.showModal({
					// 		content: '请登录',
					// 		success: (res) => {
					// 			if (res.confirm) {
					// 				uni.navigateTo({
					// 					url: `/pages/public/login`
					// 				});
					// 			}
					// 		}
					// 	});
					// }
					// // #endif
				}
			} else {
				this.$api.navTo(url);
			}
		},
		zonejump(e) {
			this.$api.navTo(`/pages/product/list?fid=${e}`);
		},
		// 跳转页面
		navTo(url) {
			uni.navigateTo({
				url
			});
		},
		// 跳转到商品列表
		navToList(fid) {
			uni.navigateTo({
				url: `/pages/product/list?fid=${fid}&sid=0`
			});
		},
		turnSearchPage() {
			let t_url = '/pages/product/search?searchword=' + this.searchproduct;
			uni.navigateTo({
				url: t_url
			});
			// console.log(t_url);
		},
		// 首页五图
		async homefiveproduct() {
			let data = await this.$api.request('/index/homeFiveProduct', 'post');
			if (data) {
				this.fiveimg = data;
				// console.log('five',data);
			}
			let datax = await this.$api.request('/index/homeCateProduct', 'post');
			if (datax) {
				this.classification = datax;
				// console.log(this.classification);
			}
		},
		// 商品置顶区样式
		bgimgs(e) {
			return {
				backgroundImage: `url('/static/homepagebg${e}.jpg')`,
				backgroundSize: '100% 100%',
				backgroundRepeat: 'no-repeat',
				color: e == 0 ? 'hotpink' : 'orange'
			};
		},
		// 获取新版app
		async pickUpInformation() {
			try {
				const data = await this.$api.request('/index/userNewVersion', 'POST', {
					ver: this.version_number //当前版本号
				});
				this.appinfos = data;
				this.restart = data.restart;
				// console.log('vvv', data);
				// this.renew();
			} catch (err) {
				console.log(err);
			} finally {
				if (this.appinfos.wgtUrl) {
					this.showUpdateDialog(this.appinfos.wgtUrl);
				}
			}
		},
		// app更新
		renew() {
			// 获取当前应用版本号
			const currentVersion = this.version_number;
			// 与服务器通信，检查是否有新版本
			const serverResponse = {
				version: this.appinfos.versionCode,
				downloadUrl: this.appinfos.wgtUrl
			};
			// 比较版本号
			if (this.compareVersions(serverResponse.version, currentVersion) > 0) {
				// 触发更新
				this.showUpdateDialog(serverResponse.downloadUrl);
			} else {
				console.log('当前已是最新版本');
			}
		},
		// 比较版本号
		compareVersions(version1, version2) {
			const v1 = version1.split('.').map(Number);
			const v2 = version2.split('.').map(Number);

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
			uni.downloadFile({
				url: downloadUrl,
				success: (downloadResult) => {
					// console.log(downloadResult);
					if (downloadResult.statusCode === 200) {
						plus.runtime.install(
							downloadResult.tempFilePath, {
							force: false
						},
							() => {
								uni.hideLoading();
								plus.runtime.restart();
								// uni.showToast({
								// 	title: '有更新啦：' + result.data.data.version,
								// 	icon: 'none',
								// 	mask: false,
								// 	position: 'bottom'
								// });
							}
							// function(e) {
							// 	// uni.hideLoading();
							// 	uni.showToast({
							// 		title: '好像有更新：' +
							// 			result
							// 			.data
							// 			.data
							// 			.version,
							// 		icon: 'none',
							// 		mask: false,
							// 		position: 'bottom'
							// 	});
							// }
						);
					}
				}
			});
		}
	}
};
</script>

<style lang="scss">
.ball {
	width: 184px;
	height: 184px;
	background: url('@/static/zero-ball.png') no-repeat center;
	border-radius: 50%;
	position: fixed;
	top: 0;
	z-index: 999;
	left: 0;
	transition: all 1.8s;
	font-size: 12px;
	color: #fff;
	text-align: center;

	.ball-top {
		display: flex;
		flex-direction: column;
		justify-content: center;
		height: 92px;
	}

	.ball-bottom {
		height: 92px;
		display: flex;
		flex-direction: column;
		justify-content: center;
	}

	.ball-close {
		position: absolute;
		top: -10px;
		right: 0;
	}
}

.zero {
	position: relative;
	padding: 24rpx 24rpx 0 24rpx;

	.zero-btn {
		width: 72px;
		height: 27px;
		position: absolute;
		top: 30px;
		right: 30px;
		font-size: 12px;
		color: #FFFFFF;
		line-height: 27px;
		text-align: center;
		background: linear-gradient(224deg, #FF6103 0%, #FFBD38 100%);
		border-radius: 33px 33px 33px 33px;
	}

	.zero-bg {
		width: calc(100vw - 48rpx);
		// height: 47px;
	}
}

@import 'index.scss'
</style>