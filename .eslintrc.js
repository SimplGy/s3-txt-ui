module.exports = {
    "env": {
        "browser": true,
        "es6": true
    },
    "extends": [
      "react-app",
      "plugin:import/errors",
      "plugin:import/warnings"
    ],
    "parserOptions": {
        "ecmaFeatures": {
            "experimentalObjectRestSpread": true,
            "jsx": true
        },
        "sourceType": "module"
    },
    "plugins": [
        "react"
    ],
    "rules": {
        "indent": [
            "warn",
            2
        ],
        "react/prop-types": [ "off" ],
        "no-debugger": [
          "warn"
        ],
        "no-console": [
          "off"
        ],
        "linebreak-style": [
            "error",
            "unix"
        ],
        "quotes": [
            "off",
            "single"
        ],
        "semi": [
            "error",
            "always"
        ],
        "no-unused-vars": [
          "warn"
        ],
        "no-use-before-define": ["off"]
    }
};
