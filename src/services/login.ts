import request from '@/utils/request';

export async function loginUser(params:object) {
  return request('/agencyUrl/api-uaa/oauth/user/token', {
    method: 'POST',
    data: params,
  });
}

export async function getCurrentUserMessage() {
  return request('/agencyUrl/api-user/users/current', {
    method: 'GET',
  });
}
export async function getCurrentMenusMessage() {
  return request('/agencyUrl/api-user/menus/current', {
    method: 'GET',
  });
}
