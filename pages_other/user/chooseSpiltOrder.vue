<template>
	<view class="main">
		<!-- <header class="header">
			<view class="header-right" @click="goback()">
				< </view>
					<view class="header-center">
						分配复消额
					</view>
					<view class="header-left">

					</view>
		</header> -->
		<view class="padding20">
			<view class="radios">
				<uni-section title="选择订单" type="line">
					<uni-data-select v-model="OrderNo" :localdata="range" @change="change"
						label="应用选择"></uni-data-select>
				</uni-section>
			</view>
			<view class="user">
				<uni-section title="选择用户" type="line">
					<view class="example-body">
						<view class="users">
							<view class="userlist">
								<view class="userlist">
									选中的用户{{checkbox1Name}}
								</view>
							</view>
							<button type="primary" @click="showDrawer('showLeft')">显示从属用户
							</button>
						</view>

						<uni-drawer ref="showLeft" mode="left" :width="320" @change="changeDrawer($event,'showLeft')">
							<view class="close">
								<view class="select-box">
									<uni-section title="单选" type="line">
										<view class="uni-px-5 uni-pb-5">
											<view class="text" style="margin-bottom: 40rpx;">选中的从属用户：</view>
											<uni-data-checkbox v-model="checkbox1"
												:localdata="hobby"></uni-data-checkbox>
										</view>
									</uni-section>
								</view>
								<button @click="closeDrawer('showLeft')" type="primary"><text
										class="word-btn-white">确认</text></button>
							</view>
						</uni-drawer>
					</view>
				</uni-section>
			</view>
			<view class="ipt">
				<uni-section title="选择会员级别" type="line">
					<view class="uni-px-5 uni-pb-5">
						<uni-data-checkbox v-model="radio1" :localdata="sex"></uni-data-checkbox>
					</view>
				</uni-section>
			</view>
			<view class="allocation">
				<button type="primary" @click="allocations()"><text
						class="word-btn-white allocationbtn">分配</text></button>
			</view>
			<!-- <view class="bottom">
				<text class="note">
					1.输入的复消额会平均分配到所选用户账户中<br />
					2.相应的贡献值也会转移<br />
					3.仅限复制的用户才可分配复消额
				</text>
			</view> -->
		</view>

	</view>
</template>

<script>
	export default {
		onLoad() {
			this.chooseSpiltOrder()
		},
		data() {
			return {
				OrderNo: 0,
				range: [],
				checkbox1: '',
				hobby: [],
				ipt: '',
				radio1: '',
				sex: [],
				checkbox1ID:''
			};
		},
		methods: {
			// 获取可以均匀分配的订单
			async chooseSpiltOrder() {
				try {
					const data = await this.$api.request('/user/chooseSpiltOrder', 'post')
					this.range = data.orderlist.map((item) => {
						return {
							value: item.id,
							text: item.id,
							epuity: item.epuity
						}
					})
					this.hobby = data.userlist.map((item) => {
						return {
							value: item.id + '--' + item.username,
							text: item.username + '---' + item.level_name,
						}
					})
					this.sex = data.rebatelist.map((item) => {
						return {
							value: item.level_id,
							text: item.level_name,
						}
					})
				} catch (err) {

				}
			},
			change(e) {
				// console.log("e:", e);
			},
			goback() {
				uni.switchTab({
					url: '/pages/user/user'
				});
			},
			// 打开串口
			showDrawer(e) {
				this.$refs[e].open()
			},
			// 关闭窗口
			closeDrawer(e) {
				const originalString = this.checkbox1;
				const startingIndex = originalString.indexOf("--");
				if (startingIndex !== -1) {
				  // const newString = originalString.substring(0, startingIndex);
					const newString = originalString.slice(0, startingIndex);
				  this.checkbox1ID = newString
				} else {
				  console.log("未找到匹配的子字符串");
				}
				this.$refs[e].close()
			},
			// 抽屉状态发生变化触发
			changeDrawer(e, type) {
				// this[type] = e
			},
			// 分配复消额
			async allocations() {
				try {
					const data = await this.$api.request('/user/spiltOrder', 'POST', {
						order_id: this.OrderNo,
						level_id:this.radio1,
						slave_id:this.checkbox1ID,
						// userlist: this.checkbox1.join(','),
						// order_epuity: this.ipt,
					})
				} catch (err) {
					console.log(err);
				}
			},
			
		},
		computed: {
			equityValue() {
				for (var i = 0; i < this.range.length; i++) {

					if (this.range[i].value == this.OrderNo) {
						if (this.range[i].epuity.startsWith('可分配的复消额：')) {
							return this.range[i].epuity
						} else {
							return this.range[i].epuity = '可分配的复消额：' + this.range[i].epuity
						}

					}
				}

			},
			checkbox1Name(){
				const originalString = this.checkbox1;
				const searchString = "--";
				const startingIndex = originalString.indexOf(searchString);
				if (startingIndex !== -1) {
				  // const newString = originalString.substring(startingIndex);
				  const newString = originalString.slice(startingIndex);
				   return newString
				} else {
					return '为空'
				}
			
			},
		},
	}
</script>

<style lang="scss" scoped>
	.main {
		position: relative;
		height: calc(100vh - 88rpx);
		background: #f8f8f8;
		padding-top: 2rpx;
		overflow: hidden;
		/* header {
			background-color: white;
			display: flex;
			justify-content: space-between;
			align-items: center;
			.header-right {
				font-size: 56rpx;
				font-weight: 400;
				margin-left: 30rpx;
			}

			.header-center {
				font-weight: 700;
				font-size: 16px;
				line-height: 30px;
				text-align: center;
				overflow: hidden;
				white-space: nowrap;
				text-overflow: ellipsis;
			}

			.header-left {
				margin-left: 30rpx;
				width: 40rpx;
			}
		} */
	}

	.radios {
		input {
			padding: 0 40rpx;
		}

		.uni-stat-box {
			padding: 20rpx;
		}
	}


	.user {
		.users {
			margin: 0 0 20rpx 0;
			display: flex;
			justify-content: space-between;
			align-items: center;

			.userlist {
				display: flex;
				width: 380rpx;
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
			}
		}

		button {
			font-size: 24rpx;
			width: 30%;
			color: #fff;
			/* padding: 0 19px; */
			margin: 0 auto;
			border-radius: 100px;
			background-color: #ff6974;
			box-shadow: 1px 2px 5px rgba(244, 67, 54, 0.4);
			height: 60rpx;
			line-height: 60rpx;
		}

		.example-body {
			padding: 10px;

			.close {
				padding: 10px;

				.select-box {
					margin-bottom: 80rpx;

					::v-deep .is-checked {
						.checklist-content {
							.checklist-text {
								color: #ff6974;
							}
						}

						.checkbox__inner {
							border-color: #ff6974;
							background-color: #ff6974;
						}
					}
				}
			}
		}

		/deep/ .checklist-text {
			span {
				color: #ff6974;
			}

		}



		.scroll-view {
			/* #ifndef APP-NVUE */
			width: 100%;
			height: 100%;
			/* #endif */
			flex: 1
		}

		// 处理抽屉内容滚动
		.scroll-view-box {
			flex: 1;
			position: absolute;
			top: 0;
			right: 0;
			bottom: 0;
			left: 0;
		}

		.info {
			padding: 15px;
			color: #666;
		}

		::v-deep .info-text {
			font-size: 14px;
			color: #666;
		}

		.info-content {
			padding: 5px 15px;
		}


	}

	.uni-section {
		margin: 20rpx 0;

		.uni-section-header {
			.uni-section-header__decoration {
				background-color: #ff6974;
			}

		}
	}

	.uni-section {

		::v-deep .uni-section-header {
			.uni-section-header__decoration {
				background-color: #d34d68;
			}
		}
	}

	.ipt {

		.uni-input {
			height: 35px;
			border: solid 1px #e5e5e5;
			border-radius: 10rpx;
			padding-left: 20rpx;
		}

		.uni-section-content {
			padding: 20rpx;

		}
	}

	.allocation {
		padding: 20rpx;

		button {
			width: 50%;
			color: #fff;
			padding: 0 19px;
			margin: 0 auto;
			border-radius: 100px;
			height: 39px;
			line-height: 39px;
			font-size: 15px;
			background: #d34d68;
			box-shadow: 1px 2px 5px rgba(244, 67, 54, 0.4);
		}
	}

	.bottom {
		position: absolute;
		bottom: 20rpx;
		margin: 0 40rpx;

		.note {
			color: #ccc;
			font-size: 30rpx;
		}
	}

	.padding20 {
		padding: 0 20rpx;
		background-color: #fff;
	}
	::v-deep .uni-data-checklist .checklist-group .checklist-box.is--default.is-checked .checklist-text{
		color: #ff6974;
	}
	::v-deep .uni-data-checklist .checklist-group .checklist-box.is--default.is-checked .radio__inner .radio__inner-icon{
		background-color: #ff6974;
	}
	::v-deep .uni-data-checklist .checklist-group .checklist-box.is--default.is-checked .radio__inner{
		border-color: #ff6974;
	}
</style>