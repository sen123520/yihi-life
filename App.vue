<script>
/**
 * vuex管理登陆状态，具体可以参考官方登陆模板示例
 */
import { mapMutations, mapState } from 'vuex';
export default {
  data() {
    return {
      _version_code: '',
      _version_num: '',
      _lastVersion_code: '',
      _lastVersion_num: ''
    };
  },
  methods: {
    ...mapMutations(['login', 'logout', 'setUserInfo','setSafeArea']),
    // #ifdef H5
    // 检查登录状态
    async checkLogin() {
      let user = uni.getStorageSync('userInfo');
	  console.log('user',user);
      if (user) {
        this.login(user);
		if(user.pw_status!=0){
			uni.showModal({
				title:'安全警告',
				content:'检测到您的登陆密码过于简单,为了您的账户安全,请修改登陆密码。',
				confirmText:'确认',
				cancelText:'返回',
				success: (res) => {
					if(res.confirm){
						uni.navigateTo({
							url:'/pages_other/userinfo/changePassword'
						})
					}
					if(res.cancel){
						this.logout()
						this.$api.navTo('/pages/public/login')	 				
					}
				}
			})
		}
      }
      let result = await this.$api.request('/user/status');
      if (!result) {
        // 若没有登录则清空个人信息
        this.logout();
      }
    },
    // #endif
    //  版本更新
    async getNewVersion(version_num) {
      const data = await this.$api.request('/index/checkNewVersion', 'post', {
        ver: this._version_code, //当前版本号
        type: 1 // 1是消费版本，0是代理商版本
      });
      // const verSion = JSON.parse(data)
      this._lastVersion_code = data.version;
      const _temp_lastVer = this._lastVersion_code.split('.').map(String);
      this._lastVersion_num = _temp_lastVer[0] + _temp_lastVer[1] + _temp_lastVer[2];

      console.log(this._lastVersion_num, this._version_num);
      if (this._lastVersion_num > this._version_num) {
        console.log('该更新了老铁');
        uni.showModal({
          title: '发现新版本',
          showCancel: false,
          confirmText: '立即更新',
          success: function (res) {
            if (res.confirm) {
              plus.runtime.openURL(
                data.wgtUrl,
                function (res) {
                  console.log('更新成功');
                },
                function (e) {
                  console.error('更新失败:', e.message);
                }
              );
            }
          }
        });
      }
    }
  },
  onLaunch: function () {
    // 锁定屏幕竖向
    // #ifdef APP-PLUS
    plus.screen.lockOrientation('portrait-primary');
    const systemInfo = uni.getSystemInfoSync();
	// console.log( '安全区域',systemInfo.safeArea);
	this.setSafeArea(systemInfo.safeArea)
    this._version_code = systemInfo.appWgtVersion || '0';
    const _temp_version = this._version_code.split('.').map(String);
    this._version_num = _temp_version[0] + _temp_version[1] + _temp_version[2];
    // console.log(this._version_num);
    // this.getNewVersion();
    // #endif
    // 监听tab栏点击事件

    //检查版本更新
  },
  onShow: function (opt) {
    // 检查用户登录情况
    // #ifdef H5
    this.checkLogin();
    // #endif
    // #ifdef MP-WEIXIN
    this.$wechatMiniLogin();
    // #endif

    //更改上级(临时)
    if (opt.query) {
      if (opt.query.pid > 0) {
        let pid = opt.query.pid;
        //缓存上级用户信息
        uni.setStorage({ key: 'pid', data: pid });
      }
    }
  },
  onHide: function () {
    //console.log('App Hide')
  }
};
</script>

<style lang="scss">
@import url('./static/font/font.css');
/* project id 1729059 */
@font-face {
  font-family: 'unishop';
  font-weight: normal;
  font-style: normal;
  src: url('/static/font/font_1729059_llr8d2acjac.ttf') format('truetype');
}

.yticon {
  font-family: 'unishop' !important;
  font-size: 16px;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.icon-shouhuodizhi:before {
  content: '\e6b5';
}

.icon-xuanzhong:before {
  content: '\e64c';
}

.icon-fenlei:before {
  content: '\e71b';
}

.icon-bianji:before {
  content: '\e77d';
}

.icon-jiahao:before {
  content: '+';
}

.icon-jianhao:before {
  content: '-';
}

.icon-wxpay:before {
  content: '\e607';
}

.icon-pay:before {
  content: '\e624';
}

.icon-alipay:before {
  content: '\e60b';
}

.icon-you:before {
  content: '\e65f';
}

.icon-huoche:before {
  content: '\e6f0';
}

.icon-shoucang:before {
  content: '\e60a';
}

.icon-gouwuche:before {
  content: '\e60e';
}

.icon-fangzi:before {
  content: '\e657';
}

.icon-daifukuan:before {
  content: '\e601';
}

.icon-daifahuo:before {
  content: '\e704';
}

.icon-daishouhuo:before {
  content: '\e62f';
}

.icon-pingjia:before {
  content: '\e61d';
}

.icon-shouhou:before {
  content: '\e610';
}

.icon-shoucang-setting:before {
  content: '\e612';
}

.icon-setting:before {
  content: '\e62b';
}

.icon-dizhi:before {
  content: '\e67c';
}

.icon-lajitong:before {
  content: '\e615';
}

view,
scroll-view,
swiper,
swiper-item,
cover-view,
cover-image,
icon,
text,
rich-text,
progress,
button,
checkbox,
form,
input,
label,
radio,
slider,
switch,
textarea,
navigator,
audio,
camera,
image,
video {
  box-sizing: border-box;
}
/* 骨架屏替代方案 */
.Skeleton {
  background: #f3f3f3;
  padding: 20upx 0;
  border-radius: 8upx;
}

/* 图片载入替代方案 */
.image-wrapper {
  font-size: 0;
  background: #f3f3f3;
  border-radius: 4px;

  image {
    width: 100%;
    height: 100%;
    transition: 0.6s;
    opacity: 0;

    &.loaded {
      opacity: 1;
    }
  }
}

.clamp {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: block;
}

.common-hover {
  background: #F2F4F7;
}

// /*边框*/
// .b-b:after,
// .b-t:after {
//   position: absolute;
//   z-index: 3;
//   left: 0;
//   right: 0;
//   height: 0;
//   content: '';
//   transform: scaleY(0.5);
//   border-bottom: 1px solid $border-color-base;
// }

// .b-b:after {
//   bottom: 0;
// }

// .b-t:after {
//   top: 0;
// }

// /* button样式改写 */
// uni-button,
// button {
//   height: 80upx;
//   line-height: 80upx;
//   font-size: $font-lg + 2upx;
//   font-weight: normal;

//   &.no-border:before,
//   &.no-border:after {
//     border: 0;
//   }
// }

// uni-button[type='default'],
// button[type='default'] {
//   color: $font-color-dark;
// }

// /* input 样式 */
// .input-placeholder {
//   color: #999999;
// }

// .placeholder {
//   color: #999999;
// }
</style>
