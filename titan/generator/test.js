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

// 무작위 날짜 출력
const randomDate = getRandomDateWithinLastTwoMonths();
console.log(randomDate);