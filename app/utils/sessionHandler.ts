import type { userUseCase } from '../useCase/userUseCase'

export const sessionHandler = async (
  sessionId: string | undefined,
  userDB: userUseCase,
) => {
  if (sessionId === undefined) {
    return undefined
  }
  return await userDB.fetchUser(sessionId)
}
