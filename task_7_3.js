'use strict';

const settings = {
    rowsCount: 21,
    colsCount: 21,
    speed: 2,
    winFoodCount: 50,
};

const config = {
    settings,

    init(userSettings) {
        Object.assign(this.settings, userSettings)
    },

    getRowsCount() {
        return this.settings.rowsCount;
    },

    getColsCount() {
        return this.settings.colsCount;
    },

    getSpeed() {
        return this.settings.speed;
    },

    getWinFoodCount() {
        return this.settings.winFoodCount;
    },

    validate() {
        const result = {
            isValid: true,
            errors: [],
        };

        if (this.settings.rowsCount < 10 || this.settings.rowsCount > 30) {
            result.isValid = false;
            result.errors.push('Неверные настройки, значение rowsCount должно быть в диапазоне [10,30].');
        }

        if (this.settings.colsCount < 10 || this.settings.colsCount > 30) {
            result.isValid = false;
            result.errors.push('Неверные настройки, значение colsCount должно быть в диапазоне [10,30].');
        }

        if (this.settings.speed < 1 || this.settings.speed > 10) {
            result.isValid = false;
            result.errors.push('Неверные настройки, значение speed должно быть в диапазоне [1,10].');
        }

        if (this.settings.winFoodCount < 5 || this.settings.winFoodCount > 50) {
            result.isValid = false;
            result.errors.push('Неверные настройки, значение winFoodCount должно быть в диапазоне [5,50].');
        }

        return result;
    }
};

const map = {
    cells: null,
    usedCells: null,

    init(rowsCount, colsCount) {
        this.cells = {};
        this.usedCells = [];

        this.renderMap(rowsCount, colsCount);
    },

    renderMap(rowsCount, colsCount) {
        const table = document.getElementById('game');
        table.innerHTML = '';

        for (let row = 0; row < rowsCount; row++) {
            const trElem = document.createElement('tr');
            trElem.classList.add('row');
            table.appendChild(trElem);

            for (let col = 0; col < colsCount; col++) {
                const tdElem = document.createElement('td');
                tdElem.classList.add('cell');
                this.cells[`x${col.toString()}_y${row.toString()}`] = tdElem;
                trElem.appendChild(tdElem);
            }
        }
    },

    render(snakePointsArray, foodPoint) {
        for (const cell of this.usedCells) {
            cell.className = 'cell';
        }

        this.usedCells = [];

        snakePointsArray.forEach((point, idx) => {
            const snakeCall = this.cells[`x${point.x}_y${point.y}`];
            snakeCall.classList.add(idx === 0 ? 'snakeHead' : 'snakeBody');
            this.usedCells.push(snakeCall);
        });

        const foodCell = this.cells[`x${foodPoint.x}_y${foodPoint.y}`];
        foodCell.classList.add('food');
        this.usedCells.push(foodCell);


    }
};

const snake = {
    body: null,
    direction: null,
    lastStepDirection: null,

    init(startBody, direction) {
        this.body = startBody;
        this.direction = direction;
        this.lastStepDirection = direction;
    },

    getBody() {
        return this.body;
    },

    getDirection() {
        return this.direction;
    },

    getLastStepDirection() {
        return this.lastStepDirection;
    },

    getNextStepHeadPoint(xConf = 0, yConf = 0) {
        const firstPoint = this.body[0];

        if (xConf && yConf) {
            if (this.isStepToBoard(xConf, yConf)) {
                switch (this.direction) {
                    case 'up':
                        return { x: firstPoint.x, y: yConf - 1 };
                    case 'down':
                        return { x: firstPoint.x, y: 0 };
                    case 'right':
                        return { x: 0, y: firstPoint.y };
                    case 'left':
                        return { x: xConf - 1, y: firstPoint.y };
                }
            } else {
                switch (this.direction) {
                    case 'up':
                        return { x: firstPoint.x, y: firstPoint.y - 1 };
                    case 'down':
                        return { x: firstPoint.x, y: firstPoint.y + 1 };
                    case 'right':
                        return { x: firstPoint.x + 1, y: firstPoint.y };
                    case 'left':
                        return { x: firstPoint.x - 1, y: firstPoint.y };
                }
            }
        } else {
            switch (this.direction) {
                case 'up':
                    return { x: firstPoint.x, y: firstPoint.y - 1 };
                case 'down':
                    return { x: firstPoint.x, y: firstPoint.y + 1 };
                case 'right':
                    return { x: firstPoint.x + 1, y: firstPoint.y };
                case 'left':
                    return { x: firstPoint.x - 1, y: firstPoint.y };
            }
        }
    },

    isOnePoint(point) {
        return this.body.some((snakePoint) => snakePoint.x === point.x && snakePoint.y === point.y);
    },

    growUp() {
        const lastBodyIdx = this.body.length - 1;
        const lastBodyPoint = this.body[lastBodyIdx];
        const lastBodyPointClone = Object.assign({}, lastBodyPoint);
        this.body.push(lastBodyPointClone);
    },

    makeStep(xConf, yConf) {
        this.lastStepDirection = this.direction;
        this.body.unshift(this.getNextStepHeadPoint(xConf, yConf));
        this.body.pop();
    },

    setDirection(direction) {
        this.direction = direction;
    },

    isStepToBoard(xConf, yConf) {
        const nextHeadPoint = this.getNextStepHeadPoint();

        return nextHeadPoint.x < 0
            || nextHeadPoint.y < 0
            || nextHeadPoint.x >= xConf
            || nextHeadPoint.y >= yConf;
    }
};

const food = {
    x: null,
    y: null,

    getCoordinates() {
        return {
            x: this.x,
            y: this.y,
        }
    },

    setCoordinates(point) {
        this.x = point.x;
        this.y = point.y;
    },

    isOnPoint(point) {
        return this.x === point.x && this.y === point.y;
    }
};

const status = {
    condition: null,

    setPlaying() {
        this.condition = 'playing';
    },

    setStopped() {
        this.condition = 'stopped';
    },

    setFinished() {
        this.condition = 'finished';
    },

    isPlaying() {
        return this.condition === 'playing';
    },

    isStopped() {
        return this.condition === 'stopped';
    },
};

const game = {
    config,
    map,
    snake,
    food,
    status,
    tickInterval: null,

    init(userSettings) {
        this.config.init(userSettings);

        const validation = this.config.validate();

        if (!validation.isValid) {
            for (const err of validation.errors) {
                console.error(err);
            }
            return;
        }

        this.map.init(this.config.getRowsCount(), this.config.getColsCount());

        this.setEventHandlers();
        this.reset();
    },

    setEventHandlers() {
        document.getElementById('playButton').addEventListener('click', () => this.playClickHandler());
        document.getElementById('newGameButton').addEventListener('click', () => this.newGameClickHandler());
        document.addEventListener('keydown', (event) => {
            this.keyDownHandler(event);
        });
    },

    playClickHandler() {
        if (this.status.isPlaying()) {
            this.stop();
        } else if (this.status.isStopped()) {
            this.play();
        }
    },

    reset() {
        this.stop();
        this.snake.init(this.getStartSnakeBody(), 'up');
        this.food.setCoordinates(this.getRandomFreeCoordinates());
        this.render();
    },

    play() {
        this.status.setPlaying();
        this.tickInterval = setInterval(() => {
            this.tickHandler();
        }, 1000 / this.config.getSpeed());
        this.setPlayButton('Стоп');
    },

    stop() {
        this.status.setStopped();
        clearInterval(this.tickInterval);
        this.setPlayButton('Старт');
    },

    finish() {
        this.status.setFinished();
        clearInterval(this.tickInterval);
        this.setPlayButton('Игра закончена', true);
    },

    tickHandler() {
        if (!this.canMakeStep()) {
            return this.finish();
        }

        if (this.food.isOnPoint(this.snake.getNextStepHeadPoint())) {
            this.snake.growUp();

            this.food.setCoordinates(this.getRandomFreeCoordinates());

            if (this.isGameWon()) {
                this.finish();
            }
        }

        this.snake.makeStep(this.config.getColsCount(), this.config.getRowsCount());
        this.render();
    },

    render() {
        this.map.render(this.snake.getBody(), this.food.getCoordinates());
    },

    getRandomFreeCoordinates() {
        const exclude = [this.food.getCoordinates(), ...this.snake.getBody()];

        while (true) {
            const randomPoint = {
                x: Math.floor(Math.random() * this.config.getColsCount()),
                y: Math.floor(Math.random() * this.config.getRowsCount())
            }

            if (!exclude.some((point) => randomPoint.x === point.x && randomPoint.y === point.y)) {
                return randomPoint;
            }
        }
    },

    getStartSnakeBody() {
        return [
            {
                x: Math.floor(this.config.getColsCount() / 2),
                y: Math.floor(this.config.getRowsCount() / 2),
            }
        ]
    },

    setPlayButton(textContent, isDisable = false) {
        const playButton = document.getElementById('playButton');
        playButton.textContent = textContent;
        isDisable ? playButton.classList.add('disabled') : playButton.classList.remove('disabled');
    },

    canMakeStep() {
        const nextHeadPoint = this.snake.getNextStepHeadPoint();

        return !this.snake.isOnePoint(nextHeadPoint);
    },

    isGameWon() {
        return this.snake.getBody().length > this.config.getWinFoodCount();
    },

    newGameClickHandler() {
        this.reset();
    },

    keyDownHandler(event) {
        if (!this.status.isPlaying()) {
            return;
        }

        const direction = this.getDirectionByCode(event.code);

        if (this.canStepDirection(direction)) {
            this.snake.setDirection(direction);
        }
    },

    getDirectionByCode(code) {
        switch (code) {
            case 'KeyW':
            case 'ArrowUp':
                return 'up';
            case 'KeyS':
            case 'ArrowDown':
                return 'down';
            case 'KeyD':
            case 'ArrowRight':
                return 'right';
            case 'KeyA':
            case 'ArrowLeft':
                return 'left';
        }
    },

    canStepDirection(direction) {
        const lastStepDirection = this.snake.getLastStepDirection();

        return direction === 'up' && lastStepDirection !== 'down'
            || direction === 'down' && lastStepDirection !== 'up'
            || direction === 'right' && lastStepDirection !== 'left'
            || direction === 'left' && lastStepDirection !== 'right';
    }
};

game.init({
    rowsCount: 20,
    colsCount: 20,
    speed: 5,
    winFoodCount: 25,
});