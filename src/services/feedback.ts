import request from '@/utils/request';

export async function queryFeedbackList(params: object) {
  return request('/agencyUrl/v1.1/proposal/query',
    {
      method: 'POST',
      data: params,
    },
  );
}
