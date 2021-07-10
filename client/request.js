export default class Request {
  constructor(props){
    this.props = props;
  }

  post(){
    return fetch(url,{method: 'post'})
  }
  get(){
    return fetch(url,{method: 'get'})
  }

}