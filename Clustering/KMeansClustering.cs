using System;
using System.Collections.Generic;
using System.Numerics;

namespace DiagramVisualization.Clustering
{
    public class KMeansClustering
    {
        private List<Vector<double>> items;
        private int k;
        private int n;
        private List<Vector<double>> [] clusters;
        private Vector<double> [] u;
        private bool toContinue = true;

        public KMeansClustering(IEnumerable<Vector<double>> items, int k, int n)
        {
            this.k = k;
            this.n = n;
            this.items = (List<Vector<double>>)items;
            u = new Vector<double>[k];
            Initialize();
        }

        public IEnumerable<IEnumerable<double[]>> Start()
        {
            int p = 0;
            foreach (var item in items)
            {
                clusters[p % k].Add(item);
                p++;
            }
            CountMetrics();

            while (toContinue)
            {
                Initialize();
                foreach (var item in items)
                    clusters[FoundMin(item)].Add(item);
                toContinue = false;
                CountMetrics();
            }

            double [][][] result = new double[k][][];
            for (int i = 0; i < k; i++)
            {
                result[i] = new double[clusters[i].Count][];
                for (int j = 0; j < clusters[i].Count; j++)
                {
                    result[i][j] = new double[n];
                    clusters[i][j].CopyTo(result[i][j]);
                }
            }

            return result;
        }

        private void Initialize()
        {
            clusters = new List<Vector<double>>[k];
            for (int i = 0; i < k; i++)
                clusters[i] = new List<Vector<double>>();
        }

        private void CountMetrics()
        {
            for (int i = 0; i < k; i++)
            {
                Vector<double> newu = new Vector<double>();
                foreach (var item in clusters[i])
                    newu = newu + item;

                newu = newu * (1 / (double)clusters[i].Count);
                if (Metrics.EuclideanDistance(newu, u[i], n) < 0.1)
                    toContinue = true;
                u[i] = newu;
            }
        }

        private int FoundMin(Vector<double> item)
        {
            double mindist = Double.MaxValue;
            int cur = 0;

            for (int i = 0; i < k; i++)
            {
                double dist = Metrics.EuclideanDistance(item, u[i], n);
                if (dist < mindist)
                {
                    mindist = dist;
                    cur = i;
                }
            }

            return cur;
        }
    }
}
