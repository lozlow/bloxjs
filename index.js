const Blox = {
	tags: ['div'],
	createElement(ctr, props, children) {
		if (props instanceof Array || typeof props !== 'object') props = children;
		if (typeof ctr === 'function') {
			return new ctr();
		} if (typeof ctr === 'string' && !this.tags.includes(ctr)) {
			return document.createTextNode(ctr);
		} else {
			const el = document.createElement(ctr);
			if (children) {
				[].concat(children).forEach(
					child => el.appendChild(child)
				);
			}

			return el;
		}
	},
	createClass(def) {
		const classProto = Object.create(HTMLElement.prototype);
		classProto.attachedCallback = function onComponentDidMount() {
			const children = def.render({});
			if (children instanceof Array) {
				children.forEach(this.appendChild.bind(this));
			} else {
				this.appendChild(children);
			}
		};
		const factory = document.registerElement(def.name, { prototype: classProto });
		return factory;
	},
	render(el, at) {
		at.appendChild(el);
	}
};

const Item2 = Blox.createClass({
	name: 'b-Item2',
	render(props) {
		return Blox.createElement('div', null, Blox.createElement(props.text || 'test2'));
	}
});

const Item = Blox.createClass({
	name: 'b-Item',
	render(props) {
		return [Blox.createElement(props.text || 'test'), Blox.createElement(Item2)];
	}
});

Blox.render(Blox.createElement(Item, { text: 'hello' }), document.getElementById('app'));
// setTimeout(() => Blox.render(Blox.createElement(Item, { text: 'hello' }), document.getElementById('app')), 3000);
