import mutation from './defaultMutation';
import { AccountRegister } from '../..';
import { IntegrationContext } from '@vue-storefront/core';

const accountRegister = async (
  context: IntegrationContext,
  email: string,
  password: string
): Promise<AccountRegister> => {
  const variables = {
    input: { email, password }
  };

  const response = await context.client.mutate({
    mutation: mutation,
    variables,
    fetchPolicy: 'no-cache'
  });

  return response.data.accountRegister;
};

export default accountRegister;
