import mutation from './defaultMutation';
import { PasswordChange } from '../../';

const passwordChange = async (
  { client },
  version: any,
  oldPassword: string,
  newPassword: string
): Promise<PasswordChange> => {
  const response = await client.mutate({
    mutation: mutation,
    variables: {
      oldPassword,
      newPassword
    },
    fetchPolicy: 'no-cache'
  });

  return response.data.passwordChange;
};

export default passwordChange;
