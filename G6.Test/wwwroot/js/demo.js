var graph = new G6.Graph({
    container: "nodeChat",
    fitView: "autoZoom",
    height: window.innerHeight,
    //modes: {
    //    red: ['mouseEnterFillRed', 'mouseLeaveResetFill'],
    //    green: ['mouseEnterFillGreen', 'mouseLeaveResetFill']
    //},
    //mode: mode
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
        var group = item.getGraphicGroup();
        var model = item.getModel();
        var x = model.x;
        var y = model.y;

        group.transform([['t', -x, -y], ['s', 0.01, 0.01], ['t', x, y]]);
        !group.get('destroyed') && group.animate({
            transform: [['t', -x, -y], ['s', 100, 100], ['t', x, y]]
        }, 450, 'easeBackOut');
    },

    // 自定义出场动画
    leaveAnimate: function leaveAnimate(item) {
        var group = item.getGraphicGroup();
        var model = item.getModel();
        var x = model.x;
        var y = model.y;
        group && !group.get('destroyed') && group.animate({
            transform: [['t', -x, -y], ['s', 0.01, 0.01], ['t', x, y]]
        }, 450, 'easeCircleOut', function () {
            group.remove();
        });
    }
});

//全局node属性配置
graph.node({
    //label: function label(model) {
    //    var lbl = { text: model.name, fill: "red", fontSize:"5px" };
    //    return lbl;
    //},

    size: 8,
    style: {
        fill: "green",
        stroke: "#6aa84f"
    },
    //shape: "customNode"
});

//全局edge属性配置
graph.edge({
    style: function style() {
        return {
            endArrow: true
        };
    },
    //color: "black",
    shape: 'smooth'
});

$.getJSON("Demo/GetRootNodes",
    function (data) {
        graph.read(data);
    });

$(window).resize(function () {
    graph.setFitView("autoZoom");
});

graph.on("click", (ev) => {
    if (ev.item.type === "node") {
        var url = "Demo/GetRandomNodes?nodeId=" + ev.item.id + "&x=" + parseInt(ev.x) + "&y=" + parseInt(ev.y);
        $.getJSON(url, function (data) {

            var n = data.nodes;
            data.nodes.forEach(function (item, index) {
                graph.add("node", item);
            });

            var e = data.edges;
            data.edges.forEach(function (item, index) {
                graph.add("edge", item);
            });

            graph.setFitView("autoZoom");
        });
    }
});