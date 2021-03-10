const tokenRemove = async ({ config }): Promise<void> => {
  if (config.auth.onTokenRemove) {
    config.auth.onTokenRemove();
  }
};

export default tokenRemove;
