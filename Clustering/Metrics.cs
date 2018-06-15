using System;
using System.Numerics;
using System.Collections.Generic;
using System.IO;
using System.Linq;

namespace DiagramVisualization.Clustering
{
    public class Metrics
    {
        public static double EuclideanDistance(Vector<double> a, Vector<double> b, int n)
        {
            double sum = 0;
            for (int i = 0; i < n; i++)
                sum += Math.Pow(a[i] - b[i], 2);
            return Math.Sqrt(sum);
        }
    }

    public class Hierarchy
    {
        public string species;
        public string id;
        public IEnumerable<Iris> data;
        public IEnumerable<Hierarchy> children;

        public Hierarchy(HierarchyTree tree)
        {
            List<Hierarchy> children = new List<Hierarchy>();
            for (int i = 0; i < 3; i++)
                children.Add(new Hierarchy(tree.children[i], Iris.irisNames[i], i.ToString()));
            this.children = children;
        }

        private Hierarchy(HierarchyTree tree, string name, string id)
        {
            this.species = name;
            this.data = tree.data is null ? null : Iris.Convert(tree.data, name, id);
            this.children = (new List<HierarchyTree>(tree.children))
                .Select((item, i) => new Hierarchy(item, name, id + i.ToString()));
        }
    }

    public class HierarchyTree
    {
        public List<Vector<double>> data;
        public HierarchyTree[] children;

        public HierarchyTree(List<Vector<double>> data)
        {
            this.data = data;
            children = new HierarchyTree[0];
        }
        public HierarchyTree(HierarchyTree[] children)
        {
            this.data = null;
            this.children = children;
        }
        public HierarchyTree(List<Vector<double>> data, HierarchyTree[] children)
        {
            this.data = data;
            this.children = children;
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
        public string id { get; set; }

        public Iris(double sepalLength, double sepalWidth, double petalLength, 
            double petalWidth, string species, string id)
        {
            this.sepalLength = sepalLength;
            this.sepalWidth = sepalWidth;
            this.petalLength = petalLength;
            this.petalWidth = petalWidth;
            this.species = species;
            this.id = id;
        }

        public Vector<double> Convert()
        {
            return new Vector<double>(new double[] { sepalLength, sepalWidth, petalLength, petalWidth });
        }

        public static IEnumerable<Iris> Convert(IEnumerable<double[]> items, string name, string id)
        {
            List<Iris> irises = new List<Iris>();
            foreach (var el in items)
                irises.Add(new Iris(el[0], el[1], el[2], el[3], name, id));
            return irises;
        }

        public static IEnumerable<Iris> Convert(IEnumerable<Vector<double>> items, string name, string id)
        {
            List<Iris> irises = new List<Iris>();
            foreach (var el in items)
                irises.Add(new Iris(el[0], el[1], el[2], el[3], name, id));
            return irises;
        }

        private static double parse(string str)
        {
            return double.Parse(str, System.Globalization.NumberStyles.AllowDecimalPoint, System.Globalization.NumberFormatInfo.InvariantInfo);
        }

        public static List<Vector<double>> GetFromFile()
        {
            var contents = File.ReadAllText(@"Controllers\iris.csv").Split('\n');
            var csv = contents.ToList().ConvertAll(item => item.Split(','));

            List<Vector<double>> toCluster = new List<Vector<double>>();
            foreach (var record in csv)
                toCluster.Add(new Iris(Iris.parse(record[0]), Iris.parse(record[1]),
                    Iris.parse(record[2]), Iris.parse(record[3]), record[4], "").Convert());
            return toCluster;
        }
    }
}
