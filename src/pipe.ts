type PipeState = "dispatch" | "fulfilled" | "reject" | "noop";
type MaybePromise<T> = T | Promise<T>;
type MaybeArray<T> = T | [only: T];

export const retriveBracket: <T>(value: MaybeArray<T>) => T = (value) =>
  Array.isArray(value) ? value[0] : value;

export default class Pipe<
  PipeContext extends unknown[] | never[],
  InputType extends unknown[] = PipeContext,
  OutputType extends unknown[] = PipeContext
> {
  private _context: PipeContext;
  private _pipeQueue: ((...value: unknown[]) => MaybePromise<unknown[]>)[];
  private _return: OutputType;

  constructor(
    prevPipe: Pipe<PipeContext, unknown[], unknown[]> | null,
    initState: ((...value: InputType) => MaybePromise<OutputType>) | PipeContext
  ) {
    const initFunc = Array.isArray(initState) ? null : initState;

    if (prevPipe) {
      this._context = prevPipe.context;
      this._pipeQueue = prevPipe.pipeQueue;
    } else {
      this._context = (initFunc ? [] : initState) as unknown as PipeContext;
      this._pipeQueue = [];
    }

    if (initFunc)
      this._pipeQueue.push(
        initFunc as unknown as (...value: unknown[]) => unknown[]
      );

    this._return = (initFunc ? [] : initState) as unknown as OutputType;
  }

  static createPipe<I extends unknown[], O extends unknown[]>(
    pipeFunc: (...value: I) => O
  ) {
    return new Pipe(null, pipeFunc);
  }

  get context() {
    return typeof this._context === "function"
      ? this._context
      : ([...this._context] as PipeContext);
  }

  get pipeQueue() {
    return [...this._pipeQueue];
  }

  pipe<O extends unknown[]>(
    pipable:
      | ((...value: OutputType) => MaybePromise<O>)
      | Pipe<unknown[] | never[], OutputType, O>
  ): Pipe<PipeContext, OutputType, O> {
    return new Pipe(
      this,
      pipable instanceof Pipe ? pipable.pipeFunc() : pipable
    );
  }

  pipeFunc() {
    const realQueue = this._pipeQueue.slice().reverse();
    if (realQueue.length === 0) return () => this._return;
    else
      return async (...value: Parameters<typeof realQueue[0]>) => {
        let result = [...value];
        while (realQueue.length > 0) {
          result = await realQueue.pop()?.(...result);
        }
        return result as OutputType;
      };
  }

  async eval() {
    return await this.pipeFunc()(...this.context);
  }
}

export const branch: <T>(
  ...mappers: ((...value: T[]) => MaybePromise<unknown[]>)[]
) => (...value: T[]) => [T[], ...unknown[]] =
  (...mappers) =>
    (...value) => {
      return [value, ...mappers.map((mapper) => mapper(...value))];
    };

export const validatorSync: <T>(
  fiberV: ((value: T) => boolean)[],
  combineV?: [indexes: number[], validator: (...value: T[]) => boolean][]
) => (...value: T[]) => [boolean] =
  (fiberV, combineV) =>
    (...value) => {
      const length = value.length;
      if (
        combineV &&
      combineV.some(([indexes]) =>
        indexes.some((idx) => idx >= length || idx < 0)
      )
      )
        return (
          console.warn(
            "Warning: Combination validator has some picker out of range."
          ),
          [false]
        );
      return [
        fiberV.every((v, i) => v(value[i])) &&
        (combineV?.every(([indexes, validator]) =>
          validator(...indexes.map((idx) => value[idx]))
        ) ??
          true),
      ];
    };

export const dispatchIf: <T>(
  validator: (...value: T[]) => MaybePromise<MaybeArray<boolean>>,
  dispatch: (...value: T[]) => MaybePromise<void>,
  mode: "detach" | "join"
) => (...value: T[]) => Promise<[PipeState, ...T[]]> =
  (validator, dispatch, mode) =>
    async (...value) => {
      const isValid = retriveBracket(await validator(...value));
      if (isValid) {
        if (mode === "detach") {
          dispatch(...value);
          return ["dispatch", ...value];
        } else {
          try {
            await dispatch(...value);
          } catch {
            return ["reject", ...value];
          }
          return ["fulfilled", ...value];
        }
      }
      return ["noop", ...value];
    };

export const stateHandler: <T>(
  handler: (state: PipeState, value?: T[]) => MaybePromise<void>
) => (...value: [PipeState, ...T[]]) => T[] =
  (handler) =>
    (...value) => {
      const [state, ...pure] = value;
      handler(state, pure);
      return pure;
    };