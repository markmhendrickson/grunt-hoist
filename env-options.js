/**
 * Options found as process.env.HOIST_*
 * @module
 */
module.exports = {
  destDir: process.env.HOIST_DEST_DIR,
  destHost: process.env.HOIST_DEST_HOST,
  destUser: process.env.HOIST_DEST_USER,
  systemdService: process.env.HOIST_SYSTEMD_SERVICE
};