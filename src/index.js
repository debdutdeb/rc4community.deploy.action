import {sshClient} from './ssh'

const main = async () => {
  await sshClient.run()
}

main()
