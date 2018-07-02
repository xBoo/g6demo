using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using G6.Test.Models;
using Microsoft.AspNetCore.Mvc;

namespace G6.Test.Controllers
{
    public class DemoController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }

        public NodeData GetRootNodes()
        {
            return BuildRootNodes();
        }

        private NodeData BuildRootNodes()
        {
            return new NodeData
            {
                Nodes = new List<Node>
                {
                    new Node {Id = "1", Name = "Node1", X=100, Y=100},
                    new Node {Id = "2", Name = "Node2",X=200,Y=100},
                    new Node {Id = "3", Name = "Node3",X=300,Y=100},
                },
                Edges = new List<Edge>
                {
                    new Edge {Source = "1", Target = "2"},
                    new Edge {Source = "2", Target = "3"}
                }
            };
        }


        public NodeData GetNodes(string nodeId, float x, float y, bool isChild = true)
        {
            var nodes = new List<Node>();
            var edges = new List<Edge>();
            for (var i = 0; i < new Random().Next(1, 5); i++)
            {
                var id = Guid.NewGuid().ToString();
                nodes.Add(new Node
                {
                    Id = id,
                    Name = "AddNode" + i,
                    X = x + (isChild ? 100 : -100),
                    Y = y + (i % 2 == 0 ? -40 * i : 40 * i)
                });

                edges.Add(new Edge
                {
                    Source = isChild ? nodeId : id,
                    Target = isChild ? id : nodeId
                });
            }

            return new NodeData { Nodes = nodes, Edges = edges };

        }
    }
}