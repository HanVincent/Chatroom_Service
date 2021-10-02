const validateCommand = message => {
    const [command, terms, nums] = message.split(' ');

    return command.toLowerCase().trim() === "/whoisspy"
        && terms.split(',').length === nums.split(',').length;
}

const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

const initGame = (message, players) => {
    shuffleArray(players);

    const [_, terms, nums] = message.split(' ');
    const people_nums = nums.split(',').map(num => parseInt(num));
    const total = people_nums.reduce((a, b) => a + b, 0);
    if (total !== players.length) {
        throw new Error("Wrong people num");
    }

    const group = {};
    let start = 0;
    terms.split(',').forEach((term, i) => {
        group[term] = players.slice(start, start + people_nums[i]);
        start += people_nums[i];
    });
    return group;
};

module.exports = { validateCommand, shuffleArray, initGame };
