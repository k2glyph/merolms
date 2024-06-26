import { http, Result } from "@meroedu/services"

export const getTotalUnreadNotifications = async (): Promise<Result<number>> => {
  return {
    ok: true,
    error: undefined,
    data: 0,
  }
  // return http.get<{ total: number }>("/_api/notifications/unread/total").then((result) => {
  //   return {
  //     ok: result.ok,
  //     error: result.error,
  //     data: result.data ? result.data.total : 0,
  //   }
  // })
}

export const markAllAsRead = async (): Promise<Result> => {
  return await http.post("/_api/notifications/read-all")
}
