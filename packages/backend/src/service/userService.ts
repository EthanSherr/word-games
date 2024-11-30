export const makeUserService = (userStore: UserStoreAdapter) => {
  return {
    ...userStore,
  }
}

export type UserStoreAdapter = {
  setReceiveDailyNotification: (email: string, value: boolean) => Promise<void>
  getAllNotifiableUsers: () => Promise<Array<{ email: string }>>
}
