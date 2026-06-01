# defimath-website
Website for DefiMath project

This is the source for [DeFiMath](https://defimath.com/) — a gas-optimized, pure-Solidity library for on-chain DeFi math. See the [full documentation](https://defimath.com/docs/) or jump straight to a module: [math primitives](https://defimath.com/docs/math/) (`exp`, `ln`, `sqrt`, standard normal CDF), [Black-Scholes options pricing and Greeks](https://defimath.com/docs/options/), [binary options](https://defimath.com/docs/binary/), [futures pricing](https://defimath.com/docs/futures/), [interest rates and yield math](https://defimath.com/docs/rates/), and [statistics and risk metrics](https://defimath.com/docs/statistics/) (volatility, Sharpe, VaR, CVaR, max drawdown).

 
## Getting Started

### Install Dependencies
```
npm i
```
### Run local server for development
```
npm run dev
```
After this, you can visit [http://localhost:3000](http://localhost:3000) from your browser.
### How to build for production
Production is being built in `out` folder. To build for production, run:
```
rm -rf .next out
npm run build
```
On Github pages, `docs` folder is being used to host the website. So, after building for production, copy the contents of `out` folder to `docs` folder. Here's how you can do it:
```
cp -R out/* docs/
rm -rf .next out
```
Commit and push the changes to your Github repository. Your website should be live in a few minutes.

## Author

Design and code is completely written by Getnext.jsTemplates design and development team.  


## License

 - Design and Code is Copyright &copy; [Getnext.jsTemplates](https://getnextjstemplates.com)
 - Licensed cover under [MIT]
 - Distributed by [ThemeWagon](https://themewagon.com)


