export const TokenAndRoleVerification = async (req, res, next) => {
  // const token = req.user;
  const { id, role } = req.query;
  if (!id || !role) {
    return res.status(400).json({ error: 'Bad Request - ID or Role missing in query parameters' });
  }
  //once verifiied add user role and details to payload and forward
  req.user = { ROLE: role, ID: BigInt(id) };
  next();
};
