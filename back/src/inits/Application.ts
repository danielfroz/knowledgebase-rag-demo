import { KbController } from "@/controllers";
import { NotFoundMiddleware } from "@/middlewares";
import { Types } from "@/types";
import { Application, container } from "@danielfroz/sloth";
import { ExpressFramework } from "@danielfroz/sloth/express";

export const init = async () => {
  const log = container.resolve(Types.Log)
  const app = new Application({
    framework: new ExpressFramework(),
    log
  })

  /**
   * This code injects the Controllers & Middlewares to the DI for later initialization
   * Note that initialization only happens at .start() phase
   */
  app.Handlers.add(KbController)
  app.Handlers.add(NotFoundMiddleware)

  const port = 4000
  await app.start({
    port,
    callback: ({ hostname, port }: { hostname: string, port: number }) => {
      log.info({ msg: `starting application on ${hostname}:${port}` })
    }
  })
}