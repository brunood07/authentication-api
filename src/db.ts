import { Pool } from 'pg';

const connectionString = 'postgres://lfmpgdsb:sBolDd_I6Zy_aVutJGdwmQPj3o40RwBm@motty.db.elephantsql.com/lfmpgdsb';

const db = new Pool({ connectionString });

export default db;