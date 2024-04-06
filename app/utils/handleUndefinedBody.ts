import type { Res } from '../routes/types'

export const handleUndefinedBody = <T>(
  res: Res<T | undefined>,
): Res<T, [400, 500]> => {
  if (res.status === 200) {
    if (res.body === undefined) {
      const notFound: { status: 400; body: string } = {
        status: 400,
        body: 'No user found for your req',
      }
      return notFound
    }
    return { ...res, body: res.body }
  }
  return res
}
