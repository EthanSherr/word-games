import { useEffect } from "react"
import { trpc } from "../connection/TrpcQueryContextProvider"
import { useSearchParams } from "react-router-dom"

export const CancelNotifications = () => {
  const { error, isSuccess, mutate } = trpc.notifyUserDaily.useMutation()

  useEffect(() => {
    mutate({ email: "", notify: false })
  }, [mutate])
  return <div>cancellin</div>
}
