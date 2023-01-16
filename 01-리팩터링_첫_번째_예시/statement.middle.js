/*
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
/**
 * - 최상단 코드에 대응하는 HTML 버전만 작성하면 끝이다.
 * => 분리된 계산 함수들이 중첩함수로 존재해서 HTML에 이 모두가 복사되어 붙여진다.
 * => 텍스트 버전과 HTML 버전 모두가 똑같은 계산함수를 사용하게 만들고 싶다.
 */
// 중간 데이터 구조
export default function statement(invoice, plays) {
  let result = `청구내역 (고객명: ${invoice.customer})\n`;
  for (let perf of invoice.performances) {
    result += `${playFor(perf).name} : ${usd(amountFor(perf) / 100)} (${
      perf.audience
    }석)\n`;
  }
  result += `총액: ${usd(totalAmount() / 100)}\n`;
  result += `적립 포인트: ${totalVolumeCredits}점\n`;
  return result;

  function amountFor(aPerformance) {
    let result = 0;

    switch (playFor(aPerformance).type) {
      case 'tragedy': // 비극
        result = 40000;

        if (aPerformance.audience > 30) {
          result += 1000 * (aPerformance.audience - 30);
        }
        break;
      case 'comedy': // 희극
        result = 30000;

        if (aPerformance.audience > 20) {
          result += 10000 + 500 * (aPerformance.audience - 20);
        }
        result += 300 * aPerformance.audience;

        break;

      default:
        throw new Error(`알 수 없는 장르 : ${playFor(aPerformance).type}`);
    }

    return result;
  }

  // 질의 함수로 바꾸기
  function playFor(aPerformance) {
    return plays[aPerformance.playID];
  }

  // 질의 함수로 바꾸기
  function volumeCreditsFor(perf) {
    let result = 0;
    result += Math.max(perf.audience - 30, 0);
    if ('comedy' === playFor(perf).type) {
      result += Math.floor(perf.audience / 5);
    }

    return result;
  }

  function usd(aNumber) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(aNumber);
  }

  function totalVolumeCredits() {
    let result = 0;
    for (let perf of invoice.performances) {
      result += volumeCreditsFor(perf);
    }

    return result;
  }

  function totalAmount() {
    let result = 0;

    for (let perf of invoice.performances) {
      result += amountFor(perf);
    }
    return result;
  }
}

// 함수 추출
