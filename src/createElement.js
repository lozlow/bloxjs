import tags from './tags';
import { createClass, getNextComponentName } from './createClass';

const pureFns = new Map();

function applyStyles(el, styles) {
	Object.keys(styles).forEach(
		key => el.style[key] = styles[key]
	);
}

export function applyProperties(el, properties) {
	Object.keys(properties || {}).forEach(
		key => {
			if (typeof el[key] !== undefined && key !== 'props') {
				if (key === 'style') {
					applyStyles(el, properties[key]);
				} else {
					el[key] = properties[key];
				}
			}
		}
	)
}

export function createElement(ctr, props, children) {
	if (props instanceof Array || typeof props !== 'object') props = children;
	props = props || {};
	if (typeof ctr === 'function' && ctr.prototype instanceof HTMLElement) {
		const component = new ctr();
		component.props = props;
		applyProperties(component, props);
		return component;
	} else if (typeof ctr === 'function') {
		let component;
		if (pureFns.has(ctr)) {
			component = pureFns.get(ctr);
		} else {
			let componentName = ctr.componentName || ctr.name;
			if (componentName === '') {
				componentName = getNextComponentName();
				console.warn(`Unnamed pure render function passed to createElement, using component name ${componentName}`);
			}
			component = createClass({
				componentName,
				render: ctr
			});
			pureFns.set(ctr, component);
		}
		return createElement(
			component,
			props,
			children
		);
	} else if (typeof ctr === 'string' && !tags.includes(ctr.toLowerCase())) {
		return document.createTextNode(ctr);
	} else {
		const el = document.createElement(ctr);
		applyProperties(el, props);

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
}
