const {NodeSSH} = require('node-ssh')
const core = require('@actions/core')
const fs = require('node:fs/promises')
const path = require('node:path')

const sshClient = {
  sshConfig: {
    host: core.getInput('remote_host'),
    port: core.getInput('remote_host_port') || 22,
    username: core.getInput('remote_user') || 'root',
    privateKey: core.getInput('ssh_private_key')
  },

  async verifySourceLoc(source) {
    try {
      await fs.access(source)
    } catch (e) {
      core.setFailed(`source file not found; ${e.message}`)
    }
  },

  async verifyRemoteFsLoc(remoteLoc) {
    // prettier-ignore
    if (!this.ssh.isConnected())
      await this.connect()

    const dirName = remoteLoc.endsWith('/')
      ? remoteLoc
      : path.basename(remoteLoc)
    try {
      /**
       * create the directory if it doesn't exist
       */
      await this.ssh.execCommand(`mkdir -pv ${dirName}`, {
        cwd:
          this.sshConfig.username === 'root'
            ? `/root`
            : `/home/${this.sshConfig.username}`,
        onStdout(chunk) {
          core.info(chunk.toString('utf-8'))
        },
        onStderr() {
          core.error(chunk.toString('utf8'))
        }
      })
    } catch (e) {
      core.setFailed(e.message)
    }
  },

  ssh: new NodeSSH(),

  async connect() {
    try {
      await this.ssh.connect(this.sshConfig)
    } catch (e) {
      core.setFailed(e.message)
    }
  },

  async sendFile(source, destination) {
    try {
      await this.ssh.putFile(source, destination, null)
    } catch (e) {
      core.setFailed(`failed to send archive; ${e.message}`)
    }
  },

  async run() {
    await this.connect()

    const source = core.getInput('source')
    await this.verifySourceLoc(source)

    const dest = core.getInput('destination')
    await this.verifyRemoteFsLoc(dest)

    await this.sendFile(source, dest)
  }
}

module.exports = {sshClient}
