using System.Collections.Generic;
using System.Numerics;

namespace DiagramVisualization.Clustering
{
    public abstract class Hierarchy
    {
        public IEnumerable<IEnumerable<double>> data;
        public IEnumerable<Hierarchy> children;
    }

    public class HierarchyTree : Hierarchy
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

    public class HierarchyClustering
    {
        private List<HierarchyTree> items;
        private int n;

        private double CountDist(HierarchyTree tree1, HierarchyTree tree2)
        {
            return Metrics.EuclideanDistance(tree1.data[0], tree2.data[0], n);
        }

        private List<Vector<double>> CountCenter(HierarchyTree tree1, HierarchyTree tree2)
        {
            var item = (tree1.data[0] + tree2.data[0]) * (0.5);
            return new List<Vector<double>>(new Vector<double>[] { item });
        }

        public HierarchyClustering(IEnumerable<Vector<double>> items, int n)
        {
            this.n = n;
            this.items = new List<HierarchyTree>();
            foreach (var item in items)
                this.items.Add(new HierarchyTree(new List<Vector<double>>(new Vector<double>[] { item })));
        }

        public HierarchyTree Start()
        {
            while (this.items.Count > 1)
            {
                double min_dist = double.MaxValue;
                int first = 0, second = 0;

                for (int i = 0; i < this.items.Count; i++)
                    for (int j = i + 1; j < this.items.Count; j++)
                    {
                        double dist = CountDist(this.items[i], this.items[j]);
                        if (dist < min_dist)
                        {
                            min_dist = dist;
                            first = i;
                            second = j;
                        }
                    }

                HierarchyTree f = this.items[first],
                    s = this.items[second];
                HierarchyTree new_tree = new HierarchyTree(CountCenter(f, s),
                    new HierarchyTree[] { f, s });
                this.items.RemoveAt(second);
                this.items.RemoveAt(first);
                this.items.Add(new_tree);
            }
            return this.items[0];
        }
    }
}
