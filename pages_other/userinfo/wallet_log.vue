<template>
	<view>
		<view class="list-total">
			<text>{{name.name}}</text><text>{{name.value}}</text>
		</view>		
		<view class="tab-list">

			<view class="tab-list-item" v-for="(item, index) in theList" :key="index">
				<view class="tab-list-item-text">
					{{ item.describe }}
				</view>
				<view class="tab-list-item-price">
					<text v-if="current == 'changeBeenLog'" class="changeBeenLog">{{item.remark}}</text>
					<view class="tab-list-item-text-time"><text v-if="current === 'rebuyscore'">有效期:{{ item.expiretime_text }}</text>
					<text v-else>{{ item.createtime_text }}</text></view>
					<view class="">
							<text v-if="item.score > 0 && current != 'withdrawalRecords' && item.type != 'out'">+</text>
							<text v-if="current == 'withdrawalRecords' || item.type == 'out'">-</text>
							<text v-if="current == 'changeBeenLog'"></text>
							<text v-else>{{ multiple ? $multiple(parseFloat(item.score)).toFixed(5) : parseFloat(item.score) }}</text>
							<!-- <text v-else>{{ parseFloat(item.score) }}</text> -->
					</view>
					<!-- <view>
						<view class="state1" v-if="item.status=='0'">未发</view>
						<view class="state2" v-if="item.status=='1'">已发</view>
						<view class="state3" v-if="item.status=='2'">挂起</view>
						<view class="state4" v-if="item.status=='3'">挂起</view>
						<view class="state5" v-if="item.status=='4'">退单</view>
					</view> -->
				</view>
			</view>
		</view>

	</view>
</template>

<script>
	import {
		mapState,
	} from 'vuex';
	export default {
		data() {
			return {
				//列表数据
				theList: [],
				page_no: 1,
				page_num: 20,
				//是否继续请求数据，如false，则说明数据都已加载完毕
				goOnLoad: true,
				current: 'greenscore',
				name: {},
				multiple:false,
				types:['epuity','epuity_welfare']
			};
		},
		computed: {
			...mapState(['userInfo'])
		},
		onLoad(q) {
			this.name = q
			switch (q.type) {
				case 'rebuyscore':// 复消积分历史
					this.current = q.type
					this.loadList('getRebuylog','returnlog')
					break;
				case 'withdrawalRecords': // 提现历史
					this.current = q.type
					this.loadList('withdrawLog','user')
					break;
				case 'transferMoneyLog':// 转账历史
					this.current = q.type
					this.loadList('transferMoneyLog','user')
					break;
				case 'changeBeenLog':// 兑换历史
					this.current = q.type
					this.loadList('changeBeenLog','user')
					break;
				default:
					this.current = q.type
					this.detection(q.type)
					this.loadList('getReturnlog','returnlog');
					break;
			}
		},
		//加载更多
		onReachBottom() {
			switch (this.current) {
				case 'rebuyscore': // 复消积分历史
					this.loadList('getRebuylog','returnlog')
					break;
				case 'withdrawalRecords': // 提现历史
					this.loadList('withdrawLog','user')
					break;
				case 'transferMoneyLog': // 转账历史
					this.loadList('transferMoneyLog','user')
					break;
				case 'changeBeenLog':// 兑换历史
					this.loadList('changeBeenLog','user')
					break;
				default:
					this.loadList('getReturnlog','returnlog');
					break;
			}
			
			
			// if(this.current != 'withdrawalRecords'){
			// 	this.loadList();
			// }else{
			// 	this.withdrawLog()
			// }
		},
		methods: {
			async loadList(types,method) {
				if (!this.goOnLoad) return; //已全部加载完成

				let logList = await this.$api.request(`/${method}/${types}`, 'POST', {
					page_no: this.page_no,
					page_num: this.page_num,
					type: this.current
				});
				if (logList) {
					this.theList = this.theList.concat(logList);
					if (logList.length < this.page_num) {
						this.goOnLoad = false;
						this.$api.msg('没有更多数据');
					} else {
						this.page_no++;
					}
				}

			},
			// 检测是否为复消额
			detection(type){
				this.types.forEach((value,index) =>{
					if(type.includes(value)){
						this.multiple = true
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	.list-total {
		color: white;
		position: relative;
		width: 100%;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		padding: 20px 26px;
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
		background-image: url('../../image/topbgimg.jpg');
		background-size: 100% 140%;
		background-repeat: no-repeat;
		text{
			margin-top: 10rpx;
		}
	}
	.tab-list {
		margin: 0 30upx;
		// border:1px solid #e3e3e3;
		border-bottom: none;

		.tab-list-item {
			padding: 20upx 20upx;
			box-sizing: border-box;
			display: flex;
			flex-direction: column;
			border-bottom: 1px solid #f4f4f4;
			background-color: #fff;
			border-radius: 10px;
			box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
			margin: 20rpx 0;

			.tab-list-item-text {
				// width: 510upx;
				line-height: 1.4em;
				color: #333;
				font-size: 40rpx;

				
			}
			.tab-list-item-text-time {
				font-size: 30rpx;
				color: #999999;
				line-height: 40rpx;
			}

			.tab-list-item-price {
				// width: 200upx;
				text-align: right;
				font-size: 32upx;
				font-weight: bold;
				display: flex;
				// flex-direction: column;
				justify-content: space-between;
				color: #ff4e4e;
				margin-top: 20rpx;
				.state1 {
					font-weight: normal;
					color: #ff512b;
					font-size: 24upx;
				}

				.state2 {
					font-weight: normal;
					color: #00B26A;
					font-size: 24upx;
				}

				.state3 {
					font-weight: normal;
					color: #007AFF;
					font-size: 24upx;
				}

				.state4 {
					font-weight: normal;
					color: #888;
					font-size: 24upx;
				}

				.state5 {
					font-weight: normal;
					color: #ff512b;
					font-size: 24upx;
				}
			}
		}
	}
	.changeBeenLog{
		font-size: 28rpx;
		position: relative;
		bottom: 4rpx;
		text-align: left;
	}
</style>