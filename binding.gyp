{
    "targets": [{
        "target_name": "tfsearch",

        "cflags": [""],
        "cflags_cc": ["-std=c++20", "-stdlib=libc++"],
        "cflags!": ["-fno-exceptions"],
        "cflags_cc!": ["-fno-exceptions"],

        "include_dirs": [
            "./src",
            "<!(node -p \"require('node-addon-api').include_dir\")"
        ],

        "sources": [
            "<!@(node -p \"require('./dev/sources').sources\")"
        ],

        "conditions": [
            ["OS=='win'", {
                "defines": [
                    "PLATFORM_WIN",
                    "_HAS_EXCEPTIONS=1"
                ],
                "msvs_settings": {
                    "VCCLCompilerTool": {
                        "ExceptionHandling": 1,
                        "AdditionalOptions": ["-std:c++20"]
                    }
                }
            }],
            ["OS=='mac'", {
                "defines": ["PLATFORM_DARWIN"],
                "xcode_settings": {
                    "GCC_ENABLE_CPP_EXCEPTIONS": "YES",
                    "CLANG_CXX_LIBRARY": "libc++",
                    "MACOSX_DEPLOYMENT_TARGET": "10.7",
                    "OTHER_CFLAGS": ["-std=c++2a"]
                }
            }]
        ]
    }]
}