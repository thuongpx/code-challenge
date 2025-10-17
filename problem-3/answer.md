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

interface Props extends BoxProps {

}
const WalletPage: React.FC<Props> = (props: Props) => {
  const { children, ...rest } = props;
  const balances = useWalletBalances();
  const prices = usePrices();

	const getPriority = (blockchain: any): number => {
	  switch (blockchain) {
	    case 'Osmosis':
	      return 100
	    case 'Ethereum':
	      return 50
	    case 'Arbitrum':
	      return 30
	    case 'Zilliqa':
	      return 20
	    case 'Neo':
	      return 20
	    default:
	      return -99
	  }
	}

  const sortedBalances = useMemo(() => {
    return balances.filter((balance: WalletBalance) => {
		  const balancePriority = getPriority(balance.blockchain);
		  if (lhsPriority > -99) {
		     if (balance.amount <= 0) {
		       return true;
		     }
		  }
		  return false
		}).sort((lhs: WalletBalance, rhs: WalletBalance) => {
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
      formatted: balance.amount.toFixed()
    }
  })

  const rows = sortedBalances.map((balance: FormattedWalletBalance, index: number) => {
    const usdValue = prices[balance.currency] * balance.amount;
    return (
      <WalletRow 
        className={classes.row}
        key={index}
        amount={balance.amount}
        usdValue={usdValue}
        formattedAmount={balance.formatted}
      />
    )
  })

  return (
    <div {...rest}>
      {rows}
    </div>
  )
}
```

# Answer:
>#1
>```javascript
>interface WalletBalance {
>  currency: string;
>  amount: number;
>}
>interface FormattedWalletBalance {
>  currency: string;
>  amount: number;
>  formatted: string;
>}

>#1 interface FormattedWalletBalance is incorrect, should extends from interface WalletBalance. Should update below:

>```javascript
>interface FormattedWalletBalance extends WalletBalance {
> formatted: string;
>}

>#2
>```javascript
> interface Props extends BoxProps {}
>```

>#2 BoxProps used in this line but not declared

>#3
>```javascript
>const { children, ...rest } = props;

>#3 "children" declared but not used in this code

>#4
>```javascript
>const getPriority = (blockchain: any): number => {
>	  switch (blockchain) {
>	    case 'Osmosis':
>	      return 100
>	    case 'Ethereum':
>	      return 50
>	    case 'Arbitrum':
>	      return 30
>	    case 'Zilliqa':
>	      return 20
>	    case 'Neo':
>	      return 20
>	    default:
>	      return -99
>	  }
>}

>#4 blockchain: any => need to define specific type for blockchain, should restrict use any
>#4 should define type for blockchain 

>#4
>```javascript
>type blockchain ='Osmosis' | 'Ethereum' | 'Arbitrum' | 'Zilliqa' | 'Neo' | string;

>#5
>```javascript
> if (lhsPriority > -99) {
>   if (balance.amount <= 0) {
>    return true;
>	}
> }
> return false

>#5 maybe this logic incorrect, balance.amount <= 0 should be return false, and finally it will return true