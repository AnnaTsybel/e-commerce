const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const StylelintPlugin = require("stylelint-webpack-plugin");
const zlib = require("zlib");
const CompressionPlugin = require("compression-webpack-plugin");

const PRODUCTION_PLUGINS = [
    new HtmlWebpackPlugin({
        title: "E-commerce",
        template: "./public/index.html",
        favicon: "./public/favicon.ico",
        minify: false,
    }),
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin(),
    new StylelintPlugin({ fix: true }),
    new CompressionPlugin({
        filename: "[path][base].br",
        algorithm: "brotliCompress",
        test: /\.(js|css|html|svg)$/,
        compressionOptions: {
            params: {
                [zlib.constants.BROTLI_PARAM_QUALITY]: 11,
            },
        },
        threshold: 10240,
        minRatio: 0.8,
        deleteOriginalAssets: false,
    }),
];

const DEVELOPMENT_PLUGINS = [
    new HtmlWebpackPlugin({
        title: "E-commerce",
        template: "./public/index.html",
        favicon: "./public/favicon.ico",
    }),
    new StylelintPlugin({ fix: true })
];

const OPTIMISATION = {
    splitChunks: {
        chunks: "all",
    },
    minimize: true,
    minimizer: [
        new CssMinimizerPlugin(),
    ],
};

const IMAGE_COMPRESSION = [
    {
        loader: "image-webpack-loader",
        options: {
            mozjpeg: {
                progressive: false,
            },
            optipng: {
                enabled: true,
            },
            pngquant: {
                quality: [0.8, 0.8],
                speed: 2,
            },
        },
    },
];

module.exports = (env, argv) => {
    const isProduction = argv.mode === 'production';

    return {
        entry: "./src/index.tsx",
        target: "web",
        watch: true,
        watchOptions: {
            aggregateTimeout: 200,
            poll: 1000,
            ignored: /node_modules/,
        },
        output: {
            path: path.resolve(__dirname, "dist/"),
            filename: "[name].[hash].js",
            publicPath: "/static/dist/",
        },
        plugins: isProduction ? PRODUCTION_PLUGINS : DEVELOPMENT_PLUGINS,
        devServer: {
            port: 3000,
            open: true,
            historyApiFallback: true,
        },
        resolve: {
            alias: {
                "@components": path.resolve(__dirname, "./src/app/components/"),
                "@static": path.resolve(__dirname, "./src/app/static/"),
                "@": path.resolve(__dirname, "./src/"),
                "@app": path.resolve(__dirname, "./src/app"),
                "@img": path.resolve(__dirname, "./src/app/static/img"),
            },
            extensions: [".ts", ".tsx", ".js", ".jsx", "json"],
            modules: ["node_modules"],
        },
        module: {
            rules: [
                {
                    test: /\.m?(tsx|ts)$/i,
                    exclude: /(node_modules)/,
                    use: [
                        {
                            loader: "ts-loader",
                        },
                    ],
                },
                {
                    test: /\.(scss)$/,
                    exclude: /(node_modules)/,
                    use: isProduction
                        ?
                        [
                            MiniCssExtractPlugin.loader,
                            "css-loader",
                            "sass-loader",
                        ]
                        :
                        [
                            "style-loader",
                            "css-loader",
                            "sass-loader",
                        ]
                },
                {
                    test: /\.(css)$/,
                    use: [
                        "style-loader",
                        "css-loader",
                    ],
                },
                {
                    test: /\.(woff|woff2|eot|ttf|otf)$/i,
                    exclude: /(node_modules)/,
                    type: "asset/resource",
                    generator: {
                        filename: "fonts/[name][hash:5][ext]",
                    },
                },
                {
                    test: /\.(jpeg|jpg|png|svg|gif|mp4|webp)(\?.*$|$)/,
                    exclude: /(node_modules)/,
                    type: "asset/resource",
                    generator: {
                        filename: "images/[name][hash:5][ext]",
                    },
                    use: isProduction ? IMAGE_COMPRESSION : [],
                },
            ],
        },
        optimization: isProduction ? OPTIMISATION : {},
    };
}
