import { hc } from "hono/client";
import { css } from "hono/css";
import { HttpPUT } from "../routes";
import { SelectTodo, todoStatusEnum } from "../../db/schemas";
import { useState } from "hono/jsx";

const client = hc<HttpPUT>("/");

export default function Todo(props: { todo: SelectTodo }) {
  const [todo, setTodo] = useState(props.todo);
  const [isSelect, setIsSelect] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<
    SelectTodo["status"] | undefined
  >(undefined);
  return (
    <div
      class={css`
        display: flex;
        flex-direction: row;
      `}
      onClick={() => {
        setIsSelect(!isSelect);
        // const res = client.index.$put({ json: { ...todo } });
        // console.log(res);
      }}
    >
      <p>{todo.title}</p>
      {isSelect ? (
        <>
          {todoStatusEnum.map((v) => (
            <p
              onClick={(e) => {
                e.stopPropagation();
                setSelectedStatus(selectedStatus !== v ? v : undefined);
              }}
              class={css`
                background-color: ${selectedStatus === v ? "red" : "unset"};
              `}
            >
              {v}
            </p>
          ))}
          {selectedStatus !== undefined && (
            <p
              onClick={async () => {
                const res = await client.index.$put({
                  json: { ...todo, status: selectedStatus },
                });
                const json = await res.json();
                if ("body" in json) {
                  console.log(res);
                  setTodo({ ...todo, status: json.body.status });
                  setIsSelect(false);
                  setSelectedStatus(undefined);
                }
              }}
            >
              change
            </p>
          )}
        </>
      ) : (
        <p>{todo.status}</p>
      )}
    </div>
  );
}
