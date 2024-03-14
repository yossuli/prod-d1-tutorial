export type Res<T, U extends number[] = [500]> =
  | {
      status: 200;
      body: T;
    }
  | {
      [K in keyof U]: {
        status: U[K];
        body?: string;
      };
    }[number];
