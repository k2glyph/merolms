import { World as CucumberWorld } from "@cucumber/cucumber"
import { Page } from "playwright"

export interface MeroeduWorld extends CucumberWorld {
  tenantName: string
  page: Page
  log: (msg: string) => void
}
