/* istanbul ignore file */
const restrictedOperations = {
  user: ['tokenCreate']
};

export const isUserOperation = (operationName) =>
  restrictedOperations.user.includes(operationName);
