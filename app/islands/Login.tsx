import { css } from 'hono/css'
import { useRef, useState } from 'hono/jsx'

const roleHandler = (isSignIn: boolean) => (isSignIn ? 'sign in' : 'log in ')
export default function Login() {
  const [isRoleSignIn, changeRole] = useState(true)
  const formRef = useRef<HTMLFormElement | null>(null)
  const submit = (e: Event) => {
    const inputs = Array.from(document.getElementsByTagName('input'))
    console.log(inputs)
    const isInBlankElm = inputs
      .filter(e => e.name !== 'name' || isRoleSignIn)
      .some(e => e.value === '')
    if (isInBlankElm) {
      alert('please input all element')
      e.preventDefault()
    }
  }
  const clickChangeRoleButton = (e: Event) => {
    changeRole(c => !c)
    e.preventDefault()
  }
  console.log(formRef.current?.clientHeight)
  return (
    <>
      <form
        class={css`
        display: grid;
        grid-template-columns: repeat(2, "fit-content");
        height: ${
          formRef !== null
            ? `${formRef.current?.clientHeight}px`
            : 'fit-content'
        };
        max-width: 480px;
        gap: 0.5rem;
        /* background-color: red; */
      `}
        method='POST'
        ref={formRef}
      >
        {isRoleSignIn && (
          <>
            <label for='name'>name</label>
            <input type='text' name='name' autocomplete='nickname' />
          </>
        )}
        <label for='accountId'>accountId</label>
        <input type='text' name='accountId' autocomplete='username' />
        <label for='password'>password</label>
        <input type='password' name='password' autocomplete='off' />
        <button
          type='submit'
          class={css`
          grid-column: 1/3;
          width: fit-content;
          margin: auto;
        `}
          onClick={submit}
        >
          {roleHandler(isRoleSignIn)}
        </button>
        <button
          type='button'
          onClick={clickChangeRoleButton}
          class={css`
          grid-column: 1/3;
          width: fit-content;
          margin: auto;
        `}
        >
          change to {roleHandler(!isRoleSignIn)}
        </button>
      </form>
    </>
  )
}
