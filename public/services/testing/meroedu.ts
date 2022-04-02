import { Meroedu } from "@meroedu/services"
import { MeroeduImpl } from "../meroedu"

export const meroeduMock = {
  notAuthenticated: (): MeroeduImpl => {
    return Meroedu.initialize({
      settings: {
        environment: "development",
        oauth: [],
      },
      tenant: {},
      user: undefined,
    })
  },
  authenticated: (): MeroeduImpl => {
    return Meroedu.initialize({
      settings: {
        environment: "development",
        oauth: [],
      },
      tenant: {},
      user: {
        name: "Jon Snow",
      },
    })
  },
}
