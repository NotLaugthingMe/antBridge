/**
 * Created by chenlin on 2017/12/21 0021.
 */

import {isString, isNumber, isIOS, isAndroid, isArray, extend, compareVersion, isFn, resTime, formatDate, parse ,isJson} from "./utils"
import Core from './core';

class Ali extends Core{
  constructor(){
    super();
  }
  loadingArr = [];
  alert(opt, fn){
    if (isString(opt) || isNumber(opt)){
      opt = {
        message: opt + ''
      }
    }
    opt = opt || {};
    this.call('alert', opt ,fn)
  }
  confirm(opt, fn){
    if (isString(opt) || isNumber(opt)) {
      opt = {message: opt + ""};
    }
    this.call('confirm', opt, fn);
  }
  toast(opt, fn){
    if (isString(opt) || isNumber(opt)) {
      opt = {
        text: opt + ''
      };
    }
    opt = opt || {};
    opt.content = opt.text;
    opt.duration = opt.duration || 2000;
    // 为了解决android不是在消失后才回调的问题。
    if (!!fn && isNumber(opt.duration) && isAndroid()) {
      opt.duration = opt.duration < 2500 ? 2000 : 3000;
      Ali.call("toast", opt);
      setTimeout(fn, opt.duration);
    } else {
      Ali.call("toast", opt, fn);
    }
  }
  setTitle(opt, fn){
    if (isString(opt)) {
      opt = {
        title: opt + ''
      }
    }
    if(!opt.title){
      console.error('setTitle: title is required');
      return false;
    }
    this.call('setTitle',opt, fn)
  }
  setOptionMenu(opt, fn){
    if (isString(opt)) {
      if (/^http/i.test(opt)){
        opt = {
          icon: opt + ''
        }
      } else {
        opt = {
          title: opt + ''
        }
      }
    }
    this.call('setOptionMenu', opt, fn)
  }
  setBarBottomLineColor(opt, fn){
   if (isString(opt)){
     opt = {
       color: opt+''
     }
   }
   this.call('setBarBottomLineColor', opt, fn)
  }
  setTitleColor(opt, fn){
    if (isString(opt)){
      opt = {
        color: opt+''
      }
    }
    this.call('setTitleColor', opt, fn)
  }
  showOptionMenu(){
    this.call('showOptionMenu');
  }
  hideOptionMenu(){
    this.call('hideOptionMenu');
  }
  showLoading(opt, fn){
    if (isString(opt) || isNumber(opt)) {
      opt = {
        text: opt + ''
      }
    }
    opt = opt || {};
    opt.delay = opt.delay || 1000;
    // 修复ios delay导致的hideLoading不一定能成功阻止被delay的showLoading的bug
    if(isIOS() && isNumber(opt.delay)){
      const delay = opt.delay;
      delete opt.delay;
      const loadingTimer = setTimeout(()=>{
        this.call('showLoading', opt, fn)
      }, delay);
      this.loadingArr = this.loadingArr || [];
      this.loadingArr.push(loadingTimer);
    } else {
      this.call('showLoading', opt, fn)
    }
  }
  hideLoading(fn){
    const {loadingArr} = this;
    if(isArray(loadingArr)){
      if (loadingArr.length) {
        while (loadingArr.length){
          clearTimeout(this.loadingArr.shift());
        }
      }
    }
    this.call('hideLoading',fn)
  }
  chooseImage(opt, fn){
    opt = extend({
      sourceType : 'camera',
      count: 1
    },opt);
    if (opt.count>9) {
      opt.count = 9;
    }
    this.call('chooseImage', opt, fn)
  }
  photo(opt, fn) {
    if (fn === undefined && isFn(opt)) {
      fn = opt;
      opt = {};
    }
    let def = {
      dataType: 'dataURL',
      imageFormat: 'jpg',
      quality: 75,
      maxWidth: undefined,
      maxHeight: undefined,
      allowEdit: false,
    };
    def = extend({},def, opt);
    if ((def.useFrontCamera === false || def.useFrontCamera === true) && compareVersion('9.6') < 0 && !isIOS()) {
      console.error('useFrontCamera can be used in IOS and aliPayVersion must be 9.0+');
    }
    this.call('photo', def, result=>{
      if (result.dataURL) {
        result.dataURL = "data:image/;base64," + result.dataURL;
      }
      result.photo = result.dataURL || result.fileURL;
      result.errorMessage = result.error === 10 ? "用户取消" : result.errorMessage;
      fn && fn(result);
    })
  }
  datePicker(opt, fn){
    if (fn === undefined && isFn(opt)) {
      fn = opt;
      opt = {};
    }
    let def ={
      beginDate: '2015-10-12',
      minDate: '2015-10-09',
      maxDate: '2016-10-09',
      mode: 1,
      isIDCard: false
    };
    def = extend({},def,opt);
    const beginDate = new Date(resTime(def.beginDate)).getTime();
    const minDate = new Date(resTime(def.minDate)).getTime();
    const maxDate = new Date(resTime(def.maxDate)).getTime();
    if (beginDate < minDate || beginDate>maxDate){
      console.error('beginDate must bigger than minDate and beginDate must be lower than maxDate');
      return false;
    }
    this.call('datePicker', opt ,result=>{
      result.errorMessage  = result.error&&result.error >10 ? '用户取消': result.errorMessage;
      fn && fn(result);
    })
  }
  scan(opt, fn){
    opt = extend({},{
      type:'bar'
    },opt);
    if (!opt.type){
      console.error('scan: type is required');
      return false;
    }
    this.call('scan', opt, result=>{
      result.errorMessage  = result.error&&result.error === 10 ? '用户取消': result.error === 11 ? '操作失败' : result.errorMessage;
      fn && fn(result);
    })
  }
  vibrate(){
    this.call('vibrate');
  }
  watchShake(fn){
    this.call('watchShake', fn)
  }
  getCurrentLocation(opt, fn){
   if (fn === undefined && isFn(opt)){
     fn = opt;
     opt = {};
   }
   opt = opt || {timeout: 15000};
   if (!opt.bizType){
     console.error('getCurrentLocation: bizType is required');
     return false;
   }
    let timer = setTimeout(()=>{
      console.error("getCurrentPosition: timeout");
       const result = {
        errorCode: 5,
        errorMessage: "调用超时"
      };
      fn && fn(result);
    }, opt.timeout);
   this.call('getCurrentLocation', opt, result=>{
     timer && clearTimeout(timer);
     result.errorMessage = result.error&&result.error === 11 ? '没有权限，可接入权限引导' : result.error === 12 ? '逆地理失败' : result.error === 13 ? '其它原因' : result.errorMessage;
     fn && fn(result);
   })
  }
  share(opt){
   opt = extend({},{
     title: '',
     imgUrl: '',
     desc: '',
     link: ''
   },opt);
    for (let key in opt) {
      const M = document.createElement('meta');
      const Head = document.getElementsByTagName('head')[0];
      M.name = `Alipay:${key}`;
      M.content = opt[key];
      Head.appendChild(M);
    }
  }
  getSingleContact(fn){
    this.call('contact', result=>{
      let temp= {
        phoneNumber: result.mobile,
        name: result.name
      };
      switch (result.error) {
        case 10:
          temp.errorMessage = "没有权限";
          break;
    
        case 11:
          temp.errorMessage = "用户取消操作";
          break;
        default:
          temp.errorMessage =  result.errorMessage;
      }
      fn && fn(temp);
    })
  }
  chooseContact(opt, fn) {
    opt = extend({}, {
      type: 'multi',
      multiMax: 50,
    }, opt);
    this.call('chooseContact', opt ,result=>{
    
    })
  }
  getNetworkType(opt, fn){
    if(fn === undefined && isFn(opt)) {
      fn = opt;
      opt = null;
    }
    opt = opt || {timeout: 15000};
    const timer = setTimeout(()=>{
      console.error("network.getType: timeout");
      const result = {
        errorCode: 5,
        errorMessage: "调用超时"
      };
      fn && fn(result);
    }, opt.timeout);
    this.call('getNetworkType', result=>{
      timer && clearTimeout(timer);
      fn && fn(result);
    })
  }
}


