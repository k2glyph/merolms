import React from "react"
import { uploadedImageURL } from "@meroedu/services"
import { useMeroedu } from "@meroedu/hooks"
import { Tenant } from "@meroedu/models"

type Size = 24 | 50 | 100 | 200

interface TenantLogoProps {
  size: Size
  useMeroeduIfEmpty?: boolean
}

export const TenantLogoURL = (tenant: Tenant, size: Size): string | undefined => {
  if (tenant && tenant.logoBlobKey) {
    return uploadedImageURL(tenant.logoBlobKey, size)
  }
  return undefined
}

export const TenantLogo = (props: TenantLogoProps) => {
  const meroedu = useMeroedu()

  const tenant = meroedu.session.tenant
  if (tenant && tenant.logoBlobKey) {
    return <img src={TenantLogoURL(meroedu.session.tenant, props.size)} alt={tenant.name} />
  } else if (props.useMeroeduIfEmpty) {
    return <img src="https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png" alt="Meroedu" />
  }
  return null
}

TenantLogo.defaultProps = {
  useMeroeduIfEmpty: false,
}

interface OAuthProviderLogoProps {
  option: {
    provider?: string
    displayName: string
    logoBlobKey?: string
  }
}

const systemProvidersLogo: { [key: string]: string } = {
  google: `data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiA/PjwhRE9DVFlQRSBzdmcgIFBVQkxJQyAnLS8vVzNDLy9EVEQgU1ZHIDEuMS8vRU4nICAnaHR0cDovL3d3dy53My5vcmcvR3JhcGhpY3MvU1ZHLzEuMS9EVEQvc3ZnMTEuZHRkJz48c3ZnIGVuYWJsZS1iYWNrZ3JvdW5kPSJuZXcgMCAwIDQwMCA0MDAiIGhlaWdodD0iNDAwcHgiIGlkPSJMYXllcl8xIiB2ZXJzaW9uPSIxLjEiIHZpZXdCb3g9IjAgMCA0MDAgNDAwIiB3aWR0aD0iNDAwcHgiIHhtbDpzcGFjZT0icHJlc2VydmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPjxnPjxwYXRoIGQ9Ik0xNDIuOSwyNC4yQzk3LjYsMzkuNyw1OSw3My42LDM3LjUsMTE2LjVjLTcuNSwxNC44LTEyLjksMzAuNS0xNi4yLDQ2LjhjLTguMiw0MC40LTIuNSw4My41LDE2LjEsMTIwLjMgICBjMTIuMSwyNCwyOS41LDQ1LjQsNTAuNSw2Mi4xYzE5LjksMTUuOCw0MywyNy42LDY3LjYsMzQuMWMzMSw4LjMsNjQsOC4xLDk1LjIsMWMyOC4yLTYuNSw1NC45LTIwLDc2LjItMzkuNiAgIGMyMi41LTIwLjcsMzguNi00Ny45LDQ3LjEtNzcuMmM5LjMtMzEuOSwxMC41LTY2LDQuNy05OC44Yy01OC4zLDAtMTE2LjcsMC0xNzUsMGMwLDI0LjIsMCw0OC40LDAsNzIuNmMzMy44LDAsNjcuNiwwLDEwMS40LDAgICBjLTMuOSwyMy4yLTE3LjcsNDQuNC0zNy4yLDU3LjVjLTEyLjMsOC4zLTI2LjQsMTMuNi00MSwxNi4yYy0xNC42LDIuNS0yOS44LDIuOC00NC40LTAuMWMtMTQuOS0zLTI5LTkuMi00MS40LTE3LjkgICBjLTE5LjgtMTMuOS0zNC45LTM0LjItNDIuNi01Ny4xYy03LjktMjMuMy04LTQ5LjIsMC03Mi40YzUuNi0xNi40LDE0LjgtMzEuNSwyNy00My45YzE1LTE1LjQsMzQuNS0yNi40LDU1LjYtMzAuOSAgIGMxOC0zLjgsMzctMy4xLDU0LjYsMi4yYzE1LDQuNSwyOC44LDEyLjgsNDAuMSwyMy42YzExLjQtMTEuNCwyMi44LTIyLjgsMzQuMi0zNC4yYzYtNi4xLDEyLjMtMTIsMTguMS0xOC4zICAgYy0xNy4zLTE2LTM3LjctMjguOS01OS45LTM3LjFDMjI4LjIsMTAuNiwxODMuMiwxMC4zLDE0Mi45LDI0LjJ6IiBmaWxsPSIjRkZGRkZGIi8+PGc+PHBhdGggZD0iTTE0Mi45LDI0LjJjNDAuMi0xMy45LDg1LjMtMTMuNiwxMjUuMywxLjFjMjIuMiw4LjIsNDIuNSwyMSw1OS45LDM3LjFjLTUuOCw2LjMtMTIuMSwxMi4yLTE4LjEsMTguMyAgICBjLTExLjQsMTEuNC0yMi44LDIyLjgtMzQuMiwzNC4yYy0xMS4zLTEwLjgtMjUuMS0xOS00MC4xLTIzLjZjLTE3LjYtNS4zLTM2LjYtNi4xLTU0LjYtMi4yYy0yMSw0LjUtNDAuNSwxNS41LTU1LjYsMzAuOSAgICBjLTEyLjIsMTIuMy0yMS40LDI3LjUtMjcsNDMuOWMtMjAuMy0xNS44LTQwLjYtMzEuNS02MS00Ny4zQzU5LDczLjYsOTcuNiwzOS43LDE0Mi45LDI0LjJ6IiBmaWxsPSIjRUE0MzM1Ii8+PC9nPjxnPjxwYXRoIGQ9Ik0yMS40LDE2My4yYzMuMy0xNi4yLDguNy0zMiwxNi4yLTQ2LjhjMjAuMywxNS44LDQwLjYsMzEuNSw2MSw0Ny4zYy04LDIzLjMtOCw0OS4yLDAsNzIuNCAgICBjLTIwLjMsMTUuOC00MC42LDMxLjYtNjAuOSw0Ny4zQzE4LjksMjQ2LjcsMTMuMiwyMDMuNiwyMS40LDE2My4yeiIgZmlsbD0iI0ZCQkMwNSIvPjwvZz48Zz48cGF0aCBkPSJNMjAzLjcsMTY1LjFjNTguMywwLDExNi43LDAsMTc1LDBjNS44LDMyLjcsNC41LDY2LjgtNC43LDk4LjhjLTguNSwyOS4zLTI0LjYsNTYuNS00Ny4xLDc3LjIgICAgYy0xOS43LTE1LjMtMzkuNC0zMC42LTU5LjEtNDUuOWMxOS41LTEzLjEsMzMuMy0zNC4zLDM3LjItNTcuNWMtMzMuOCwwLTY3LjYsMC0xMDEuNCwwQzIwMy43LDIxMy41LDIwMy43LDE4OS4zLDIwMy43LDE2NS4xeiIgZmlsbD0iIzQyODVGNCIvPjwvZz48Zz48cGF0aCBkPSJNMzcuNSwyODMuNWMyMC4zLTE1LjcsNDAuNi0zMS41LDYwLjktNDcuM2M3LjgsMjIuOSwyMi44LDQzLjIsNDIuNiw1Ny4xYzEyLjQsOC43LDI2LjYsMTQuOSw0MS40LDE3LjkgICAgYzE0LjYsMywyOS43LDIuNiw0NC40LDAuMWMxNC42LTIuNiwyOC43LTcuOSw0MS0xNi4yYzE5LjcsMTUuMywzOS40LDMwLjYsNTkuMSw0NS45Yy0yMS4zLDE5LjctNDgsMzMuMS03Ni4yLDM5LjYgICAgYy0zMS4yLDcuMS02NC4yLDcuMy05NS4yLTFjLTI0LjYtNi41LTQ3LjctMTguMi02Ny42LTM0LjFDNjcsMzI4LjksNDkuNiwzMDcuNSwzNy41LDI4My41eiIgZmlsbD0iIzM0QTg1MyIvPjwvZz48L2c+PC9zdmc+`,
  facebook: `data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiA/PjwhRE9DVFlQRSBzdmcgIFBVQkxJQyAnLS8vVzNDLy9EVEQgU1ZHIDEuMC8vRU4nICAnaHR0cDovL3d3dy53My5vcmcvVFIvMjAwMS9SRUMtU1ZHLTIwMDEwOTA0L0RURC9zdmcxMC5kdGQnPjxzdmcgZW5hYmxlLWJhY2tncm91bmQ9Im5ldyAwIDAgMzIgMzIiIGhlaWdodD0iMzJweCIgaWQ9IkxheWVyXzEiIHZlcnNpb249IjEuMCIgdmlld0JveD0iMCAwIDMyIDMyIiB3aWR0aD0iMzJweCIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+PGc+PHBhdGggZD0iTTMyLDMwYzAsMS4xMDQtMC44OTYsMi0yLDJIMmMtMS4xMDQsMC0yLTAuODk2LTItMlYyYzAtMS4xMDQsMC44OTYtMiwyLTJoMjhjMS4xMDQsMCwyLDAuODk2LDIsMlYzMHoiIGZpbGw9IiMzQjU5OTgiLz48cGF0aCBkPSJNMjIsMzJWMjBoNGwxLTVoLTV2LTJjMC0yLDEuMDAyLTMsMy0zaDJWNWMtMSwwLTIuMjQsMC00LDBjLTMuNjc1LDAtNiwyLjg4MS02LDd2M2gtNHY1aDR2MTJIMjJ6IiBmaWxsPSIjRkZGRkZGIiBpZD0iZiIvPjwvZz48Zy8+PGcvPjxnLz48Zy8+PGcvPjxnLz48L3N2Zz4=`,
  github:
    "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiA/PjwhRE9DVFlQRSBzdmcgIFBVQkxJQyAnLS8vVzNDLy9EVEQgU1ZHIDEuMC8vRU4nICAnaHR0cDovL3d3dy53My5vcmcvVFIvMjAwMS9SRUMtU1ZHLTIwMDEwOTA0L0RURC9zdmcxMC5kdGQnPjxzdmcgZW5hYmxlLWJhY2tncm91bmQ9Im5ldyAwIDAgMzIgMzIiIGhlaWdodD0iMzJweCIgaWQ9IkxheWVyXzEiIHZlcnNpb249IjEuMCIgdmlld0JveD0iMCAwIDMyIDMyIiB3aWR0aD0iMzJweCIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+PHBhdGggY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNMTYuMDAzLDBDNy4xNywwLDAuMDA4LDcuMTYyLDAuMDA4LDE1Ljk5NyAgYzAsNy4wNjcsNC41ODIsMTMuMDYzLDEwLjk0LDE1LjE3OWMwLjgsMC4xNDYsMS4wNTItMC4zMjgsMS4wNTItMC43NTJjMC0wLjM4LDAuMDA4LTEuNDQyLDAtMi43NzcgIGMtNC40NDksMC45NjctNS4zNzEtMi4xMDctNS4zNzEtMi4xMDdjLTAuNzI3LTEuODQ4LTEuNzc1LTIuMzQtMS43NzUtMi4zNGMtMS40NTItMC45OTIsMC4xMDktMC45NzMsMC4xMDktMC45NzMgIGMxLjYwNSwwLjExMywyLjQ1MSwxLjY0OSwyLjQ1MSwxLjY0OWMxLjQyNywyLjQ0MywzLjc0MywxLjczNyw0LjY1NCwxLjMyOWMwLjE0Ni0xLjAzNCwwLjU2LTEuNzM5LDEuMDE3LTIuMTM5ICBjLTMuNTUyLTAuNDA0LTcuMjg2LTEuNzc2LTcuMjg2LTcuOTA2YzAtMS43NDcsMC42MjMtMy4xNzQsMS42NDYtNC4yOTJDNy4yOCwxMC40NjQsNi43Myw4LjgzNyw3LjYwMiw2LjYzNCAgYzAsMCwxLjM0My0wLjQzLDQuMzk4LDEuNjQxYzEuMjc2LTAuMzU1LDIuNjQ1LTAuNTMyLDQuMDA1LTAuNTM4YzEuMzU5LDAuMDA2LDIuNzI3LDAuMTgzLDQuMDA1LDAuNTM4ICBjMy4wNTUtMi4wNyw0LjM5Ni0xLjY0MSw0LjM5Ni0xLjY0MWMwLjg3MiwyLjIwMywwLjMyMywzLjgzLDAuMTU5LDQuMjM0YzEuMDIzLDEuMTE4LDEuNjQ0LDIuNTQ1LDEuNjQ0LDQuMjkyICBjMCw2LjE0Ni0zLjc0LDcuNDk4LTcuMzA0LDcuODkzQzE5LjQ3OSwyMy41NDgsMjAsMjQuNTA4LDIwLDI2YzAsMiwwLDMuOTAyLDAsNC40MjhjMCwwLjQyOCwwLjI1OCwwLjkwMSwxLjA3LDAuNzQ2ICBDMjcuNDIyLDI5LjA1NSwzMiwyMy4wNjIsMzIsMTUuOTk3QzMyLDcuMTYyLDI0LjgzOCwwLDE2LjAwMywweiIgZmlsbD0iIzE4MTYxNiIgZmlsbC1ydWxlPSJldmVub2RkIi8+PGcvPjxnLz48Zy8+PGcvPjxnLz48Zy8+PC9zdmc+",
}

export const OAuthProviderLogoURL = (logoBlobKey?: string): string | undefined => {
  if (logoBlobKey) {
    return uploadedImageURL(logoBlobKey, 100)
  }
  return undefined
}

export const OAuthProviderLogo = (props: OAuthProviderLogoProps) => {
  if (props.option.logoBlobKey) {
    return <img src={OAuthProviderLogoURL(props.option.logoBlobKey)} alt={props.option.displayName} />
  }

  if (props.option.provider && props.option.provider in systemProvidersLogo) {
    return <img src={systemProvidersLogo[props.option.provider]} alt={props.option.displayName} />
  }

  return null
}