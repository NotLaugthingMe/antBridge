/**
 * Created by chenlin on 2017/12/21 0021.
 */

const ua = navigator.userAgent;
const strings = Object.prototype.toString;
export function isNumber(num) {
  return strings.call(num).toLowerCase() === '[object number]';
}
export function isString(str) {
  return strings.call(str).toLowerCase() === '[object string]';
}
export function isFn(fn) {
  return strings.call(fn).toLowerCase() === '[object function]';
}
export function isArray(arr) {
  return strings.call(arr).toLowerCase() === '[object array]';
}
export function isAliPay() {
  return (ua.indexOf("AlipayClient") > -1 || ua.indexOf("AliApp(AP") > -1);
}

export function aliPayVersion() {
  if(isAliPay()){
    const version=ua.match(/AlipayClient\/(.*)/);
    return (version && version.length) ? version[1] : "";
  }
}
export function isIOS() {
  return !!ua.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
}
export function isAndroid() {
  return ua.indexOf('Android') > -1 || ua.indexOf('Adr') > -1;
}
export function resTime(str) {
  const reg = /(-)|(:)/g;
  str=str.replace(reg, ',');
  return str;
}
// return 1代表目标比当前版本小，-1相反，相同为0
export function compareVersion(targetVersion) {
  const aliPayVersion = aliPayVersion().split(".");
  targetVersion = targetVersion.split(".");
  
  for (let i = 0, n1, n2; i < aliPayVersion.length; i++) {
    n1 = parseInt(targetVersion[i], 10) || 0;
    n2 = parseInt(aliPayVersion[i], 10) || 0;
    
    if (n1 > n2) return -1;
    if (n1 < n2) return 1;
  }
  
  return 0;
}
export function extend() {
  let temp ={};
  let len = arguments.length;
  for(let i = 0; i <len; i++) {
    let source  = arguments[i];
    if (source !== undefined && source !== null) {
      for(let key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)){
          temp[key] = source[key];
        }
      }
    }
  }
  return temp;
}
export function formatDate(date, format) {
  if (getType(date) !== 'date') {
    throw new Error('date must be a Date');
  }
  let o = {
    "M+": date.getMonth() + 1,
    "d+": date.getDate(),
    "h+": date.getHours(),
    "m+": date.getMinutes(),
    "s+": date.getSeconds(),
    "q+": Math.floor((date.getMonth() + 3) / 3),
    "S": date.getMilliseconds()
    
  };
  if (/(y+)/.test(format)) {
    format = format.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
  }
  for (let k in o) {
    if (new RegExp("(" + k + ")").test(format)) {
      format = format.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
    }
  }
  return format;
}
export function parse(str) {
  let s = strings.call(str) === '[object object]';
  if (!s) {
    if(JSON && JSON.parse){
      return JSON.parse(str);
    }
    return (new Function("return "+ str))();
  }else {
    return str
  }
}
export function isJson(obj) {
  return typeof obj === 'object' && strings.call(obj).toLowerCase() === '[object object]';
}
