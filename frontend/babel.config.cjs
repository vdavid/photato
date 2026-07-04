module.exports = function(api) {
    api.cache(false);

    return {
        plugins: [
//            "transform-react-createelement-to-jsx"
            ['@babel/plugin-transform-react-jsx', {}] /* Docs: https://babeljs.io/docs/en/babel-plugin-transform-react-jsx */
        ]
    };
};