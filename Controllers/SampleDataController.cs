using System.Collections.Generic;
using System.Linq;
using System.Numerics;
using CsvHelper;
using DiagramVisualization.Clustering;
using Microsoft.AspNetCore.Mvc;

namespace DiagramVisualization.Controllers
{
    [Route("api/[controller]")]
    public class SampleDataController : Controller
    {
        private static readonly string[] irisNames = new []{ "setosa", "versicolor", "virginica" };

        [HttpGet("[action]")]
        public IEnumerable<Iris> Irises()
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

            var kMeansCluster = new KMeansClustering(toCluster, 3, 4);
            var kclusters = kMeansCluster.Start();

            var hierarchyCluster = new HierarchyClustering(toCluster, 4);
            var hclusters = hierarchyCluster.Start();

            List<Iris> irises = new List<Iris>();
            for (int i = 0; i < 3; i++)
                foreach (var el in kclusters.ElementAt(i))
                    irises.Add(new Iris(el[0], el[1], el[2], el[3], irisNames[i]));

            return irises;
        }

        public class Iris
        {
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
        }
    }
}

