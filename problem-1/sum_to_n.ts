var sum_to_n_a = function (n: number) {
  let sum = 0;
  if (n === 0) return 0;
  for (let i = 0; i <= n; i++) {
    sum = sum + i;
  }
  return sum;
};

var sum_to_n_b = function (n: number) {
  let sum = 0;
  if (n === 0) return 0;
  sum = (n * (n + 1)) / 2;
  return sum;
};

var sum_to_n_c = function (n: number) {
  let sum = 0;
  if (n === 0) return 0;
  sum = n + sum_to_n_c(n - 1);
  return sum;
};
