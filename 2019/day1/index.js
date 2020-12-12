import fs from 'fs';
import path from 'path';

const calculateFuelRequired = v => (Math.floor(v / 3) - 2);

const result = fs.readFileSync(path.resolve(__dirname, './input'), 'utf-8')
  .split('\n')
  .filter(v => !!v)
  .map(s => {
    const v = parseInt(s, 10);
    const contentFuel = calculateFuelRequired(v);
    let fuelExtra = [];
    let lastFuel = contentFuel;
    while (lastFuel > 0) {
      lastFuel = calculateFuelRequired(lastFuel);
      if (lastFuel > 0) { fuelExtra.push(lastFuel); }
    }
    console.log(contentFuel, fuelExtra);
    return fuelExtra.reduce((acc, next) => (acc + next), contentFuel);
  })
  .reduce((acc, next) => acc + next, 0);

console.log(result);
