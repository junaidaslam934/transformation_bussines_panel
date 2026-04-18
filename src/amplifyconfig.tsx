// src/amplifyConfig.ts
import { Amplify } from 'aws-amplify';
import { confirmResetPassword, resetPassword, signOut } from 'aws-amplify/auth';

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: process.env.NEXT_PUBLIC_USER_POOL_ID!,
      userPoolClientId: process.env.NEXT_PUBLIC_USER_POOL_CLIENT_ID!,
    },
  },
});

console.log('Amplify configured with environment variables!');
 