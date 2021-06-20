/*
 * config the api easy to invoke.
 * Created Date: Friday June 18th 2021
 * Author: 陈堂宋 (chentangsong)
 * -----
 * Last Modified: Friday June 18th 2021 10:54:15 pm
 * Modified By: the developer formerly known as 陈堂宋 (chentangsong) at <chentangsong@foxmail.com>
 * -----
 * HISTORY:
 */

import apiConfig from './apiConfig';
class Api {
  @apiConfig('get')
  envSystemInfo = '/devTools/api/env-system-info';

}
export default new Api()