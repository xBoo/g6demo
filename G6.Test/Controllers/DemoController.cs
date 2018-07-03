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
                    new Node {Id = "1", Name = "Node1", X=0, Y=100},
                    new Node {Id = "2", Name = "Node2",X=160,Y=100},
                    new Node {Id = "3", Name = "Node3",X=320,Y=100},
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

            for (var i = 0; i < new Random().Next(1, 8); i++)
            {
                float dy = 0;
                switch (i)
                {
                    case 0:
                        dy = 0;
                        break;
                    case 1:
                        dy = 40;
                        break;
                    default:
                        dy = i % 2 == 0 ? i / 2 * 40 * -1 : (i + 1) / 2 * 40;
                        break;
                }

                Console.WriteLine(dy);

                var id = Guid.NewGuid().ToString();
                nodes.Add(new Node
                {
                    Id = id,
                    Name = "AddNode" + i,
                    X = x + (isChild ? 160 : -160),
                    Y = y + dy
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