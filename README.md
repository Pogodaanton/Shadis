# Shadis

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

# Development

This project uses React for the front-end and PHP for the back-end. You can find the front-end code in `src` and the back-end code in `public`.

## Available Scripts

In the project directory, you can run:

### `yarn start` or `yarn serve`

Runs the app in the development mode and builds it to the `dist` folder.<br />
Because webpack-dev-server cannot interpret PHP code, it is required to route a **PHP-(MySQL/MariaDB)-server** to the automatically generated `dist` directory.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `yarn build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

This build is minified and the filenames include hashes for cache prevention.<br />
See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
