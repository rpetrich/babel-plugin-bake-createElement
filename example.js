/** @jsx ceviche.h */
import * as ceviche from "ceviche";

function handleClick() {
	console.log("Clicked!");
}

const array = [];

export default <div>
	<h1 key="title">Title</h1>
	<p class="test">Some text</p>
	<button onclick={handleClick}>Click me!</button>
	<p class="cantBake">{array}</p>
	<p>{[<div/>]}</p>
</div>;
