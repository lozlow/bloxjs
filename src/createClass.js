import elementStates from './elementStates';

export function createClass(def) {
	const classProto = Object.create(
		HTMLElement.prototype,
		{
			createdCallback: {
				value: function $onCreated() {
					console.log('created', this);
					this.$state = elementStates.CONSTRUCTED;
				}
			},
			attachedCallback: {
				value: function $onAttached() {
					this.$state = elementStates.ATTACHED;
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
					if ((!def.shouldComponentUpdate || def.shouldComponentUpdate()) &&
						this.$state >= elementStates.ATTACHED) {
						this.$render();
					}
				},
				get: function $getProps() {
					return this.$props;
				}
			},
			$props: {
				value: {},
				writable: true,
				enumerable: true
			},
			$state: {
				value: 0,
				writable: true,
				enumerable: false
			}
		}
	);
	const factory = document.registerElement(def.name, { prototype: classProto });
	return factory;
}
