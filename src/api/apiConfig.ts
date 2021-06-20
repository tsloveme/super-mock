import Request from "../utils/request";
interface PlayRoad {
  any:any
};
interface ReqConfig {

};
export default (...options:any[])=>{
  let reqOption:any = {};
  let method = options.find((v:any)=>{
    if (typeof v != 'string') {
      return false;
    }
    v = v.toLocaleLowerCase();
    if (v == 'get' || v == 'post') {
      return true
    }
  });
  if (method) {
    reqOption.method = method.toLocaleLowerCase();
  }
  return function (target:any, key:string) {

    let descriptor = {
      value: (data:PlayRoad, config?:ReqConfig)=>{
        return Request({
          data,
          url: key,
          ...reqOption,
          ...config
        })
      }
    }
    return descriptor
  }
}
