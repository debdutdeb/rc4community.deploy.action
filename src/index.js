const main = async () => {
  await require('./ssh').sshClient.run()
}

main()
