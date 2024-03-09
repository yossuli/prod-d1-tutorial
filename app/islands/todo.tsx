import { hc } from "hono/client";
import { css } from "hono/css";
import { AppType } from "../routes";
import { SelectTodo, todoStatusEnum } from "../../db/schemas";
import { useState } from "hono/jsx";

const client = hc<AppType>("/");

export default function Todo(props: { todo: SelectTodo }) {
  const [todo, setTodo] = useState(props.todo);
  const [isSelect, setIsSelect] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<
    SelectTodo["status"] | undefined
  >(undefined);
  const [a, b] = useState<string | undefined>(undefined);
  return (
    <div
      class={css`
        display: flex;
        flex-direction: row;
      `}
    >
      {a === undefined ? (
        <div
          onClick={() => {
            b(todo.title);
          }}
        >
          {todo.title}
        </div>
      ) : (
        <>
          <input
            value={a}
            onChange={(e) => {
              b((e.target as HTMLInputElement).value);
            }}
          ></input>
          <button
            onClick={async () => {
              const res = await client.index.$put({
                json: { ...todo, title: a },
              });
              const json = await res.json();
              if ("body" in json) {
                setTodo({ ...todo, title: json.body.title });
                b(undefined);
              }
            }}
          >
            save
          </button>
          <button
            onClick={() => {
              b(undefined);
            }}
          >
            cancel
          </button>
        </>
      )}
      {isSelect ? (
        <>
          {todoStatusEnum.map((v) => (
            <div
              onClick={(e) => {
                e.stopPropagation();
                setSelectedStatus(selectedStatus !== v ? v : undefined);
              }}
              class={css`
                background-color: ${selectedStatus === v ? "red" : "unset"};
              `}
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
  );
}
