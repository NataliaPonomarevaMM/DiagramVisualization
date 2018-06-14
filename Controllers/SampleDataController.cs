using System.Collections.Generic;
using System.Linq;
using System.Numerics;
using CsvHelper;
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
                foreach (var el in kclusters.ElementAt(i))
                    irises.Add(new Iris(el[0], el[1], el[2], el[3], Iris.irisNames[i]));
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

            return root;
        }
    }

    public class Iris
    {
        public static readonly string[] irisNames = new[] { "setosa", "versicolor", "virginica" };

        public double sepalLength { get; set; }
        public double sepalWidth { get; set; }
        public double petalLength { get; set; }
        public double petalWidth { get; set; }
        public string species { get; set; }

        public Iris(double sepalLength, double sepalWidth, double petalLength, double petalWidth, string species)
        {
            this.sepalLength = sepalLength;
            this.sepalWidth = sepalWidth;
            this.petalLength = petalLength;
            this.petalWidth = petalWidth;
            this.species = species;
        }

        public Vector<double> Convert()
        {
            return new Vector<double>(new double[] { sepalLength, sepalWidth, petalLength, petalWidth });
        }

        public static List<Vector<double>> GetFromFile()
        {
            var csv = new CsvReader(System.IO.File.OpenText(@"Controllers\iris.csv"));
            csv.Configuration.Delimiter = ",";
            csv.Read();
            csv.Configuration.HeaderValidated = null;
            csv.Configuration.MissingFieldFound = null;
            var first = csv.GetRecord<Iris>();
            var csvResult = csv.GetRecords<Iris>();

            List<Vector<double>> toCluster = new List<Vector<double>>();
            foreach (var record in csvResult)
                toCluster.Add(record.Convert());
            toCluster.Add(first.Convert());
            return toCluster;
        }
    }
}

