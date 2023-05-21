import HtmlWebpackPlugin from 'html-webpack-plugin';
import * as path from 'path'
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//Налаштування змінної для версій 'девелопмент' і 'прод'
const mode = process.env.NODE_ENV || 'development';

//збірка для 'дев', чи для 'прод' із 'браузер-ліст'
//'браузер-ліст' в файлику .browserslistrc
const target = mode === 'development' ? 'web' : 'browserslist';

//якшо 'дев' тоді сорсмапи потрібні для відслідковування помилок
const devtool = mode === 'development' ? 'source-map' : undefined



//----------- СТВОРЮЄМО ТЕМПЛАТИ ХТМЛ ------------------
//webpack-html-plugin
//Підключаємо багато темплейтів HTML
let html_pages = ['page', 'contacts', 'error'];
let html_pages_container = html_pages.map(name => {
    return new HtmlWebpackPlugin({
        template: path.resolve(__dirname, 'src/templates', `${name}.html`), // relative path to the HTML files
        filename: `${name}.html`, // output HTML files
        chunks: [`${name}`]
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


//ЕКСПОРТ НАЛАШТУВАНЬ ВЕБПАК
//Налаштування для входу та виходу для вебпака
export default {
    mode,
    target,
    devtool,
    entry: {
        "main": path.resolve(__dirname, 'src', 'index.js'), //Яка папка для вебпака як точка входу
        "page": path.resolve(__dirname, 'src/scripts', 'page.js'),
        "contacts": path.resolve(__dirname, 'src/scripts', 'contacts.js'),
        "error": path.resolve(__dirname, 'src/scripts', 'error.js')
    },
    output: {
        path: path.resolve(__dirname, 'build'), //яка папака для 'білд' і 'прод' файлів
        clean: true, //чи очищати папаку для білд і прод
        filename: '[name].[contenthash].js' //файли  js на виході в dist з хешем
    },

    //Додаємо плагіни скачані в конфіг в масиві
    plugins: [
        ...html_pages_container //Додаємо наші шаблони ХТМЛ
    ]
}