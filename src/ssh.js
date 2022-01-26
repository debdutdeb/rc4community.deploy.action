const {NodeSSH} = require('node-ssh')
const core = require('@actions/core')
const fs = require('node:fs/promises')
const path = require('node:path')

module.exports = {
  sshConfig: {
    host: core.getInput('remote_host'),
    port: core.getInput('remote_host_port') || 22,
    username: core.getInput('remote_user') || 'root',
    privateKey: core.getInput('ssh_private_key')
  },

  source: core.getInput('source'),

  destination: (() => {
    const s = core.getInput('source')
    const d = core.getInput('destination')
    return d.endsWith('/') ? path.join(d, path.basename(s)) : d
  })(),

  ssh: new NodeSSH(),

  /* prettier-ignore */
  async connect() { await this.ssh.connect(this.sshConfig) },

  /* prettier-ignore */
  async verifySourceExists() { await fs.access(this.source) },

  async confirmRemoteLocExists() {
    if (
      (
        await this.ssh.execCommand(`mkdir -pv ${this.destinationDir}`, {
          cwd: this.sshConfig.username === 'root' ? '/root' : `/home/${this.sshConfig.username}`,
          // prettier-ignore
          ...{
            onStdout(c) { console.log(c.toString('utf-8')) },
            onStderr(c) { console.log(c.toString('utf-8')) }
          }
        })
      ).code
    )
      throw new Error('failed to  create destination directory on remote server')
  },

  async remoteExtract() {
    if (!(await this.ssh.exec('which', ['tar'], {stream: 'stdout'})).length)
      throw new Error(
        'no tar binary found on remote server; please make sure it is installed for the action to work'
      )

    if (
      (
        await this.ssh.execCommand(
          `tar zxvf ${this.destination} --strip-components=1 && ${
            core.getInput('keep_archive')
              ? `mv -v ${this.destination} ..`
              : `rm -v ${this.destination}`
          }`,
          {
            cwd: this.destinationDir,
            /* prettier-ignore */
            ...{
            onStdout(c) {console.log(c.toString('utf8'))},
            onStderr(c) {console.log(c.toString('utf8'))}
          }
          }
        )
      ).code !== 0
    )
      throw new Error('archive extract failed')
  },

  async run() {
    Object.defineProperty(this, 'destinationDir', {value: path.dirname(this.destination)})
    try {
      await this.ssh.connect(this.sshConfig)
      core.info('connected to remote host ..')

      core.debug(`source file: ${this.source}, destination: ${this.destination}`)
      // am i alright papa?
      await this.verifySourceExists()
      await this.confirmRemoteLocExists()

      await this.ssh.putFile(this.source, this.destination)
      core.info(`file ${path.basename(this.source)} sent successfully`)

      await this.remoteExtract()
      core.info('archive successfully extracted and deleted')
    } catch (e) {
      core.setFailed(e)
      process.abort()
    }

    this.ssh.dispose()
  }
}
