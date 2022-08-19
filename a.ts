function findSolution(equation: string): string {
  const [rawLeft, rawRight] = equation.split("=");
  const norm = (str: string) =>
    str[0] !== "+" && str[1] !== "-" ? "+" + str : str;
  const [left, right] = [rawLeft, rawRight].map((str) => norm(str));
  const lm = left
    .split("-")
    .slice(1)
    .map((split) => split.split("+")[0]);
  const rm = right
    .split("-")
    .slice(1)
    .map((split) => split.split("+")[0]);
  const lp = left
    .split("+")
    .slice(1)
    .map((split) => split.split("-")[0])
    .filter((split) => split !== "");
  const rp = right
    .split("+")
    .slice(1)
    .map((split) => split.split("-")[0])
    .filter((split) => split !== "");

  const sums = (splits: string[]): [constants: number, myths: number] => (
    console.log("/"),
    splits
      .map(
        (split) => (
          console.log(split),
          split === "x"
            ? [0, 1]
            : split.indexOf("x") !== -1
              ? [0, parseInt(split.split("x")[0])]
              : [parseInt(split), 0]
        )
      )
      .reduce((acc, cur) => [acc[0] + cur[0], acc[1] + cur[1]], [0, 0]) as [
      constants: number,
      myths: number
    ]
  );

  const minus = ([constants, myths]: [constants: number, myths: number]): [
    constants: number,
    myths: number
  ] => [-constants, -myths];

  console.log(sums(lm), sums(lp), sums(rp), sums(rm));
  const result = [minus(sums(lm)), sums(lp), minus(sums(rp)), sums(rm)].reduce(
    (acc, cur) => [acc[0] + cur[0], acc[1] + cur[1]],
    [0, 0]
  );

  if (result[1] === 0)
    return result[0] === 0 ? "Infinity Solutions" : "No Solution";
  return `x=${Math.floor(-result[0] / result[1])}`;
}

console.log(findSolution("2-x+x+3x=2x-x+x+3"));
