using System.Collections.Generic;
using System.Numerics;

namespace DiagramVisualization.Clustering
{
    public class KHierarchyClustering
    {
        private int n;
        private int k;
        private List<Vector<double>> data;

        public KHierarchyClustering(IEnumerable<Vector<double>> items, int k, int n)
        {
            this.n = n;
            this.k = k;
            this.data = (List<Vector<double>>)items;
        }

        public HierarchyTree Start()
        {
            return Cluster(this.data);
        }

        private HierarchyTree Cluster(List<Vector<double>> items)
        {
            if (items.Count <= 3)
                return new HierarchyTree(items);

            KMeansClustering _cluster = new KMeansClustering(items, k, n);
            List<Vector<double>>[] result = _cluster.Start1();

            HierarchyTree[] children = (new List<List<Vector<double>>>(result))
                .ConvertAll<HierarchyTree>(item => Cluster(item)).ToArray();

            return new HierarchyTree(children);
        }
    }
}
