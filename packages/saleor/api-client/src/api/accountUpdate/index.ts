import mutation from './defaultMutation';
import { AccountInput, AccountUpdate } from '../..';

const accountRegister = async (
  context,
  input: AccountInput
): Promise<AccountUpdate> => {
  const variables = {
    input: input
  };

  const response = await context.client.mutate({
    mutation: mutation,
    variables,
    fetchPolicy: 'no-cache'
  });

  return response.data.accountUpdate;
};

export default accountRegister;
