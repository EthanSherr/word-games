import { useEffect } from "react"
import { trpc } from "../connection/TrpcQueryContextProvider"
import { useSearchParams } from "react-router-dom"

export const CancelNotifications = () => {
  const { mutate, isSuccess, isPending, error } =
    trpc.notifyUserDaily.useMutation()

  const [searchParams] = useSearchParams()
  const email = searchParams.get("email")

  useEffect(() => {
    if (!email) return
    mutate({ email: email, notify: false })
  }, [mutate, email])

  if (isSuccess) {
    return <div>You have been unsubscribed!</div>
  }
  if (error) {
    console.error(error)
    return <div>Something went wrong</div>
  }

  if (isPending) {
    return <div>Pending...</div>
  }

  return <div>Unknown user</div>
}
