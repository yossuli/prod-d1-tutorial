import { css } from 'hono/css'
import { useState } from 'hono/jsx'

const roleHandler = (isSignIn: boolean) => (isSignIn ? 'sign in' : 'log in ')
export default function Login() {
  const [isSignIn, changeRole] = useState(true)
  const submit = (e: Event) => {
    const inputs = Array.from(document.getElementsByTagName('input'))
    const isInBlankElm = inputs
      .filter(e => e.type !== 'submit' && (e.name !== 'name' || !isSignIn))
      .some(e => e.value !== '')
    if (isInBlankElm) {
      alert('please input all element')
      e.preventDefault()
    }
  }
  return (
    <>
      <form
        class={css`
        display: grid;
        grid-template-columns: repeat(2, auto);
      `}
        method='POST'
      >
        {isSignIn && (
          <>
            <label for='name'>name</label>
            <input type='text' name='name' />
          </>
        )}
        <label for='accountId'>accountId</label>
        <input type='text' name='accountId' />
        <label for='password'>password</label>
        <input type='password' name='password' />
        <input
          type='submit'
          class={css`
          grid-column: 1/3;
          width: fit-content;
          margin: auto;
        `}
          onClick={submit}
        />
      </form>
      <button onClick={() => changeRole(!isSignIn)}>
        {roleHandler(!isSignIn)}
      </button>
    </>
  )
}
