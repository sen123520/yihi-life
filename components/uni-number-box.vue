<template>
	<view class="uni-numbox" @click.stop="nothing">
		<button class="uni-numbox-minus" 
			@click="_calcValue('subtract')"
			:disabled="isMin"
		>
			<view class="yticon icon-jianhao" :class="isMin?'uni-numbox-disabled': ''" ></view>
			<!-- <text class="yticon icon-jianhao" :class="minDisabled?'uni-numbox-disabled': ''" ></text> -->
		</button>
		<input 
			class="uni-numbox-value" 
			type="number" 
			:disabled="disabled"
			:value="inputValue"
			@input="_onBlur"
			@blur="_onBlur"
		>
		<button 
			class="uni-numbox-plus" 
			@click="_calcValue('add')"
			
		>
			<view class="yticon icon-jiahao" :class="isMax?'uni-numbox-disabled': ''" ></view>
			<!-- <text class="yticon icon-jiahao" :class="maxDisabled?'uni-numbox-disabled': ''" ></text> -->
		</button>
	</view>
</template>
<script>
	export default {
		name: 'uni-number-box',
		props: {
			isMax: {
				type: Boolean,
				default: false
			},
			isMin: {
				type: Boolean,
				default: false
			},
			index: {
				type: Number,
				default: 0
			},
			value: {
				type: Number,
				default: 0
			},
			min: {
				type: Number,
				default: -Infinity
			},
			max: {
				type: Number,
				default: Infinity
			},
			step: {
				type: Number,
				default: 1
			},
			disabled: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				inputValue: this.value,
				minDisabled: false,
				maxDisabled: false
			}
		},
		created(){
			this.maxDisabled = this.isMax;
			this.minDisabled = this.isMin;
		},
		computed: {
			
		},
		watch: {
			value(number){
				this.inputValue = number;
			},
			inputValue(number) {
				const data = {
					number: number,
					index: this.index
				}
				this.$emit('eventChange', data);
			}
		},
		methods: {
			nothing(){},
			_calcValue(type) {
				const scale = this._getDecimalScale();
				let value = this.inputValue * scale;
				let newValue = 0;
				let step = this.step * scale;
				
				if(type === 'subtract'){
					newValue = value - step;
					if (newValue <= this.min){
						this.minDisabled = true;
					}
					if(newValue < this.min){
						newValue = this.min
					}
					if(newValue < this.max && this.maxDisabled === true){
						this.maxDisabled = false;
					}
				}else if(type === 'add'){
					newValue = value + step;
					if (newValue >= this.max){
						this.maxDisabled = true;
					}
					if(newValue > this.max){
						newValue = this.max
					}
					if(newValue > this.min && this.minDisabled === true){
						this.minDisabled = false;
					}
				}
				if(newValue === value){
					return;
				}
				this.inputValue = newValue / scale;
			},
			_getDecimalScale() {
				let scale = 1;
				// 浮点型
				if (~~this.step !== this.step) {
					scale = Math.pow(10, (this.step + '').split('.')[1].length);
				}
				return scale;
			},
			_onBlur(event) {
				let value = event.detail.value;
				if (!value) {
					this.inputValue = 0;
					return
				}
				value = +value;
				if (value > this.max) {
					value = this.max;
				} else if (value < this.min) {
					value = this.min
				}

				this.inputValue = value
			}
		}
	}
</script>
<style>
	.uni-numbox {
		position:absolute;
		right: 10rpx;
		bottom: 10rpx;
		display: flex;
		justify-content: flex-start;
		align-items: center;
		width:135rpx;
		height: 32rpx;
		/* background:#F2F4F7; */
		/* border: #555 1rpx solid; */
	}
	uni-button:after{
		border: none;
	}
	.uni-numbox-minus,
	.uni-numbox-plus {
		/* margin: 0; */
		padding: 0;
		/* background-color: #fff; */
		width: 32rpx;
		height: 32rpx;
		overflow: hidden;
		line-height: 32rpx;
		text-align: center;
		position: relative;
		border: none;
	}
	.uni-numbox-minus .yticon,
	.uni-numbox-plus .yticon{
		font-size: 32rpx;
		text-align: center;
		/* color: #555; */
	}

	.uni-numbox-minus {
		/* border: #fff; */
		border-radius:50%;
	}

	.uni-numbox-plus {

		border-radius:50%;
	}

	.uni-numbox-value {
		position: relative;
		background-color: #fff;
		width: 80rpx;
		height: 32rpx;
		line-height: 32rpx;
		text-align: center;
		padding: 0;
		font-size: 28rpx;
	}

	.uni-numbox-disabled.yticon {
		color: #d6d6d6;
	}
</style>
