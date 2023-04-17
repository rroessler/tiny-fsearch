{
    "targets": [
        {
            "target_name": "fsearch",
            "cflags": [""],
            "cflags_cc": ["-std=c++20", "-stdlib=libc++", "-03"],
            "cflags!": ["-fno-exceptions"],
            "cflags_cc!": ["-fno-exceptions"],
            "include_dirs": [
                "./src",
                "<!(node -p \"require('node-addon-api').include_dir\")",
            ],
            "sources": ["<!@(node -p \"require('./tools/sources').sources\")"],
            "conditions": [
                [
                    "OS=='win'",
                    {
                        "msvs_settings": {
                            "VCCLCompilerTool": {
                                "ExceptionHandling": 1,
                                "AdditionalOptions": ["-std:c++20"],
                            }
                        }
                    },
                ],
                [
                    "OS=='mac'",
                    {
                        "cflags+": ["-fvisibility=hidden"],
                        "xcode_settings": {
                            "GCC_ENABLE_CPP_EXCEPTIONS": "YES",
                            "CLANG_CXX_LIBRARY": "libc++",
                            "MACOSX_DEPLOYMENT_TARGET": "10.7",
                            "CLANG_CXX_LANGUAGE_STANDARD": "c++2a",
                            "OTHER_CFLAGS": ["-std=c++2a", "-O3"],
                        },
                    },
                ],
            ],
        }
    ]
}
