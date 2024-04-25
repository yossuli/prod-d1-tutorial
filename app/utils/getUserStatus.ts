import type { InsertUser } from '../../db/schemas'
import type { Res } from '../routes/types'

export const getUserStatus = (user: Res<InsertUser, [number]> | undefined) =>
  user ? 'logout' : 'login'
