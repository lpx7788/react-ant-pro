import request from '@/utils/request';

// 资讯来源列表
export async function queryInformationSourseList() {
  return request('/agencyUrl/v1.0/industryInformation/categoryArr',
    {
      method: 'POST',
    },
  );
}

// 编辑者列表
export async function queryEditorList() {
  return request('/agencyUrl/v1.0/industryInformation/editorArr',
    {
      method: 'POST',
    },
  );
}

// 获取资讯页面列表
export async function queryInformationList (params: object) {
  return request('/agencyUrl/v1.0/industryInformation/query',
    {
      method: 'POST',
      data: params,
    },
  );
}

// 删除资讯
export async function queryDeleteInformationList (params: object) {
  return request('/agencyUrl/v1.0/industryInformation/delete',
    {
      method: 'POST',
      data: params,
    },
  );
}

// 置顶资讯
export async function informationListToTop (params: object) {
  return request('/agencyUrl/v1.0/industryInformation/topped',
    {
      method: 'POST',
      data: params,
    },
  );
}

// 隱藏资讯或者显示
export async function informationListDisplay (params: object) {
  return request('/agencyUrl/v1.0/industryInformation/display',
    {
      method: 'POST',
      data: params,
    },
  );
}

// 发布资讯
export async function informationRelease (params: object) {
  return request('/agencyUrl/v1.0/industryInformation/release',
    {
      method: 'POST',
      data: params,
    },
  );
}

// 编辑资讯
export async function informationEdit (params: object) {
  return request('/agencyUrl/v1.0/industryInformation/edit',
    {
      method: 'POST',
      data: params,
    },
  );
}
