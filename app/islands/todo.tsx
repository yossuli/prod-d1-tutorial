import { hc } from "hono/client";
import { css } from "hono/css";
import { AppType } from "../routes";
import { SelectTodo, todoStatusEnum } from "../../db/schemas";
import { useState } from "hono/jsx";
import { styles } from "./todo-css";

const client = hc<AppType>("/");

export default function Todo(props: { todo: SelectTodo }) {
  const [todo, setTodo] = useState(props.todo);
  const [isSelect, setIsSelect] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<
    SelectTodo["status"] | undefined
  >(undefined);
  const [editedTitle, setEditedTitle] = useState<string | undefined>(undefined);
  return (
    <div class={styles.base}>
      {editedTitle === undefined ? (
        <div
          onClick={() => {
            setEditedTitle(todo.title);
          }}
        >
          <b>{todo.title}</b>
        </div>
      ) : (
        <div class={styles.editTitle}>
          <input
            value={editedTitle}
            onChange={(e) => {
              setEditedTitle((e.target as HTMLInputElement).value);
            }}
            class={styles.editTitleInput}
          ></input>
          <button
            onClick={async () => {
              const res = await client.index.$put({
                json: { ...todo, title: editedTitle },
              });
              const json = await res.json();
              if ("body" in json) {
                setTodo({ ...todo, title: json.body.title });
                setEditedTitle(undefined);
              }
            }}
          >
            save
          </button>
          <button
            onClick={() => {
              setTimeout(() => setEditedTitle(undefined));
            }}
          >
            cancel
          </button>
        </div>
      )}
      <div class={styles.todoStatus}>
        {isSelect ? (
          <>
            {todoStatusEnum.map((v) => (
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedStatus(selectedStatus !== v ? v : undefined);
                }}
                class={styles.listedStatus(selectedStatus, v)}
              >
                {v}
              </div>
            ))}
            {selectedStatus !== undefined && (
              <div
                onClick={async () => {
                  const res = await client.index
                    .$put({
                      json: { ...todo, status: selectedStatus },
                    })
                    .then((v) => v.json());
                  if ("body" in res) {
                    setTodo({ ...todo, status: res.body.status });
                    setIsSelect(false);
                    setSelectedStatus(undefined);
                  }
                }}
              >
                change
              </div>
            )}
            <div
              onClick={async () => {
                const res = await client.index
                  .$delete({ json: { ...todo } })
                  .then((v) => v.json());
                if ("body" in res) {
                }
              }}
            >
              delete
            </div>
          </>
        ) : (
          <div
            onClick={() => {
              setIsSelect(!isSelect);
            }}
          >
            {todo.status}
          </div>
        )}
      </div>
    </div>
  );
}
