const formatTime = () => new Date().toISOString();

const logger = {
  info: (msg, meta = {}) => {
    console.log(`[${formatTime()}] [INFO] ${msg}`, Object.keys(meta).length ? meta : '');
  },
  warn: (msg, meta = {}) => {
    console.warn(`[${formatTime()}] [WARN] ${msg}`, Object.keys(meta).length ? meta : '');
  },
  error: (msg, meta = {}) => {
    console.error(`[${formatTime()}] [ERROR] ${msg}`, Object.keys(meta).length ? meta : '');
  },
  debug: (msg, meta = {}) => {
    if (process.env.NODE_ENV !== 'production') {
      console.debug(`[${formatTime()}] [DEBUG] ${msg}`, Object.keys(meta).length ? meta : '');
    }
  }
};

module.exports = logger;
