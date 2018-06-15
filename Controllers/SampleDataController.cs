using System.Collections.Generic;
using System.Linq;
using DiagramVisualization.Clustering;
using Microsoft.AspNetCore.Mvc;

namespace DiagramVisualization.Controllers
{
    [Route("api/[controller]")]
    public class KDataController : Controller
    {
        [HttpGet("[action]")]
        public IEnumerable<Iris> Irises()
        {
            var kMeansCluster = new KMeansClustering(Iris.GetFromFile(), 3, 4);
            var kclusters = kMeansCluster.Start2();
            List<Iris> irises = new List<Iris>();
            for (int i = 0; i < 3; i++)
                irises.AddRange(Iris.Convert(kclusters.ElementAt(i), Iris.irisNames[i], ""));
            return irises;
        }
    }

    [Route("api/[controller]")]
    public class HierarchyDataController : Controller
    {
        [HttpGet("[action]")]
        public Hierarchy Irises()
        {
            var hierarchyCluster = new KHierarchyClustering(Iris.GetFromFile(), 3, 4);
            var root = hierarchyCluster.Start();

            return new Hierarchy(root);
        }
    }
}

