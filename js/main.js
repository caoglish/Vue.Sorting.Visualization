(function (window) {

    let millisecond = 500;

    let setTimeoutPromise = function (func, ms) {
        ms = ms || 0;
        return new Promise(
            function (resolve, reject) {
                setTimeout(() => {
                    resolve(func());
                }, ms);
            }
        )
    }

    var queue = {
        queue: Promise.resolve(),
        add: function (func) {
            this.queue = this.queue.then(() => {
                return setTimeoutPromise(() => {
                    func.bind(this)();
                }, millisecond)
            })
        }
    };

    let bublesort = function (array, record) {

        for (var i = 0; i < array.length; i++) {
            for (var j = 0; j < array.length - i - 1; j++) {

                if (array[j] > array[j + 1]) {
                    var tmp = array[j];
                    array[j] = array[j + 1];
                    array[j + 1] = tmp;
                    record.bind(this)(array);
                }
            }
        }
        record.bind(this)(array);
    }

    let insertsort = function (array, record) {
        for (var i = 1; i < array.length; i++) {
            for (var j = i; j - 1 >= 0; j--) {

                if (array[j] < array[j - 1]) {
                    var temp = array[j];
                    array[j] = array[j - 1];
                    array[j - 1] = temp;
                    record(array)
                }

            }
        }
        record(array)
    };

    let selectionsort = function (array, record) {
        for (var i = 0; i < array.length; i++) {
            var min = i;
            for (var j = i + 1; j < array.length; j++) {

                if (array[j] < array[min]) {
                    min = j;
                }
            }
            var temp = array[i];
            array[i] = array[min];
            array[min] = temp;
            record(array)
        }
        record(array)
    };

    let makeRandomNum = () => {
        return _(_.range(1, 100)).shuffle().shuffle().slice(0, 10).value();
    };

    initLines = makeRandomNum();


    sortList = {
        bublesort: bublesort,
        insertsort: insertsort,
        selectionsort: selectionsort
    }
    let sort = bublesort;

    window.app = new Vue({
        el: "#app",
        data: {
            message: "Vuejs is work",
            lines: initLines,
            originalLines: _.clone(initLines),
            isShowApp: true,
            isDone: true
        },
        created: function () {},
        methods: {
            resetData() {
                this.isShowApp = false;
                this.lines = makeRandomNum();
                this.originalLines = _.clone(this.lines);
                queue.add(() => (this.isShowApp = true));
            },
            sort: function () {
                this.isDone = false;
                this.reset()

                sort(_.clone(this.lines), (list) => {
                    let tmplist = _.clone(list)
                    queue.add(() => {
                        this.lines = _.clone(tmplist);
                    });
                });
                queue.add(() => {
                    this.isDone = true;
                });
            },
            reset() {
                this.lines = _.clone(this.originalLines);
            },
            setSortAlgorithm(algorithm) {
                sort = sortList[algorithm];
            },
        }
    });

})(window);