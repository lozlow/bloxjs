import elementStates from './elementStates';
import { applyProperties } from './createElement';
import DomDiff from 'diff-dom';

let unnamedComponentCount = 1;

export function createClass(def) {
	const componentDefinition = Object.assign(
		{
			componentDidMount() {},
			componentDidReceiveProps() {}
		},
		def
	);
	const classProto = Object.create(
		HTMLElement.prototype,
		{
			createdCallback: {
				value: function $onCreated() {
					this.$state = elementStates.CONSTRUCTED;
				}
			},
			attachedCallback: {
				value: function $onAttached() {
					this.$state = elementStates.ATTACHED;
					this.$attachChildren();
					applyProperties(this, Object.assign(
						{},
						{
							[componentDefinition.className && 'className']: componentDefinition.className,
							[componentDefinition.style && 'style']: componentDefinition.style
						}
					));
					componentDefinition.componentDidMount();
				}
			},
			$attachChildren: {
				value: function $attachChildren() {
					let children = componentDefinition.render(this.$props);
					if (children instanceof Array) {
						children.forEach(this.appendChild.bind(this));
					} else {
						if (typeof children === 'string') {
							children = document.createTextNode(children);
						}
						this.appendChild(children);
					}
				}
			},
			$patch: {
				value: function $patch(nextProps) {
					const differ = new DomDiff();
					const nodes = this.childNodes;
					const next = [].concat(componentDefinition.render(nextProps));
					const patches = Array.from(nodes).map(
						(node, idx) => { return differ.diff(node, next[idx]) }
					);
					patches.forEach(
						(patch, idx) => differ.apply(nodes[idx], patch)
					);
					applyProperties(this, nextProps);
				}
			},
			props: {
				enumerable: true,
				set: function $setProps(props) {
					this.$props = props;
					componentDefinition.componentDidReceiveProps(props);
					if ((!componentDefinition.shouldComponentUpdate || componentDefinition.shouldComponentUpdate()) &&
						this.$state >= elementStates.ATTACHED) {
						this.$patch(props);
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

	if (!componentDefinition.componentName) {
		componentDefinition.componentName = 'b-UnnamedComponent' + unnamedComponentCount++;
		console.warn(`componentName not supplied in component definition, using ${componentDefinition.componentName}`);
	}

	const factory = document.registerElement(componentDefinition.componentName, { prototype: classProto });
	return factory;
}
