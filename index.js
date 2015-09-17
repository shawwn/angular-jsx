exports.convert = function (code) {
    var recast = require("recast");

    var ast = recast.parse(code);
    var b = recast.types.builders;

    recast.visit(ast, {
            visitObjectExpression: function (path) {
                var obj = path.value;
                for (var i = 0; i < obj.properties.length; i++) {
                    var property = obj.properties[i];
                    if (property.key.name === "template") {
                        var templateStr = recast.print(property.value).code;
                        templateStr = templateStr.replace(/(\r\n|\n|\r)/g,'\n');
                        property.value = b.literal(templateStr);
                    }
                }
                this.traverse(path);
            }
        }
    );

    var output = recast.print(ast).code;
    return output;
}