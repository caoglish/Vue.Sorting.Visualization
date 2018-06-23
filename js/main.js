(function (window) {
    
    let bublesort = function (array) {
        for (var i = 0; i < array.length; i++) {
            for (var j = 0; j < array.length - i - 1; j++) {
                if (array[j] > array[j + 1]) {
                    var tmp = array[j];
                    array[j] = array[j + 1];
                    array[j + 1] = tmp;
                    this.lines = _.clone(array);
                }
            }
        }
        this.lines = _.clone(array);
    }

    let insertsort = function (array) {
        for (var i = 1; i < array.length; i++) {
            for (var j = i; j - 1 >= 0; j--) {
                if (array[j] < array[j - 1]) {
                    var temp = array[j];
                    array[j] = array[j - 1];
                    array[j - 1] = temp;
                    return array;
                }

            }
        }
        return array;
    };

    let selectionsort = function (array) {
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
            return array
        }
        return array
    };

  
    sortList={
        bublesort: bublesort,
        insertsort: insertsort
    }
    let sort = bublesort;

    let orginalData = _(_.range(1, 100)).shuffle().shuffle().slice(0, 10).value();



    window.app = new Vue({
        el: "#app",
        data: {
            message: "Vuejs is work",
            lines: orginalData,
            originalLines: _.clone(orginalData),
            isStarted: false
        },
        created: function () {},
        methods: {
            sort: function () {
                sort.bind(this)(this.lines)
                // var lastList = _.clone(this.lines);
                // var newList = _.clone(sort(this.lines));
                // if (!_.isEqual(lastList, newList)) {
                //     this.lines = newList;
                //     isDone = false;
                // } else {
                //     isDone = true;
                // }
                // return isDone;
            },
            reset(){
                this.lines = _.clone(this.originalLines);
            },
            setSortAlgorithm(algorithm){
                sort = sortList[algorithm];
            },
            start: function () {
                //this.reset()
                this.isStarted = false;
                let test = (flag) => {
                    if (!flag) {
                        setTimeout(() => {
                            let isDone = this.sort();
                            //test(isDone);
                            test(true);
                            if (isDone) this.isStarted = !isDone;
                        }, 300);
                        return;
                    }
                }
                test(false);
            }
        }
    });

})(window);