import { request } from '@/utils'

export default {
  getSingleReviewList: (data) => request.post('/contract/getSingleReviewList', data, { noNeedTip: true }),
}
