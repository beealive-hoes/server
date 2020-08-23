import * as mysql from "mysql";
import * as chalk from "chalk";


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

  public static saveData(timestamp: number, data: { humidity1?: number, temperature1?: number, airpressure1?: number, humidity2?: number, temperature2?: number, airpressure2?: number, weight?: number, volume?: number, wind?: number, rain?: number }) {
    const fields = [ 'timestamp' ];
    const values = [ timestamp ];

    for (const set of [ 'humidity1', 'temperature1', 'airpressure1', 'humidity2', 'temperature2', 'airpressure2', 'weight', 'volume', 'wind', 'rain' ]) {
      if (!data[set]) continue;
      fields.push(set);
      values.push(data[set]);
    }

    const sql = `INSERT INTO beealive.data (${fields.join(', ')}) VALUES (${values.map(v => `'${v}'`).join(', ')});`;

    this.connection.query(sql, (err, res) => {
      if (err) console.error(err);
      else console.log(sql)
    });
  }

}