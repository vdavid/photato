module.exports = function (api) {
    api.cache(false);

    return {
        "plugins": [
            [
                "@babel/plugin-transform-react-jsx",
                {
                    "throwIfNamespace": true, /* Defaults to true */
                    "runtime": "automatic", /* Decides which runtime to use. “automatic” auto imports the functions that JSX
                                   transpiles to. “classic” does not automatically import anything. Defaults to “classic”. */
                    "importSource": "custom-jsx-library" // defaults to react
                }
            ]
        ]
    };
};