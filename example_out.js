/** @jsx ceviche.h */
import * as ceviche from "ceviche";

function handleClick() {
	console.log("Clicked!");
}

const array = [];

export default {
	type: 1,
	tag: "div",
	props: {
		children: [{
			type: 1,
			tag: "h1",
			props: {
				children: ["Title"]
			},
			text: null,
			key: "title",
			index: null,
			_children: null,
			_el: null,
			_component: null
		}, {
			type: 1,
			tag: "p",
			props: { "class": "test", children: ["Some text"]
			},
			text: null,
			key: null,
			index: null,
			_children: null,
			_el: null,
			_component: null
		}, {
			type: 1,
			tag: "button",
			props: { onclick: handleClick, children: ["Click me!"]
			},
			text: null,
			key: null,
			index: null,
			_children: null,
			_el: null,
			_component: null
		}, ceviche.h(
			"p",
			{ "class": "cantBake" },
			array
		), {
			type: 1,
			tag: "p",
			props: {
				children: [{
					type: 1,
					tag: "div",
					props: {},
					text: null,
					key: null,
					index: null,
					_children: null,
					_el: null,
					_component: null
				}]
			},
			text: null,
			key: null,
			index: null,
			_children: null,
			_el: null,
			_component: null
		}]
	},
	text: null,
	key: null,
	index: null,
	_children: null,
	_el: null,
	_component: null
};
