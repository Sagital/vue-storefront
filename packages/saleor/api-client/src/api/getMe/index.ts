import defaultMutation from './defaultMutation';
import { User } from '../../';

const getMe = async (context): Promise<User> => {
  const jwtToken = context.config.auth.onTokenRead();

  const response = await context.client.mutate({
    mutation: defaultMutation,
    variables: { token: jwtToken },
    fetchPolicy: 'no-cache'
  });

  return response.data.tokenVerify.user;
};

export default getMe;
