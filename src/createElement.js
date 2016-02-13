import tags from './tags';

export function createElement(ctr, props, children) {
	if (props instanceof Array || typeof props !== 'object') props = children;
	if (typeof ctr === 'function') {
		const component = new ctr();
		component.props = props;
		return component;
	} if (typeof ctr === 'string' && !tags.includes(ctr)) {
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
}
