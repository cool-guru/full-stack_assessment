declare module 'currency-symbol-map' {
    function getSymbolFromCurrency(currencyCode: string): string;
    export default getSymbolFromCurrency;
  }
  
  declare module 'currency-symbol-map/map' {
    const currencyToSymbolMap: { [key: string]: string };
    export default currencyToSymbolMap;
  }