(function (window) {
	let millisecond = 300;
	let sortComponentList = [];

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

	var queueGenerator = function () {
		return {
			queue: Promise.resolve(),
			add: function (func) {
				this.queue = this.queue.then(() => {
					return setTimeoutPromise(() => {
						func.bind(this)();
					}, millisecond)
				})
			}
		};
	}

	let bublesort = function (array, record) {
		for (var i = 0; i < array.length; i++) {
			for (var j = 0; j < array.length - i - 1; j++) {
				record(array,j);
				if (array[j] > array[j + 1]) {
					var tmp = array[j];
					array[j] = array[j + 1];
					array[j + 1] = tmp;
					
				}
			}
		}
		record(array,j);
	}

	let insertsort = function (array, record) {
		for (var i = 1; i < array.length; i++) {
			for (var j = i; j - 1 >= 0; j--) {
				record(array,j)
				if (array[j] < array[j - 1]) {
					var temp = array[j];
					array[j] = array[j - 1];
					array[j - 1] = temp;
				}
			}
		}
		record(array,j)
	};

	let selectionsort = function (array, record) {
		for (var i = 0; i < array.length; i++) {
			var min = i;
			for (var j = i + 1; j < array.length; j++) {
				
				if (array[j] < array[min]) {
					min = j;
				}
				record(array,j,min)
			}
			var temp = array[i];
			array[i] = array[min];
			array[min] = temp;
			
		}
		record(array,j,min)
	};

	let makeRandomNum = () => {
		return _(_.range(1, 100)).shuffle().shuffle().slice(0, 15).value();
	};
	initLines = makeRandomNum();

	let sortList = {
		bublesort: bublesort,
		insertsort: insertsort,
		selectionsort: selectionsort
	}


	window.dev = sortComponentList
	Vue.component('visual-sort', {
		template: '#visual-sort-template',
		props: ['type'],
		data: function () {
			return {
				queue: queueGenerator(),
				message: "Vuejs is work incomponent",
				lines: initLines,
				originalLines: _.clone(initLines),
				isShowApp: true,
				isDone: true,
				currentPosition:0,
				highlight:null,
				sortAlgorithm: sortList[this.type]
			}
		},
		created: function () {
			sortComponentList.push(this);
		},
		methods: {
			resetData(data) {
				this.isShowApp = false;
				this.lines = data;
				this.originalLines = _.clone(this.lines);
				this.queue.add(() => (this.isShowApp = true));
			},
			sort: function () {
				this.isDone = false;
				this.reset()
				this.sortAlgorithm(_.clone(this.lines), (list,position,highlight) => {
					

					let tmplist = _.clone(list)
					this.queue.add(() => {
						
						this.lines = _.clone(tmplist);
						this.currentPosition=position;
						if(highlight!==undefined) {
							this.highlight=highlight;
							console.log(this.highlight);
						}
					});
				});
				this.queue.add(() => {
					this.isDone = true;
				});
			},
			reset() {
				this.lines = _.clone(this.originalLines);
			},
			setSortAlgorithm(algorithm) {
				this.sortAlgorithm = sortList[algorithm];
			},
		}
	})

	window.app = new Vue({
		el: "#app",
		component: ["visual-sort"],
		data: {
			sortComponentList: sortComponentList,
			lines: initLines,
			originalLines: _.clone(initLines),
		},
		mounted: function () {
			this.sort();
		},
		methods: {
			resetData() {
				this.lines = makeRandomNum();
				this.originalLines = _.clone(this.lines);
				_.each(this.sortComponentList, (sc) => {
					sc.resetData(this.originalLines);
				});

			},
			sort() {
				_.each(this.sortComponentList, (sc) => {
					sc.sort();
				});
			}
		},
		computed: {
			isDone: function () {
				return this.sortComponentList.reduce((sum, sc) => {
					return sum & sc.isDone;
				}, true)
			}
		}
	});

})(window);