
function getRandomDateWithinLastTwoMonths() {
	// 현재 날짜
	const currentDate = new Date();

	// 두 달 전 날짜 계산
	const twoMonthsAgo = new Date();
	twoMonthsAgo.setMonth(currentDate.getMonth() - 2);

	// 두 날짜 사이의 무작위 날짜 생성
	const randomTimestamp = Math.random() * (currentDate - twoMonthsAgo) + twoMonthsAgo.getTime();

	// 무작위 타임스탬프를 Date 객체로 변환
	return new Date(randomTimestamp);
}

function formatDate(date) {
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, '0');  // 1월은 0부터 시작하므로 +1
	const day = String(date.getDate()).padStart(2, '0');
	const hours = String(date.getHours()).padStart(2, '0');
	const minutes = String(date.getMinutes()).padStart(2, '0');
	const seconds = String(date.getSeconds()).padStart(2, '0');

	return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}


const shipStatus = "OUT";
const stdTypes = ['NX10001', 'NX10002', 'NX10003', 'NX10004', 'NX10005', 'NX10006', 'NX10007', 'NX10008']; 
const equipMap = { 1: 1, 2: 1, 3: 2, 4: 2, 5: 3, 6: 3, 7: 4, 8: 4 }

const fs = require('fs');
const filename = `query_gantry_stack_${shipStatus}.txt`;
fs.writeFile(filename, '', 'utf8', (err) => {
  if (err) {
    console.error('파일 쓰기 실패:', err);
  } else {
    console.log('파일이 성공적으로 저장되었습니다.');
  }
});


function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}



// 8 * 10 * 10 * 8 = 640개

let count = 0;
for (let port = 5; port <= 8; port++) {	
	for (let row = 1; row <= 10; row++) {
		for (let column = 1; column <= 10; column++) {

			const warehouseId = 1;
			const equipmentId = equipMap[port];
			const level = rand(1, 8);			
			const stdName = stdTypes[rand(0, 7)];
			const skip = rand(0, 1);			
			if (skip === 1) {
				continue;
			}

			if (shipStatus == "OUT") {
				count ++;
				if (count > 100) {
					break;
				}
			}
			
			const query = `INSERT INTO gantry_stack (warehouse_id, equipment_id, port, bank, bay, level, standard_type, shipping_status, create_date) VALUES (${warehouseId}, ${equipmentId}, ${port}, ${row}, ${column}, ${level}, '${stdName}', '${shipStatus}', '${formatDate(getRandomDateWithinLastTwoMonths())}');\n`;	

				fs.appendFile(filename, query, 'utf8', (err) => {
					if (err) {
						console.error('파일 추가 실패:', err)	;
					} else {
						console.log('파일에 데이터가 추가되었습니다.');
					}
				});
			
		}
	}
}