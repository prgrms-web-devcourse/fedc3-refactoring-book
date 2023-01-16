/**
 * 모든 과정
 * - 함수쪼개기
 * 1. 함수추출하기
 * 2. 지역 변수 이름 좀 더 명확하게 바꾸기
 * 3. 임시 변수를 질의 함수로 바꾸기
 * - 필수: 컴파일-테스트-커밋
 * 4. 변수 인라인 하기
 * 5. 함수 선언 바꾸기
 *
 * 6. 반복문 쪼개기
 *  - 문장 슬라이스 하기
 */

export default function statement(invoice, plays) {
  let totalAmount = 0;
  let volumeCredits = 0;
  let result = `청구내역 (고객명: ${invoice.customer})\n`;

  const format = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format;

  for (let perf of invoice.performances) {
    const play = plays[perf.playID];

    let thisAmount = 0;

    switch (play.type) {
      case 'tragedy': // 비극
        thisAmount = 40000;

        if (perf.audience > 30) {
          thisAmount += 1000 * (perf.audience - 30);
        }
        break;
      case 'comedy': // 희극
        thisAmount = 30000;

        if (perf.audience > 20) {
          thisAmount += 10000 + 500 * (perf.audience - 20);
        }
        thisAmount += 300 * perf.audience;

        break;

      default:
        throw new Error(`알 수 없는 장르 : ${play.type}`);
    }

    // 포인트를 적립한다.
    volumeCredits += Math.max(perf.audience - 30, 0);

    // 희극 관객 5명마다 추가 포인트를 제공한다.
    if ('comedy' === play.type) {
      volumeCredits += Math.floor(perf.audience / 5);
    }

    result += `${play.name} : ${format(thisAmount / 100)} (${
      perf.audience
    }석)\n`;
    totalAmount += thisAmount;
  }

  result += `총액: ${format(totalAmount / 100)}\n`;
  result += `적립 포인트: ${volumeCredits}점\n`;

  return result;
}
