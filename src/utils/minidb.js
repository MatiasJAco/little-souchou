const fs = require('fs');
const path = require("path");

class MiniDb {
  constructor(name) {
	   const pathLogs= path.join(__dirname,"..","..", "logs");
  const pathData= path.join(__dirname,"..","..", "data");
  this.basePath = path.join(__dirname,"..","..", "data",`${name}`); 
   // this.basePath = `../../data/${name}`;
   
   
   	if (!fs.existsSync(pathLogs)){
      console.log('[MiniDb]', 'Create logs directory:', pathLogs);
	  fs.mkdirSync(pathLogs);

    }
	if (!fs.existsSync(pathData)){
      console.log('[MiniDb]', 'Create base directory:', pathData);
	  fs.mkdirSync(pathData);

    }
	
//    this.basePath = `C:/Users/matia/Downloads/discordbot/little-daiko-master/data/${name}`;
    if (!fs.existsSync(this.basePath)){
      console.log('[MiniDb]', 'Create base directory:', this.basePath);
      fs.mkdirSync(this.basePath);
    }
  }

  get(id) {
    const filePath = `${this.basePath}/${id}.json`;

    try {
      if (fs.existsSync(filePath)) {
        const raw = fs.readFileSync(filePath, {
          encoding: 'utf8',
          flag: 'r'
        });
        return JSON.parse(raw) || null;
      }
    } catch (e) {
      console.error('[MiniDb]', 'Write error:', filePath, e);
    }
    return null;
  }

  put(id, value) {
    const filePath = `${this.basePath}/${id}.json`;

    try {
      const raw = JSON.stringify(value);
      fs.writeFileSync(filePath, raw, {
        encoding: 'utf8',
        mode: '666',
        flag: 'w'
      });
      return true;
    } catch (e) {
      console.error('[MiniDb]', 'Write error:', filePath, e);
      return false;
    }
  }
}

module.exports = MiniDb;