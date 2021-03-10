const isGuest = (context) => {
  const { config } = context;

  const jwtToken = config.auth.onTokenRead();
  return !jwtToken;
};

export default isGuest;
