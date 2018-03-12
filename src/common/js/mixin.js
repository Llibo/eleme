import {formatDate} from 'common/js/util'
export const commonFilter = {
  // 过滤器
  filters: {
    formatDate (date, format) {
      if (!date) {
        return '--'
      }
      return formatDate(date, 'yyyy-MM-dd hh:ss')
    }
  }
}
