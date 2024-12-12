<template>
	<view>
		<!-- 地址 -->
		<navigator url="/pages_other/address/address?source=1" class="address-section">
			<view class="order-content">
				<text class="yticon icon-shouhuodizhi"></text>
				<view class="cen" v-if="addressData && addressData.name">
					<view class="top">
						<text class="name">{{ addressData.name }}</text>
						<text class="mobile">{{ addressData.mobile }}</text>
					</view>
					<text
						class="address">{{ addressData.province.name + addressData.city.name + addressData.area.name + ' ' + addressData.address }}</text>
				</view>
				<view class="cen" v-else>请选择收货地址</view>
				<text class="yticon icon-you"></text>
			</view>
			<image class="a-bg"
				src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAu4AAAAFCAYAAAAaAWmiAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6Rjk3RjkzMjM2NzMxMTFFOUI4RkU4OEZGMDcxQzgzOEYiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6Rjk3RjkzMjQ2NzMxMTFFOUI4RkU4OEZGMDcxQzgzOEYiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpGOTdGOTMyMTY3MzExMUU5QjhGRTg4RkYwNzFDODM4RiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpGOTdGOTMyMjY3MzExMUU5QjhGRTg4RkYwNzFDODM4RiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PrEOZlQAAAiuSURBVHjazJp7bFvV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">
			</image>
		</navigator>

		<view class="progress" v-if="progress.number">
			<!-- <ProgressBar 
			class="ProgressBar" 
			:Sold="progress.sold" 
			:widthUpx="250"
			:Width="percentage(progress.number, progress.sold)" 
			Type="candy" 
			:Vice="true"></ProgressBar> -->
		</view>
		<view class="goods-section">
			<!-- 商品列表 -->
			<view class="goods-header">
				<text>商城自营</text>
				<text>共{{ goodsCount }}件</text>
			</view>
			<view class="g-item" v-for="(item, index) in product" :key="item.id">
				<image :src="item.image" mode="aspectFill"></image>
				<view class="right">
					<text class="title clamp">{{ item.title }}</text>
					<view class="spec">
						{{ item.spec ? '规格:' + item.spec : '' }} {{ ' 库存:' + item.stock }}
						{{ progress.number ? '(秒:' + progress.number + '件,剩:' + (progress.number - progress.sold) + '件)' : '' }}
					</view>
					<view class="price-box">
						<view class="price">￥{{ item.sales_price }}</view>
						<!-- <text class="number">x 1</text> -->
						<uni-number-box v-if="progress.number" class="step" :min="1"
							:disabled="item.number >= progress.number - progress.sold" :value="item.number"
							:isMax="progress.number - progress.sold <= item.number ? true : false"
							:isMin="item.number === 1" :index="index" @eventChange="numberChange"></uni-number-box>
						<uni-number-box v-else class="step" :min="1" :disabled="item.number >= item.stock"
							:value="item.number" :isMax="item.stock <= item.number ? true : false"
							:isMin="item.number === 1" :max="item.max_number" :index="index"
							@eventChange="numberChange"></uni-number-box>
					</view>
				</view>
			</view>
		</view>
		<!-- 优惠明细 -->
		<view class="yt-list" v-if="couponList && couponList.length">
			<view class="yt-list-cell b-b" @click="toggleMask('show')">
				<view class="cell-icon">
					券
				</view>
				<text class="cell-tit clamp">消费券</text>
				<text class="cell-tip active">
					{{useCouponIndex !== -1 ? couponList[useCouponIndex].title : '选择消费券'}}
				</text>
				<text class="cell-more wanjia wanjia-gengduo-d"></text>
			</view>
		</view>
		<!-- 金额明细 -->
		<view class="yt-list">
			<view class="yt-list-cell b-b" v-if="order_type!=8">
				<view class="cell-tit clamp">配送方式</view>
				<view class="cell-tip">
					<picker @change="deliveryChange" range-key="name" :value="deliveryIndex" :range="deliveryList">
						<view class="uni-input">{{ deliveryList[deliveryIndex].name }}</view>
					</picker>
				</view>
			</view>
			<view class="yt-list-cell b-b">
				<view class="cell-tit clamp">商品合计</view>
				<view class="cell-tip">￥{{ price }}</view>
			</view>
			<view class="yt-list-cell b-b" v-if="couponList && couponList.length">
				<view class="cell-tit clamp">优惠券金额</view>
				<view class="cell-tip red">-￥{{ coupon_price }}</view>
			</view>
			<view class="yt-list-cell b-b" v-if="other_coupon.price">
				<view class="cell-tit clamp">其他优惠（{{ other_coupon.name }})</view>
				<view class="cell-tip red">-￥{{ other_coupon.price }}</view>
			</view>
			<view class="yt-list-cell b-b" v-if="order_type!=8">
				<view class="cell-tit clamp">运费</view>
				<view class="cell-tip">￥{{ deliveryPrice }}</view>
			</view>
			<view class="yt-list-cell b-b" v-if="order_type!=8">
				<view class="cell-tit clamp upanddown">
					<text class="up">余额抵扣</text>
					<text class="up">(最少抵扣{{ deduction.min_realmoney }})</text>
					<text class="up" v-if="order_type!=2">账户余额：{{ wallet.real_money }}</text>
					<text class="up" v-if="order_type==2">账户余额：{{ wallet.real_money }}</text>
				</view>
				<input class="number_box" type="number" placeholder="" v-model="pay_detail.real_money"
					@blur="limitInput('force_realmoney', $event)" />
			</view>
			<view class="yt-list-cell b-b" v-if="order_type!=8">
				<view class="cell-tit clamp upanddown">
					<text class="up"> 绑定余额抵扣 </text>
					<text class="up"> (最多抵扣{{ deduction.max_realmoney_2 }}) </text>
					<text class="up" v-if="order_type!=2">账户绑定余额：{{ wallet.real_money_2 }}</text>
					<text class="up" v-if="order_type==2">账户绑定余额：{{ wallet.real_money_2 }}</text>
				</view>
				<input class="number_box" type="number" placeholder="" v-model="pay_detail.real_money_2"
					@blur="limitInput('force_realmoney_2', $event)" />
			</view>
			
			<!-- &&deduction.min_realmoney!=0 -->
			<view class="yt-list-cell b-b" v-if="deduction.max_greenscore!=0">
				<view class="cell-tit clamp upanddown">
					<text class="up">购物券抵扣</text>
					<text class="up">(最多抵扣{{ deduction.max_greenscore }})</text>
					<text class="up">账户购物券：{{ wallet.greenscore }}</text>
					<!-- <text class="down">账户购物券：{{wallet.greenscore}}</text> -->
				</view>
				<view class="cell-tip">
					<input class="number_box" type="number" placeholder="" v-model="pay_detail.greenscore"
						@blur="limitInput('greenscore', $event)" />
				</view>
			</view>
			<view class="yt-list-cell b-b">
				<view class="cell-tit clamp upanddown">
					<text class="up">福利购物券抵扣</text>
					<text class="up">(最多抵扣{{ deduction.max_greenscore }})</text>
					<text class="up">账户福利购物券：{{ wallet.greenscore_benefit }}</text>
				</view>
				<view class="cell-tip">
					<input class="number_box" type="number" placeholder="" v-model="pay_detail.greenscore_benefit"
						@blur="limitInput('greenscore_benefit', $event)" />
				</view>
			</view>
			<view class="yt-list-cell b-b" v-if="order_type!=8">
				<view class="cell-tit clamp upanddown">
					<text class="up">奖励积分抵扣</text>
					<text class="up">(最多抵扣{{ deduction.max_been }})</text>
					<text class="up">账户奖励积分：{{ wallet.been }}</text>
					<!-- <text class="down">账户奖励积分：{{wallet.been}}</text> -->
				</view>
				<view class="cell-tip">
					<input class="number_box" type="number" placeholder="" v-model="pay_detail.been"
						@blur="limitInput('been', $event)" />
				</view>
			</view>
			<view class="yt-list-cell b-b" v-if="order_type==6">
				<view class="cell-tit clamp upanddown">
					<text class="up">复消积分</text>
					<text class="up">(最多抵扣{{ deduction.max_rebuyscore }})</text>
					<text class="up">账户复消积分：{{ wallet.rebuyscore }}</text>
				</view>
				<view class="cell-tip">
					<input class="number_box" type="number" placeholder="" v-model="pay_detail.rebuy_score"
						@blur="limitInput('rebuy_score', $event)" />
				</view>
			</view>
			<view class="yt-list-cell b-b" v-if="order_type ==7">
				<view class="cell-tit clamp upanddown">
					<text class="up">兑换积分</text>
					<text class="up"
						v-if=" deduction.max_exchange_score >0">(最多抵扣{{ deduction.max_exchange_score }})</text>
					<text class="up">账户兑换积分：{{ wallet.exchange_score }}</text>
				</view>
				<view class="cell-tip">
					<input class="number_box" type="number" placeholder="" v-model="pay_detail.exchange_score" />
				</view>
			</view>
			<view class="yt-list-cell desc-cell" v-if="order_type!=8">
				<view class="cell-tit clamp">备注</view>
				<input class="desc" type="text" v-model="remark" placeholder="请填写备注信息"
					placeholder-class="placeholder" />
			</view>
			<view class="yt-list-cell desc-cell" v-if="order_type==8">
				<view class="cell-tit clamp">交易账号</view>
				<input class="desc" type="text" v-model="jiaoyi_account" placeholder="请填写555000开头的11位账号 "
					placeholder-class="placeholder" />
			</view>
		</view>
		<!-- 底部 -->
		<view class="footer">
			<view class="price-content">
				<text>实付款</text>
				<text class="price-tip">￥</text>
				<text class="price">{{ calculateFinalPrice }}</text>
			</view>
			<text class="submit" @click="submit">提交订单</text>
		</view>
		<!-- 优惠券面板 -->
		<view class="mask" :class="maskState === 0 ? 'none' : maskState === 1 ? 'show' : ''" @click="toggleMask">
			<view class="mask-content" @click.stop.prevent="stopPrevent">
				<!-- 优惠券页面，仿mt -->
				<view class="coupon-item" v-for="(item, index) in couponList" :key="index"
					:class="useCouponIndex === index ? 'selectCoupon' : ''">
					<view class="con" v-on:click="useCoupon(index)">
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
					<text class="tips">{{ item.category_text }}可用</text>
				</view>
			</view>
			<button class="btn" @click="toggleMask">收起</button>
		</view>
		<uni-popup ref="popup" background-color="#fff" :is-mask-click="false">
			<view class="dx-popup">
				<view class="dx-title">兑换须知</view>
				<view class='dx-content'>
					积分兑换一经确认提交不得更改，
					请兑换前认真确认身份信息及兑换内容。
					积分兑换成功后，即被扣减相应积分值，
					会员不得申请退、换货。
				</view>
				<view class="dx-second">
					<button @click="dxClose">返回</button>
					<button style="color: #fa436a;" @click="dxComfirm"
						:disabled="ms_count>0">{{ms_count<=0?'确认':ms_count}}</button>
					<!-- <text>{{ms_count}}</text>秒后将自动跳转 -->
				</view>
			</view>
		</uni-popup>

	</view>
</template>

<script>
	import uniNumberBox from '@/components/uni-number-box.vue';
	export default {
		components: {
			uniNumberBox
		},
		options: {
			styleIsolation: 'shared'
		},
		data() {
			return {
				jiaoyi_account: '',
				showPoup: false,
				vModelValue: 3,
				maskState: 0, //优惠券面板显示状态
				remark: '', //备注
				payType: 1, //1微信 2支付宝
				couponList: [],
				useCouponIndex: -1,
				addressData: {
					city_id: 0,
					id: 0
				},
				product: [],
				price: 0.0, //商品金额
				coupon_price: 0.0, //优惠券金额
				coupon_id: 0, //优惠券ID
				other_coupon: {
					price: 0,
					name: ''
				}, //其他优惠金额
				total: 0.0, //实付金额
				raw_total: 0.0,
				raw_total_2: 0.0,
				deliveryList: [{
						name: '商家快递'
					},
					{
						name: '自提'
					}
				],
				deliveryIndex: 0,
				deliveryPrice: 0.0,
				cart: [], // 购物车id
				flash_id: 0, // 秒杀id
				progress: {},
				submitLock: false, // 提交按钮锁
				self_delivery: 0, //自提
				minus_green_score: 0,
				minus_rebuy_score: 0,
				wallet: {},
				//订单类型:1=会员区,2=复购区,3=新人礼包区,4=优品区,5=惠品区,6=生活区,7=兑换区,8=秒杀区
				order_type: 1,
				pay_detail: {
					been: 0,
					been_benefit: 0,
					greenscore: 0,
					greenscore_benefit: 0,
					max_greenscore: 0,
					pay_money: 0,
					real_money: 0,
					coupon_money: 0,
					rebuy_score: 0,
					exchange_score: 0,
					real_money_2: 0,
					total: 0
				},
				deduction: {
					max_greenscore: 0,
					min_greenscore: 0,
					max_been: 0,
					min_been: 0,
					max_coupon: 0,
					min_realmoney: 0,
					max_rebuyscore: 0,
					min_rebuyscore: 0,
					force_realmoney: 0,
					min_realmoney: 0,
					max_realmoney_2: 0,
					total: 0
				},
				// 钱 包 信 息
				extend_info: {
					wallet: {
						real_money: '',
						been: '',
						been_benefit: '',
						greenscore: '',
						greenscore_benefit: ''
					}
				},
				secure: '',
				id: '',
				count: 3,
				ms_count: 0
			};
		},
		onLoad(options) {
			this.id = options.id
			if (options.hasOwnProperty('flash_id')) {
				this.flash_id = options.flash_id;
			}

			if (options.hasOwnProperty('cart')) {
				this.cart = options.cart;
				// 从购物车进入
				this.getOrderCreate({
					cart: options.cart
				});
			} else {
				// 从商品进入
				this.getOrderCreate({
					id: options.id,
					spec: options.spec,
					flash_id: this.flash_id
				});
			}
			this.getUserScore();
			// this.calmoneylimit();
			this.loadData();

		},
		onShow() {},
		mounted() {
			uni.showLoading({
				title: '加载中',
				mask: true
			});
			// 自动填入现有积分
			setTimeout(() => {
				this.calcTotal();
				uni.hideLoading();
			}, 500);
		},
		watch: {
			addressData(newVal, oldVal) {
				if (JSON.stringify(newVal) !== '{}' && JSON.stringify(oldVal) !== '{}') {
					this.getExpressPrice();
				}
			}
		},
		computed: {
			goodsCount() {
				let _count = 0
				this.product.map((item, index) => {
					return _count += item.number
				})
				return _count
			},
			accountsPayable() {
				const max_been = this.deduction.max_been; // 奖励积分总额
				const max_greenscore = this.deduction.max_greenscore; // 购物券总额
				// const max_coupon = this.deduction.max_coupon; // 消费券总额
				const max_rebuyscore = this.deduction.max_rebuyscore; // 复消积分总额
				const min_realmoney = this.wallet.real_money - this.deduction.min_realmoney > 0 ? 0 : this.deduction
					.min_realmoney; // 最低支付金额

				const price = this.price; // 商品总价

				// 用户选择的额度
				const user_been_benefit = this.pay_detail.been_benefit; // 用户选择的消费奖励积分抵扣额度
				const user_been = this.pay_detail.been; // 用户选择的奖励积分抵扣额度
				const user_greenscore_benefit = this.pay_detail.greenscore_benefit; // 用户选择的福利购物券抵扣额度
				const user_greenscore = this.pay_detail.greenscore; // 用户选择的购物券抵扣额度
				// const user_coupon = this.pay_detail.coupon_money; // 用户选择的消费券额度
				const user_real_money = this.pay_detail.real_money; // 用户选择的余额
				const user_rebuyscore = this.pay_detail.rebuy_score; // 用户选择的复消积分

				// 计算奖励积分、购物券、消费券的总抵扣额度
				const total_been_benefit = Math.min(user_been_benefit, max_been);
				const total_been = Math.min(user_been, max_been - total_been_benefit);
				const total_greenscore_benefit = Math.min(user_greenscore_benefit, max_greenscore);
				const total_greenscore = Math.min(user_greenscore, max_greenscore - total_greenscore_benefit);
				const total_rebuyscore = Math.min(user_rebuyscore, max_rebuyscore);
				// const total_coupon = Math.min(user_coupon, max_coupon);
				const total_real_money = Math.max(user_real_money, price);

				// 计算商品总抵扣额度
				const total_discount = total_been_benefit + total_been + total_greenscore_benefit + total_greenscore +
					total_rebuyscore - this.deliveryPrice;
				// + total_coupon;

				// 计算最终支付金额
				// const final_payment = Math.max(price - total_discount, min_realmoney);
				// const final_payment2 = Math.min(final_payment - user_real_money, min_realmoney);
				const final_payment = Math.max(price - total_discount - user_real_money, min_realmoney);
				if (final_payment > 0) {
					return final_payment.toFixed(2);
				} else {
					return 0;
				}
			},
			calculateFinalPrice() {
				let finalPrice = 0;
				let greenscore_benefit = Number(this.pay_detail.greenscore_benefit);
				let greenscore = Number(this.pay_detail.greenscore)
				let beenTotal = Number(this.pay_detail.been_benefit) + Number(this.pay_detail.been);
				let rebuyScoreTotal = Number(this.pay_detail.rebuy_score);
				let real_money = Number(this.pay_detail.real_money);
				let real_money_2 = Number(this.pay_detail.real_money_2);
				let exchange_score = Number(this.pay_detail.exchange_score)
				// greenscoreTotal = Math.min(greenscoreTotal, this.deduction.max_greenscore);
				beenTotal = Math.min(beenTotal, this.deduction.max_been);
				rebuyScoreTotal = Math.min(rebuyScoreTotal, this.deduction.max_rebuyscore);
				let deductionTotal = greenscore + greenscore_benefit + beenTotal + rebuyScoreTotal + exchange_score +
					real_money_2;
				if (deductionTotal > this.price) {
					finalPrice = Math.max(this.deduction.min_realmoney, this.price - deductionTotal) + this.deliveryPrice;
				} else {
					finalPrice = Math.max(this.deduction.min_realmoney, this.price - deductionTotal) + this.deliveryPrice;
				}
				if (finalPrice - real_money > 0) {
					finalPrice = finalPrice - real_money;
					return finalPrice.toFixed(2);
				} else {
					return 0;
				}
			}
		},
		methods: {
			limitInput(field, e) {
				const value = parseInt(this.pay_detail[field]);
				let maxAllowed = 0;
				let minAllowed = 0;
				let types = '';
				switch (field) {
					case 'greenscore_benefit':
						types = 'greenscore';
						minAllowed = this.deduction.min_greenscore || 0
						maxAllowed = this.deduction.max_greenscore;
						break;
					case 'greenscore':
						types = 'greenscore_benefit';
						minAllowed = this.deduction.min_greenscore || 0
						maxAllowed = this.deduction.max_greenscore;
						break;
					case 'been_benefit':
						types = 'been';
						minAllowed = this.deduction.min_been || 0;
						maxAllowed = this.deduction.max_been;
						break;
					case 'been':
						types = 'been_benefit';
						minAllowed = this.deduction.min_been || 0;
						maxAllowed = this.deduction.max_been;
						break;
					case 'rebuy_score':
						types = 'rebuy_score';
						minAllowed = this.deduction.min_rebuyscore || 0;
						maxAllowed = this.deduction.max_rebuyscore;
						break;
					case 'force_realmoney_2':
						types = 'force_realmoney_2';
						minAllowed = this.deduction.min_realmoney_2 || 0;
						maxAllowed = this.deduction.max_realmoney_2;
						break;
					case 'force_realmoney':
						types = 'force_realmoney';
						minAllowed = this.deduction.min_realmoney || 0;
						maxAllowed = this.deduction.force_realmoney;
						const precent = this.deduction.min_realmoney / this.deduction.total * 100;
						// console.log(precent,minAllowed)
						if (minAllowed > 0 && maxAllowed > 0) {
							// 强制余额为50%
							this.pay_detail.real_money = this.deduction.min_realmoney;
							uni.showToast({
								title: `余额必须为商品价格的${precent}%`,
								duration: 2000,
								icon: 'none'
							});
						}
						break;
				}
				if (value > maxAllowed) {
					if (types == 'rebuy_score') {
						if (this.deduction.max_rebuyscore != 0) {
							return (this.pay_detail[field] = this.deduction.max_rebuyscore);
						}
						return (this.pay_detail[field] = 0);
					}
					this.pay_detail[field] = Math.min(Number(maxAllowed.toString() - Number(this.pay_detail[types])), this
						.wallet[field]);
				}
			},
			// 获取钱包信息
			async loadData() {
				let e_info = await this.$api.request('/user/getUserExtendInfo');
				this.extend_info = e_info;
			},
			async getExpressPrice() {
				if (this.addressData) {
					let product_list_array = JSON.stringify(this.product);
					let deliveryFee = await this.$api.request('/order/getTotalDeliveryFee', 'POST', {
						city_id: this.addressData.city_id,
						product_list: product_list_array,
						self_delivery: this.self_delivery
					});

					if (deliveryFee.status == 1) {
						this.deliveryPrice = deliveryFee.fee;
						this.submitLock = false;
					} else {
						this.deliveryPrice = 0;
						this.$api.msg(deliveryFee.fee);
						this.submitLock = true;
					}
				}
			},
			// 获取分区限制抵扣金额
			async calmoneylimit() {
				try {
					const data = await this.$api.request('/order/calMoneyLimit', 'POST', {
						order_type: this.order_type,
						total: this.price
					});
					this.deduction = data;
					// console.log('----', this.deduction);
					this.pay_detail.real_money = data.min_realmoney;
				} catch (err) {
					console.log(err);
				} finally {}
			},
			// 计算百分比
			percentage(number, sold) {
				if (!sold) {
					return 0;
				}
				return parseInt((sold / number) * 100);
			},
			async getUserScore() {
				let wallet = await this.$api.request('/user/getUserExtendInfo');
				this.wallet = wallet.wallet;
				// console.log(this.wallet);
			},
			getDefaultAddress() {
				let defaultAddress = this.$api.request('/address/info');
				this.addressData = defaultAddress;
			},
			// 选择运费
			deliveryChange(e) {
				this.self_delivery = e.detail.value;
				this.deliveryIndex = e.detail.value;
				this.getExpressPrice();
				this.calcTotal();
			},
			// 使用优惠券
			useCoupon(index) {
				if (this.useCouponIndex !== index) {
					this.useCouponIndex = index;
					this.coupon_price = this.couponList[index].value;
					this.coupon_id = this.couponList[index].id;
				} else {
					this.useCouponIndex = -1;
					this.coupon_price = 0;
				}
				this.calcTotal();
			},
			//获取创建订单信息
			async getOrderCreate(param) {
				let that = this;

				let apiUrl = !param.flash_id || param.flash_id == 0 ? '/order/create' : '/flash/createOrder';
				let data = await this.$api.request(apiUrl, 'POST', param, true);

				if (data) {
					this.product = data.product;
					console.log(this.product);
					this.couponList = data.coupon;
					//this.deliveryList = data.delivery;
					this.order_type = data.order_type;
					if (data.address) {
						this.addressData = data.address;
						//计算运费
						this.getExpressPrice();
					}

					if (data.flash) {
						this.progress = data.flash;

					}
					let price = 0;
					data.product.forEach((item) => {
						price = price + parseFloat(item.sales_price) * item.number;
					});
					this.raw_total = price.toFixed(2);
					this.getOtherCoupon(this.raw_total);

					//this.calcTotal();
				} else {
					setTimeout(() => {
						that.$api.request('/order/create', 'POST', param);
					}, 300);
					setTimeout(function() {
						// that.$api.prePage().getDetail(param.id, param.flash_id);
						uni.navigateBack();
					}, 3000);
				}
			},

			//获取其他优惠
			async getOtherCoupon(raw_price) {
				let that = this;
				let product_list_array = JSON.stringify(that.product);
				let data = await this.$api.request('/order/getOtherCouponPrice', 'POST', {
					order_type: that.order_type,
					raw_price: raw_price
				});
				if (data) {
					that.other_coupon = data;
				}
			},
			//显示优惠券面板
			toggleMask(type) {
				let timer = type === 'show' ? 10 : 300;
				let state = type === 'show' ? 1 : 0;
				this.maskState = 2;
				setTimeout(() => {
					this.maskState = state;
				}, timer);
			},
			changePayType(type) {
				this.payType = type;
			},
			submit() {
				this.pay_detail.total = this.calculateFinalPrice;
				uni.showModal({
					title: '提示',
					content: `确认当前的收货人为${this.addressData.name ? this.addressData.name : '空'}-${this.addressData.mobile ? this.addressData.mobile : ''}吗？`,
					cancelText: '取消',
					confirmText: '确认',
					confirmColor: '#fa436a',
					cancelColor: '#000000',
					success: (res) => {
						if (res.confirm) {
							if (this.calculateFinalPrice < 0 && this.order_type != 8) {
								uni.showModal({
									content: '请检查余额，如余额不足请充值!',
									success: (confirmRes) => {
										if (confirmRes.confirm) {
											return;
										}
									}
								});
							} else {
								// if(this.secure == ''){
								// 	this.$api.msg('请输入安全密码')
								// }
								if (this.jiaoyi_account === '' && this.order_type == 8) {
									return this.$api.msg('交易账号必填！');
								}
								if (!this.addressData || !this.addressData.hasOwnProperty('city_id')) {
									this.$api.msg('请选择收货地址');
									return;
								}
								
								if (this.order_type == 8 && this.calculateFinalPrice > 0) {
									return this.$api.msg('兑换失败！实付款不为零')
								}
								if (this.order_type == 8 && this.calculateFinalPrice === 0) {
									this.$refs.popup.open()
									this.ms_count = this.count
									let timer = setInterval(() => {
										if (timer) {
											this.ms_count--
											if (this.ms_count <= 0) {
												clearInterval(timer)
											}
										}
									}, 1000)
									return
								}
								// this.$api.msg('提交中...', 20000);
								this.successSubmit()
								// console.log(this.addressData)
							}
						} else {
							return;
						}
					}
				});
			},
			dxClose() {
				this.$refs.popup.close()
			},
			dxComfirm() {
				console.log('确认');
				this.successSubmit()
			},
			async successSubmit() {
				let delivery_id = this.product[0].delivery_id;
				let coupon_id = 0;
				if (this.couponList && this.couponList[this.useCouponIndex] && this
					.couponList[this.useCouponIndex].id) {
					coupon_id = this.couponList[this.useCouponIndex].id;
				}
				let data = {
					city_id: this.addressData.city_id > 0 ? this.addressData.city_id : '',
					address_id: this.addressData.id > 0 ? this.addressData.id : '',
					delivery_id: delivery_id,
					coupon_id: coupon_id,
					remark: this.remark,
					product_id: [],
					spec: [],
					number: [],
					cart: this.cart,
					flash_id: this.flash_id,
					self_delivery: this.self_delivery,
					greenscore_benefit: this.pay_detail.greenscore_benefit,
					greenscore: this.pay_detail.greenscore,
					been_benefit: this.pay_detail.been_benefit,
					been: this.pay_detail.been,
					real_money: this.pay_detail.real_money,
					real_money_2: this.pay_detail.real_money_2,
					coupon_money: this.pay_detail.coupon_money,
					order_type: this.order_type,
					other_coupon_price: this.other_coupon.price,
					rebuyscore: this.pay_detail.rebuy_score,
					total: this.pay_detail.total,
					jiaoyi_account: this.jiaoyi_account,
					exchange_score: this.pay_detail.exchange_score
				};

				this.product.forEach((item, index) => {
					data.product_id.push(item.id);
					data.spec.push(item.spec.replace(/,/g, '|'));
					data.number.push(item.number);
				});
				this.submitLock = true; // 提交锁
				let apiUrl = this.flash_id == 0 ? '/order/submit' : '/flash/submitOrder';
				let result = await this.$api.request(apiUrl, 'POST', data);
				console.log(result);
				if (result) {
					this.submitLock = false; // 解除锁
					this.$api.msg('已提交', 2000);
					console.log(this.pay_detail.total, result.out_trade_no);
					uni.redirectTo({
						url: `/pages/money/pay?order_id=${result.order_id}&total=${this.pay_detail.total}&out_trade_no=${result.out_trade_no}`
					});
				}
				this.submitLock = false; // 解除锁
			},

			stopPrevent() {},
			//数量
			async numberChange(data) {
				let oldNumber = this.product[data.index].number;
				let newNumber = data.number;
				this.product[data.index].number = newNumber;
				let price = 0;
				this.product.forEach((item) => {
					price = price + parseFloat(item.sales_price) * item.number;
				});
				this.raw_total = price.toFixed(2);
				//计算运费
				await this.getExpressPrice();
				await this.getOtherCoupon(this.raw_total);
				this.calcTotal();
				//判断当前库存
				let stock = this.product[data.index].stock;
				if (newNumber > this.product[data.index].stock) {
					this.product[data.index].number = stock;
				}
			},
			// 计算价格
			async calcTotal() {
				let price = 0;
				let number = 0; // 产品数量
				let product = this.product;
				product.forEach((item) => {
					price = price + parseFloat(item.sales_price) * item.number;
					number = number + item.number;
				});
				this.price = price.toFixed(2);
				await this.calmoneylimit();
				let total = price;

				total = total + this.deliveryPrice;

				// 检查当前优惠券是否满足使用条件
				this.coupon_price = 0.0;
				if (this.useCouponIndex != -1 && this.couponList && this.couponList[this.useCouponIndex]) {
					this.coupon_price = this.couponList[this.useCouponIndex].value;
					if (this.price >= this.couponList[this.useCouponIndex].least) {
						total = total - this.coupon_price;
					} else {
						this.$api.msg('选中的优惠券不满足使用条件', 2000);
						this.useCouponIndex = -1; //取消选中的优惠券
						this.coupon_price = 0; //设置优惠金额为0
					}
				}

				total = total - this.other_coupon.price;

				this.total = total.toFixed(2);

				let that = this;
				let product_list_array = JSON.stringify(that.product);
				// let data = await this.$api.request('/order/calPayMoney', 'POST', {
				// 	order_type: that.order_type,
				// 	total: this.total
				// });
				// if (data) {
				// 	// that.pay_detail.been = Number(data.been)
				// 	// that.pay_detail.been_benefit = Number(data.been_benefit)
				// 	// that.pay_detail.greenscore = Number(data.greenscore)
				// 	// that.pay_detail.greenscore_benefit = Number(data.greenscore_benefit)
				// 	// that.pay_detail.max_greenscore = Number(data.max_greenscore)
				// 	// that.pay_detail.pay_money = Number(data.pay_money)
				// 	// that.pay_detail.real_money = Number(data.real_money)
				// 	// that.pay_detail.coupon_money = Number(data.coupon_money)
				// 	// that.pay_detail.rebuy_score = Number(data.rebuyscore)
				// 	that.total = Number(data.pay_money);
				// }
			},
			onGreenScoreBlur(event) {
				let value = Number(event.detail.value);
				//console.log(value);
				if (!value) {
					this.minus_green_score = 0;
					this.calcTotal();
					return;
				}
				//console.log(value);
				//不能大于剩余积分最大值
				if (value >= this.wallet.green_score) {
					value = this.wallet.green_score;
				}
				//不能大于订单金额最大值. 本来金额减复购积分
				let max = this.raw_total_2 - this.minus_rebuy_score;
				if (value >= max) {
					value = max;
				}
				//console.log(value);
				this.minus_green_score = value;
				this.calcTotal();
			},
			onRebuyScoreBlur(event) {
				let value = Number(event.detail.value);
				if (!value) {
					this.minus_rebuy_score = 0;
					this.calcTotal();
					return;
				}
				if (value >= this.wallet.rebuy_score) {
					value = this.wallet.rebuy_score;
				}
				let max = this.raw_total_2 - this.minus_green_score;
				if (value >= max) {
					value = max;
				}
				this.minus_rebuy_score = value;
				this.calcTotal();
			}
		}
	};
</script>

<style lang="scss">
	page {
		background: #F2F4F7;
		padding: 0 0 100rpx;
	}

	.uni-numbox {
		left: initial !important;
		right: 0 !important;
	}

	.address-section {
		padding: 30upx 0;
		background: #fff;
		position: relative;
		// height: 168rpx;
		margin-top: 4rpx;

		.order-content {
			display: flex;
			align-items: center;

		}

		.icon-shouhuodizhi {
			flex-shrink: 0;
			display: flex;
			align-items: center;
			justify-content: center;
			width: 90rpx;
			color: #888;
			font-size: 44upx;
		}

		.cen {
			display: flex;
			flex-direction: column;
			flex: 1;
			font-size: 32rpx;
			color: $font-color-dark;

		}

		.name {
			font-size: 34upx;
			margin-right: 24upx;
		}

		.address {
			margin-top: 14rpx;
			font-size: 26rpx;
			// margin-right: 20upx;
			color: $font-color-light;
		}

		.icon-you {
			font-size: 32upx;
			color: $font-color-light;
			margin-right: 30upx;
		}

		.a-bg {
			position: absolute;
			left: 0;
			bottom: 0;
			display: block;
			width: 100%;
			height: 5upx;
		}
	}

	.goods-section {
		margin-top: 20rpx;
		background: #fff;
		padding-top: 10rpx;
		padding-bottom: 20rpx;

		.goods-header {
			font-size: 30rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			height: 80rpx;
			padding: 0 30rpx;
			position: relative;
			border-bottom: #F2F4F7 solid 1rpx;
		}

		.logo {
			display: block;
			width: 50upx;
			height: 50upx;
			border-radius: 100px;
		}

		.name {
			font-size: 30upx;
			color: $font-color-base;
			margin-left: 24upx;
		}

		.g-item {
			display: flex;
			margin: 20upx 30upx;

			image {
				flex-shrink: 0;
				display: block;
				width: 160upx;
				height: 160upx;
				border-radius: 4upx;
			}

			.right {
				height: 160upx;
				flex: 1;
				padding-left: 20rpx;
				overflow: hidden;
				position: relative;
			}

			.title {
				font-size: 28rpx;
				color: $font-color-dark;
			}

			.spec {
				font-size: 24rpx;
				color: $font-color-light;
				margin: 10rpx 0;
			}

			.price-box {
				display: flex;
				align-items: center;
				font-size: 32upx;
				color: $font-color-dark;
				padding-top: 5px;

				.price {
					margin-bottom: 4upx;
					color: red;
				}

				.market_price {
					font-size: 26upx;
					margin-left: 20upx;
					color: #b2b2b2;
					text-decoration: line-through;
					margin-top: -8rpx;
				}

				.number {
					font-size: 26upx;
					color: $font-color-base;
					margin-left: 20upx;
				}

				.step {
					left: unset;
					right: 10upx;
				}
			}

			.step-box {
				position: relative;
			}
		}
	}

	.yt-list {
		margin-top: 16upx;
		background: #fff;
	}

	.yt-list-cell {
		display: flex;
		align-items: center;
		padding: 10rpx 30rpx 10rpx 40rpx;
		line-height: 70rpx;
		position: relative;

		::v-deep .uni-numbox-minus {
			display: flex;
			justify-content: center;
			align-items: center;
		}

		::v-deep .uni-numbox-plus {
			display: flex;
			justify-content: center;
			align-items: center;
		}

		&.cell-hover {
			background: #fafafa;
		}

		&.b-b:after {
			left: 30upx;
		}

		.cell-icon {
			height: 32upx;
			width: 32upx;
			font-size: 22upx;
			color: #fff;
			text-align: center;
			line-height: 32upx;
			background: #f85e52;
			border-radius: 4upx;
			margin-right: 12upx;

			&.hb {
				background: #ffaa0e;
			}

			&.lpk {
				background: #3ab54a;
			}
		}

		.cell-more {
			align-self: center;
			font-size: 24upx;
			color: $font-color-light;
			margin-left: 8upx;
			margin-right: -10upx;
		}

		.cell-tit {

			flex: 1;
			font-size: 26upx;
			// color: $font-color-light;
			color: black;
			font-weight: 900;
			margin-right: 10upx;
		}

		.cell-tip {
			font-size: 26upx;
			color: $font-color-dark;

			&.disabled {
				color: $font-color-light;
			}

			&.active {
				color: $base-color;
			}

			&.red {
				color: $base-color;
			}

			picker {
				max-width: 500rpx;
				line-height: 50rpx;
			}
		}

		.cell-tip.max_score_total {
			color: $font-color-light;
		}

		.minus_score {
			width: 140upx;
		}

		&.desc-cell {
			.cell-tit {
				max-width: 120upx;
			}
		}

		.desc {
			flex: 1;
			font-size: $font-base;
			color: $font-color-dark;
		}
	}

	/* 支付列表 */
	.pay-list {
		padding-left: 40upx;
		margin-top: 16upx;
		background: #fff;

		.pay-item {
			display: flex;
			align-items: center;
			padding-right: 20upx;
			line-height: 1;
			height: 110upx;
			position: relative;
		}

		.icon-weixinzhifu {
			width: 80upx;
			font-size: 40upx;
			color: #6bcc03;
		}

		.icon-alipay {
			width: 80upx;
			font-size: 40upx;
			color: #06b4fd;
		}

		.icon-xuanzhong2 {
			display: flex;
			align-items: center;
			justify-content: center;
			width: 60upx;
			height: 60upx;
			font-size: 40upx;
			color: $base-color;
		}

		.tit {
			font-size: 32upx;
			color: $font-color-dark;
			flex: 1;
		}
	}

	.dx-popup {
		width: 500rpx;
		padding: 40rpx;
		font-size: 34rpx;

		.dx-title {
			text-align: center;
			font-weight: 700;
		}

		.dx-content {
			margin: 20rpx 0;
		}

		.dx-second {
			width: 100%;
			height: 80rpx;
			border-top: #F2F4F7 solid 2rpx;
			display: flex;
			align-items: center;
			color: #FF4500;

			button {
				width: 40%;
				height: 60rpx;
				line-height: 60rpx;
			}
		}
	}

	.footer {
		position: fixed;
		left: 0;
		bottom: 0;
		z-index: 995;
		display: flex;
		align-items: center;
		width: 100%;
		height: calc(90upx + env(safe-area-inset-bottom) / 2);
		justify-content: space-between;
		font-size: 30upx;
		background-color: #fff;
		z-index: 99;
		color: $font-color-base;
		box-shadow: 0 -1px 5px rgba(0, 0, 0, 0.1);
		padding-bottom: calc(env(safe-area-inset-bottom) / 2);

		.price-content {
			padding-left: 30upx;
		}

		.price-tip {
			color: $base-color;
			margin-left: 8upx;
		}

		.price {
			font-size: 36upx;
			color: $base-color;
		}

		.submit {
			display: flex;
			align-items: center;
			justify-content: center;
			width: 280upx;
			height: 100%;
			color: #fff;
			font-size: 32upx;
			background-color: $uni-color-primary;
		}

		.submit.lock {
			background-color: #ccc;
		}
	}

	/* 优惠券面板 */
	.mask {
		display: flex;
		align-items: flex-end;
		position: fixed;
		left: 0;
		top: var(--window-top);
		bottom: 0;
		width: 100%;
		background: rgba(0, 0, 0, 0);
		z-index: 100;
		transition: 0.3s;

		.mask-content {
			width: 100%;
			min-height: 30vh;
			max-height: 70vh;
			background: #f3f3f3;
			transform: translateY(100%);
			transition: 0.3s;
			overflow-y: scroll;
			padding-bottom: 100rpx;
		}

		.btn {
			background: #fa436a;
			position: absolute;
			bottom: 0;
			width: 700rpx;
			margin: 20rpx 25rpx;
			color: #fff;
			border-radius: 40rpx;
		}

		&.none {
			display: none;
		}

		&.show {
			background: rgba(0, 0, 0, 0.4);

			.mask-content {
				transform: translateY(0);
			}
		}
	}

	/* 选中的优惠券 */
	.selectCoupon {
		border: 1upx solid red;
	}

	/* 优惠券列表 */
	.coupon-item {
		display: flex;
		flex-direction: column;
		margin: 20upx 24upx;
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

	.minus_score {
		text-align: right;
	}

	.number_box {
		height: 70rpx;
		text-align: end;
		width: 280rpx;
		font-size: 26rpx;
		background-color: #F2F4F7;
		padding-right: 20rpx;
		// ::v-deep .uni-input-input {
		// 	pointer-events: none;
		// 	color: #888;
		// }

		.uni-numbox-plus {
			line-height: 50rpx;
		}
	}

	.upanddown {
		display: flex;
		flex-direction: column;
		padding: 10rpx 0;

		.up {
			font-size: 28rpx;
			line-height: 28rpx;
			margin-bottom: 6rpx;
			color: black;
			font-weight: 700;
		}

		.down {
			font-size: 16rpx;
			line-height: 16rpx;
		}
	}
</style>