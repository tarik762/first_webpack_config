import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import * as path from 'path'
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//Налаштування змінної для версій 'девелопмент' і 'прод'
const mode = process.env.NODE_ENV || 'development';
//збірка для 'дев', чи для 'прод' із 'браузер-ліст'
//'браузер-ліст' в файлику .browserslistrc
const dev_mode = mode === 'development';
const target = dev_mode ? 'web' : 'browserslist';

//якшо 'дев' тоді сорсмапи потрібні для відслідковування помилок
const devtool = dev_mode ? 'source-map' : undefined


//----------- СТВОРЮЄМО ТЕМПЛАТИ ХТМЛ ------------------
//webpack-html-plugin
//Підключаємо багато темплейтів HTML
let html_pages = ['page', 'contacts', 'error'];  //Всі ХТМЛ сторінки
let html_pages_container = html_pages.map(name => {
    return new HtmlWebpackPlugin({
        template: path.resolve(__dirname, 'src/templates', `${name}.html`), // relative path to the HTML files
        filename: `${name}.html`, // output HTML files
        chunks: ['main', `${name}`]
        //chunks: [`${name}`] // respective JS files
    })
});


// і під кінець Для index.html сторінки (МЕЙН сторінки)
html_pages_container.push(
    new HtmlWebpackPlugin({
        template: path.resolve(__dirname, 'src', 'index.html'),
        filename: 'index.html',
        chunks: ['main']
    })
);


//-------------   ЕКСПОРТ НАЛАШТУВАНЬ ВЕБПАК------------------------
//Налаштування для входу та виходу для вебпака
export default {
    mode,
    target,
    devtool,
    //налаштуємо сервак
    devServer: {
        open: true,
        compress: true
    },
    entry: {
        //Must be write in automation ...maybe later
        main: path.resolve(__dirname, 'src', 'index.jsx'), //MAIN FILE
        page: path.resolve(__dirname, 'src/scripts', 'page.js'),
        contacts: path.resolve(__dirname, 'src/scripts', 'contacts.js'),
        error: path.resolve(__dirname, 'src/scripts', 'error.js')
    },
    output: {
        path: path.resolve(__dirname, 'build'), //яка папака для 'білд' і 'прод' файлів
        clean: true, //чи очищати папаку для білд і прод
        filename: 'js/[name].[contenthash].js', //файли  js на виході в dist з хешем
        assetModuleFilename: "assets/[hash][ext]"
    },

    //Додаємо плагіни скачані в конфіг в масиві
    plugins: [
        ...html_pages_container, //Додаємо наші шаблони ХТМЛ
        new MiniCssExtractPlugin({ //Додаємо наш MiniCssExtractPlugin
            filename: 'css/[name].[contenthash].css',
        })
    ],
    module: {
        rules: [
            // HTML Loader
            {
                //Наш HTML loader
                test: /\.html$/i,
                loader: 'html-loader'
            },
            // CSS Loader
            {
                test: /\.(c|sa|sc)ss$/i,
                use: [
                    dev_mode ? 'style-loader' : MiniCssExtractPlugin.loader,
                    'css-loader',
                    {
                        loader: 'postcss-loader', //Добавляємо автопрефіксер
                        options: {
                            postcssOptions: {
                                plugins: ['postcss-preset-env']
                            }
                        }
                    },
                    'sass-loader'
                ]
            },
            // JSX Loader
            {
                test: /\.jsx?$/, // определяем тип файлов
                exclude: /(node_modules)/,  // исключаем из обработки папку node_modules
                loader: "babel-loader",   // определяем загрузчик
                options: {
                    presets: ["@babel/preset-react"]    // используемые плагины
                }
            },
            // JS Loader BABEL
            {
                test: /\.(?:js|mjs|cjs)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            ['@babel/preset-env', { targets: "defaults" }]
                        ]
                    }
                }
            },
            // Fonts WOFF, WOFF2
            {
                test: /\.woff2?$/i,
                type: 'asset/resource',
                generator: {
                    filename: 'fonts/[name][ext]'
                }
            },
            // Images 
            {
                test: /\.(jpe?g|png|webp|gif)$/i,
                use: [
                    {
                        loader: 'image-webpack-loader',
                        options: {
                            mozjpeg: {
                                progressive: true,
                            },
                            // optipng.enabled: false will disable optipng
                            optipng: {
                                enabled: false,
                            },
                            pngquant: {
                                quality: [0.65, 0.90],
                                speed: 4
                            },
                            gifsicle: {
                                interlaced: false,
                            },
                            // the webp option will enable WEBP
                            webp: {
                                quality: 75
                            }
                        }
                    }
                ],
                type: 'asset/resource',
                generator: {
                    filename: 'assets/[hash][ext]'
                }
            }
            // 
        ]
    },
    devServer: {
        open: true
    }
}