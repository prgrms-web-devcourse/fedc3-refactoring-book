function usd(aNumber) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(aNumber);
}

export default function statement(invoice, plays) {
  return renderPlainText(createStatementData(invoice, plays));
}

// createStatemnetData.js
function createStatementData(invoice, plays) {
  const statementData = {}; // 중간 데이터 역할
  statementData.customer = invoice.customer;
  statementData.performances = invoice.performances.map(enrichPerformance);
  statementData.totalVolumeCredits = totalVolumeCredits(statementData);
  statementData.totalAmount = totalAmount(statementData);
  return renderPlainText(statementData, plays);

  // 중간 데이터에 연극 데이터도 추가해야함
  function enrichPerformance(aPerformance) {
    const result = Object.assign({}, aPerformance); // 얕은 복사 (공간 확보)
    result.play = playFor(result);
    result.amount = amountFor(result);
    result.volumeCredits = volumeCreditsFor(result);
    return result;
  }
  // 질의 함수로 바꾸기
  function playFor(aPerformance) {
    return plays[aPerformance.playID];
  }
  function amountFor(aPerformance) {
    let result = 0;

    switch (aPerformance.play.type) {
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
        throw new Error(`알 수 없는 장르 : ${aPerformance.play.type}`);
    }

    return result;
  }
  function volumeCreditsFor(perf) {
    let result = 0;
    result += Math.max(perf.audience - 30, 0);
    if ('comedy' === perf.play.type) {
      result += Math.floor(perf.audience / 5);
    }

    return result;
  }
  function totalVolumeCredits() {
    return data.performances.reduce(
      (acc, cur) => (acc += cur.volumeCredits),
      0
    );
  }
  function totalAmount() {
    return data.performances.reduce((acc, cur) => (acc += cur.amount), 0);
  }
  return statementData;
}

// 두번째 단계에 필요
function renderPlainText(data) {
  let result = `청구내역 (고객명: ${data.customer})\n`;

  for (let perf of data.performances) {
    result += `${perf.play.name} : ${usd(perf.amount / 100)} (${
      perf.audience
    }석)\n`;
  }
  result += `총액: ${usd(data.totalAmount / 100)}\n`;
  result += `적립 포인트: ${data.totalVolumeCredits}점\n`;

  return result;
}

// HTML 버전 작성하기 준비 끝
function renderHtml(statementData) {
  let result = `<h1>청구 내역 (고객명: ${statementData.customer} )</h1>\n`;

  result += '<table>\n';
  result += '<tr><th>연극</th><th>좌석 수</th><th>금액</th></tr>';

  for (let perf of statementData.performances) {
    result += `<tr><td>${perf.play.name}</td><td>${perf.audience}</td>`;
    result += `<td>${usd(perf.amount)}</td></tr>\n`;
  }
  result += '</table>\n';
  result += `<p>총액: <em>${usd(statementData.totalAmount)}</em></p>\n`;
  result += `<p>적립 포인트: <em>${statementData.totalVolumeCredits}</em>점</p>\n`;
  result += '</table>\n';

  return result;
}
