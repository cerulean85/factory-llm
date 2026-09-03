const fs = require('fs');
fs.writeFile(`./data/query_crane_cell.txt`, '', 'utf8', (err) => {
  if (err) {
    console.error('파일 쓰기 실패:', err);
  } else {
    console.log('파일이 성공적으로 저장되었습니다.');
  }
});

let equipmentId = 1;
const [maxCount, maxEqipCount, maxLevel] = [320, 8, 8];
while (equipmentId <= maxEqipCount) {
	let bank = 1;
	let bay = 1;
	let level = 1;
	for (let i = 1; i <= maxCount; i++) {

		if (i == ((maxCount / 2) + 1)) {
			bank = 2;
			bay = 1;
			level = 1;
		}

		if (level > maxLevel) {
			level = 1;
			bay ++;
		}
		
		const query = `INSERT INTO crane_cell (warehouse_id, equipment_id, bank, bay, level) VALUES (1, ${equipmentId}, ${bank}, ${bay}, ${level});\n`;
		level ++;

		// console.log(query);

		fs.appendFile('query.txt', query, 'utf8', (err) => {
			if (err) {
				console.error('파일 추가 실패:', err);
			} else {
				console.log('파일에 데이터가 추가되었습니다.');
			}
		});
		

		
	}
	equipmentId ++;
}
