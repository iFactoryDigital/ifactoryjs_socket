
// Require dependencies
const io   = require('socket.io-client');
const uuid = require('uuid');

// Require local dependencies
const store = require('default/public/js/store');

/**
 * Build socket class
 */
class SocketStore {
  /**
   * Construct socket class
   */
  constructor() {
    // Set variables
    this.__userID = store.get('user') && store.get('user').get ? store.get('user').get('id') : (store.get('user') || {}).id;

    // Bind private methods
    this.onUser = this.onUser.bind(this);

    // Run socket
    this.socket = io.connect(store.get('config').socket.url, store.get('config').socket.params);

    // socket on
    this.socket.on('connect', () => {
      // true
      this.connected = true;
    }).on('disconnect', () => {
      // false
      this.connected = false;
    });

    // Bind methods
    this.on = this.socket.on.bind(this.socket);
    this.off = this.socket.off.bind(this.socket);
    this.emit = this.socket.emit.bind(this.socket);
    this.once = this.socket.once.bind(this.socket);

    // Listen to route
    this.on('user', this.onUser);

    // Store on user
    store.on('user', this.onUser);
  }

  /**
   * Calls name and data
   *
   * @param  {String} name
   * @params {*} args
   *
   * @return {Promise}
   */
  async call(name, ...args) {
    // Let id
    const id = uuid();

    // Create emission
    const emission = {
      id,
      args,
      name,
    };

    // Emit to socket
    this.emit('eden.call', emission);

    // Await one response
    const result = await new Promise((resolve) => {
      // On message
      this.once(id, resolve);
    });

    // Return result
    return result;
  }

  /**
   * Listen to state change
   *
   * @param {Object} user
   *
   * @return {*}
   */
  onUser(user) {
    // check user id
    if ((!user && this.__userID) || (user.get ? user.get('id') : user.id) !== this.__userID) {
      // set user id
      this.__userID = user ? (user.get ? user.get('id') : user.id) : null;

      // reset connection
      return this.socket.disconnect() && this.socket.connect();
    }
  }
}

/**
 * Export built socket class
 *
 * @type {SocketStore}
 */
exports = module.exports = window.eden.socket = new SocketStore();
