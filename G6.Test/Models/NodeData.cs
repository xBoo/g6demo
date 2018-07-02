using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace G6.Test.Models
{
    public class NodeData
    {
        public List<Node> Nodes { get; set; }

        public List<Edge> Edges { get; set; }
    }

    public class Node
    {
        /// <summary>
        /// 节点Id
        /// </summary>
        public string Id { get; set; }

        /// <summary>
        /// 节点名称
        /// </summary>
        public string Name { get; set; }

        /// <summary>
        /// x坐标
        /// </summary>
        public float X { get; set; }

        /// <summary>
        /// y坐标
        /// </summary>
        public float Y { get; set; }

        /// <summary>
        /// 颜色
        /// </summary>
        public string Color { get; set; } = "green";

        /// <summary>
        /// 尺寸
        /// </summary>
        public object Size { get; set; }

        /// <summary>
        /// 所用图形
        /// </summary>
        public string Shape { get; set; }

        /// <summary>
        /// 显示样式
        /// </summary>
        public object Style { get; set; }

        /// <summary>
        /// 显示文本，样式
        /// </summary>
        public object Label { get; set; }

        /// <summary>
        /// 所属组别
        /// </summary>
        public object Parent { get; set; }

        /// <summary>
        /// 渲染层级
        /// </summary>
        public int? Index { get; set; }
    }

    public class Edge
    {
        /// <summary>
        /// 源
        /// </summary>
        public string Source { get; set; }

        /// <summary>
        /// 目标
        /// </summary>
        public string Target { get; set; }

        /// <summary>
        /// 显示文本、样式
        /// </summary>
        public string Label { get; set; }
    }


}
