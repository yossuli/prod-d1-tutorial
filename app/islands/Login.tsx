import { useState } from 'hono/jsx'

import { styles } from './Login-css'

const roleHandler = (isSignIn: boolean) => (isSignIn ? 'sign in' : 'log in ')
export default function Login() {
  const [isRoleSignIn, changeRole] = useState(true)
  // const formRef = useRef<HTMLFormElement | null>(null)
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
  // console.log(formRef.current?.clientHeight)
  return (
    <>
      <form
        class={styles.form(isRoleSignIn)}
        method='POST'
        // ref={formRef}
      >
        {isRoleSignIn && (
          <>
            <label for='name' class={styles.input}>
              name
            </label>
            <input
              class={styles.input}
              type='text'
              name='name'
              autocomplete='nickname'
            />
          </>
        )}
        <label for='accountId' class={styles.input}>
          accountId
        </label>
        <input
          class={styles.input}
          type='text'
          name='accountId'
          autocomplete='username'
        />
        <label for='password' class={styles.input}>
          password
        </label>
        <input
          class={styles.input}
          type='password'
          name='password'
          autocomplete='off'
        />
        <button type='submit' class={styles.button} onClick={submit}>
          {roleHandler(isRoleSignIn)}
        </button>
        <button
          type='button'
          onClick={clickChangeRoleButton}
          class={styles.button}
        >
          change to {roleHandler(!isRoleSignIn)}
        </button>
      </form>
    </>
  )
}
