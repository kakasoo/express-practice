function solution(num) {
    let [sum, count] = [0, 0];

    for (let i = 1; num - sum - i >= 0; sum += i++) {
        if ((num - sum) % i === 0) {
            count++;
        }
    }

    console.log(count);
}
