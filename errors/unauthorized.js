export default class UnauthorizedError extends Error {
  status;
  constructor(message) {
    super(message);
    this.status = 401;
  }
}
