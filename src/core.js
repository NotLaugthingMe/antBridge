/**
 * Created by chenlin on 2017/12/21 0021.
 */

import {isString, isFn, isAliPay, aliPayVersion} from './utils';

export default class Core{
  isAliPay = isAliPay();
  aliPayVersion = aliPayVersion();
  ready(fn){
    if (window.AlipayJSBridge && window.AlipayJSBridge.call){
      fn && fn();
    } else {
      document.addEventListener('AlipayJSBridgeReady', fn, false)
    }
  }
  call(...arg){
    const args = Array.prototype.slice.call(arg);
    const name = args[0];
    let opt = args[1];
    let callback = args[2];
    if (!isString(name)) {
      console.error('apiName error:' + name);
      return false;
    }
    if (callback === undefined && isFn(opt)) {
      callback = opt;
      opt = null;
    }
    this.ready(()=>{
      window.AlipayJSBridge.call(name, opt, callback)
    })
  }
}
