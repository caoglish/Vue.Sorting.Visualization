(function (window) {
    let orginalData = _(_.range(1, 100)).shuffle().shuffle().slice(0, 10).value();
    let millisecond = 300;
 
    let bublesort = function (array, record) {
        for (var i = 0; i < array.length; i++) {
            for (var j = 0; j < array.length - i - 1; j++) {
                record.bind(this)(array);
                if (array[j] > array[j + 1]) {
                    var tmp = array[j];
                    array[j] = array[j + 1];
                    array[j + 1] = tmp;
                }
            }
        }
        record.bind(this)(array);
    }


  
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

 
    var queue={
        queue: Promise.resolve(),
        add: function(func) {
           this.queue = this.queue.then(() => {
                return setTimeoutPromise( ()=> {
                    func.bind(this)();
                }, millisecond)
            })
        }
    };
 

    
   

  


    let insertsort = function (array,record) {
        for (var i = 1; i < array.length; i++) {
            for (var j = i; j - 1 >= 0; j--) {
                record(array)
                if (array[j] < array[j - 1]) {
                    var temp = array[j];
                    array[j] = array[j - 1];
                    array[j - 1] = temp;
                    
                }

            }
        }
        record(array)
    };

    let selectionsort = function (array, record) {
        for (var i = 0; i < array.length; i++) {
            var min = i;
            for (var j = i + 1; j < array.length; j++) {
                record(array)
                if (array[j] < array[min]) {
                    min = j;
                }
            }
            var temp = array[i];
            array[i] = array[min];
            array[min] = temp;
            
        }
        record(array)
    };


    sortList={
        bublesort: bublesort,
        insertsort: insertsort,
        selectionsort: selectionsort
    }
    let sort = bublesort;

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
                sort(this.lines, (list)=> {
                    let tmplist=_.clone(list)
                    queue.add(()=>{
                        this.lines = _.clone(tmplist);
                    });
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
