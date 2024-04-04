import { css } from 'hono/css'

export const styles = {
  form: (isRoleSignIn: boolean) => css`
    display: grid;
    grid-template-columns: repeat(2, "fit-content");
    grid-template-rows: repeat(${isRoleSignIn ? 3 : 2}, 1fr) repeat(2, 45px);
    height: 270px;
    max-width: 480px;
    @media  (max-width: 600px)  {
      height: 180px;
      grid-template-rows: repeat(${isRoleSignIn ? 3 : 2}, 1fr) repeat(2, 45px);
    }
  `,
  input: css`
    height: 24px;
    margin: auto 0;
    @media  (max-width: 600px)  {
      height: 24px;
    }
  `,
  button: css`
    grid-column: 1/3;
    width: fit-content;
    margin: auto;
  `,
}
