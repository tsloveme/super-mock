export default class Dom{
  /**
   * dom生成辅助工具
   * @param {String} tag 标签
   * @param {Object} attrs 属性集合
   * @param {Array} children 子节点
   */
  static create(tag, attrs={}, children=[]){
    let dom = document.createElement(tag);
    for (let k in attrs) {
      if (k.toLowerCase() == 'classname') {
        dom.setAttribute('class', attrs[k]);
      } else if (/^on(click|touch|focus|blur|change|input|mouseover|mousemove|keyup|keydown|mouseout)/.test(k.toLowerCase())) {
        // 事件绑定
        dom.addEventListener(k.replace(/^on/, ''), attrs[k]);
      } else {
        // 其他属性
        dom.setAttribute(k, attrs[k]);
      }
    }
    return dom;
  }
}