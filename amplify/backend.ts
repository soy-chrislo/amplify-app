import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';

/**
 * @see https://docs.amplify.aws/react/build-a-backend/ to add storage, functions, and more
 */
defineBackend({
  auth,
  data,
});

// No entiendo, si userPool esta en authMode en resource, y si en list pongo userPool, se puede consultar desde / pero solo una vez logueado en /dashboard, osea, no es publico (No federated jwt), pero si cambio a authMode identityPool en list, se puede ver publico, pero no autenticado en / ("Not Authorized to access listPosts on type Query")