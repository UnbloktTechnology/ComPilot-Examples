import { updateRowValuesBatchBody } from './dataset-bodies';

export const API_CALLS = [
  {
    id: 'get-datasets',
    name: 'Get Datasets List',
    method: 'GET',
    endpoint: '/datasets',
    description: 'Liste tous les datasets',
    hasBody: false,
    bodyTemplate: '',
    isStub: false
  },
  {
    id: 'get-dataset-details',
    name: 'Get Dataset Details',
    method: 'GET',
    endpoint: '/datasets/{datasetId}',
    description: "Détails d'un dataset (champs custom)",
    hasBody: false,
    bodyTemplate: '',
    isStub: false
  },
  {
    id: 'get-dataset-rows',
    name: 'Get Dataset Rows',
    method: 'GET',
    endpoint: '/datasets/{datasetId}/row-entities',
    description: "Liste les lignes d'un dataset",
    hasBody: false,
    bodyTemplate: '',
    isStub: false
  },
  {
    id: 'get-row-details',
    name: 'Get Row Details',
    method: 'GET',
    endpoint: '/datasets/{datasetId}/rows/{datasetRowId}',
    description: "Valeurs d'une ligne",
    hasBody: false,
    bodyTemplate: '',
    isStub: false
  },

  {
    id: 'update-row-values-batch',
    name: 'Update Row Values Batch',
    method: 'PUT',
    endpoint: '/datasets/{datasetId}/rows/{datasetRowId}/values/batch',
    description: "Update/insert/delete valeurs d'une ligne",
    hasBody: true,
    bodyTemplate: updateRowValuesBatchBody,
    isStub: false
  }
];

export type ApiCall = typeof API_CALLS[number]; 