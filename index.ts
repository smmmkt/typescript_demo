import Pipe, {
  dispatchIf,
  validatorSync,
  stateHandler,
  branch,
} from "./src/pipe";
import chalk from "chalk";

const a = new Pipe(null, [122, 12])
  .pipe(Pipe.createPipe((num1: number, num2: number) => [num1 * num2]))
  .pipe((num: number) => [num * (num % 10) + 13])
  .pipe((num: number) => [num, `${num}`])
  .pipe(
    dispatchIf(
      validatorSync(
        [],
        [
          [[0, 1], (num: number, str: string) => num === parseInt(str)],
          [[0, 1], () => true],
        ]
      ),
      async (...value) => {
        throw new Error(`${value}`);
      },
      "join"
    )
  )
  .pipe(
    stateHandler((state) =>
      console.log(chalk.bgGreen(chalk.whiteBright(state)))
    )
  )
  .pipe(branch((num: number) => [num, num]));

(async () => {
  console.log(await a.pipeFunc()(1, 2));
})();
