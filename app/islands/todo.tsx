import { hc } from 'hono/client'
import { useState } from 'hono/jsx'
import type { SelectTodo } from '../../db/schemas'
import { todoStatusEnum } from '../../db/schemas'
import type { AppType } from '../routes'
import { styles } from './todo-css'

const client = hc<AppType>('/')

export default function Todo(props: { todo: SelectTodo }) {
  const [todo, setTodo] = useState(props.todo)
  const [isSelect, setIsSelect] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState<
    SelectTodo['status'] | undefined
  >(undefined)
  const [editedTitle, setEditedTitle] = useState<string | undefined>(undefined)
  const changeTitleEditMode = () => {
    setEditedTitle(todo.title)
  }

  const saveTitle = async (editedTitle: string) => {
    const res = await client.index.$put({
      json: { ...todo, title: editedTitle },
    })

    const json = await res.json()
    if (json.status === 200) {
      setTodo({ ...todo, title: json.body.title })
      setEditedTitle(undefined)
    }
  }

  const cancelTitleChange = () => {
    setTimeout(() => setEditedTitle(undefined))
  }

  const selectStatus = (e: Event, v: SelectTodo['status'] | undefined) => {
    e.stopPropagation()
    setSelectedStatus(selectedStatus !== v ? v : undefined)
  }

  const changeStatus = async (selectedStatus: SelectTodo['status']) => {
    const res = await client.index
      .$put({
        json: { ...todo, status: selectedStatus },
      })
      .then(v => v.json())

    if (res.status === 200) {
      setTodo({ ...todo, status: res.body.status })
      setIsSelect(false)
      setSelectedStatus(undefined)
    }
  }

  const deleteTodo = async () => {
    const res = await client.index
      .$delete({ json: { ...todo } })
      .then(v => v.json())
    if ('body' in res) {
    }
  }

  const changeStatusEditMode = () => {
    setIsSelect(!isSelect)
  }
  return (
    <div class={styles.base}>
      {editedTitle === undefined ? (
        <div onClick={changeTitleEditMode} onKeyDown={changeTitleEditMode}>
          <b>{todo.title}</b>
        </div>
      ) : (
        <div class={styles.editTitle}>
          <input
            value={editedTitle}
            onChange={e => {
              setEditedTitle((e.target as HTMLInputElement).value)
            }}
            class={styles.editTitleInput}
          />
          <button
            onClick={() => saveTitle(editedTitle)}
            onKeyDown={() => saveTitle(editedTitle)}
          >
            save
          </button>
          <button onClick={cancelTitleChange} onKeyDown={cancelTitleChange}>
            cancel
          </button>
        </div>
      )}
      <div class={styles.todoStatus}>
        {isSelect ? (
          <>
            {todoStatusEnum.map(v => (
              <div
                onClick={e => selectStatus(e, v)}
                onKeyDown={e => selectStatus(e, v)}
                class={styles.listedStatus(selectedStatus, v)}
              >
                {v}
              </div>
            ))}
            {selectedStatus !== undefined && (
              <div
                onClick={() => changeStatus(selectedStatus)}
                onKeyDown={() => changeStatus(selectedStatus)}
              >
                change
              </div>
            )}
            <div onClick={deleteTodo} onKeyDown={deleteTodo}>
              delete
            </div>
          </>
        ) : (
          <div onClick={changeStatusEditMode} onKeyDown={changeStatusEditMode}>
            {todo.status}
          </div>
        )}
      </div>
    </div>
  )
}
