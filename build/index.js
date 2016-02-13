const Item2 = blox.createClass({
	name: 'b-Item2',
	componentDidMount() {
		console.log('componentDidMount');
	},
	componentDidReceiveProps(props) {
		console.log('received props', props);
	},
	render(props) {
		return blox.createElement('div', null, props.text || 'test2');
	}
});

const Item = blox.createClass({
	name: 'b-Item',
	componentDidMount() {
		console.log('componentDidMount');
	},
	componentDidReceiveProps(props) {
		console.log('received props', props);
	},
	render(props) {
		return [blox.createElement(props.text || 'test'), blox.createElement(Item2, { text: 'number two' })];
	}
});

const el = blox.createElement(Item, { text: 'hello' });
blox.render(el, document.getElementById('app'));
setTimeout(() => el.props = { text: 'goodbye' }, 3000);
// setTimeout(() => blox.render(blox.createElement(Item, { text: 'hello' }), document.getElementById('app')), 3000);
