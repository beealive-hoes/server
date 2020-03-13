import * as mysql from "mysql";
import * as chalk from "chalk";



const shortTermTableName = 'data_short';
const longTermTableName = 'data_long';
const datasets = [ 'microphone' ];


export type DbSettings = {
  host: string,
  user: string,
  password: string,
}


export default class Database {

  private constructor() { }

  private static connection: mysql.Connection;

  //

  public static connect(settings: DbSettings): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.connection = mysql.createConnection(settings);
      console.log(chalk.yellowBright('Connecting to MySQL...'));
      
      this.connection.connect(function(err) {
        if (err) {
          console.error(err);
          reject(err);
          return;
        }
        console.log(chalk.greenBright('Connected to MySQL!'));
        resolve(true);
      });
    });
  }

  //

  public static saveShortTermData(timestamp: number, type: string, value: number) {
    // TODO push day's min, max & avr to long term db
    const sql = `
      SELECT 1
      FROM \`beealive\`.\`${shortTermTableName}\`
      WHERE \`timestamp\` = '${timestamp}';
      `;
    this.connection.query(sql, (err, res) => {
      if (err) {
        console.error(err);
        return;
      }
      
      const insertValues = [ timestamp ];
      for (let i = 0; i < datasets.length; i++) insertValues.push(0);
      insertValues[datasets.indexOf(type)] = value;

      const sql = res.length
        ? `UPDATE \`beealive\`.\`${shortTermTableName}\` SET \`${type}\`='${value}' WHERE \`timestamp\`='${timestamp}';`
        : `INSERT INTO \`beealive\`.\`${shortTermTableName}\` (\`timestamp\`, ${datasets.map(s => `\`${s}\``).join(', ')}) VALUES ('${timestamp}', '${value}');`;

        console.log(res)
        console.log(sql)

      this.connection.query(sql, (err, res) => {
        if (err) console.error(err);
        else console.log(':+1:');
      });
    });
  }

}