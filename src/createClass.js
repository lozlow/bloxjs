import elementStates from './elementStates';
import { applyProperties } from './createElement';
import DomDiff from 'diff-dom';

let unnamedComponentCount = 1;

export function getNextComponentName() {
	return 'b-UnnamedComponent' + unnamedComponentCount++;
}

export function createClass(def) {
	const componentDefinition = Object.assign(
		{
			componentWillMount() {},
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
					this.$props = Object.assign({}, componentDefinition.defaultProps);
					this.$state = elementStates.CONSTRUCTED;
				}
			},
			attachedCallback: {
				value: function $onAttached() {
					componentDefinition.componentWillMount.call(this);
					applyProperties(
						this,
						Object.assign(
							{},
							{
								[componentDefinition.className && 'className']: componentDefinition.className,
								[componentDefinition.style && 'style']: componentDefinition.style
							}
						)
					);
					this.$attachChildren();
					this.$state = elementStates.ATTACHED;
					componentDefinition.componentDidMount.call(this);
				}
			},
			$attachChildren: {
				value: function $attachChildren() {
					let children = componentDefinition.render.call(this, this.$props);

					const append = (el) => {
						if (el instanceof Array) {
							el.forEach(append);
						} else {
							if (typeof el === 'string') {
								el = document.createTextNode(el);
							}
							this.appendChild(el);
						}
					}

					append(children);
				}
			},
			$patch: {
				value: function $patch(nextProps) {
					const differ = new DomDiff();
					const nodes = this.childNodes;
					const next = [].concat(componentDefinition.render.call(this, nextProps));
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
					componentDefinition.componentDidReceiveProps(props);
					if (this.$state >= elementStates.ATTACHED &&
						(!componentDefinition.shouldComponentUpdate || componentDefinition.shouldComponentUpdate.call(this, this.$props, props))) {
						this.$patch(props);
					}
					this.$props = props;
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
		componentDefinition.componentName = getNextComponentName();
		console.warn(`componentName not supplied in component definition, using ${componentDefinition.componentName}`);
	}

	const factory = document.registerElement(componentDefinition.componentName, { prototype: classProto });
	return factory;
}
