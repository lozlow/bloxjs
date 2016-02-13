const Blox = {
	tags: ['div'],
	elementStates: {
		DETACHED: 0,
		CONSTRUCTED: 1,
		ATTACHED: 2
	},
	createElement(ctr, props, children) {
		if (props instanceof Array || typeof props !== 'object') props = children;
		if (typeof ctr === 'function') {
			const component = new ctr();
			component.props = props;
			return component;
		} if (typeof ctr === 'string' && !this.tags.includes(ctr)) {
			return document.createTextNode(ctr);
		} else {
			const el = document.createElement(ctr);
			if (children) {
				[].concat(children).forEach(
					child => {
						if (typeof child === 'string') child = this.createElement(child);
						el.appendChild(child);
					}
				);
			}

			return el;
		}
	},
	createClass(def) {
		const classProto = Object.create(
			HTMLElement.prototype,
			{
				createdCallback: {
					value: function $onCreated() {
						console.log('created', this);
						this.$state = Blox.elementStates.CONSTRUCTED;
					}
				},
				attachedCallback: {
					value: function $onAttached() {
						this.$state = Blox.elementStates.ATTACHED;
						this.$render();
						def.componentDidMount();
					}
				},
				$render: {
					value: function $render() {
						while (this.firstChild) {
							this.removeChild(this.firstChild);
						}
						const children = def.render(this.$props);
						if (children instanceof Array) {
							children.forEach(this.appendChild.bind(this));
						} else {
							this.appendChild(children);
						}
					}
				},
				props: {
					enumerable: true,
					set: function $setProps(props) {
						this.$props = props;
						def.componentDidReceiveProps(props);
						if ((!def.shouldComponentUpdate || !def.shouldComponentUpdate()) &&
							this.$state >= Blox.elementStates.ATTACHED) {
							this.$render();
						}
					},
					get: function $getProps() {
						return this.$props;
					}
				},
				$state: {
					value: 0,
					writable: true
				}
			}
		);
		const factory = document.registerElement(def.name, { prototype: classProto });
		return factory;
	},
	render(el, at) {
		at.appendChild(el);
	}
};

const Item2 = Blox.createClass({
	name: 'b-Item2',
	componentDidMount() {
		console.log('componentDidMount');
	},
	componentDidReceiveProps(props) {
		console.log('received props', props);
	},
	render(props) {
		return Blox.createElement('div', null, props.text || 'test2');
	}
});

const Item = Blox.createClass({
	name: 'b-Item',
	componentDidMount() {
		console.log('componentDidMount');
	},
	componentDidReceiveProps(props) {
		console.log('received props', props);
	},
	render(props) {
		return [Blox.createElement(props.text || 'test'), Blox.createElement(Item2, { text: 'number two' })];
	}
});

const el = Blox.createElement(Item, { text: 'hello' });
Blox.render(el, document.getElementById('app'));
setTimeout(() => el.props = { text: 'goodbye' }, 3000);
// setTimeout(() => Blox.render(Blox.createElement(Item, { text: 'hello' }), document.getElementById('app')), 3000);
