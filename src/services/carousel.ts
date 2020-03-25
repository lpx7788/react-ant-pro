import request from '@/utils/request';

// 轮播图
export async function queryCarouselList(params: object) {
  return request('/agencyUrl/v1.1/advertisement/query',
    {
      method: 'POST',
      data: params,
    },
  );
}

// 删除
export async function arouselListDelete(params: object) {
  return request('/agencyUrl/v1.1/advertisement/delete',
    {
      method: 'POST',
      data: params,
    },
  );
}

// 删除
export async function arouselListMove(params: object) {
  return request('/agencyUrl/v1.1/advertisement/move',
    {
      method: 'POST',
      data: params,
    },
  );
}

// 新增
export async function arouselListAdd(params: object) {
  return request('/agencyUrl/v1.1/advertisement/add',
    {
      method: 'POST',
      data: params,
    },
  );
}

// 编辑
export async function arouselListEdit(params: object) {
  return request('/agencyUrl/v1.1/advertisement/edit',
    {
      method: 'POST',
      data: params,
    },
  );
}
