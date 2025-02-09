
// Require dependencies
const Helper = require('helper');

/**
 * Build socket helper class
 */
class SocketHelper extends Helper {
  /**
   * Construct socket helper class
   */
  constructor() {
    // Run super
    super();

    // Bind methods
    this.room = this.room.bind(this);
    this.user = this.user.bind(this);
    this.emit = this.emit.bind(this);
    this.session = this.session.bind(this);
  }

  /**
   * Emits to room
   *
   * @param  {String}  name
   * @param  {String}  type
   * @param  {*}       args
   */
  room(name, type, ...args) {
    // Emit to socket
    this.eden.emit('socket.room', {
      room : name,
      type,
      args,
    }, true);
  }

  /**
   * Emits to user
   *
   * @param  {user}    User
   * @param  {String}  type
   * @param  {*}       data
   */
  user(user, type, ...args) {
    // Emit to socket
    this.eden.emit('socket.user', {
      to   : (user ? user.get('_id').toString() : true),
      type,
      args,
    }, true);
  }

  /**
   * Emit information
   *
   * @param  {String}  type
   * @param  {*}       data
   * @param  {user}    User
   */
  emit(type, ...args) {
    // Emit to socket
    this.eden.emit('socket.emit', {
      type,
      args,
    }, true);
  }

  /**
   * Emit by session id
   *
   * @param {String} session
   * @param {String} type
   * @param {Object} data
   */
  session(session, type, ...args) {
    // Emit to socket
    this.eden.emit('socket.session', {
      args,
      type,
      session,
    }, true);
  }
}

/**
 * Export socket helper
 *
 * @type {SocketHelper}
 */
exports = module.exports = new SocketHelper();
