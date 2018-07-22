module.exports = function({ types, template }) {

	function object(obj) {
		const result = [];
		for (const key of Object.keys(obj)) {
			result.push(types.objectProperty(types.identifier(key), obj[key]));
		}
		return types.objectExpression(result);
	}

	function importBindingForPath(path) {
		if (path.isIdentifier()) {
			const binding = path.scope.getBinding(path.node.name);
			if (binding && binding.path.isImportSpecifier() &&
				binding.path.node.imported.type === "Identifier" &&
				binding.path.parent.type === "ImportDeclaration" &&
				binding.path.parent.source.type === "StringLiteral") {
				return {
					module: binding.path.parent.source.value,
					export: binding.path.node.imported.name,
				};
			}
		} else if (path.isMemberExpression() && !path.node.computed && path.node.object.type === "Identifier") {
			const binding = path.scope.getBinding(path.node.object.name);
			if (binding) {
				if (binding.path.isImportNamespaceSpecifier() && binding.path.parent.source.type === "StringLiteral") {
					return {
						module: binding.path.parent.source.value,
						export: path.node.property.name,
					};
				}
				if (binding.path.isVariableDeclarator()) {
					let initPath = binding.path.get("init");
					if (initPath.isCallExpression() && initPath.get("callee").isIdentifier() && initPath.get("callee").node.name === "_interopRequireWildcard" && initPath.node.arguments.length === 1 && initPath.node.arguments[0].type === "Identifier") {
						const otherBinding = path.scope.getBinding(initPath.node.arguments[0].name);
						if (otherBinding && otherBinding.path.isVariableDeclarator()) {
							initPath = otherBinding.path.get("init");
						}
					}
					if (initPath.isCallExpression() && initPath.get("callee").isIdentifier() && initPath.get("callee").node.name === "require" && initPath.node.arguments.length === 1 && initPath.node.arguments[0].type === "StringLiteral") {
						return {
							module: initPath.node.arguments[0].value,
							export: path.node.property.name,
						};
					}
				}
			}
		}
	}

	function isCreateElement(path) {
		const binding = importBindingForPath(path);
		if (binding) {
			return (binding.export === "createElement" || binding.export === "h") && (binding.module === "react" || binding.module === "preact" || binding.module === "ceviche");
		}
		return false;
	}

	function isCallToCreateElement(path) {
		return path.isCallExpression() && isCreateElement(path.get("callee"));
	}

	function staticPropertyKey(node) {
		if (types.isStringLiteral(node.key))
			return node.key.value;
		if (!node.computed && types.isIdentifier(node.key))
			return node.key.name;
	}

	return {
		visitor: {
			CallExpression(path) {
				if (!isCallToCreateElement(path)) {
					// Bail! Not a call to createElement
					return;
				}
				// console.log(path.node);
				const args = path.get("arguments");
				if (args.length < 1) {
					// Bail! Not a valid call to createElement
					return;
				}
				let props = args.length > 1 ? args[1].node : types.nullLiteral();
				let key = types.nullLiteral();
				let propList;
				if (types.isObjectExpression(props)) {
					propList = props.properties.slice();
				} else if (types.isNullLiteral(props)) {
					propList = [];
				} else {
					// Bail! Would mutate a dynamically constructed props object!
					return;
				}
				propList = propList.filter(node => {
					if (staticPropertyKey(node) === "key") {
						key = node.value;
						return false;
					}
					return true;
				});
				switch (args.length) {
					case 2:
						break;
					case 3:
						if (types.isArrayExpression(args[2])) {
							propList.push(types.objectProperty(types.identifier("children"), args[2].node));
							break;
						}
						if (!isCallToCreateElement(args[2]) && !types.isStringLiteral(args[2])) {
							return;
						}
						// fallthrough
					default:
						propList.push(types.objectProperty(types.identifier("children"), types.arrayExpression(args.slice(2).map(arg => arg.node))));
						break;
				}
				path.replaceWith(object({
					type: types.numericLiteral(1),
					tag: args[0].node,
					props: types.objectExpression(propList),
					text: types.nullLiteral(),
					key,
					index: types.nullLiteral(),
					_children: types.nullLiteral(),
					_el: types.nullLiteral(),
					_component: types.nullLiteral(),
				}));
			},
		}
	};
}
