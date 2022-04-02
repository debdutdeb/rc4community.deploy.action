const {NodeSSH} = require('node-ssh')
const core = require('@actions/core')
const fs = require('node:fs/promises')
const {F_OK} = require('node:fs').constants
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
    const d = core.getInput('destination')
    /**
     * if path is a directory, append source file name
     * else return d
     * putFile needs absolute path of the destination, including the filename, thus this sadness
     */
    return d.endsWith('/') ? path.join(d, path.basename(core.getInput('source'))) : d
  })(),

  ssh: new NodeSSH(),

  /* prettier-ignore */
  async verifySourceExists() { await fs.access(this.source, F_OK) },

  async exec(cmd, execOptions) {
    execOptions = {
      /* prettier-ignore */
      onStdout(c) { console.log(c.toString('utf-8')) },
      /* prettier-ignore */
      onStderr(c) { console.log(c.toString('utf-8')) },
      cwd: this.destinationDir,
      ...execOptions
    }
    const {code} = await this.ssh.execCommand(cmd, execOptions)
    return code
  },

  async confirmRemoteLocExists() {
    let cwd = null
    if (!this.destinationDir.startsWith('/'))
      cwd = this.sshConfig.username === 'root' ? '/root' : `/home/${this.sshConfig.username}`

    if (await this.exec(`mkdir -pv ${this.destinationDir}`, {cwd}))
      throw new Error('failed to  create destination directory on remote server')
  },

  async remoteExtract() {
    if (!await this.ssh.exec('which', ['tar'], {stream: 'stdout'}))
      throw new Error(
        'no tar binary found on remote server; please make sure it is installed for the action to work'
      )

    const extractCommand = `tar zxvf ${this.destination}`

    const keepArchive = core.getInput('keep_archive')
      ? `mv -v ${this.destination} ${this.destination}-${new Date().toString()}`
      : `rm -vf ${this.destination}`

    if (await this.exec(`${extractCommand} && ${keepArchive}`))
      throw new Error('archive extract failed')
  },

  async startService() {
    const installPossibleNewDeps = 'npm install --production'
    const startPm2ServiceThingy = 'pm2 reload ecosystem.config.js'
    if (await this.exec(`${installPossibleNewDeps} && ${startPm2ServiceThingy}`))
      throw new Error('deployment failed')
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

      await this.startService()
      core.info('successfully deployed')
    } catch (e) {
      core.setFailed(e)
      process.abort()
    }

    this.ssh.dispose()
  }
}
