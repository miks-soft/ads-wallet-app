export type RequestsFinance = {
  getDocuments: PickApiData<'/api/v1/finance/documents', 'get'>;
  getTempLink: PickApiData<'/api/v1/finance/get-temp-link/{id}', 'get'>;
};
