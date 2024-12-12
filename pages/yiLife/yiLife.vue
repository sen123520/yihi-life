<template>
	<view>
		<view class="container">
			<view class="content">更新中...</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				tomweichat: ''
			};
		},
		onLoad() {
			// this.navto();
			if (this.$store.state.userInfo.user_id) {
				this.getToMiniUrl()
			} else {
				uni.showModal({
					content: '请登录',
					success: (res) => {
						if (res.confirm) {
							uni.navigateTo({
								url: `/pages/public/login`
							});
						}
					}
				});
			}
		},
		onShow() {
			this.navto();
		},
		methods: {
			async getToMiniUrl() {
				const tominiUrl = await this.$api.request('/index/gettominiUrl', 'get', {
					id: this.$store.state.userInfo.user_id,
					token: this.$store.state.userInfo.token
				})
				console.log(tominiUrl);
				this.tomweichat = tominiUrl
			},
		async navto() {
				const id = this.$store.state.userInfo.user_id;
				const token = this.$store.state.userInfo.token;
				const url =
					'http://yihuo.rongyigou8.com/app/index.php?i=1&c=entry&m=ewei_shopv2&do=mobile&r=account.login&attach=qicai';
				await this.getToMiniUrl()

				// 仅在app中运行，且调用plus这个api
				// #ifdef APP-PLUS
				if (token) {
					uni.showModal({
						title: '提示',
						content: '即将跳转',
						success: (res)=> {
							if (res.confirm) {
								//跳小程序
								console.log(this.tomweichat)
								if (this.tomweichat === '') {
									if (url.includes('?')) {
										plus.runtime.openURL(`${url}&token=${token}&qicai_id=${id}`, function(
											err) {
											uni.showToast({
												title: JSON.stringify(err),
												duration: 8000
											});
										});
									} else {
										url = url + '?';
										plus.runtime.openURL(`${url}&token=${token}&qicai_id=${id}`, function(
											err) {
											uni.showToast({
												title: JSON.stringify(err),
												duration: 8000
											});
										});
									}
									uni.switchTab({
										url: '/pages/index/index'
									});
								} else {
									// window.open(this.tomweichat)
									console.log(55555);
									plus.runtime.openURL(this.tomweichat)
									// window.location.href = this.tomweichat;
									// uni.switchTab({
									// 	url: '/pages/index/index'
									// });
								}


								//跳H5
								// if (res.confirm) {
								//   if (url.includes('?')) {
								//     plus.runtime.openURL(`${url}&token=${token}&qicai_id=${id}`, function (err) {
								//       uni.showToast({
								//         title: JSON.stringify(err),
								//         duration: 8000
								//       });
								//     });
								//   } else {
								//     url = url + '?';
								//     plus.runtime.openURL(`${url}&token=${token}&qicai_id=${id}`, function (err) {
								//       uni.showToast({
								//         title: JSON.stringify(err),
								//         duration: 8000
								//       });
								//     });
								//   }
								// } else if (res.cancel) {
								//   console.log('无事发生');
								// }
							} else if (res.cancel) {
								console.log('无事发生');
								uni.switchTab({
									url: '/pages/index/index'
								});
							}
						}
					});
				} else {
					uni.showModal({
						content: '请登录',
						success: (res) => {
							if (res.confirm) {
								uni.navigateTo({
									url: `/pages/public/login`
								});
							}
						}
					});
				}
				// #endif

				// #ifdef H5
				if (token) {
					//跳小程序
					uni.showModal({
						title: '提示',
						content: '即将跳转',
						success: (res) => {
							if (res.confirm) {
								if (this.tomweichat != '') {
									window.location.href = this.tomweichat;
								} else {
									if (url.includes('?')) {
										window.location.href = `${url}&token=${token}&qicai_id=${id}`;
										uni.switchTab({
											url: '/pages/index/index'
										});
									} else {
										url = url + '?';
										window.location.href = `${url}&token=${token}&qicai_id=${id}`;
										uni.switchTab({
											url: '/pages/index/index'
										});
									}
								}
								return
							}
							if(res.cancel){
								return console.log('取消');
								
							}
						},
						complete: () => {
							this.$api.navTo('/pages/index/index')
						}
					})
					// console.log(this.tomweichat)
					// if (this.tomweichat != '') {
					// 	window.location.href = this.tomweichat;
					// }


					// 跳H5
					// if (url.includes('?')) {
					//   window.location.href = `${url}&token=${token}&qicai_id=${id}`;
					//   uni.switchTab({
					//     url: '/pages/index/index'
					//   });
					// } else {
					//   url = url + '?';
					//   window.location.href = `${url}&token=${token}&qicai_id=${id}`;
					//   uni.switchTab({
					//     url: '/pages/index/index'
					//   });
					// }
				} else {
					uni.showModal({
						content: '请登录',
						success: (res) => {
							if (res.confirm) {
								uni.navigateTo({
									url: `/pages/public/login`
								});
							}
						}
					});
				}
				// #endif


			}
		}
	};
</script>

<style lang="scss" scoped>
	page {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	.container {
		height: 100vh;
		line-height: 100vh;
		font-size: $font-xlg;
		color: #333;

		.content {
			text-align: center;
		}
	}
</style>