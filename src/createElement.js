import tags from './tags';

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
	if (typeof ctr === 'function') {
		const component = new ctr();
		component.props = props;
		applyProperties(component, props);
		return component;
	} if (typeof ctr === 'string' && !tags.includes(ctr.toLowerCase())) {
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
