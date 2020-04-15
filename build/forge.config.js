module.exports = {
    "packagerConfig": {
        "icon": "static/resources/cloud-enc.icns"
    },
    "makers": [
        {
            "name": "@electron-forge/maker-squirrel",
            "config": {
                "name": "cryptobox"
            }
        },
        {
            "name": "@electron-forge/maker-dmg",
            "config": {
                "backgroundColor": "#3f4247",
                "format": "ULFO"
            }
        },
        {
            "name": "@electron-forge/maker-deb",
            "config": {}
        },
        {
            "name": "@electron-forge/maker-rpm",
            "config": {}
        }
    ]
}