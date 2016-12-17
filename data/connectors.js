import Sequelize from 'sequelize';
import casual from 'casual';
import _ from 'lodash';
require("sequelize-msnodesqlv8");

//Working for sqlite
const db = new Sequelize('blog', null, null, {
  dialect: 'sqlite',
  storage: './blog.sqlite',
});


// let db = new Sequelize({
//   dialect: 'mssql',
//   dialectModulePath: 'sequelize-msnodesqlv8',
//   dialectOptions: {
//     driver: 'SQL Server Native Client 11.0',
//     instanceName: 'DESKTOP-53LH7NO',
//     trustedConnection: true
//   },
//   //host: 'localhost',
//   database: 'graphqlData'
// });

// let db = new Sequelize({
//   dialect: 'mssql',
//   dialectModulePath: 'sequelize-msnodesqlv8',
//   dialectOptions: {
//     driver: 'ODBC Driver 11 for SQL Server',
//     instanceName: 'DESKTOP-53LH7NO'
//   },
//   host: 'localhost',
//   username: 'sa',
//   password: 'ffgdfgdfg',
//   database: 'graphqlData'
// });

const AuthorModel = db.define('author', {
  firstName: { type: Sequelize.STRING },
  lastName: { type: Sequelize.STRING },
});

const PostModel = db.define('post', {
  title: { type: Sequelize.STRING },
  text: { type: Sequelize.STRING },
});

AuthorModel.hasMany(PostModel);
PostModel.belongsTo(AuthorModel);

// create mock data with a seed, so we always get the same
casual.seed(123);
db.sync({ force: true }).then(() => {
  _.times(10, () => {
    return AuthorModel.create({
      firstName: casual.first_name,
      lastName: casual.last_name,
    }).then((author) => {
      return author.createPost({
        title: `A post by ${author.firstName}`,
        text: casual.sentences(3),
      });
    });
  });
});

const Author = db.models.author;
const Post = db.models.post;

export { Author, Post };