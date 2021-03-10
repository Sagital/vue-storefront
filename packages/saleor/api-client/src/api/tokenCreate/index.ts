import defaultMutation from './defaultMutation';
import {CreateToken} from '../../';

const tokenCreate = async (context, email: string, password: string): Promise<CreateToken> => {
  const response = await context.client.mutate({
    mutation: defaultMutation,
    variables: { email, password },
    fetchPolicy: 'no-cache'
  });

  return response.data.tokenCreate;
};

export default tokenCreate;
