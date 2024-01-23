module.exports = ({ app, express }) => {
  express.appConfig = async () => {

    app.use(express.static(`${process.cwd()}/views`))

    app.use(express.json({ limit: '50mb' }))

    app.use(express.urlencoded({ extended: false, limit: '50mb' }))

  }
}
