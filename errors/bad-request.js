export default class BadRequest extends Error {
  status;
  constructor(message) {
    super(message);
    this.status = 400;
  }
}
