const Item2 = blox.createClass({
	componentName: 'b-Item2',
	componentDidMount() {
		console.log('componentDidMount');
	},
	componentDidReceiveProps(props) {
		console.log('received props', props);
	},
	render(props) {
		return blox.createElement(
			'div',
			null,
			[
				blox.createElement(
					'input',
					{
						oninput: e => {
							const el = e.currentTarget;
							const pos = el.selectionStart;
							// const next = el.value.slice(0, pos) + String.fromCharCode(e.keyCode) + el.value.slice(pos);
							setTimeout(() => itemTmp.props = { text: el.value /* next */ }, 0)
						},
						value: props.text
					}
				),
				props.text || 'test2'
			]);
	}
});

var itemTmp = blox.createElement(Item2, { text: 'abcdef' });

const Item = blox.createClass({
	componentName: 'b-Item',
	componentDidMount() {
		console.log('componentDidMount');
	},
	componentDidReceiveProps(props) {
		console.log('received props', props);
	},
	render(props) {
		return [
			blox.createElement(props.text || 'test'),
			blox.createElement('button', { onclick: () => window.el.props = { style: { color: 'orange' } } }, 'Make orange'),
			itemTmp
		];
	}
});

// window.el = blox.createElement(Item, { style: { color: '#eee' }, text: 'hello' });
// blox.render(el, document.getElementById('app'));
// setTimeout(() => el.props = { text: 'goodbye' }, 3000);
// setTimeout(() => blox.render(blox.createElement(Item, { text: 'hello' }), document.getElementById('app')), 3000);

function Label(props) {
	return props.label;
}
Label.componentName = 'b-label';

const MenuItem = blox.createClass({
	style: {
		display: 'inline-block',
		background: '#FBFBFB',
		padding: '8px',
		border: '1px solid #eee'
	},
	render(props) {
		return blox.createElement(Label, { label: props.label });
	}
});

const Menu = blox.createClass({
	render(props) {
		return props.items.map(item => blox.createElement(MenuItem, item));
	}
});

blox.render(blox.createElement(Menu, { items: [{ label: 'Home' }, { label: 'About' }] }), document.getElementById('app'));
