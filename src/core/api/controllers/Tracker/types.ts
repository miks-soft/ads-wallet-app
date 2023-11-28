export type RequestsTracker = {
  postCashlessPayment: PickApiData<
    '/api/v1/tracker/cashless-payment-request',
    'post'
  >;
  getIssue: PickApiData<'/api/v1/tracker/issue/{id}', 'get'>;
  postIssue: PickApiData<'/api/v1/tracker/issue', 'post'>;
  getIssues: PickApiData<'/api/v1/tracker/issues', 'get'>;
  getHelpdeskRequests: PickApiData<'/api/v1/tracker/helpdesk', 'get'>;
  getHelpdeskRequest: PickApiData<'/api/v1/tracker/helpdesk/{id}', 'get'>;
  getHelpdeskThemes: PickApiData<'/api/v1/tracker/helpdesk/theme', 'get'>;
  getNewMessagesCount: PickApiData<'/api/v1/tracker/helpdesk/new-count', 'get'>;
  postHelpdeskRequest: PickApiData<'/api/v1/tracker/helpdesk', 'post'>;
  postIssueMessage: PickApiData<'/api/v1/tracker/issue/{id}/comments', 'post'>;
  postHelpdeskRequestMessage: PickApiData<
    '/api/v1/tracker/helpdesk/{id}/comments',
    'post'
  >;
};

export enum TagsApiTracker {
  ISSUE = 'TRACKER_ISSUE',
  HELPDESK = 'HELPDESK',
  MESSAGES_COUNT = 'MESSAGES_COUNT',
}
