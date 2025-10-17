# List out the computational inefficiencies and anti-patterns found in the code block below

```javascript
interface WalletBalance {
  currency: string;
  amount: number;
}
interface FormattedWalletBalance {
  currency: string;
  amount: number;
  formatted: string;
}

interface Props extends BoxProps {}
const WalletPage: React.FC<Props> = (props: Props) => {
  const { children, ...rest } = props;
  const balances = useWalletBalances();
  const prices = usePrices();

  const getPriority = (blockchain: any): number => {
    switch (blockchain) {
      case "Osmosis":
        return 100;
      case "Ethereum":
        return 50;
      case "Arbitrum":
        return 30;
      case "Zilliqa":
        return 20;
      case "Neo":
        return 20;
      default:
        return -99;
    }
  };

  const sortedBalances = useMemo(() => {
    return balances
      .filter((balance: WalletBalance) => {
        const balancePriority = getPriority(balance.blockchain);
        if (lhsPriority > -99) {
          if (balance.amount <= 0) {
            return true;
          }
        }
        return false;
      })
      .sort((lhs: WalletBalance, rhs: WalletBalance) => {
        const leftPriority = getPriority(lhs.blockchain);
        const rightPriority = getPriority(rhs.blockchain);
        if (leftPriority > rightPriority) {
          return -1;
        } else if (rightPriority > leftPriority) {
          return 1;
        }
      });
  }, [balances, prices]);

  const formattedBalances = sortedBalances.map((balance: WalletBalance) => {
    return {
      ...balance,
      formatted: balance.amount.toFixed(),
    };
  });

  const rows = sortedBalances.map(
    (balance: FormattedWalletBalance, index: number) => {
      const usdValue = prices[balance.currency] * balance.amount;
      return (
        <WalletRow
          className={classes.row}
          key={index}
          amount={balance.amount}
          usdValue={usdValue}
          formattedAmount={balance.formatted}
        />
      );
    }
  );

  return <div {...rest}>{rows}</div>;
};
```

# Answer:

> #1
>
> ```javascript
> interface WalletBalance {
>   currency: string;
>   amount: number;
> }
> interface FormattedWalletBalance {
>   currency: string;
>   amount: number;
>   formatted: string;
> }
> ```

> #1 interface `FormattedWalletBalance` is incorrect, should extends from interface `WalletBalance`. Should update below:

> ```javascript
> interface FormattedWalletBalance extends WalletBalance {
>   formatted: string;
> }
> ```

> #2
>
> ```javascript
> interface Props extends BoxProps {}
> ```
>
> #2 `BoxProps` used in this line but not declared

> #3
>
> ```javascript
> const { children, ...rest } = props;
> ```

> #3 `children` declared but not used in this code

> #4
>
> ```javascript
> const getPriority = (blockchain: any): number => {
>   switch (blockchain) {
>     case "Osmosis":
>       return 100;
>     case "Ethereum":
>       return 50;
>     case "Arbitrum":
>       return 30;
>     case "Zilliqa":
>       return 20;
>     case "Neo":
>       return 20;
>     default:
>       return -99;
>   }
> };
> ```

> #4 `blockchain: any` => need to define specific type for blockchain, should restrict use any
> #4 should define type for `blockchain`
> #4
>
> ```javascript
> type Blockchain =
>   | "Osmosis"
>   | "Ethereum"
>   | "Arbitrum"
>   | "Zilliqa"
>   | "Neo"
>   | string;
> ```

> #5
>
> ```javascript
> if (lhsPriority > -99) {
>   if (balance.amount <= 0) {
>     return true;
>   }
> }
> return false;
> ```

> #5 `lhsPriority` not exists in code
> #5 maybe this logic incorrect, `balance.amount <= 0` should be `return false`, and finally it will `return true`

> #6
>
> ```javascript
> const formattedBalances = sortedBalances.map((balance: WalletBalance) => {
>   return {
>     ...balance,
>     formatted: balance.amount.toFixed(),
>   };
> });
> ```

> #6
> `formattedBalances` declared but not used in code

> #7
>
> ```javascript
> <WalletRow
>   className={classes.row}
>   key={index}
>   amount={balance.amount}
>   usdValue={usdValue}
>   formattedAmount={balance.formatted}
> />
> ```

> #7 `key` use `index` is incorrect, should use `balance.currency` for `key`

#8

> ```javascript
> const sortedBalances = useMemo(() => {
>   return balances
>     .filter((balance: WalletBalance) => {
>       const balancePriority = getPriority(balance.blockchain);
>       if (lhsPriority > -99) {
>         if (balance.amount <= 0) {
>           return true;
>         }
>       }
>       return false;
>     })
>     .sort(
>       (lhs: WalletBalance, rhs: WalletBalance) => {
>         if (leftPriority > rightPriority) {
>           const leftPriority = getPriority(lhs.blockchain);
>         } else if (rightPriority > leftPriority) {
>           const rightPriority = getPriority(rhs.blockchain);
>         }
>         return -1;
>       },
>       [balances, prices]
>     );
>   return 1;
> });
> ```

> #8
> should remove `prices` in dependecies of `sortedBalances()`.
> It not necessary in this case, it only depends on value of `balances` and `balancePriority`

# Refactor version code:

> ```javascript
> type Blockchain =
>   | "Osmosis"
>   | "Ethereum"
>   | "Arbitrum"
>   | "Zilliqa"
>   | "Neo"
>   | string;
>
> interface WalletBalance {
>   currency: string;
>   amount: number;
> }
> interface FormattedWalletBalance extends WalletBalance {
>   formatted: string;
> }
>
> interface BoxProps {
>   // something here
> }
> interface Props extends BoxProps {}
>
> const WalletPage: React.FC<Props> = (props: Props) => {
>   const { ...rest } = props;
>   const balances = useWalletBalances();
>   const prices = usePrices();
>
>   const getPriority = (blockchain: Blockchain): number => {
>     switch (blockchain) {
>       case "Osmosis":
>         return 100;
>       case "Ethereum":
>         return 50;
>       case "Arbitrum":
>         return 30;
>       case "Zilliqa":
>         return 20;
>       case "Neo":
>         return 20;
>       default:
>         return -99;
>     }
>   };
>
>   const sortedBalances = useMemo(() => {
>     return balances
>       .filter((balance: WalletBalance) => {
>         const balancePriority = getPriority(balance.blockchain);
>         if (lhsPriority > -99) {
>           if (balance.amount <= 0) {
>             return false;
>           }
>         }
>         return true;
>       })
>       .sort((lhs: WalletBalance, rhs: WalletBalance) => {
>         const leftPriority = getPriority(lhs.blockchain);
>         const rightPriority = getPriority(rhs.blockchain);
>         if (leftPriority > rightPriority) {
>           return -1;
>         } else if (rightPriority > leftPriority) {
>           return 1;
>         }
>       });
>   }, [balances]);
>
>   const formattedBalances = sortedBalances.map((balance: WalletBalance) => {
>     return {
>       ...balance,
>       formatted: balance.amount.toFixed(),
>     };
>   });
>
>   const rows = sortedBalances.map(
>     (formattedBalance: FormattedWalletBalance, index: number) => {
>       // change `balance` to `formattedBalance` to easy control
>       const usdValue =
>         prices[formattedBalance.currency] * formattedBalance.amount;
>       return (
>         <WalletRow
>           className={classes.row}
>           key={formattedBalance.currency}
>           amount={formattedBalance.amount}
>           usdValue={usdValue}
>           formattedAmount={formattedBalance.formatted}
>         />
>       );
>     }
>   );
>
>   return <div {...rest}>{rows}</div>;
> };
> ```
