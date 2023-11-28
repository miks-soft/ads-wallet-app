type paths = import('./../generated/api').paths;
declare module '*.png' {
  const value: any;
  export = value;
}

declare module '#env' {
  const DEFAULT_API_URL: string;
  const __DEVELOPMENT__: number;
  const API_URL_USA: string;
  const API_URL_RU: string;
  const INITIAL_REGION: string;

  export {
    DEFAULT_API_URL,
    API_URL_RU,
    API_URL_USA,
    __DEVELOPMENT__,
    INITIAL_REGION,
  };
}

type text = string | number;

declare type SetState<T> = React.Dispatch<React.SetStateAction<T>>;
declare type SetStateArg<T> = React.SetStateAction<T>;

declare type getSetStateProps<T> = Required<{
  [K in keyof T as K extends string ? `set${Capitalize<K>}` : never]: SetState<
    T[K]
  >;
}>;

declare type Eject<T = object> = Exclude<NonNullable<T>, undefined>?;

declare type PickPath<T> = Eject<T['parameters']['path']>;
declare type PickParams<T> = Eject<T['parameters']['query']>;
declare type PickData<T> = Eject<
  T['requestBody']['content']['multipart/form-data'] &
    T['requestBody']['content']['application/json']
>;

declare type PickApiData<T extends keyof paths, U extends keyof paths[T]> = {
  response: paths[T][U]['responses']['200']['content']['application/json']['data'];
  args: paths[T][U]['parameters']['path'] extends Object
    ? {
        path: paths[T][U]['parameters']['path'];
        params?: paths[T][U]['parameters']['query'];
        data?: NonNullable<
          paths[T][U]['requestBody']
        >['content']['application/json'] &
          paths[T][U]['requestBody']['content']['multipart/form-data'];
      }
    : paths[T][U]['parameters']['query'] extends Object
    ? {
        params?: paths[T][U]['parameters']['query'];
        data?: NonNullable<
          paths[T][U]['requestBody']
        >['content']['application/json'] &
          paths[T][U]['requestBody']['content']['multipart/form-data'];
      }
    : undefined &
        NonNullable<paths[T][U]['requestBody']>['content']['application/json'] &
        paths[T][U]['requestBody']['content']['multipart/form-data'] extends Object
    ? {
        data?: NonNullable<
          paths[T][U]['requestBody']
        >['content']['application/json'] &
          paths[T][U]['requestBody']['content']['multipart/form-data'];
      }
    : void;
};

declare type ArrayElement<ArrayType extends readonly unknown[]> =
  ArrayType extends readonly (infer ElementType)[] ? ElementType : never;
