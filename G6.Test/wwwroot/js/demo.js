﻿var graph = new G6.Graph({
    container: "nodeChat",
    fitView: "cc",
    height: window.innerHeight,
    //animate: true
});

G6.registerEdge('smooth', {
    getPath: function getPath(item) {
        var points = item.getPoints();
        var start = points[0];
        var end = points[points.length - 1];
        var hgap = Math.abs(end.x - start.x);
        if (end.x > start.x) {
            return [['M', start.x, start.y], ['C', start.x + hgap / 4, start.y, end.x - hgap / 2, end.y, end.x, end.y]];
        }
        return [['M', start.x, start.y], ['C', start.x - hgap / 4, start.y, end.x + hgap / 2, end.y, end.x, end.y]];
    }
});

G6.registerEdge('flowingEdge', {
    afterDraw: function afterDraw(item) {
        var keyShape = item.getKeyShape();
        keyShape.attr('lineDash', [10, 10]);
        keyShape.attr('lineDashOffset', 0);
        keyShape.animate({
            lineDashOffset: -20,
            repeat: true
        }, 500);
    }
});

G6.registerNode("customNode", {
    // 自定义入场动画
    enterAnimate: function enterAnimate(item) {
        if (item.isNode) {
            var group = item.getGraphicGroup();
            var model = item.getModel();
            var x = model.x;
            var y = model.y;

            var label = item.getLabel();
            label.__cfg.visible = $("#chkDisplay").prop("checked");


            var keyShape = item.getKeyShape();
            var children = item.getChildren();
            var box = keyShape.getBBox();
            var labelBox = label.getBBox();
            var dx = -1 * ((box.maxX - box.minX + labelBox.maxX - labelBox.minX) / 2);
            var dy = 0;
            if (children.length === 0) {
                dx = -dx;
            }
            label.translate(dx, dy);

            group.transform([['t', -x, -y], ['s', 0.01, 0.01], ['t', x, y]]);
            !group.get('destroyed') && group.animate({ transform: [['t', -x, -y], ['s', 100, 100], ['t', x, y]] }, 450, 'easeBackOut');
        }
    },

    // 自定义出场动画
    leaveAnimate: function leaveAnimate(item) {
        if (item.isNode) {
            var group = item.getGraphicGroup();
            var model = item.getModel();
            var x = model.x;
            var y = model.y;
            group && !group.get('destroyed') &&
                group.animate({ transform: [['t', -x, -y], ['s', 0.01, 0.01], ['t', x, y]] }, 450, 'easeCircleOut', function () { group.remove(); });
        }
    }
});

//全局node属性配置
graph.node({
    label: function label(model) {
        return {
            text: model.name,
            fill: "blue",
            fontSize: "12px"
        };
    },
    size: 24,
    style: {
        fill: "green",
        stroke: "black"
    },
    //shape: "customNode"
});

//全局edge属性配置
graph.edge({
    style: function style() {
        return {
            endArrow: true,
            lineWidth: 1
        };
    },
    shape: 'smooth'
});

$.getJSON("Demo/GetRootNodes",
    function (data) {
        graph.read(data);
        graph.getNodes().forEach(function (node) {
            setLable(node);
        });
    });


function removeChild(item) {
    var edges = item.getEdges();
    var nodes = item.itemMap._nodes;

    for (var i = 0; i < edges.length; i++) {
        if (edges[i].source.id === item.id) {

            var nd = graph.find(edges[i].target.id);
            removeChild(nd);
            graph.remove(nd, "node");
            graph.remove(edges[i], "edge");
        }
    }
}

function addNodes(ev, isChild) {
    var url = "Demo/GetNodes?nodeId=" + ev.item.id + "&x=" + ev.x + "&y=" + ev.y + "&isChild=" + isChild;
    $.getJSON(url, function (data) {
        data.nodes.forEach(function (item, index) {
            var nd = graph.add("node", item);
            setLable(nd);
        });
        var e = data.edges;
        data.edges.forEach(function (item, index) {
            graph.add("edge", item);
        });
        graph.draw();
    });
}

function setLable(node) {
    var model = node.getModel();
    var label = node.getLabel();
    label.__cfg.visible = $("#chkDisplay").prop("checked");
    var keyShape = node.getKeyShape();
    var children = node.getChildren();
    var parent = node.getParent();
    var box = keyShape.getBBox();
    var labelBox = label.getBBox();
    var dx = -1 * ((box.maxX - box.minX + labelBox.maxX - labelBox.minX) / 2);
    var dy = 0;

    if (children.length === 0) {
        dx = -dx;
    }
    label.translate(dx, dy);
};

graph.on("click", (ev) => {
    if (ev.item != null && ev.item.isNode) {

        console.info(ev.item.model.x);

        var edges = graph.getEdges();
        var hasChild = false;
        var hasParent = false;
        for (var i = 0; i < edges.length; i++) {

            if (edges[i].target.id === ev.item.id) {
                hasParent = true;
            }

            if (edges[i].source.id === ev.item.id) {
                hasChild = true;
            }
        }

        if (hasParent && hasChild) {
            removeChild(ev.item);
        }
        else if (!hasParent && hasChild) {
            addNodes(ev, false);
            autoZoom(ev.item);
        }
        else {
            addNodes(ev, true);
            autoZoom(ev.item);
        }
    }
});

function autoZoom(node) {
    var model = node.getModel();
    var x = Math.abs(model.x);
    var width = graph.getWidth();
    if (x + 100 > width || x * 2 + 100 > width) {
        graph.setFitView("cc");
    }
}

graph.on('node:dragstart', function (ev) {
    var item = ev.item;

    var model = item.getModel();
    node = item;
    dx = model.x - ev.x;
    dy = model.y - ev.y;
});

graph.on('node:drag', function (ev) {
    node && graph.update(node, {
        x: ev.x + dx,
        y: ev.y + dy
    });
});

graph.on('node:dragend', function (ev) {
    var item = ev.item;
    graph.draw();
});

graph.on('afterchange', function () {
    graph.draw();
});

graph.on('mouseenter', (ev) => {
    if (ev.item !== null && ev.item.isNode) {

    }
});

graph.on('mousewheel', function (ev) {
    graph.setFitView("cc");
});

$(window).resize(function () {
    graph.setFitView("cc");
});

$("#chkDisplay").on("click", function (sender, obj) {
    var checked = $(this).prop("checked");
    graph.getNodes().forEach(function (node) {
        var label = node.getLabel();
        label.__cfg.visible = checked;
    });
    graph.draw();
});
