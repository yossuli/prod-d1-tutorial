import { css } from 'hono/css'

import type { SelectTodo } from '../../db/schemas'

export const styles = {
  base: css`
    display: grid;
    grid-template-columns: repeat(2, auto);
    gap: 1rem;
  `,
  editTitle: css`
    display: grid;
    grid-template-columns: repeat(2, 1fr);
  `,
  editTitleInput: css`
    grid-column: 1/3;
  `,
  todoStatus: css`
    display: flex;
    flex-direction: row;
    & > * {
      margin: 0 0.2rem;
    }
  `,
  listedStatus: (
    selectedStatus: SelectTodo['status'] | undefined,
    v: SelectTodo['status'] | undefined,
  ) => css`
    background-color: ${selectedStatus === v ? 'red' : 'unset'};
  `,
}
