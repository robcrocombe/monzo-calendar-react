import currency from 'currency-formatter';

export function formatCurrency(
  val: number,
  code: string,
  disableAbs?: boolean,
  options?: Dictionary<any>
): string {
  const value = (disableAbs ? val : Math.abs(val)) / 100;
  return currency.format(value, { code, ...options });
}
