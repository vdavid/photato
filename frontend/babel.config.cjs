module.exports = function (api) {
    api.cache(false);

    return {
        "plugins": [
            ["@babel/plugin-transform-react-jsx", {}] /* Docs: https://babeljs.io/docs/en/babel-plugin-transform-react-jsx */
        ]
    };
};