import * as stylex from "@stylexjs/stylex"
import { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"
import { Unsubscription } from "../components/Unsubscription"
import { trpc } from "../connection/TrpcQueryContextProvider"

export const CancelNotifications = () => {
  const { mutate, isSuccess, isPending, error } =
    trpc.notifyUserDaily.useMutation()

  const [searchParams] = useSearchParams()
  const email = searchParams.get("email")
  const [unsubscribeClick, setUnsubscribeClick] = useState(false)
  const unsubscribe = () => {
    console.log("UNSUBSCRIPTION PLEASE")
    setUnsubscribeClick(true)
  }
  const cancel = () => {
    console.log("cancel: do nothing")
  }

  useEffect(() => {
    if (!email) return
    mutate({ email: email, notify: false })
  }, [mutate, email])

  // if (email) {
  //   return <Unsubscription unsubscribe={unsubscribe} cancel={cancel} />
  // }

  if (isSuccess) {
    return <div {...stylex.props(styles.base)}>You have been unsubscribed!</div>
  }
  if (error) {
    console.error(error)
    return <div {...stylex.props(styles.base)}>Something went wrong</div>
  }

  if (isPending) {
    return <div {...stylex.props(styles.base)}>Pending...</div>
  }

  return <div {...stylex.props(styles.base)}>Unknown user</div>
}

const styles = stylex.create({
  base: {
    width: "100%",
    minHeight: "10rem",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    "@media (max-width: 480px)": {
      fontSize: "1rem",
    },
    "@media (min-width: 481px) and (max-width: 834px)": {
      fontSize: "1.25rem",
    },
    "@media (min-width: 835px) ": {
      fontSize: "1.5rem",
    },
  },
})
