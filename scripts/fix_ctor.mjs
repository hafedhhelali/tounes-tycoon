import fs from 'fs';

let engine = fs.readFileSync('c:/Projects/tounes-tycoon/engine.js', 'utf8');

const target = `  constructor(initialState = null) {
    this.businesses = BUSINESS_CONFIGS.map(cfg => ({
      ...cfg,
      level: 0,
      hiredManagersCount: 0,
      hasManager: false,
      progressMs: 0,
      isProducing: false
    }));`;

const replacement = `  constructor(initialState = null) {
    this.BUSINESS_CONFIGS = BUSINESS_CONFIGS;
    this.cityBusinesses = {};
    this.businesses = this.initCityBusinesses('tunis');`;

if (engine.includes(target)) {
  engine = engine.replace(target, replacement);
  fs.writeFileSync('c:/Projects/tounes-tycoon/engine.js', engine, 'utf8');
  console.log('✔ Engine constructor patched successfully with cityBusinesses initialization');
} else {
  console.log('⚠ Target not found');
}
