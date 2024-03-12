export type Res<T> =
  | {
      status: 200;
      body: T;
    }
  | {
      status: 500;
    };
