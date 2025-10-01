# defimath-website
Website for DefiMath project

 
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


