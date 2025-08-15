import * as Inits from './inits'

const bootstrap = async () => {
  try {
    await Inits.Log.init()
    await Inits.Config.init()
    await Inits.Repos.init()
    await Inits.Application.init()
  }
  catch (err) {
    console.log(`failed to initialize service: ${err}`)
  }
}

bootstrap()