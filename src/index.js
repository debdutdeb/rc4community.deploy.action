const main = async () => {
  await (new (require('./ssh'))()).run()
}

main()
