export type RequestsObservers = {
  postObserver: PickApiData<'/api/v1/advertservice/observers', 'post'>;
  attachObserverClient: PickApiData<
    '/api/v1/advertservice/observers/attach',
    'post'
  >;
  detachObserverClient: PickApiData<
    '/api/v1/advertservice/observers/detach',
    'post'
  >;
  deleteObserver: PickApiData<'/api/v1/advertservice/observers/delete', 'post'>;
  getObservers: PickApiData<'/api/v1/advertservice/observers', 'get'>;
};

export enum TagsApiObservers {
  OBSERVERS = 'OBSERVERS',
}
