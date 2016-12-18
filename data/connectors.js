import Sequelize from 'sequelize';
import casual from 'casual';
import _ from 'lodash';

//Working for sqlite
// const db = new Sequelize('blog', null, null, {
//   dialect: 'sqlite',
//   storage: './blog.sqlite',
// });

var database="graphqlData",
  userName = "user",
  password = "password",
  host = "DESKTOP-53LH7NO",
  instance = "MSSQLSERVER";

//This one works for local SQL Server (tedious driver)
// let db = new Sequelize(database, userName, password, {
// 			dialect: 'mssql',
// 			host: host,
//       pool: {
//         max: 5,
//         min: 0,
//         idle: 10000
//       }
// 		});

// //This one works for local SQL Server (tedious driver)
// let db = new Sequelize(database, userName, password, {
// 			dialect: 'mssql',
// 			host: host,
// 			//port: 1433, // Default port
// 			options: {
//         // driver: 'tedious',
// 				instanceName: instance,
//         // encrypt: true,
// 			},
//       pool: {
//           max: 5,
//           min: 0,
//           idle: 10000
//       }
// 		});

//This one works for local SQL Server (tedious driver)
//var db = new Sequelize('mssql://'+userName+':'+password+'@'+host+'/'+database);

//This one works for local SQL Server using trusted connection (msnodesqlv8 driver)
var conStr = 'Driver={SQL Server Native Client 11.0};Server='+host+';Database='+database+';Trusted_Connection=yes;';
//var conStr = 'Driver={SQL Server Native Client 11.0};Server='+host+'\\\\'+instance+';Database='+database+';Trusted_Connection=yes;';

console.log(conStr);

let db = new Sequelize({
  dialect: 'mssql',
  dialectModulePath: 'sequelize-msnodesqlv8',
  dialectOptions: {
    connectionString: conStr
  },
  pool: {
    min: 0,
    max: 5,
    idle: 10000
  }
});


// db
//   .authenticate()
//   .then(function(err) {
//     console.log('Connection has been established successfully.');
//   })
//   .catch(function (err) {
//     console.log('Unable to connect to the database:', err);
//   });

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